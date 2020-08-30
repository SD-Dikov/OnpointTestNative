const range = document.querySelector('#date-range-input');
const infographicList = document.querySelector('.infographics-list');
const anchors = document.querySelectorAll('.scroll-smooth');
const slides = document.querySelectorAll('.slide');
const moreBlock = document.querySelector('.more');
let scrollPosition = 0;
let xDown = null;
let yDown = null;

function smoothScroll(element) {
  document.querySelector(element).scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    }
  );
};

function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
};

function animateRange(num) {
  requestAnimationFrame(function move() {
    if (range.value == num) {
      return
    } else if (range.value <= num) {
      range.value++;
    } else {
      range.value--;
    }
    range.style.background = `linear-gradient(90deg, transparent 1%, #d1eaff 1%, #d1eaff ${range.value}%, #435063 ${range.value}%, #435063 99%, transparent 99%)`;
    requestAnimationFrame(move)
  });
};

function setMoreBlock() {
  if (anchors[0].classList.contains('slides-current')) {
    moreBlock.classList.add('more--active');
  } else {
      moreBlock.classList.remove('more--active');
    }
};

function smoothDowm() {
  let startView = window.innerHeight;
  let endView = startView * 2;
  requestAnimationFrame(function scroll() {
    if (startView < endView) {
      window.scrollBy(0, 32);
      startView += 32;
    };
    requestAnimationFrame(scroll);
  });
};

function smoothUp() {
  let startView = window.innerHeight * -1;
  let endView = startView * 2;
  requestAnimationFrame(function scroll() {
    if (startView > endView) {
      window.scrollBy(0, -32);
      startView -= 32;
    };
    requestAnimationFrame(scroll);
  });
};

function changeSlideDown(index) {
  if (slides[index + 1]) {
    const el = slides[index + 1].getAttribute('id');
    smoothDowm();
  }
};

function changeSlideUp(index) {
  if (slides[index - 1]) {
    const el = slides[index - 1].getAttribute('id');
    smoothUp();
  }
};

anchors.forEach(anchor => {
  anchor.addEventListener('click', function(evt) {
    evt.preventDefault();

    anchors.forEach(item => {
      item.classList.remove('slides-current');
    });

    const el = anchor.getAttribute('href');
    anchor.classList.add('slides-current');
    setMoreBlock();
    smoothScroll(el);
  });
});

range.addEventListener('touchmove', function() {
  range.style.background = `linear-gradient(90deg, transparent 1%, #d1eaff 1%, #d1eaff ${range.value}%, #435063 ${range.value}%, #435063 99%, transparent 99%)`;
  if (range.value <= 25) {
    infographicList.style.backgroundPositionX = '0';
  } else if (range.value > 25 && range.value < 75) {
    infographicList.style.backgroundPositionX = '-1024px';
  } else {
    infographicList.style.backgroundPositionX = '-2048px';
  }
});

range.addEventListener('touchend', function() {
  if (range.value <= 25) {
    animateRange(1);
    infographicList.style.backgroundPositionX = '0';
  } else if (range.value > 25 && range.value < 75) {
    animateRange(50);
    infographicList.style.backgroundPositionX = '-1024px';
  } else {
    animateRange(98);
    infographicList.style.backgroundPositionX = '-2048px';
  }
  range.style.background = `linear-gradient(90deg, transparent 1%, #d1eaff 1%, #d1eaff ${range.value}%, #435063 ${range.value}%, #435063 99%, transparent 99%)`;
});

slides.forEach((slide, i) => {
  slide.addEventListener('touchstart', handleTouchStart, false);
  slide.addEventListener('touchmove', function(evt) {
    if (evt.target !== range) {
      evt.preventDefault();
    } else {
      return
    }
    if (!xDown || !yDown) {
      return
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          return
      } else {
        return
      }
    } else {
      if (yDiff > 0) {
        if (slides[i + 1]) {
          anchors.forEach(item => {
            item.classList.remove('slides-current')
          });
          document.querySelector(`a[href="#${slides[i + 1].getAttribute('id')}"]`).classList.add('slides-current');
        }
        changeSlideDown(i);
      } else {
        if (slides[i - 1]) {
          anchors.forEach(item => {
            item.classList.remove('slides-current')
          });
          document.querySelector(`a[href="#${slides[i - 1].getAttribute('id')}"]`).classList.add('slides-current');
        }

        changeSlideUp(i);
      }
    }

    setMoreBlock();
    xDown = null;
    yDown = null;
  });
});

document.addEventListener('scroll', function(){
  scrollPosition = window.pageYOffset;
  document.querySelector('.slide__wrapper--one').style.transform = 'translateY(-'+ scrollPosition +'px)';
  document.querySelector('.slide__wrapper--two').style.transform = 'translateY(-'+ (scrollPosition / 2) +'px)';
});
