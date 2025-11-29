import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/creator',
    pathMatch: 'full'
  },
  {
    path: 'creator',
    loadComponent: () => import('./survey-creator/survey-creator.component').then(m => m.SurveyCreatorComponent)
  },
  {
    path: 'viewer',
    loadComponent: () => import('./survey-viewer/survey-viewer.component').then(m => m.SurveyViewerComponent)
  }
];





