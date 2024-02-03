import { trigger, style, animate, transition } from '@angular/animations';

export const loginModalBackgroundAnimation = trigger('fadeInOutBg', [
  transition(':enter', [
    style({
      opacity: 0,
    }),
    animate(150)
  ]),
  transition(':leave', [
    animate(150, style({
      opacity: 0,
    }))
  ]),
]);

export const loginModalWindowAnimation = trigger('fadeInOutWindow', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'scale(0.9)',
    }),
    animate('250ms ease-out', style({
      opacity: 1,
      transform: 'scale(1)',
    })),
  ]),
  transition(':leave', [
    animate('250ms ease-out', style({
      opacity: 0,
      transform: 'scale(0.9)',
    })),
  ]),
]);
