//DOM ELEMENTS
const resultInput = document.getElementById('result');
const lengthInput = document.getElementById('length-input');
const uppercase = document.getElementById('upper');
const lowercase = document.getElementById('lower');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const button = document.getElementById('submit-button');
const copyToClipboard = document.getElementsByClassName('img')[0];
const copyMessage = document.getElementById('copy-success');

//FUNCTIONS
const settingForGenerate = () => {
  const length = +lengthInput.value;
  const hasLower = lowercase.checked;
  const hasUpper = uppercase.checked;
  const hasNumber = numbers.checked;
  const hasSymbol = symbols.checked;
  resultInput.value = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
};

const randomLowerLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97);

const randomUpperLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);

const randomNumber = () => String.fromCharCode(Math.floor(Math.random() * 10) + 48);

const randomSymbol = () => {
  const half = Math.floor(Math.random() * 2) + 1;
  const firstHalf = String.fromCharCode(Math.floor(Math.random() * 15) + 33);
  const secondHalf = String.fromCharCode(Math.floor(Math.random() * 7) + 58);
  return half === 1 ? firstHalf : secondHalf;
};

const generatePassword = (lower, upper, number, symbol, length) => {
  let password = '';

  const typesCount = lower + upper + number + symbol;

  const typesArray = [{ lower }, { upper }, { number }, { symbol }].filter((item) => Object.values(item)[0]);

  if (typesCount === 0) {
    return '';
  }

  for (let i = 0; i < length; i += typesCount) {
    typesArray.forEach((type) => {
      const functionName = Object.keys(type)[0];

      password += randomFunctions[functionName]();
    });
  }
  if (length > 20) {
    const generatedPassword = password.slice(0, 20);
    return generatedPassword;
  }
  const generatedPassword = password.slice(0, length);
  return generatedPassword;
};

//EVENT LISTENERS
document.addEventListener('keydown', (event) => {
  event.key === 'Enter' && settingForGenerate();
});

button.addEventListener('click', settingForGenerate);

copyToClipboard.addEventListener('click', () => {
  if (resultInput.value === '') {
    return false;
  }
  resultInput.select();
  resultInput.setSelectionRange(0, 99999);
  document.execCommand('copy');
  copyMessage.style.display = 'flex';
  copyMessage.innerHTML = `Skopiowano do schowka hasło: &nbsp; <b>${resultInput.value}</b>`;
  setTimeout(function () {
    copyMessage.style.display = 'none';
  }, 2000);
});

const randomFunctions = {
  lower: randomLowerLetter,
  upper: randomUpperLetter,
  number: randomNumber,
  symbol: randomSymbol,
};
