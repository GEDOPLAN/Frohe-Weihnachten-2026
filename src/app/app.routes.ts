import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'memory',
    pathMatch: 'full',
  },
  {
    path: 'memory',
    loadComponent: () => import('./feature/memory/memory').then((m) => m.Memory),
  },
  {
    path: 'sliding',
    loadComponent: () => import('./feature/sliding/sliding').then((m) => m.Sliding),
  },
  {
    path: 'lights',
    loadComponent: () => import('./feature/lights/lights').then((m) => m.Lights),
  },
];
