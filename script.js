'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const operationContent = document.querySelectorAll('.operations__content');
const operationTaps = document.querySelector('.operations__tab-container');
const nav = document.querySelector('.nav');
const header = document.querySelector('header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const sections = document.querySelectorAll('.section');
const featureImgs = document.querySelectorAll('.features img')


const openModal = function (e) 
{
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click',function()
{
  section1.scrollIntoView({behavior: 'smooth'});
})


// document.querySelectorAll('.nav__link').forEach(function(link,i)
// {
//   link.addEventListener('click',function(e)
//   {
//     e.preventDefault();
//     document.querySelector(`#section--${i+1}`).scrollIntoView({behavior:"smooth"});
//   })
// })

document.querySelector('.nav__links').addEventListener('click',function(e)
{
  e.preventDefault();
  if(e.target.classList.contains('nav__link'))
  {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:"smooth"});
  }
})



operationTaps.addEventListener('click',function(e)
{
  const targetBtn = e.target.closest('.operations__tab');
  if(!targetBtn) return;

  [...operationTaps.children].forEach(function(btn) 
  {
    if(btn == targetBtn)
      btn.classList.add('operations__tab--active');
    else
      btn.classList.remove('operations__tab--active');
  })

  const tabIndex = targetBtn.getAttribute('data-tab');
  operationContent.forEach(function(content)
  {
    if(content.classList.contains(`operations__content--${tabIndex}`))
      content.classList.add('operations__content--active');
    else
      content.classList.remove('operations__content--active');
  })
})


function handleHover(e,op)
{
  const link = e.target;
  if(link.classList.contains('nav__link'))
  {
    const siblings = nav.querySelectorAll('.nav__link');
    const image = nav.querySelector('img');
    siblings.forEach(function(sibling)
    {
      if(sibling !== link)
        sibling.style.opacity = op;
    })
    image.style.opacity = op;
  }
}

nav.addEventListener('mouseover',function(e)
{
  handleHover(e,'0.5');
})

nav.addEventListener('mouseout',function(e)
{
  handleHover(e,'1');
})


const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(function(entries)
{
  if(!entries[0].isIntersecting)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
},{
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
})
headerObserver.observe(header);

const sectionObserver = new IntersectionObserver(function(entries)
{
  entries.forEach(function(entry)
  {
    if(entry.isIntersecting)
    {
      entry.target.classList.remove('section--hidden');
      sectionObserver.unobserve(entry.target);
    }
  })
},{
  root: null,
  threshold: 0.15,
})
sections.forEach(section => sectionObserver.observe(section));

const imagesObserver = new IntersectionObserver(function(entries)
{
  entries.forEach(function(entry)
  {
    if(entry.isIntersecting)
    {
      entry.target.setAttribute('src',`${entry.target.getAttribute('data-src')}`);
      entry.target.onload = function()
      {
        entry.target.classList.remove('lazy-img');
        imagesObserver.unobserve(entry.target);
      }
    }
  })
},{
  root: null,
  threshold: 0,
  rootMargin: '200px'
})
featureImgs.forEach(img => imagesObserver.observe(img));

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let currSlide = 0;

const goToSlide = (slide) => slides.forEach((s,i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
goToSlide(0);

const activateDot = function(slide)
{
  document.querySelectorAll('.dots__dot').forEach(dot => dot.getAttribute('data-slide') == slide ?
  dot.classList.add('dots__dot--active') : dot.classList.remove('dots__dot--active'));
}

const nextSlide = function()
{
  if(currSlide === slides.length - 1)
    currSlide = 0;
  else
    currSlide++; 
  goToSlide(currSlide);
  activateDot(currSlide);
}
btnRight.addEventListener('click',nextSlide)

const previousSlide = function()
{
  if(currSlide === 0)
    currSlide = slides.length-1;
  else
    currSlide--;
  goToSlide(currSlide);
  activateDot(currSlide);
}
btnLeft.addEventListener('click',previousSlide)

document.addEventListener('keyup',function(e)
{
  if(e.key === 'ArrowRight')
    btnRight.click();
  else if (e.key === 'ArrowLeft')
    btnLeft.click(); 
})

const dotsContainer = document.querySelector('.dots');
for(let i = 0; i < slides.length; i++)
{
  const div = document.createElement('div');
  div.classList.add('dots__dot');
  div.setAttribute('data-slide',i);
  if(i === 0) div.classList.add('dots__dot--active');
  dotsContainer.appendChild(div);
}

dotsContainer.addEventListener('click',function(e)
{
  const currDot = e.target;
  if(currDot.classList.contains('dots__dot'))
  {
    currSlide = currDot.getAttribute('data-slide');
    activateDot(currSlide);
    goToSlide(currSlide);
  }
})