import { gsap } from 'gsap';
// eslint-disable-next-line import/prefer-default-export
export function animateTransitionToCart(cartIndicator, arrayOfElementsMainPage) {
  const tl = gsap.timeline();
  tl.to(cartIndicator, {
    x: 100,
    duration: 0.5,
    ease: 'power',
  }).to(arrayOfElementsMainPage, {
    x: -400,
    duration: 0.4,
    ease: 'power3',
    opacity: 0,
  }, '-=0.4')
    .to(
      cartIndicator,
      {
        x: 0,
        duration: 1,
        opacity: 1,
      },
    );
}

export function animateTransitionFromTo(elements, {
  yFrom, yTo, xFrom, xTo,
}, show = true) {
  console.log('animate');
  const fromParams = {};
  const toParams = {};

  if (xFrom) fromParams.x = xFrom;
  if (yFrom) fromParams.y = yFrom;

  if (xTo) toParams.x = xTo;
  if (yTo) toParams.y = yTo;

  // console.log(fromParams, toParams);
  const tl = gsap.timeline();
  return tl.fromTo(elements, {
    ...fromParams,
    opacity: show ? 0 : 1,
  }, {
    // delay: 0.5,
    duration: 0.7,
    ...toParams,
    opacity: show ? 1 : 0,
  });
}

export function defaultTransitionAppear(page) {
  const tl = gsap.timeline();
  tl.fromTo(page, {
    opacity: 0,
  }, {
    opacity: 1,
    duration: 1,
  });
}

export function defaultFadeContent(page) {
  const tl = gsap.timeline();
  return tl.fromTo(page, {
    opacity: 1,
    y: 0,
  }, {
    opacity: 0,
    duration: 0.4,
    y: 200,
  });
}
