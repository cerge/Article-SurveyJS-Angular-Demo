import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container">
      <header class="header">
        <h1>SurveyJS + Angular Demo</h1>
        <p>Complete survey system with visual creator</p>
        <nav class="nav">
          <a routerLink="/creator" routerLinkActive="active">Create Survey</a>
          <a routerLink="/viewer" routerLinkActive="active">View Survey</a>
        </nav>
      </header>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .nav a.active {
      background-color: #1565c0;
      font-weight: bold;
    }
  `]
})
export class AppComponent {
  title = 'SurveyJS Angular Demo';
}





