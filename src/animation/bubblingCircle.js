import { gsap } from 'gsap';

function bubblingCircle(tl, event, circle, { x, y }, { scaleTo, effectOfSubsideEarlyOn }) {
  const timingSubside = effectOfSubsideEarlyOn ?? '-=0.6';
  // eslint-disable-next-line no-param-reassign
  if (Array.isArray(circle)) [circle] = circle;
  const style = window.getComputedStyle(event.path[0]);
  const { backgroundColor } = style;
  // eslint-disable-next-line no-param-reassign
  circle.style.backgroundColor = backgroundColor === 'rgb(255, 255, 255)' ? '#272727' : '#9eff00';

  tl.restart();
  tl.fromTo(circle, {
    display: 'block',
    opacity: 0,
    scale: 0,
    left: x ?? event.offsetX,
    top: y ?? event.offsetY,
  }, {
    ease: 'sine',
    duration: 1,
    scale: scaleTo ?? 40,
    opacity: 1,
  })
    .to(circle, {
      display: 'none',
      opacity: 0,
      duration: 1,
    }, timingSubside)
    .addPause();
}

export function buttonCircle(event, circle) {
  const tl = gsap.timeline();
  bubblingCircle(tl, event, circle, {}, {});
}

export function checkboxCircle(event, circle) {
  const tl = gsap.timeline();
  bubblingCircle(tl, event, circle, { x: 8, y: 8 }, { scaleTo: 8, effectOfSubsideEarlyOn: '-=0.1' });
}
