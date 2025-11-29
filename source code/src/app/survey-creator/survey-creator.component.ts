import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyCreatorModel } from 'survey-creator-core';
import { SurveyCreatorModule } from 'survey-creator-angular';
import { SurveyService } from '../survey.service';


@Component({
  selector: 'app-survey-creator',
  standalone: true,
  imports: [CommonModule, SurveyCreatorModule],
  template: `
    <div class="creator-container">
      <h2>Survey Creator </h2>
      <p class="instructions">
        Use the visual editor below to design your survey. 
        Drag questions from the left panel, configure them, and click "Save Survey" when done.
      </p>
     
      
      <div class="creator-wrapper">
        <survey-creator [model]="creator"></survey-creator>
      </div>

      <div class="actions">
        <button (click)="saveSurvey()" [disabled]="saving" class="save-btn">
          {{ saving ? 'Saving... ' : 'Save Survey ' }}
        </button>
        <button (click)="loadSurvey()" [disabled]="loading" class="load-btn">
          {{ loading ? 'Loading...' : 'Load Survey ' }}
        </button>
      </div>

      <div *ngIf="message" [class]="'message ' + messageType">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .creator-container {
      padding: 20px;
    }

    h2 {
      color: #1976d2;
      margin-bottom: 10px;
    }

    .instructions {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.6;
    }

    .creator-wrapper {
      margin: 20px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    button {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .save-btn {
      background-color: #4caf50;
      color: white;
    }

    .save-btn:hover:not(:disabled) {
      background-color: #45a049;
    }

    .load-btn {
      background-color: #2196f3;
      color: white;
    }

    .load-btn:hover:not(:disabled) {
      background-color: #1976d2;
    }

    .message {
      margin-top: 15px;
      padding: 12px;
      border-radius: 4px;
    }

    .message.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .message.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `]
})
export class SurveyCreatorComponent implements OnInit {
  creator!: SurveyCreatorModel;
  saving = false;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private surveyService: SurveyService) {}

  ngOnInit() {
    // Initialize Survey Creator
    // Inicializar el Creador de Encuestas
    this.creator = new SurveyCreatorModel({
      showLogicTab: true,
      showJSONEditorTab: true,
      showTestSurveyTab: true,
      showDesignerTab: true
    });

    // Optional: Set default JSON
    // Opcional: Establecer JSON por defecto
    this.creator.JSON = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "question1",
              title: "What is your name?"
            }
          ]
        }
      ]
    };
  }

  /**
   * Save survey to backend
   * Guardar encuesta en el backend
   */
  saveSurvey() {
    this.saving = true;
    this.message = '';

    const surveyJson = this.creator.JSON;

    this.surveyService.saveSurvey(surveyJson).subscribe({
      next: (response) => {
        this.saving = false;
        if (response.success) {
          this.showMessage('Survey saved successfully!', 'success');
        } else {
          this.showMessage('Error saving survey', 'error');
        }
      },
      error: (error) => {
        this.saving = false;
        console.error('Error saving survey:', error);
        this.showMessage('Error: ' + (error.message || 'Failed to save'), 'error');
      }
    });
  }

  /**
   * Load survey from backend
   * Cargar encuesta desde el backend
   */
  loadSurvey() {
    this.loading = true;
    this.message = '';

    this.surveyService.loadSurvey().subscribe({
      next: (survey) => {
        this.loading = false;
        if (survey && Object.keys(survey).length > 0) {
          this.creator.JSON = survey;
          this.showMessage('Survey loaded successfully! ', 'success');
        } else {
          this.showMessage('No survey found ', 'error');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading survey:', error);
        this.showMessage('Error: ' + (error.message || 'Failed to load '), 'error');
      }
    });
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    if (type === 'success') {
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
}





