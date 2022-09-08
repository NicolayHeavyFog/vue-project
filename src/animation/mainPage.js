import { gsap } from 'gsap';

export function animatePageHandler(element) {
  gsap.fromTo(
    element,
    {
      y: 500,
    },
    {
      y: 0,
      duration: 1.5,
    },
  );
}

export function animateFilterElements([titleElement, formElement]) {
  const tl = gsap.timeline();
  tl.fromTo(
    titleElement,
    {
      y: 200,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'sine',
    },
  )
    .fromTo(
      formElement,
      {
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'expo',
      },
    );
}

export function animateArrayOfElements(arrayOfElements) {
  const tl = gsap.timeline();
  arrayOfElements.forEach((e) => {
    tl.add(() => e.classList.remove('catalog__item--hiden'))
      .fromTo(
        e,
        {
          scale: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back',
        },
        '-=0.3',
      );
  });
}

export function animateTransitionMainToProduct(catalog) {
  const tl = gsap.timeline();
  return tl.to(catalog, {
    opacity: 0,
    duration: 0.4,
    y: -200,
  });
}
