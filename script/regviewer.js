/**
 * Web-based RegViewer — register bit viewer & calculator
 * Replaces the Qt desktop RegViewer with a pure-JS interactive tool.
 *
 * Original bugs fixed:
 *   #1: bit range input now validated (start/end must be integers within width)
 *   #2: calculator works correctly in all width modes (8/16/32/64) via BigInt
 */
class RegViewer {
    constructor(width = 64) {
        this.width = width;
        this.value = 0n;
        this.shiftMode = 'logical';
        this.variables = {};
    }

    get mask() {
        return (1n << BigInt(this.width)) - 1n;
    }

    setWidth(w) {
        if (![8, 16, 32, 64].includes(w)) return;
        this.width = w;
        this.value &= this.mask;
    }

    setValue(v) {
        if (typeof v !== 'bigint') v = BigInt(v);
        this.value = v & this.mask;
    }

    getValue() { return this.value; }

    getSignedValue() {
        const msb = 1n << BigInt(this.width - 1);
        if (this.value & msb) {
            return this.value - (1n << BigInt(this.width));
        }
        return this.value;
    }

    /* ---- single bit ---- */
    getBit(n) { return (this.value >> BigInt(n)) & 1n; }
    setBit(n) { this.value |= (1n << BigInt(n)); this.value &= this.mask; }
    clearBit(n) { this.value &= ~(1n << BigInt(n)); this.value &= this.mask; }
    toggleBit(n) { this.value ^= (1n << BigInt(n)); this.value &= this.mask; }

    /* ---- bit range (with validation — fixes original bug #1) ---- */
    parseRange(str) {
        str = str.trim();
        const m = str.match(/^(\d+)\s*-\s*(\d+)$/);
        if (!m) {
            const single = str.match(/^(\d+)$/);
            if (!single) return null;
            const n = parseInt(single[1]);
            if (n < 0 || n >= this.width) return null;
            return { start: n, end: n };
        }
        let a = parseInt(m[1]);
        let b = parseInt(m[2]);
        if (a < 0 || a >= this.width || b < 0 || b >= this.width) return null;
        if (a > b) [a, b] = [b, a];
        return { start: a, end: b };
    }

    setBits(start, end) {
        for (let i = start; i <= end; i++) this.value |= (1n << BigInt(i));
        this.value &= this.mask;
    }
    clearBits(start, end) {
        for (let i = start; i <= end; i++) this.value &= ~(1n << BigInt(i));
        this.value &= this.mask;
    }
    invertBits(start, end) {
        for (let i = start; i <= end; i++) this.value ^= (1n << BigInt(i));
        this.value &= this.mask;
    }

    getSubData(start, end) {
        const bits = end - start + 1;
        const subMask = (1n << BigInt(bits)) - 1n;
        return (this.value >> BigInt(start)) & subMask;
    }

    /* ---- bulk ---- */
    setAll() { this.value = this.mask; }
    clearAll() { this.value = 0n; }
    invertAll() { this.value = (~this.value) & this.mask; }
    getBitCount() {
        let count = 0;
        let v = this.value;
        while (v) { count += Number(v & 1n); v >>= 1n; }
        return count;
    }

    /* ---- shift (works correctly in all width modes — fixes original bug #2) ---- */
    shiftLeft(n) {
        n = n % this.width;
        if (n <= 0) return;
        if (this.shiftMode === 'rotate') {
            const rotated = ((this.value << BigInt(n)) | (this.value >> BigInt(this.width - n))) & this.mask;
            this.value = rotated;
        } else {
            this.value = (this.value << BigInt(n)) & this.mask;
        }
    }

    shiftRight(n) {
        n = n % this.width;
        if (n <= 0) return;
        if (this.shiftMode === 'arithmetic') {
            const msb = 1n << BigInt(this.width - 1);
            const sign = this.value & msb;
            this.value >>= BigInt(n);
            if (sign) {
                for (let i = 0; i < n; i++) {
                    this.value |= (1n << BigInt(this.width - 1 - i));
                }
            }
        } else if (this.shiftMode === 'rotate') {
            this.value = ((this.value >> BigInt(n)) | (this.value << BigInt(this.width - n))) & this.mask;
        } else {
            this.value >>= BigInt(n);
            this.value &= this.mask;
        }
    }

    /* ---- format output ---- */
    toBinary() {
        let s = this.value.toString(2);
        return s.padStart(this.width, '0');
    }

    toOctal() {
        return this.value.toString(8);
    }

    toDecimalUnsigned() {
        return this.value.toString(10);
    }

    toDecimalSigned() {
        return this.getSignedValue().toString(10);
    }

    toHex() {
        const hexDigits = Math.ceil(this.width / 4);
        return this.value.toString(16).toUpperCase().padStart(hexDigits, '0');
    }

    toAddrSize() {
        const units = ['B', 'K', 'M', 'G', 'T', 'P', 'E'];
        let parts = [];
        let v = this.value;
        for (let i = 6; i >= 0; i--) {
            const shift = BigInt(i * 10);
            const unitVal = (v >> shift) & 1023n;
            if (unitVal > 0n) {
                parts.push(unitVal.toString() + units[i]);
            }
        }
        return parts.length > 0 ? parts.join('') : '0B';
    }

    /* ---- parse input ---- */
    fromBinary(str) {
        str = str.trim().replace(/^0b/i, '');
        if (!/^[01]{1,64}$/.test(str)) return false;
        this.setValue(BigInt('0b' + str));
        return true;
    }

    fromOctal(str) {
        str = str.trim().replace(/^0o/i, '');
        if (!/^[0-7]{1,22}$/.test(str)) return false;
        const v = BigInt('0o' + str);
        if (v > this.mask) return false;
        this.setValue(v);
        return true;
    }

    fromDecimal(str) {
        str = str.trim();
        const signed = str.startsWith('-');
        const numStr = signed ? str.slice(1) : str;
        if (!/^\d{1,20}$/.test(numStr)) return false;
        let v = BigInt(numStr);
        if (signed) {
            const signedMax = 1n << BigInt(this.width - 1);
            if (v > signedMax) return false;
            v = ((1n << BigInt(this.width)) - v) & this.mask;
        } else {
            if (v > this.mask) return false;
        }
        this.setValue(v);
        return true;
    }

    fromHex(str) {
        str = str.trim().replace(/^0x/i, '');
        if (!/^[0-9a-fA-F]{1,16}$/.test(str)) return false;
        const v = BigInt('0x' + str);
        if (v > this.mask) return false;
        this.setValue(v);
        return true;
    }

    fromAddrSize(str) {
        str = str.trim().toUpperCase();
        if (!/^(?:(\d+)E)?(?:(\d+)P)?(?:(\d+)T)?(?:(\d+)G)?(?:(\d+)M)?(?:(\d+)K)?(?:(\d+)B)?$/.test(str)) return false;
        if (str === '') return false;
        const m = str.match(/^(?:(\d+)E)?(?:(\d+)P)?(?:(\d+)T)?(?:(\d+)G)?(?:(\d+)M)?(?:(\d+)K)?(?:(\d+)B)?$/);
        let v = 0n;
        const shifts = [60, 50, 40, 30, 20, 10, 0];
        for (let i = 1; i <= 7; i++) {
            if (m[i]) v += BigInt(m[i]) << BigInt(shifts[i - 1]);
        }
        if (v > this.mask) return false;
        this.setValue(v);
        return true;
    }

    /* ---- expression calculator ---- */
    evaluateExpression(expr) {
        const parser = new ExprParser(expr, this.variables, this.value, this.width, this.mask);
        const result = parser.parse();
        if (result.error) return result;
        if (result.assignment) {
            this.variables[result.varName] = result.value & this.mask;
        }
        return { error: false, value: result.value & this.mask };
    }
}

/**
 * Recursive-descent expression parser supporting:
 * Arithmetic: + - * / % **    Shift: << >>    Bitwise: ^ & | ~
 * Logical: < > <= >= == != && || !
 * Hex (0x), binary (0b), octal (0o), decimal
 * Variables: x = current value, name=expr for assignment
 * Operator precedence follows C language conventions.
 */
class ExprParser {
    constructor(expr, variables, currentValue, width, mask) {
        this.expr = expr.trim();
        this.pos = 0;
        this.variables = { ...variables };
        this.variables['x'] = currentValue;
        this.width = width;
        this.mask = mask;
        this.tokens = this.tokenize();
        this.tokenIdx = 0;
    }

    tokenize() {
        const tokens = [];
        let i = 0;
        const s = this.expr;
        while (i < s.length) {
            const c = s[i];
            if (c === ' ' || c === '\t' || c === '\n') { i++; continue; }
            if (c >= '0' && c <= '9') {
                let num = '';
                if (c === '0' && (s[i+1] === 'x' || s[i+1] === 'X')) {
                    num = '0x'; i += 2;
                    while (i < s.length && /[0-9a-fA-F]/.test(s[i])) { num += s[i]; i++; }
                } else if (c === '0' && (s[i+1] === 'b' || s[i+1] === 'B')) {
                    num = '0b'; i += 2;
                    while (i < s.length && /[01]/.test(s[i])) { num += s[i]; i++; }
                } else if (c === '0' && (s[i+1] === 'o' || s[i+1] === 'O')) {
                    num = '0o'; i += 2;
                    while (i < s.length && /[0-7]/.test(s[i])) { num += s[i]; i++; }
                } else {
                    while (i < s.length && /[0-9]/.test(s[i])) { num += s[i]; i++; }
                }
                tokens.push({ type: 'number', value: BigInt(num) });
                continue;
            }
            if (/[a-zA-Z_]/.test(c)) {
                let name = '';
                while (i < s.length && /[a-zA-Z0-9_]/.test(s[i])) { name += s[i]; i++; }
                tokens.push({ type: 'ident', value: name });
                continue;
            }
            const two = s.substring(i, i + 2);
            const three = s.substring(i, i + 3);
            if (two === '**') { tokens.push({ type: 'op', value: '**' }); i += 2; continue; }
            if (two === '<<') { tokens.push({ type: 'op', value: '<<' }); i += 2; continue; }
            if (two === '>>') { tokens.push({ type: 'op', value: '>>' }); i += 2; continue; }
            if (two === '<=') { tokens.push({ type: 'op', value: '<=' }); i += 2; continue; }
            if (two === '>=') { tokens.push({ type: 'op', value: '>=' }); i += 2; continue; }
            if (two === '==') { tokens.push({ type: 'op', value: '==' }); i += 2; continue; }
            if (two === '!=') { tokens.push({ type: 'op', value: '!=' }); i += 2; continue; }
            if (two === '&&') { tokens.push({ type: 'op', value: '&&' }); i += 2; continue; }
            if (two === '||') { tokens.push({ type: 'op', value: '||' }); i += 2; continue; }
            if ('+-*/%&^|~()<>!='.includes(c)) {
                tokens.push({ type: 'op', value: c }); i++; continue;
            }
            return null;
        }
        return tokens;
    }

    peek() { return this.tokens[this.tokenIdx]; }
    next() { return this.tokens[this.tokenIdx++]; }
    isOp(val) {
        const t = this.peek();
        return t && t.type === 'op' && t.value === val;
    }
    consumeOp(val) {
        if (this.isOp(val)) { this.tokenIdx++; return true; }
        return false;
    }

    parse() {
        if (!this.tokens || this.tokens.length === 0) {
            return { error: true, message: 'Empty expression' };
        }
        try {
            const result = this.parseAssignment();
            if (this.tokenIdx < this.tokens.length) {
                return { error: true, message: 'Unexpected token: ' + JSON.stringify(this.peek()) };
            }
            return { error: false, value: result.value, assignment: result.assignment, varName: result.varName };
        } catch (e) {
            return { error: true, message: e.message };
        }
    }

    parseAssignment() {
        const saved = this.tokenIdx;
        if (this.peek() && this.peek().type === 'ident') {
            const varName = this.peek().value;
            this.next();
            if (this.consumeOp('=')) {
                const expr = this.parseLogicalOr();
                return { value: expr, assignment: true, varName: varName };
            }
            this.tokenIdx = saved;
        }
        const val = this.parseLogicalOr();
        return { value: val, assignment: false, varName: null };
    }

    parseLogicalOr() {
        let left = this.parseLogicalAnd();
        while (this.consumeOp('||')) {
            const right = this.parseLogicalAnd();
            left = (left !== 0n || right !== 0n) ? 1n : 0n;
        }
        return left;
    }

    parseLogicalAnd() {
        let left = this.parseBitwiseOr();
        while (this.consumeOp('&&')) {
            const right = this.parseBitwiseOr();
            left = (left !== 0n && right !== 0n) ? 1n : 0n;
        }
        return left;
    }

    parseBitwiseOr() {
        let left = this.parseBitwiseXor();
        while (this.consumeOp('|')) {
            const right = this.parseBitwiseXor();
            left = left | right;
        }
        return left;
    }

    parseBitwiseXor() {
        let left = this.parseBitwiseAnd();
        while (this.consumeOp('^')) {
            const right = this.parseBitwiseAnd();
            left = left ^ right;
        }
        return left;
    }

    parseBitwiseAnd() {
        let left = this.parseEquality();
        while (this.consumeOp('&')) {
            const right = this.parseEquality();
            left = left & right;
        }
        return left;
    }

    parseEquality() {
        let left = this.parseRelational();
        while (true) {
            if (this.consumeOp('==')) {
                const right = this.parseRelational();
                left = left === right ? 1n : 0n;
            } else if (this.consumeOp('!=')) {
                const right = this.parseRelational();
                left = left !== right ? 1n : 0n;
            } else break;
        }
        return left;
    }

    parseRelational() {
        let left = this.parseShift();
        while (true) {
            if (this.consumeOp('<')) {
                const right = this.parseShift();
                left = left < right ? 1n : 0n;
            } else if (this.consumeOp('<=')) {
                const right = this.parseShift();
                left = left <= right ? 1n : 0n;
            } else if (this.consumeOp('>')) {
                const right = this.parseShift();
                left = left > right ? 1n : 0n;
            } else if (this.consumeOp('>=')) {
                const right = this.parseShift();
                left = left >= right ? 1n : 0n;
            } else break;
        }
        return left;
    }

    parseShift() {
        let left = this.parseAdditive();
        while (true) {
            if (this.consumeOp('<<')) {
                const right = this.parseAdditive();
                left = (left << right) & this.mask;
            } else if (this.consumeOp('>>')) {
                const right = this.parseAdditive();
                left = left >> right;
            } else break;
        }
        return left;
    }

    parseAdditive() {
        let left = this.parseMultiplicative();
        while (true) {
            if (this.consumeOp('+')) {
                const right = this.parseMultiplicative();
                left = left + right;
            } else if (this.consumeOp('-')) {
                const right = this.parseMultiplicative();
                left = left - right;
            } else break;
        }
        return left;
    }

    parseMultiplicative() {
        let left = this.parsePower();
        while (true) {
            if (this.consumeOp('*')) {
                const right = this.parsePower();
                left = left * right;
            } else if (this.consumeOp('/')) {
                const right = this.parsePower();
                if (right === 0n) throw new Error('Division by zero');
                left = left / right;
            } else if (this.consumeOp('%')) {
                const right = this.parsePower();
                if (right === 0n) throw new Error('Modulo by zero');
                left = left % right;
            } else break;
        }
        return left;
    }

    parsePower() {
        let left = this.parseUnary();
        if (this.consumeOp('**')) {
            const right = this.parsePower();
            if (right < 0n) throw new Error('Negative exponent');
            left = left ** right;
        }
        return left;
    }

    parseUnary() {
        if (this.consumeOp('-')) {
            const val = this.parseUnary();
            return -val & this.mask;
        }
        if (this.consumeOp('~')) {
            const val = this.parseUnary();
            return ~val & this.mask;
        }
        if (this.consumeOp('!')) {
            const val = this.parseUnary();
            return val === 0n ? 1n : 0n;
        }
        if (this.consumeOp('+')) {
            return this.parseUnary();
        }
        return this.parsePrimary();
    }

    parsePrimary() {
        if (this.consumeOp('(')) {
            const val = this.parseLogicalOr();
            if (!this.consumeOp(')')) throw new Error('Expected )');
            return val;
        }
        const t = this.next();
        if (!t) throw new Error('Unexpected end of expression');
        if (t.type === 'number') return t.value;
        if (t.type === 'ident') {
            if (t.value in this.variables) return this.variables[t.value];
            throw new Error('Undefined variable: ' + t.value);
        }
        throw new Error('Unexpected token: ' + JSON.stringify(t));
    }
}

/* ---- UI Controller ---- */
let rv = null;
let rvInitialized = false;

function initRegViewer() {
    if (rvInitialized) return;
    rvInitialized = true;
    rv = new RegViewer(64);
    rv.variables = {};
    renderRV();
}

function renderRV() {
    renderBits();
    renderFormats();
    renderVariables();
}

function renderBits() {
    const container = document.getElementById('rv-bits');
    if (!container) return;
    const w = rv.width;
    let html = '<div class="rv-bits-row">';
    for (let i = w - 1; i >= 0; i--) {
        const bitVal = rv.getBit(i);
        const cls = bitVal ? 'rv-bit rv-bit-on' : 'rv-bit rv-bit-off';
        html += `<div class="${cls}" onclick="toggleBit(${i})" title="bit ${i}">${bitVal}</div>`;
    }
    html += '</div>';
    let labelHtml = '<div class="rv-bits-labels">';
    for (let i = w - 1; i >= 0; i--) {
        if (i % 4 === 0 && i !== w - 1) {
            labelHtml += `<span class="rv-bit-label rv-bit-label-major">${i}</span>`;
        } else if (i % 4 === 0) {
            labelHtml += `<span class="rv-bit-label rv-bit-label-major">${i}</span>`;
        } else {
            labelHtml += `<span class="rv-bit-label"></span>`;
        }
    }
    labelHtml += '</div>';
    container.innerHTML = labelHtml + html;

    const countEl = document.getElementById('rv-bitcount');
    if (countEl) countEl.textContent = rv.getBitCount();
}

function toggleBit(n) {
    rv.toggleBit(n);
    renderRV();
}

function renderFormats() {
    const setVal = (id, val) => { const el = document.getElementById(id); if (el && document.activeElement !== el) el.value = val; };
    setVal('rv-bin', rv.toBinary());
    setVal('rv-oct', rv.toOctal());
    setVal('rv-dec', rv.toDecimalUnsigned());
    setVal('rv-decs', rv.toDecimalSigned());
    setVal('rv-hex', rv.toHex());
    setVal('rv-size', rv.toAddrSize());
}

function renderVariables() {
    const container = document.getElementById('rv-vars');
    if (!container) return;
    const varNames = Object.keys(rv.variables).filter(n => n !== 'x');
    if (varNames.length === 0) {
        container.innerHTML = '<span class="rv-no-vars">No variables stored</span>';
        return;
    }
    let html = '<table class="rv-var-table"><thead><tr><th>Name</th><th>Value (Hex)</th><th>Value (Dec)</th></tr></thead><tbody>';
    for (const name of varNames) {
        const val = rv.variables[name];
        html += `<tr><td>${name}</td><td>0x${val.toString(16).toUpperCase()}</td><td>${val.toString(10)}</td></tr>`;
    }
    html += '</tbody></table>';
    html += '<button class="rv-btn rv-btn-sm" onclick="clearVariables()">Clear Variables</button>';
    container.innerHTML = html;
}

function clearVariables() {
    rv.variables = {};
    renderVariables();
}

function rvSetWidth(w) {
    rv.setWidth(w);
    document.getElementById('rv-width-8').classList.toggle('active', w === 8);
    document.getElementById('rv-width-16').classList.toggle('active', w === 16);
    document.getElementById('rv-width-32').classList.toggle('active', w === 32);
    document.getElementById('rv-width-64').classList.toggle('active', w === 64);
    renderRV();
}

function rvSetShiftMode(mode) {
    rv.shiftMode = mode;
    document.getElementById('rv-shift-logical').classList.toggle('active', mode === 'logical');
    document.getElementById('rv-shift-arithmetic').classList.toggle('active', mode === 'arithmetic');
    document.getElementById('rv-shift-rotate').classList.toggle('active', mode === 'rotate');
}

function rvInputFormat(type) {
    const input = document.getElementById('rv-' + type);
    if (!input) return;
    const val = input.value.trim();
    if (val === '') return;
    let ok = false;
    switch (type) {
        case 'bin': ok = rv.fromBinary(val); break;
        case 'oct': ok = rv.fromOctal(val); break;
        case 'dec': ok = rv.fromDecimal(val); break;
        case 'decs': ok = rv.fromDecimal(val); break;
        case 'hex': ok = rv.fromHex(val); break;
        case 'size': ok = rv.fromAddrSize(val); break;
    }
    if (!ok) {
        input.style.borderColor = '#e74c3c';
        setTimeout(() => { input.style.borderColor = ''; }, 1500);
    } else {
        renderRV();
    }
}

function rvBitRangeOp(op) {
    const input = document.getElementById('rv-range');
    const val = input.value.trim();
    if (val === '') {
        showRangeError('Please enter a bit range (e.g. 8-15 or 3)');
        return;
    }
    const range = rv.parseRange(val);
    if (!range) {
        const maxBit = rv.width - 1;
        showRangeError(`Invalid range. Use format: start-end (0-${maxBit}) or single bit number`);
        input.style.borderColor = '#e74c3c';
        setTimeout(() => { input.style.borderColor = ''; }, 1500);
        return;
    }
    switch (op) {
        case 'set': rv.setBits(range.start, range.end); break;
        case 'clear': rv.clearBits(range.start, range.end); break;
        case 'invert': rv.invertBits(range.start, range.end); break;
        case 'extract':
            const sub = rv.getSubData(range.start, range.end);
            rv.setValue(sub);
            break;
    }
    renderRV();
}

function showRangeError(msg) {
    const el = document.getElementById('rv-range-error');
    if (el) {
        el.textContent = msg;
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 3000);
    }
}

function rvShift(dir) {
    const input = document.getElementById('rv-shift-amount');
    let n = parseInt(input.value);
    if (isNaN(n) || n < 0) n = 0;
    if (dir === 'left') rv.shiftLeft(n);
    else rv.shiftRight(n);
    renderRV();
}

function rvBulk(op) {
    switch (op) {
        case 'setAll': rv.setAll(); break;
        case 'clearAll': rv.clearAll(); break;
        case 'invertAll': rv.invertAll(); break;
    }
    renderRV();
}

function rvCalc() {
    const input = document.getElementById('rv-calc-input');
    const resultEl = document.getElementById('rv-calc-result');
    const errorEl = document.getElementById('rv-calc-error');
    const expr = input.value.trim();
    if (expr === '') return;
    errorEl.style.display = 'none';
    const result = rv.evaluateExpression(expr);
    if (result.error) {
        resultEl.textContent = '';
        errorEl.textContent = result.message || 'Syntax error';
        errorEl.style.display = 'block';
        return;
    }
    rv.setValue(result.value);
    const hexVal = '0x' + result.value.toString(16).toUpperCase();
    const decVal = result.value.toString(10);
    const signedVal = rv.getSignedValue().toString(10);
    resultEl.innerHTML = `Hex: ${hexVal} &nbsp;|&nbsp; Dec(unsigned): ${decVal} &nbsp;|&nbsp; Dec(signed): ${signedVal}`;
    renderRV();
}

function rvCalcKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        rvCalc();
    }
}
