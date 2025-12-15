// Global variables
let detailMode = false;

// Function to toggle detail mode
function detailToggle() {
    detailMode = !detailMode;
    go();
}

// Function to update the decimals description
function updateDecDescr() {
    const dec = parseInt(document.getElementById('dec').value);
    const decDescr = document.getElementById('decDescr');
    
    if (dec === 0) {
        decDescr.textContent = 'ones';
    } else if (dec > 0) {
        decDescr.textContent = `1e-${dec}`;
    } else {
        decDescr.textContent = `1e${dec}`;
    }
}

// Function to increase decimals
function decUp() {
    const dec = parseInt(document.getElementById('dec').value);
    document.getElementById('dec').value = dec + 1;
    updateDecDescr();
    go();
}

// Function to decrease decimals
function decDn() {
    const dec = parseInt(document.getElementById('dec').value);
    document.getElementById('dec').value = dec - 1;
    updateDecDescr();
    go();
}

// Function to generate random numbers
function genGo() {
    const rawfrom = parseFloat(document.getElementById('rawfrom').value);
    const rawto = parseFloat(document.getElementById('rawto').value);
    const rawmax = parseInt(document.getElementById('rawmax').value);
    
    if (isNaN(rawfrom) || isNaN(rawto) || isNaN(rawmax)) {
        alert('Please enter valid numbers for From, To, and Count.');
        return;
    }
    
    let rawnums = '';
    for (let i = 0; i < rawmax; i++) {
        const randomNum = (Math.random() * (rawto - rawfrom) + rawfrom).toFixed(4);
        rawnums += randomNum + '\n';
    }
    
    document.getElementById('rawnums').value = rawnums;
    go();
}

// Function to perform rounding based on selected method
function go() {
    const rawnums = document.getElementById('rawnums').value.trim().split('\n');
    const roundnums = document.getElementById('roundnums');
    const roundstats = document.getElementById('roundstats');
    const type = document.getElementById('type').value;
    const dec = parseInt(document.getElementById('dec').value);
    
    let roundedValues = '';
    let stats = '';
    
    for (let i = 0; i < rawnums.length; i++) {
        if (rawnums[i] === '') continue;
        
        const num = parseFloat(rawnums[i]);
        if (isNaN(num)) continue;
        
        let roundedNum = 0;
        
        switch (type) {
            case '5up':
                roundedNum = roundHalfUp(num, dec);
                break;
            case '5down':
                roundedNum = roundHalfDown(num, dec);
                break;
            case '5away0':
                roundedNum = roundHalfAwayFromZero(num, dec);
                break;
            case '5to0':
                roundedNum = roundHalfTowardsZero(num, dec);
                break;
            case '5even':
                roundedNum = roundHalfEven(num, dec);
                break;
            case '5odd':
                roundedNum = roundHalfOdd(num, dec);
                break;
            case 'floor':
                roundedNum = Math.floor(num * Math.pow(10, dec)) / Math.pow(10, dec);
                break;
            case 'ceiling':
                roundedNum = Math.ceil(num * Math.pow(10, dec)) / Math.pow(10, dec);
                break;
        }
        
        roundedValues += roundedNum.toFixed(Math.abs(dec)) + '\n';
    }
    
    roundnums.value = roundedValues;
    
    if (detailMode) {
        stats = 'Detail mode: ON';
    } else {
        stats = 'Detail mode: OFF';
    }
    
    roundstats.textContent = stats;
}

// Helper functions for different rounding methods
function roundHalfUp(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor + 0.5) / factor;
}

function roundHalfDown(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor - 0.5) / factor;
}

function roundHalfAwayFromZero(num, decimals) {
    const factor = Math.pow(10, decimals);
    return (num >= 0) ? Math.round(num * factor + 0.5) / factor : Math.round(num * factor - 0.5) / factor;
}

function roundHalfTowardsZero(num, decimals) {
    const factor = Math.pow(10, decimals);
    return (num >= 0) ? Math.round(num * factor - 0.5) / factor : Math.round(num * factor + 0.5) / factor;
}

function roundHalfEven(num, decimals) {
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(num * factor);
    return (rounded % 2 === 0) ? rounded / factor : (Math.round(num * factor + 0.5) / factor);
}

function roundHalfOdd(num, decimals) {
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(num * factor);
    return (rounded % 2 !== 0) ? rounded / factor : (Math.round(num * factor + 0.5) / factor);
}

// Initialize
window.onload = function() {
    updateDecDescr();
    go();
};
