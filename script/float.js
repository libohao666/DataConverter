/**
 * FloatConverter class for converting between binary representations and floating-point values.
 * Supports custom configurations for sign bits, exponent bits, and mantissa bits.
 */
class FloatConverter {
    /**
     * Creates a new FloatConverter instance.
     * @param {number} signBits - Number of sign bits (typically 1)
     * @param {number} exponentBits - Number of exponent bits
     * @param {number} mantissaBits - Number of mantissa bits
     * @param {number} index - Card index used to uniquely identify DOM elements
     * @param {boolean} initUiFlag - Whether to initialize UI elements
     */
    constructor(signBits, exponentBits, mantissaBits, index, initUiFlag) {
        this.index = index;
        this.signBits = signBits;
        this.exponentBits = exponentBits;
        this.mantissaBits = mantissaBits;
        this.initUiFlag = initUiFlag;
        
        // Calculate exponent bias to convert stored exponent to actual value
        this.exponentBias = exponentBits === 1 ? 1 : Math.pow(2, exponentBits - 1) - 1;
        
        // Initialize binary bit arrays
        this.sign = 0; // Sign bit (0 or 1)
        this.exponent = new Array(exponentBits).fill(0); // Exponent bits array
        this.mantissa = new Array(mantissaBits).fill(0); // Mantissa bits array
        
        if (initUiFlag) {
            this.initUI();
        }
    }
    
    /**
     * Initializes UI elements and sets up event listeners.
     */
    initUI() {
        const index = this.index;
        
        // Sign bit checkbox
        if (document.getElementById(`cbsign_${index}`).checked) {
            this.sign = 1;
        } else {
            this.sign = 0;
        }
        
        // Exponent bit checkboxes
        for (let i = 0; i < this.exponentBits; i++) {
            if (document.getElementById(`cbexp${i}_${index}`).checked) {
                this.exponent[i] = 1;
            } else {
                this.exponent[i] = 0;
            }
        }
        
        // Mantissa bit checkboxes
        for (let i = 0; i < this.mantissaBits; i++) {
            if (document.getElementById(`cbmant${i}_${index}`).checked) {
                this.mantissa[i] = 1;
            } else {
                this.mantissa[i] = 0;
            }
        }
        
        // Set event listeners
        document.getElementById(`cbsign_${index}`).addEventListener('change', () => {
            this.sign = document.getElementById(`cbsign_${index}`).checked ? 1 : 0;
            this.updateUI(true);
        });
        
        for (let i = 0; i < this.exponentBits; i++) {
            document.getElementById(`cbexp${i}_${index}`).addEventListener('change', () => {
                this.exponent[i] = document.getElementById(`cbexp${i}_${index}`).checked ? 1 : 0;
                this.updateUI(true);
            });
        }
        
        for (let i = 0; i < this.mantissaBits; i++) {
            document.getElementById(`cbmant${i}_${index}`).addEventListener('change', () => {
                this.mantissa[i] = document.getElementById(`cbmant${i}_${index}`).checked ? 1 : 0;
                this.updateUI(true);
            });
        }
        
        // Decimal input field event listener
        document.getElementById(`decimal_${index}`).addEventListener('change', (event) => {
            const decimalValue = parseFloat(event.target.value);
            if (!isNaN(decimalValue)) {
                this.updateFromDecimal(decimalValue);
            }
        });
        
        // Binary input field event listener
        document.getElementById(`binary_${index}`).addEventListener('input', (event) => {
            const binaryValue = event.target.value;
            this.updateFromBinary(binaryValue);
        });
        
        // Hexadecimal input field event listener
        document.getElementById(`hexadecimal_${index}`).addEventListener('input', (event) => {
            const hexValue = event.target.value;
            this.updateFromHex(hexValue);
        });
    }
    
    /**
     * Updates the UI display based on current bit values.
     */
    updateUI(updateDecimalValueFlag, nanFlag = false, zeroFlag = false) {
        const index = this.index;
        if (nanFlag) {
            document.getElementById(`highprecision_decimal_${index}`).value = "nan";
            document.getElementById(`hexadecimal_${index}`).value = "";
            document.getElementById(`actual_sign_${index}`).textContent = "";
            document.getElementById(`actual_exponent_${index}`).textContent = "";
            document.getElementById(`actual_mantissa_${index}`).textContent = "";
            document.getElementById(`binary_${index}`).value = "";
            return;
        }
        if (!this.initUiFlag) return; // Skip UI update if not initialized
        
        // Update sign display
        document.getElementById(`sign_value_${index}`).textContent = this.sign === 0 ? '+1' : '-1';
        document.getElementById(`actual_sign_${index}`).textContent = this.sign;
        
        document.getElementById(`actual_exponent_${index}`).textContent = this.exponent.join('');
        
        // Calculate and update mantissa value display
        let mantissaValue = 0;
        if (zeroFlag) {
            mantissaValue = -1;
        } else {
            for (let i = 0; i < this.mantissaBits; i++) {
                mantissaValue += this.mantissa[i] * Math.pow(2, -(i + 1));
            }
        }
        document.getElementById(`mantissa_value_${index}`).textContent = mantissaValue.toString();
        document.getElementById(`actual_mantissa_${index}`).textContent = this.mantissa.join('');
        
        const expAllZero = this.exponent.every(b => b === 0);
        let floatValue;
        
        if (zeroFlag) {
            floatValue = 0;
        } else if (expAllZero) {
            // Subnormal number
            const mantissaValue = this.mantissa.reduce((v, b, i) => v + b * Math.pow(2, -(i + 1)), 0);
            floatValue = Math.pow(-1, this.sign) * Math.pow(2, 1 - this.exponentBias) * mantissaValue;
        } else {
            const exponentValue = this.exponent.reduce((acc, bit, idx) =>
                acc + bit * Math.pow(2, this.exponentBits - 1 - idx), 0) - this.exponentBias;
            floatValue = Math.pow(-1, this.sign) *
                        Math.pow(2, exponentValue) *
                        (1 + mantissaValue);
        }

        document.getElementById(`highprecision_decimal_${index}`).value = floatValue.toString();
        
        // Update calculation process display
        const signPart = this.sign === 0 ? '1' : '(-1)';
        let calculationProcess;
        
        if (zeroFlag) {
            floatValue = 0;
            calculationProcess = "ZERO";
        } else if (expAllZero) {
            // Subnormal number
            const mantissaValue = this.mantissa.reduce((v, b, i) => v + b * Math.pow(2, -(i + 1)), 0);
            const expSubnormal = 1 - this.exponentBias;
            floatValue = Math.pow(-1, this.sign) * Math.pow(2, expSubnormal) * mantissaValue;
            
            const mantissaSum = mantissaValue.toFixed(6);
            calculationProcess = `SUBNORMAL ${signPart} * 2^${expSubnormal} * ${mantissaSum}`;
            document.getElementById(`exponent_value_${index}`).textContent = `2^${expSubnormal}`;
        } else {
            // Normal number
            const exponentValue = this.exponent.reduce((acc, bit, idx) =>
                acc + bit * Math.pow(2, this.exponentBits - 1 - idx), 0) - this.exponentBias;
            floatValue = Math.pow(-1, this.sign) *
                        Math.pow(2, exponentValue) *
                        (1 + mantissaValue);
            
            const mantissaSum = (1 + mantissaValue).toFixed(6);
            calculationProcess = `NORMAL ${signPart} * 2^${exponentValue} * ${mantissaSum}`;
            document.getElementById(`exponent_value_${index}`).textContent = `2^${exponentValue}`;
        }
        document.getElementById(`calculation_process_${index}`).textContent = calculationProcess;

        // Update binary and hexadecimal representations
        const binaryString = `${this.sign}${this.exponent.join('')}${this.mantissa.join('')}`;
        document.getElementById(`binary_${index}`).value = binaryString;
        
        const hexValue = parseInt(binaryString, 2).toString(16).toLowerCase().padStart(
            Math.ceil((this.signBits + this.exponentBits + this.mantissaBits) / 4), '0');
        document.getElementById(`hexadecimal_${index}`).value = hexValue;
        
        // Update decimal representation if requested
        if (updateDecimalValueFlag) {
            document.getElementById(`decimal_${index}`).value = floatValue.toString();
        }
    }

    /**
     * Updates the binary representation from a decimal value.
     * @param {number} decimalValue - Decimal value to convert
     */
    updateFromDecimal(decimalValue) {
        if (decimalValue === 0) {
            // Handle zero case
            this.sign = 0;
            this.exponent.fill(0);
            this.mantissa.fill(0);
            this.updateUI(false, false, true);
            return;
        }
        
        // Determine sign bit
        this.sign = decimalValue < 0 ? 1 : 0;
        const absValue = Math.abs(decimalValue);
        
        // Calculate exponent and mantissa
        let exponent;
        let mantissa;
        
        if (absValue < Math.pow(2, -this.exponentBias)) {
            // Subnormal number
            exponent = 0;
            mantissa = absValue / Math.pow(2, -this.exponentBias);
        } else {
            // Normal number
            exponent = Math.floor(Math.log2(absValue)) + this.exponentBias;
            mantissa = absValue / Math.pow(2, exponent - this.exponentBias) - 1;
        }
        
        // Clamp exponent to valid range
        if (exponent < 0) {
            exponent = 0;
            mantissa = absValue / Math.pow(2, -this.exponentBias);
        } else if (exponent > Math.pow(2, this.exponentBits) - 1) {
            exponent = Math.pow(2, this.exponentBits) - 1;
            mantissa = 1; // Represents infinity or NaN
            this.updateUI(false, true);
            return;
        }
        
        // Convert exponent to binary representation
        this.exponent = new Array(this.exponentBits).fill(0);
        for (let i = this.exponentBits - 1; i >= 0; i--) {
            const bitPosition = this.exponentBits - 1 - i;
            this.exponent[i] = (exponent >> bitPosition) & 1;
            if (this.initUiFlag) {
                document.getElementById(`cbexp${i}_${this.index}`).checked = this.exponent[i];
            }
        }
        
        // Quantize mantissa to fixed bit length
        const mantissaBits = [];
        let remainingMantissa = mantissa;
        for (let i = 0; i < this.mantissaBits; i++) {
            const bitValue = Math.floor(remainingMantissa * 2);
            mantissaBits.push(bitValue);
            remainingMantissa = (remainingMantissa * 2) - bitValue;
        }
        
        // Update mantissa bits
        this.mantissa = mantissaBits;
        if (this.initUiFlag) {
            for (let i = 0; i < this.mantissaBits; i++) {
                document.getElementById(`cbmant${i}_${this.index}`).checked = this.mantissa[i];
            }
        }
        
        this.updateUI(false);
    }
    
    /**
     * Updates the binary representation from a binary string.
     * @param {string} binaryValue - Binary string to parse
     */
    updateFromBinary(binaryValue) {
        if (binaryValue.length !== this.signBits + this.exponentBits + this.mantissaBits) {
            return; // Length mismatch, ignore
        }

        // Update sign bit
        this.sign = parseInt(binaryValue[0], 2);
        if (this.initUiFlag) {
            document.getElementById(`cbsign_${this.index}`).checked = this.sign === 1;
        }
        
        // Update exponent bits
        const exponentPart = binaryValue.substring(this.signBits, this.signBits + this.exponentBits);
        for (let i = 0; i < this.exponentBits; i++) {
            this.exponent[i] = parseInt(exponentPart[i], 2);
            if (this.initUiFlag) {
                document.getElementById(`cbexp${i}_${this.index}`).checked = this.exponent[i] === 1;
            }
        }
        
        // Update mantissa bits
        const mantissaPart = binaryValue.substring(this.signBits + this.exponentBits);
        for (let i = 0; i < this.mantissaBits; i++) {
            this.mantissa[i] = parseInt(mantissaPart[i], 2);
            if (this.initUiFlag) {
                document.getElementById(`cbmant${i}_${this.index}`).checked = this.mantissa[i] === 1;
            }
        }
        
        this.updateUI(true);
    }
    
    /**
     * Updates the binary representation from a hexadecimal string.
     * @param {string} hexValue - Hexadecimal string to convert
     */
    updateFromHex(hexValue) {
        if (hexValue.length !== Math.ceil((this.signBits + this.exponentBits + this.mantissaBits) / 4)) {
            return; // Length mismatch, ignore
        }
        const binaryValue = parseInt(hexValue, 16).toString(2).padStart(
            Math.ceil((this.signBits + this.exponentBits + this.mantissaBits) / 4) * 4, '0'
        );
        this.updateFromBinary(binaryValue);
    }

    /**
     * Converts a binary string to its decimal equivalent.
     * @param {string} binaryValue - Binary string representation
     * @returns {number} Decimal value
     */
    binaryToDecimal(binaryValue) {
        if (binaryValue.length !== this.signBits + this.exponentBits + this.mantissaBits) {
            throw new Error(`Binary length mismatch for FloatConverter`);
        }
        
        // Parse bits
        this.sign = parseInt(binaryValue[0], 2);
        for (let i = 0; i < this.exponentBits; i++) {
            this.exponent[i] = parseInt(binaryValue[1 + i], 2);
        }
        for (let i = 0; i < this.mantissaBits; i++) {
            this.mantissa[i] = parseInt(binaryValue[1 + this.exponentBits + i], 2);
        }
        
        // Calculate decimal value
        const exponentValue = this.exponent.reduce((acc, bit, index) => {
            return acc + bit * Math.pow(2, this.exponentBits - 1 - index);
        }, 0) - this.exponentBias;
        
        let mantissaValue = 0;
        for (let i = 0; i < this.mantissaBits; i++) {
            mantissaValue += this.mantissa[i] * Math.pow(2, -(i + 1));
        }
        
        return Math.pow(-1, this.sign) * Math.pow(2, exponentValue) * (1 + mantissaValue);
    }
}

/**
 * IntConverter class for converting between binary representations and integer values.
 */
class IntConverter {
    constructor(bits, index, initUiFlag) {
        this.index = index;
        this.bits = bits;
        this.value = 0;
        this.bitsArray = new Array(bits).fill(0);
        this.initUiFlag = initUiFlag;
        if (initUiFlag) {
            this.initUI();
        }
    }
    
    initUI() {
        const index = this.index;
        
        // Initialize bit checkboxes
        for (let i = 0; i < this.bits; i++) {
            if (document.getElementById(`cbint${i}_${index}`).checked) {
                this.bitsArray[i] = 1;
            } else {
                this.bitsArray[i] = 0;
            }
        }
        
        // Set event listeners
        for (let i = 0; i < this.bits; i++) {
            document.getElementById(`cbint${i}_${index}`).addEventListener('change', () => {
                this.bitsArray[i] = document.getElementById(`cbint${i}_${index}`).checked ? 1 : 0;
                this.updateUI(true);
            });
        }
        
        // Decimal input event listener
        document.getElementById(`decimal_${index}`).addEventListener('input', (event) => {
            const decimalValue = parseInt(event.target.value);
            if (!isNaN(decimalValue)) {
                this.updateFromDecimal(decimalValue);
            }
        });
        
        // Binary input event listener
        document.getElementById(`binary_${index}`).addEventListener('input', (event) => {
            const binaryValue = event.target.value;
            this.updateFromBinary(binaryValue);
        });
        
        // Hexadecimal input event listener
        document.getElementById(`hexadecimal_${index}`).addEventListener('input', (event) => {
            const hexValue = event.target.value;
            this.updateFromHex(hexValue);
        });
    }
    
    updateUI(updateDecimalValueFlag) {
        if (!this.initUiFlag) return; // Skip UI update if not initialized
        
        const index = this.index;
        
        // Calculate integer value (two's complement)
        let value = 0;
        for (let i = 0; i < this.bits; i++) {
            value += this.bitsArray[i] * Math.pow(2, this.bits - 1 - i);
        }
        
        // Handle negative numbers (two's complement)
        if (this.bitsArray[0] === 1) {
            value -= Math.pow(2, this.bits);
        }
        
        this.value = value;
        
        // Update UI elements
        document.getElementById(`int_value_${index}`).textContent = value;
        document.getElementById(`actual_bits_${index}`).textContent = this.bitsArray.join('');
        document.getElementById(`highprecision_decimal_${index}`).value = value.toString();
        
        // Update binary and hexadecimal representations
        const binaryString = this.bitsArray.join('');
        document.getElementById(`binary_${index}`).value = binaryString;
        
        const hexValue = parseInt(binaryString, 2).toString(16).toLowerCase().padStart(
            Math.ceil(this.bits / 4), '0');
        document.getElementById(`hexadecimal_${index}`).value = hexValue;
        
        // Update decimal representation if requested
        if (updateDecimalValueFlag) {
            document.getElementById(`decimal_${index}`).value = value.toString();
        }
    }
    
    updateFromDecimal(decimalValue) {
        // Clamp value to valid range
        const maxValue = Math.pow(2, this.bits - 1) - 1;
        const minValue = -Math.pow(2, this.bits - 1);
        this.value = Math.max(minValue, Math.min(maxValue, decimalValue));
        
        // Convert to binary representation
        let binary = this.value >= 0 ? this.value.toString(2) : (Math.pow(2, this.bits) + this.value).toString(2);
        binary = binary.padStart(this.bits, '0');
        
        // Update bit array
        this.bitsArray = binary.split('').map(bit => parseInt(bit));
        
        if (this.initUiFlag) {
            // Update checkboxes
            for (let i = 0; i < this.bits; i++) {
                document.getElementById(`cbint${i}_${this.index}`).checked = this.bitsArray[i] === 1;
            }
        }
        
        this.updateUI(true);
    }
    
    updateFromBinary(binaryValue) {
        if (binaryValue.length !== this.bits) {
            return; // Length mismatch, ignore
        }
        
        // Update bit array
        this.bitsArray = binaryValue.split('').map(bit => parseInt(bit));
        
        if (this.initUiFlag) {
            // Update checkboxes
            for (let i = 0; i < this.bits; i++) {
                document.getElementById(`cbint${i}_${this.index}`).checked = this.bitsArray[i] === 1;
            }
        }
        
        this.updateUI(true);
    }
    
    updateFromHex(hexValue) {
        if (hexValue.length !== Math.ceil(this.bits / 4)) {
            return; // Length mismatch, ignore
        }
        const binaryValue = parseInt(hexValue, 16).toString(2).padStart(
            Math.ceil(this.bits / 4) * 4, '0'
        );
        this.updateFromBinary(binaryValue);
    }

    /**
     * Converts a binary string to its decimal equivalent.
     * @param {string} binaryValue - Binary string representation
     * @returns {number} Decimal value
     */
    binaryToDecimal(binaryValue) {
        if (binaryValue.length !== this.bits) {
            throw new Error(`Binary length mismatch for IntConverter`);
        }
        
        let value = 0;
        for (let i = 0; i < this.bits; i++) {
            value += parseInt(binaryValue[i], 2) * Math.pow(2, this.bits - 1 - i);
        }
        
        // Handle negative numbers (two's complement)
        if (parseInt(binaryValue[0], 2) === 1) {
            value -= Math.pow(2, this.bits);
        }
        
        return value;
    }
}

/**
 * AscendConverter class for converting between binary and HIF8 floating-point format.
 * HIF8 is a proprietary 8-bit floating-point format used by Ascend AI processors.
 */
class AscendConverter {
    constructor(index, initUiFlag) {
        this.index = index;
        this.bits = 8;
        this.binary = new Array(this.bits).fill(0);
        this.initUiFlag = initUiFlag;
        if (initUiFlag) {
            this.initUI();
        }
    }

    initUI() {
        const index = this.index;
        for (let i = 0; i < this.bits; i++) {
            if (document.getElementById(`cbascend${i}_${index}`).checked) {
                this.binary[i] = 1;
            } else {
                this.binary[i] = 0;
            }
        }
        for (let i = 0; i < this.bits; i++) {
            document.getElementById(`cbascend${i}_${index}`).addEventListener('change', () => {
                this.binary[i] = document.getElementById(`cbascend${i}_${index}`).checked ? 1 : 0;
                this.updateUI(true);
            });
        }
        document.getElementById(`decimal_${index}`).addEventListener('input', (event) => {
            const decimalValue = parseFloat(event.target.value);
            if (!isNaN(decimalValue)) {
                this.updateFromDecimal(decimalValue);
            }
        });
        document.getElementById(`binary_${index}`).addEventListener('input', (event) => {
            const binaryValue = event.target.value;
            this.updateFromBinary(binaryValue);
        });
        document.getElementById(`hexadecimal_${index}`).addEventListener('input', (event) => {
            const hexValue = event.target.value;
            this.updateFromHex(hexValue);
        });
    }

    updateUI(updateDecimalValueFlag, nanFlag = false) {
        const index = this.index;
        if (nanFlag) {
            document.getElementById(`highprecision_decimal_${index}`).value = "nan";
            document.getElementById(`hexadecimal_${index}`).value = "";
            document.getElementById(`actual_ascend_${index}`).innerHTML = "nan";
            document.getElementById(`binary_${index}`).value = "";
            return;
        }
        if (!this.initUiFlag) return;
        
        const binaryString = this.binary.join('');
        const decimalValue = this.binaryToDecimal(binaryString);
        document.getElementById(`highprecision_decimal_${index}`).value = decimalValue.toString();
        
        if (updateDecimalValueFlag) {
            document.getElementById(`decimal_${index}`).value = decimalValue.toString();
        }
        document.getElementById(`binary_${index}`).value = binaryString;
        const hexValue = parseInt(binaryString, 2).toString(16).toLowerCase().padStart(2, '0');
        document.getElementById(`hexadecimal_${index}`).value = hexValue;

        // Update encoded representation with color-coded bits
        const encodedHtml = this.getEncodedHtml(binaryString);
        document.getElementById(`actual_ascend_${index}`).innerHTML = encodedHtml;
    }

    getEncodedHtml(binaryString) {
        /**
         * Dot field: 2 to 4 bits, encoding 5 D values (0 to 4) and non-normal sign (DML).
         */
        const dot_value_list = [
            { code: '0000', value: 0, dml: true },
            { code: '0001', value: 0, dml: false },
            { code: '001', value: 1, dml: false },
            { code: '01', value: 2, dml: false },
            { code: '10', value: 3, dml: false },
            { code: '11', value: 4, dml: false }
        ];

        let s = binaryString[0];
        let dotPart = '';
        let exponentPart = '';
        let mantissaPart = '';
        let dml = false;

        for (const entry of dot_value_list) {
            if (binaryString.substring(1).startsWith(entry.code)) {
                dotPart = entry.code;
                dml = entry.dml;
                const d_len = entry.code.length;
                const d = entry.value;
                if (d > 0) {
                    const eStart = 1 + d_len;
                    const eEnd = eStart + d;
                    exponentPart = binaryString.substring(eStart, eEnd);
                    mantissaPart = binaryString.substring(eEnd);
                } else {
                    mantissaPart = binaryString.substring(1 + d_len);
                }
                break;
            }
        }

        // Construct color-coded HTML
        let encodedHtml = '';
        encodedHtml += `<span style="color: black;">${s}</span>`; // Sign bit: black
        encodedHtml += `<span style="color: red;">${dotPart}</span>`; // Dot field: red
        if (exponentPart) {
            encodedHtml += `<span style="color: green;">${exponentPart}</span>`; // Exponent: green
        }
        if (mantissaPart) {
            encodedHtml += `<span style="color: blue;">${mantissaPart}</span>`; // Mantissa: blue
        }

        return encodedHtml;
    }

    updateFromDecimal(decimalValue) {
        const binaryString = this.decimalToBinary(decimalValue);
        if (binaryString === "nan") {
            this.updateUI(true, true);
            return;
        }
        if (binaryString.length !== this.bits) {
            return;
        }
        this.binary = binaryString.split('').map(bit => parseInt(bit));
        if (this.initUiFlag) {
            for (let i = 0; i < this.bits; i++) {
                document.getElementById(`cbascend${i}_${this.index}`).checked = this.binary[i] === 1;
            }
        }
        this.updateUI(false);
    }

    updateFromBinary(binaryValue) {
        if (binaryValue.length !== this.bits) {
            return;
        }
        this.binary = binaryValue.split('').map(bit => parseInt(bit));
        if (this.initUiFlag) {
            for (let i = 0; i < this.bits; i++) {
                document.getElementById(`cbascend${i}_${this.index}`).checked = this.binary[i] === 1;
            }
        }
        this.updateUI(true);
    }

    updateFromHex(hexValue) {
        if (hexValue.length !== 2) {
            return;
        }
        const binaryValue = parseInt(hexValue, 16).toString(2).padStart(this.bits, '0');
        this.updateFromBinary(binaryValue);
    }

    binaryToDecimal(binaryString) {
        if (binaryString.length !== this.bits) {
            throw new Error(`Binary length mismatch for AscendConverter`);
        }
        if (binaryString === "00000000") {
            return 0;
        }
        const s = binaryString[0];
        const dot_value_list = [
            { code: '0000', value: 0, dml: true },
            { code: '0001', value: 0, dml: false },
            { code: '001',  value: 1, dml: false },
            { code: '01',   value: 2, dml: false },
            { code: '10',   value: 3, dml: false },
            { code: '11',   value: 4, dml: false }
        ];
        
        // Exact prefix matching
        let dml = false, d = 0, d_len = 0;
        for (const entry of dot_value_list) {
            if (binaryString.substr(1, entry.code.length) === entry.code) {
                dml = entry.dml;
                d_len = entry.code.length;
                d = entry.value;
                break;
            }
        }
        let e_value = 0;
        if (d > 0) {
            const e = binaryString.substring(1 + d_len, 1 + d_len + d);
            e_value = (-1) ** parseInt(e[0]) * parseInt('1' + e.substring(1), 2);
        }
        const m = binaryString.substring(1 + d_len + d);
        let m_value = 0.0;
        if (dml) {
            m_value = parseInt(m, 2);
            return ((-1) ** parseInt(s)) * (2 ** (m_value - 23)) * 1.0;
        } else {
            for (let i = 0; i < (7 - d_len - d); i++) {
                m_value += parseInt(m[i], 10) * Math.pow(2, -(i + 1));
            }
            return ((-1) ** parseInt(s)) * (2 ** e_value) * (1 + m_value);
        }
    }

    decimalToBinary(decimalValue) {
        if (decimalValue === 0) {
            return '00000000';
        }
        const s = decimalValue > 0 ? '0' : '1';
        const v_abs = Math.abs(decimalValue);
        const dot_value_list = [
            { code: '0000', value: 0, dml: true },
            { code: '0001', value: 0, dml: false },
            { code: '001', value: 1, dml: false },
            { code: '01', value: 2, dml: false },
            { code: '10', value: 3, dml: false },
            { code: '11', value: 4, dml: false }
        ];
    
        for (const entry of dot_value_list) {
            const code = entry.code;
            const dml = entry.dml;
            const d = entry.value;
            const d_len = code.length;
            const e_length = d; // E length equals D
            const m_length = 7 - d_len - e_length; // M length = 7 - dot length - D
    
            if (m_length < 0) {
                continue;
            }
    
            if (dml) {
                // Handle DML = true case
                const log2_v = Math.log2(v_abs);
                if (!Number.isInteger(log2_v)) {
                    continue;
                }
                const k = parseInt(log2_v);
                const m_value = k + 23;
                if (m_value < 0 || m_value >= 2 ** m_length) {
                    continue;
                }
                const m_str = m_value.toString(2).padStart(m_length, '0');
                return s + code + m_str;
            } else {
                // Handle DML = false case
                const possible_e_values = [];
                const min_e_mag = e_length > 0 ? 2 ** (e_length - 1) : 0;
                const max_e_mag = e_length > 0 ? (2 ** e_length) - 1 : 0;
    
                if (min_e_mag === 0) {
                    continue;
                }
    
                for (let mag = min_e_mag; mag <= max_e_mag; mag++) {
                    possible_e_values.push(mag, -mag);
                }
    
                for (const e_value of possible_e_values) {
                    try {
                        const m_plus1 = v_abs / (2 ** e_value);
                        if (m_plus1 < 1 || m_plus1 > 2) {
                            continue;
                        }
                        const m_value = m_plus1 - 1;
                        if (m_value < 0 || m_value >= 1 || !Number.isFinite(m_value)) {
                            continue;
                        }
    
                        // Convert m_value to binary fractional string
                        let m_str = '';
                        let remaining = m_value;
                        for (let i = 0; i < m_length; i++) {
                            remaining *= 2;
                            const bit = Math.floor(remaining);
                            m_str += bit.toString();
                            remaining -= bit;
                        }
    
                        if (m_str.length !== m_length) {
                            continue;
                        }
    
                        // Generate e_str
                        const sign_bit = e_value > 0 ? '0' : '1';
                        const abs_e = Math.abs(e_value);
                        const num_part = abs_e - min_e_mag;
                        if (num_part < 0) {
                            continue;
                        }
                        const num_bits = e_length - 1;
                        const num_str = num_bits > 0 ? num_part.toString(2).padStart(num_bits, '0') : '';
                        const e_str = sign_bit + num_str;
                        if (e_str.length !== e_length) {
                            continue;
                        }
    
                        // Concatenate full binary string
                        return s + code + e_str + m_str;
                    } catch (e) {
                        continue;
                    }
                }
            }
        }
        return 'nan';
    }
}
