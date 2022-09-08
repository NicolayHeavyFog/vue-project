import { gsap } from 'gsap';

export function animateTransitionProduct(page, {
  yFrom, yTo, xFrom, xTo,
}) {
  const fromParams = {};
  const toParams = {};
  if (yFrom) fromParams.y = yFrom;
  if (yTo) toParams.y = yTo;
  if (xFrom) fromParams.x = xFrom;
  if (xTo) toParams.x = xTo;
  const tl = gsap.timeline();
  return tl.fromTo(page, {
    opacity: 0,
    ...fromParams,
  }, {
    opacity: 1,
    duration: 0.4,
    ...toParams,
  });
}

export function navigateTabs(passingTabs, activeTab, direction) {
  const tl = gsap.timeline();
  const xTendAxis = direction ? { from: 600, to: -600 } : { from: -600, to: 600 };
  passingTabs.forEach((tab, index) => {
    if (index !== 0) {
      tl
        .fromTo(tab.tab, {
          x: xTendAxis.from,
          display: 'none',
        }, {
          display: 'block',
          x: 0,
          duration: 0.2,
          ease: 'none',
        });
    }
    tl.fromTo(tab.tab, {
      x: 0,
    }, {
      display: 'none',
      x: xTendAxis.to,
      duration: 0.2,
      ease: 'none',
    });
    tab.tab.classList.remove('item__content--active');
  });
  tl.fromTo(activeTab, {
    x: xTendAxis.from,
  }, {
    x: -600 * passingTabs.lenght,
    display: 'block',
    duration: 0.2,
    ease: 'circ',
  }).add(() => activeTab.classList.add('item__content--active'));
}

export function showImage(image) {
  const tl = gsap.timeline();
  tl.fromTo(image, {
    opacity: 0,
  }, {
    display: 'block',
    opacity: 1,
    duration: 0.8,
  });
}

export function shake(elements) {
  const tl = gsap.timeline();
  // tl.restart();
  tl.to(elements, {
    x: '+=10', yoyo: true, repeat: 1, duration: 0.2,
  }).to(elements, {
    x: 0, duration: 0.2,
  });
}
