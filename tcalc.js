const urlParams = new URLSearchParams(window.location.search);
const startingValue = urlParams.get('startingValue');
const calculateRemaining = !urlParams.has('calculateRemaining') || urlParams.get('calculateRemaining') == 'true';

const input = document.getElementById('input');
input.onkeydown = keyPress;

if (!!startingValue) {
    input.value = startingValue;
    processInput();
}

function keyPress(event) {
    console.log(event.key, event.key === 'Enter');
    if (event.key === 'Enter') {
        processInput();
    }
}

function processInput() {
    let expression = input.value
        .replace(/\s/g,'') // Remove whitespaces
        .replace(/#[^#]*#/g, '') // Remove comments (stuff between # and #)
        .replace(/(\d?\d)(?::|\.)(\d\d)/g, '($1h+$2m)') // Change HH:MM to HHh + MMm
        .replace(/h/ig, '*60') // Multiply hours by 60
        .replace(/m/ig, ''); // Remove m (we calculate minutes)

    console.log("expression", expression);

    let result = eval(expression);
    console.log('result in minutes: ', result);
    let isNegative = false;
    let humanReadable = (isNegative ? '-' : '') + (Math.floor(result / 60)).toFixed(0).padStart(2, '0') + ':'+ (Math.floor(result % 60)).toFixed(0).padStart(2, '0');

    if (calculateRemaining) {
        let until = new Date(Date.now() + result * 60 * 1000);
        if (result < 0) {
            result *= -1;
            isNegative = true;
        }
        humanReadable += ' => ' + until.getHours().toString().padStart(2, '0') + ':' + until.getMinutes().toString().padStart(2, '0');
	}
    console.log('humanReadable: ', humanReadable);
    document.title = humanReadable || 'invalid';
    document.getElementById('result').innerText = document.title;
}