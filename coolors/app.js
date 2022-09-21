//DOM elements
const colorDivs = document.querySelectorAll('.color');
const generateButton = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const slides = document.querySelectorAll('.sliders');
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
const panel = document.querySelector('.panel');
const colors = document.querySelector('.colors');
const adjusts = document.querySelectorAll('.adjust');
const locks = document.querySelectorAll('.lock');
let initialColors;
//Local Storage
let savedPalettes = [];

//Event listeners
generateButton.addEventListener('click', randomColors);

sliders.forEach((slider) => {
  slider.addEventListener('input', hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener('change', () => {
    updateTextUI(index);
  });
});

currentHexes.forEach((hex) => {
  hex.addEventListener('click', () => {
    copyToClipboard(hex);
  });
});

popup.addEventListener('transitionend', () => {
  const popupBox = popup.children[0];
  popup.classList.remove('active');
  popupBox.classList.remove('active');

  panel.style.filter = 'blur(0)';
  colors.style.filter = 'blur(0)';
});

adjusts.forEach((adjust, index) => {
  adjust.addEventListener('click', () => {
    slides[index].classList.toggle('active');
    const closeAdjustment = slides[index].children[0];
    closeAdjustment.addEventListener('click', () => {
      slides[index].classList.remove('active');
    });
  });
});

locks.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (button.children[0].classList.contains('fa-lock-open')) {
      button.children[0].classList.remove('fa-lock-open');
      button.children[0].classList.add('fa-lock');
      colorDivs[index].classList.add('locked');
    } else {
      button.children[0].classList.remove('fa-lock');
      button.children[0].classList.add('fa-lock-open');
      colorDivs[index].classList.remove('locked');
    }
  });
});

//Functions
function generateHex() {
  const letters = '0123456789ABCDEF';
  let hash = '#';
  for (let i = 0; i < 6; i++) {
    hash += letters[Math.floor(Math.random() * 16)];
  }
  return hash;
}

function randomColors() {
  initialColors = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

    if (div.classList.contains('locked')) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(randomColor).hex());
    }

    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;
    checkTextContrast(randomColor, hexText);

    const color = chroma(randomColor);
    const sliders = div.querySelectorAll('.sliders input');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
  });
  resetInputs();

  adjusts.forEach((button, index) => {
    checkTextContrast(initialColors[index], button);
    checkTextContrast(initialColors[index], locks[index]);
  });
}

function checkTextContrast(color, text) {
  const lum = chroma(color).luminance();
  lum > 0.5 ? (text.style.color = 'black') : (text.style.color = 'white');
}

function colorizeSliders(color, hue, brightness, saturation) {
  //Brightness setup
  const midBright = color.set('hsl.l', 0.5);
  const scaleBrightness = chroma.scale(['black', midBright, 'white']);

  //Saturation setup
  const noSat = color.set('hsl.s', 0);
  const fullSat = color.set('hsl.s', 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);

  //   input Update
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75 ))`;
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(0)}, ${scaleBrightness(0.5)},${scaleBrightness(1)})`;
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
}

function hslControls(event) {
  const index = event.target.getAttribute('data-bright') || event.target.getAttribute('data-sat') || event.target.getAttribute('data-hue');
  let sliders = event.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = initialColors[index];

  let color = chroma(bgColor).set('hsl.s', saturation.value).set('hsl.l', brightness.value).set('hsl.h', hue.value);

  colorDivs[index].style.backgroundColor = color;

  colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector('h2');
  const icons = activeDiv.querySelectorAll('.controls button');
  textHex.innerText = color.hex();
  //Check contrast
  checkTextContrast(color, textHex);

  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll('.sliders input');
  sliders.forEach((slider) => {
    if (slider.name === 'hue') {
      const hueColor = initialColors[slider.getAttribute('data-hue')];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === 'saturation') {
      const satColor = initialColors[slider.getAttribute('data-sat')];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
    if (slider.name === 'brightness') {
      const brightColor = initialColors[slider.getAttribute('data-bright')];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
  });
}

function copyToClipboard(hex) {
  const element = document.createElement('textarea');
  element.value = hex.innerText;
  document.body.appendChild(element);
  element.select();
  document.execCommand('copy');
  document.body.removeChild(element);
  const popupBox = popup.children[0];

  popup.classList.add('active');
  popupBox.classList.add('active');

  panel.style.filter = 'blur(2rem)';
  colors.style.filter = 'blur(2rem)';
}

//Implement save to palette and local Storage
const saveButton = document.querySelector('.save');
const submitSaveButton = document.querySelector('.save-palette');
const closeSave = document.querySelector('.close-save');
const saveContainer = document.querySelector('.save-container');
const saveInput = document.querySelector('.save-name');
const libraryContainer = document.querySelector('.library-container ');
const libraryPopup = document.querySelector('.library-popup');
const libraryButton = document.querySelector('.library');
const closeLibraryButton = document.querySelector('.close-library');

//Event Listeners
saveButton.addEventListener('click', openPalette);
closeSave.addEventListener('click', closePalette);
libraryButton.addEventListener('click', openLibrary);
closeLibraryButton.addEventListener('click', closeLibrary);
submitSaveButton.addEventListener('click', savePalette);

function openPalette(event) {
  const savePopup = saveContainer.children[0];
  saveContainer.classList.add('active');
  savePopup.classList.add('active');
  panel.style.filter = 'blur(2rem)';
  colors.style.filter = 'blur(2rem)';
  const input = savePopup.children[2];
  input.focus();
}

function closePalette(event) {
  const savePopup = saveContainer.children[0];
  saveContainer.classList.remove('active');
  savePopup.classList.remove('active');
  panel.style.filter = 'blur(0rem)';
  colors.style.filter = 'blur(0rem)';
}

function savePalette(event) {
  const savePopup = saveContainer.children[0];
  saveContainer.classList.remove('active');
  savePopup.classList.remove('active');
  panel.style.filter = 'blur(0rem)';
  colors.style.filter = 'blur(0rem)';

  const name = saveInput.value;
  const colorsArr = [];
  currentHexes.forEach((hex) => {
    colorsArr.push(hex.innerText);
  });

  let paletteNumber;
  if (localStorage.getItem('palettes') === null) {
    paletteNumber = savedPalettes.length;
  } else {
    const paletteArr = JSON.parse(localStorage.getItem('palettes'));
    paletteNumber = paletteArr.length;
  }
  const paletteObj = { name, colors: colorsArr, nr: paletteNumber };
  savedPalettes.push(paletteObj);

  //Save to local Storage
  saveToLocalStorage(paletteObj);
  saveInput.value = '';

  //Generate the palette for Library
  const palette = document.createElement('div');
  palette.classList.add('custom-palette');
  palette.setAttribute('id', paletteObj.nr);
  const title = document.createElement('h4');
  title.innerText = paletteObj.name;
  const preview = document.createElement('div');
  preview.classList.add('small-preview');
  paletteObj.colors.forEach((smallColor) => {
    const smallDiv = document.createElement('div');
    smallDiv.style.backgroundColor = smallColor;
    preview.appendChild(smallDiv);
  });
  const paletteButton = document.createElement('button');
  paletteButton.classList.add('pick-palette-button');
  paletteButton.classList.add(paletteObj.nr);
  paletteButton.innerText = 'Select';

  const deletePaletteButton = document.createElement('button');
  deletePaletteButton.classList.add('delete-palette-button');
  deletePaletteButton.classList.add(paletteObj.nr);
  deletePaletteButton.innerHTML = '&times;';

  deletePaletteButton.addEventListener('click', (event) => {
    closeLibrary();
    const paletteIndex = event.target.classList[1];
    const palettesObject = JSON.parse(localStorage.getItem('palettes'));
    const index = parseInt(palette.getAttribute('id')) + 1;
    libraryContainer.children[0].children[index].remove();
    palettesObject.splice(paletteIndex, 1);
    localStorage.setItem('palettes', JSON.stringify(palettesObject));
  });

  paletteButton.addEventListener('click', (event) => {
    closeLibrary();
    const paletteIndex = event.target.classList[1];
    initialColors = [];
    savedPalettes[paletteIndex].colors.forEach((color, index) => {
      initialColors.push(color);
      colorDivs[index].style.backgroundColor = color;
      const text = colorDivs[index].children[0];
      text.innerText = color;
      checkTextContrast(color, text);
      updateTextUI(index);
    });
    resetInputs();
  });

  //Append to the Library
  palette.appendChild(deletePaletteButton);
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteButton);

  libraryPopup.appendChild(palette);
  const firstPalette = document.getElementById('0');
  firstPalette.style.marginTop = '13vh';
}

function saveToLocalStorage(paletteObj) {
  let localPalettes;
  if (localStorage.getItem('palettes') === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem('palettes'));
  }
  localPalettes.push(paletteObj);
  localStorage.setItem('palettes', JSON.stringify(localPalettes));
}

function openLibrary(event) {
  libraryContainer.classList.add('active');
  libraryPopup.classList.add('active');
  panel.style.filter = 'blur(2rem)';
  colors.style.filter = 'blur(2rem)';
}

function closeLibrary(event) {
  libraryContainer.classList.remove('active');
  libraryPopup.classList.remove('active');
  panel.style.filter = 'blur(0rem)';
  colors.style.filter = 'blur(0rem)';
}

function getLocal() {
  if (localStorage.getItem('palettes') === null) {
    localPalettes = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem('palettes'));
    paletteObjects.forEach((paletteObject) => {
      const palette = document.createElement('div');
      palette.classList.add('custom-palette');
      palette.setAttribute('id', paletteObject.nr);
      const title = document.createElement('h4');
      title.innerText = paletteObject.name;
      const preview = document.createElement('div');
      preview.classList.add('small-preview');
      paletteObject.colors.forEach((smallColor) => {
        const smallDiv = document.createElement('div');
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
      });
      const paletteButton = document.createElement('button');
      paletteButton.classList.add('pick-palette-button');
      paletteButton.classList.add(paletteObject.nr);
      paletteButton.innerText = 'Select';

      const deletePaletteButton = document.createElement('button');
      deletePaletteButton.classList.add('delete-palette-button');
      deletePaletteButton.classList.add(paletteObject.nr);
      deletePaletteButton.innerHTML = '&times;';

      deletePaletteButton.addEventListener('click', (event) => {
        closeLibrary();
        const paletteIndex = event.target.classList[1];
        const palettesObject = JSON.parse(localStorage.getItem('palettes'));
        const index = parseInt(palette.getAttribute('id')) + 1;
        libraryContainer.children[0].children[index].remove();
        palettesObject.splice(paletteIndex, 1);
        localStorage.setItem('palettes', JSON.stringify(palettesObject));
      });

      paletteButton.addEventListener('click', (event) => {
        closeLibrary();
        const paletteIndex = event.target.classList[1];
        initialColors = [];
        paletteObjects[paletteIndex].colors.forEach((color, index) => {
          initialColors.push(color);
          colorDivs[index].style.backgroundColor = color;
          const text = colorDivs[index].children[0];
          text.innerText = color;
          checkTextContrast(color, text);
          updateTextUI(index);
        });
        resetInputs();
      });

      palette.appendChild(deletePaletteButton);
      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(paletteButton);
      libraryPopup.appendChild(palette);
      const firstPalette = document.getElementById('0');
      firstPalette.style.marginTop = '13vh';
    });
  }
}

window.addEventListener('keydown', function (event) {
  if (!saveContainer.classList.contains('active') && event.code === 'Space') {
    event.preventDefault();
    randomColors();
    return;
  }

  if (saveContainer.classList.contains('active') && event.code === 'Enter') {
    savePalette();
    return;
  }

  if (saveContainer.classList.contains('active') && event.code === 'Escape') {
    closePalette();
    return;
  }

  if (libraryContainer.classList.contains('active') && event.code === 'Escape') {
    closeLibrary();
    return;
  }
});

// localStorage.clear();
getLocal();
randomColors();
