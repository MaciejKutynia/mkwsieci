//DOM Elements
const slides = $('.slide');
const images = $('.slide img');
const frame = $('.frame');
const slideContainer = $('.group');
const nextButton = $('.next');
const prevButton = $('.prev');

//Variables
const numberOfElements = 3;
const loop = true;
const speed = 1000;
const velocity = 50;
let currentIndex = numberOfElements - 1;
const saveIndex = currentIndex;
const frameWidth = frame.width();
const frameHeight = frame.height();
const slideWidth = frameWidth / numberOfElements;
let slideAnimate = slideWidth * 2;
const lastIndex = slides.length - 1;
const firstSlide = slides[0];
const startingPosition = slides.length * slideWidth + (saveIndex + 1) * slideAnimate;
const mouse = {
  x: undefined,
  prevX: undefined,
  distanceX: undefined,
};
let isPressed = false;
const press = {
  start: undefined,
  end: undefined,
  delta: undefined,
};
let movingIndex, movingLeft, timer;
let loopInteger = 1;
let step;

//Setup images
slides.css({ width: slideWidth, height: frameHeight });
images.css({ width: slideWidth, height: frameHeight, transform: 'scale(0.8)' });

//Setup if loop is true
if (loop) {
  let firstElement = $(slides[0]).clone();
  $(firstElement).insertBefore(slides[0]);
  for (let i = saveIndex; i >= 0; i--) {
    let element = $(slides[i]).clone();
    $(element).insertAfter(slides[lastIndex]);
  }
  for (let i = lastIndex; i >= 1; i--) {
    let element = $(slides[i]).clone();
    $(element).insertAfter(firstElement);
  }
  slideContainer.css({ 'margin-left': `-${startingPosition + slideWidth}px` });
}

function nextSlide() {
  if (loop) {
    if (currentIndex === saveIndex - 1) {
      slideContainer.css({ 'margin-left': `-${startingPosition - slideWidth}px` });
      slideContainer.animate({ 'margin-left': `-=${slideAnimate}px` }, speed);
      currentIndex++;
    } else {
      slideContainer.animate({ 'margin-left': `-=${slideAnimate}px` }, speed);
      currentIndex === lastIndex ? (currentIndex = 0) : currentIndex++;
    }
  } else {
    if (currentIndex < lastIndex) {
      slideContainer.animate({ 'margin-left': `-=${slideAnimate}px` }, speed);
      currentIndex++;
    }
  }
}

function prevSlide() {
  if (loop) {
    if (currentIndex === saveIndex + 1) {
      slideContainer.css({ 'margin-left': `-${startingPosition + slideWidth}px` });
      slideContainer.animate({ 'margin-left': `+=${slideAnimate}px` }, speed);
      currentIndex--;
    } else {
      slideContainer.animate({ 'margin-left': `+=${slideAnimate}px` }, speed);
      currentIndex === 0 ? (currentIndex = lastIndex) : currentIndex--;
    }
  } else {
    if (currentIndex !== saveIndex) {
      slideContainer.animate({ 'margin-left': `-=${slideAnimate}px` }, speed);
    }
  }
}

function getPosition(event) {
  const positionX = event.clientX;
  return positionX;
}

function mouseDown(event) {
  isPressed = true;
  mouse.prevX = getPosition(event);
  press.start = new Date();
  return mouse.prevX;
}

function mouseUp(event) {
  mouse.prevX = getPosition(event);
  isPressed = false;
  press.end = new Date();
  return mouse.prevX;
}

function move(event) {
  mouse.x = getPosition(event);
  mouse.distanceX = mouse.prevX - mouse.x;
  movingLeft = slideContainer.css('margin-left');
  movingLeft = movingLeft.replace('px', '');
  movingLeft = -movingLeft;
  movingIndex = Math.ceil((startingPosition - movingLeft) / slideWidth);
  movingIndex = -movingIndex;

  if (isPressed) {
    if (mouse.distanceX > 0) {
      if (loop) {
        slideContainer.css({ 'margin-left': `-=${mouse.distanceX / velocity}px` });
        if (movingIndex >= loopInteger * slides.length - saveIndex) {
          loopInteger++;
        }
        currentIndex = saveIndex + (movingIndex - slides.length * (loopInteger - 1));
        if (movingIndex + 1 == lastIndex) {
          slideContainer.css({ 'margin-left': `-${startingPosition - slideWidth}px` });
        }
      } else {
        nextSlide();
      }
    } else {
      if (loop) {
        slideContainer.css({ 'margin-left': `-=${mouse.distanceX / velocity}px` });
        if (movingIndex < -(saveIndex + slides.length * (loopInteger - 1))) loopInteger += loopInteger;
        currentIndex = saveIndex + (movingIndex + slides.length * (loopInteger - 1));
        if (-(movingIndex + 1) === numberOfElements) slideContainer.css({ 'margin-left': `-${startingPosition + slideWidth}px` });
      } else {
        prevSlide();
      }
    }
  }
  clearTimeout(timer);
  timer = setTimeout(() => {
    mouse.prevX = mouseStopped(event);
  }, 300);
}

function mouseStopped(event) {
  let positionX = getPosition(event);
  return positionX;
}

// Event Listeners
nextButton.on('click', nextSlide);
prevButton.on('click', prevSlide);
frame.on('mousedown', mouseDown);
frame.on('mouseup', mouseUp);
frame.on('mouseleave', mouseUp);
frame.on('mousemove', move);
