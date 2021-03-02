import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';


export const toggle = trigger('toggle', [
  state('in', style({ display: 'none' })),
  transition(':enter', [
    style({transform: 'translateY(-100%)', 'opacity': 1, height: '0'}),
    animate('500ms', style({transform: 'translateY(0)', 'opacity': 1, height: '*'}))
  ]),
  transition( ':leave', [
    style({ transform: 'translateY(0)', opacity: 1, height: '*'}),
    animate('500ms', style({ transform: 'translateY(-100%)', 'opacity': 1, height: '0' }))
  ])
]);
