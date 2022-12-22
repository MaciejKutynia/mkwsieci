const hamburger = document.getElementById('hamburger');
const line1 = document.querySelector('.line1');
const line2 = document.querySelector('.line2');
const nav = document.getElementById('navigation');
const contactForm = document.querySelector('.contact-form');
const closeButton = document.querySelector('.close');
const submitButton = document.querySelector('.submit');
const email = document.querySelector('.e-mail');
const emailIcon = document.querySelector('.fa-at');
const cvButton = document.querySelector('.cv');
const logo = document.querySelector('#logo a');
const cursor = document.querySelector('.cursor');
const cursorText = document.querySelector('.cursor span');
const responseArea = document.querySelector('.response');
const littleNav = document.querySelector('.little-nav');

function navToggle() {
  nav.classList.toggle('active');
  if (nav.classList.contains('active')) {
    gsap.to('.line1', 0.4, { rotate: '45', y: 6, background: 'black' });
    gsap.to('.line2', 0.4, { rotate: '-45', y: -6, background: 'black' });
  } else {
    gsap.to('.line1', 0.4, { rotate: '0', y: 0, background: 'white' });
    gsap.to('.line2', 0.4, { rotate: '0', y: 0, background: 'white' });
  }
  contactForm.classList.remove('active');
}

const script = document.createElement('script');
script.src = './carousel.js';

barba.init({
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        nav.classList.remove('active');
        document.getElementById('logo').style.animation = '';
        gsap.to('.line1', 0.4, { rotate: '0', y: 0, background: 'white' });
        gsap.to('.line2', 0.4, { rotate: '0', y: 0, background: 'white' });
        contactForm.classList.remove('active');
      },
    },
    {
      namespace: 'about',
      beforeEnter() {
        document.getElementById('logo').style.animation =
          'rotate 5s linear infinite';
        nav.classList.remove('active');
        gsap.to('.line1', 0.4, { rotate: '0', y: 0, background: 'white' });
        gsap.to('.line2', 0.4, { rotate: '0', y: 0, background: 'white' });
        contactForm.classList.remove('active');
        console.log(documewnt.querySelector('script'));
      },
      afterEnter() {
        gsap.fromTo(
          '.my-photo',
          { translateY: '-150%' },
          { translateY: '0%', duration: 2, ease: 'bounce.out' }
        );
        gsap.fromTo('.about-me-content', 1.5, { left: '100%' }, { left: '0%' });
      },
    },
    {
      namespace: 'portfolio',
      beforeLeave({ next }) {
        next.container.removeChild(script);
      },
      beforeEnter({ next }) {
        document.getElementById('logo').style.animation =
          'rotate 5s linear infinite';
        nav.classList.remove('active');
        gsap.to('.line1', 0.4, { rotate: '0', y: 0, background: 'white' });
        gsap.to('.line2', 0.4, { rotate: '0', y: 0, background: 'white' });
        contactForm.classList.remove('active');
        const carouselContent = document.querySelector('.carousel');
        const carouselNextButton = document.querySelector(
          '.carousel-next-button'
        );
        const carouselPrevButton = document.querySelector(
          '.carousel-prev-button'
        );
        const itemWidth =
          document.querySelector('.carousel .item') &&
          document.querySelector('.carousel .item').clientWidth;
        const allElements = carouselContent.children.length - 1;
        const carouselMargin = 40;
        let carouselCounter = 3,
          slideLeft = 0;
        let carouselSlide = itemWidth + carouselMargin;
        console.log('aaa');

        //Portfolio carousel handler

        carouselNextButton.addEventListener('click', function () {
          if (carouselCounter < allElements) {
            carouselCounter++;
            slideLeft = slideLeft - carouselSlide;
            console.log(slideLeft);
            carouselContent.style.marginLeft = slideLeft + 'px';
          }
          if (carouselCounter > 3) {
            carouselPrevButton.style.opacity = 1;
          }
          if (carouselCounter === allElements) {
            this.style.opacity = 0;
          }
        });

        carouselPrevButton.addEventListener('click', function () {
          if (carouselCounter > 3) {
            carouselCounter--;
            slideLeft = slideLeft + carouselSlide;
            console.log(slideLeft);
            carouselContent.style.marginLeft = slideLeft + 'px';
          }
          if (carouselCounter < allElements) {
            carouselNextButton.style.opacity = 1;
          }
          if (carouselCounter === 3) {
            this.style.opacity = 0;
          }
        });
      },
    },
  ],
  transitions: [
    {
      name: 'opacity',
      leave(data) {
        let done = this.async();
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.fromTo(data.current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          '.swipe',
          0.3,
          { x: '-100%' },
          { x: '0%', onComplete: done },
          '-=0.5'
        );
      },
      enter(data) {
        let done = this.async();
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.fromTo(data.current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          '.swipe',
          0.3,
          { x: '0%' },
          { x: '100%', onComplete: done },
          '-=0.5'
        );
      },
    },
  ],
});

//Event Listeners
window.addEventListener('click', (event) => {
  if (event.target.id !== 'navigation' && event.target.id !== 'hamburger') {
    nav.classList.remove('active');
    gsap.to('.line1', 0.4, { rotate: '0', y: 0, background: 'white' });
    gsap.to('.line2', 0.4, { rotate: '0', y: 0, background: 'white' });
  }
});

hamburger.addEventListener('mouseover', () => {
  if (!nav.classList.contains('active')) {
    hamburger.classList.add('hovered');
    line1.style.background = 'black';
    line2.style.background = 'black';
    littleNav.classList.add('active');
  }
});

hamburger.addEventListener('mouseleave', () => {
  if (!nav.classList.contains('active')) {
    line1.style.background = 'white';
    line2.style.background = 'white';
  }
  hamburger.classList.remove('hovered');
  littleNav.classList.remove('active');
});

littleNav.addEventListener('mouseover', () => {
  hamburger.classList.add('hovered');
  littleNav.classList.add('active');
  line1.style.background = 'black';
  line2.style.background = 'black';
});

littleNav.addEventListener('mouseleave', () => {
  hamburger.classList.remove('hovered');
  littleNav.classList.remove('active');
  line1.style.background = 'white';
  line2.style.background = 'white';
});

hamburger.addEventListener('click', navToggle);

email.addEventListener('click', () => {
  contactForm.classList.add('active');
});

closeButton.addEventListener('click', () => {
  contactForm.classList.remove('active');
});

cvButton.addEventListener('click', async () => {
  const fetchData = await fetch('./CV_Maciej_Kutynia.pdf');
  const response = await fetchData.blob();
  const data = await function () {
    let url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = 'CV_Maciej_Kutynia.pdf';
    document.body.appendChild(link);
    link.click();
  };
  data();
});

window.addEventListener('load', (event) => {
  const swipe = document.querySelector('.swipe');
  swipe.style.transform = 'translateX(-100%)';
});

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  let email = document.querySelector('#e-mail');
  let subject = document.querySelector('#subject');
  let msg = document.querySelector('#message');
  const mail = { email: email.value, subject: subject.value, msg: msg.value };
  const fetchData = await fetch('https://email-sender-1234.herokuapp.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(mail),
  });
  const response = await fetchData.json();
  responseArea.innerText = response;
  responseArea.style.opacity = 1;
  setTimeout(() => {
    responseArea.style.opacity = 0;
  }, 2000);
  email.value = '';
  subject.value = '';
  msg.value = '';
});

submitButton.addEventListener('click', () => {
  const email = document.querySelector('#e-mail');
  if (email.value.includes('@')) {
    contactForm.classList.remove('active');
  }
});

const portfolioSection =
  document.querySelector('.portfolio') && document.querySelector('.portfolio');
