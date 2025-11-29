import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyModel } from 'survey-core';
import { SurveyModule } from 'survey-angular-ui';
import { SurveyService, SurveySchema } from '../survey.service';

@Component({
  selector: 'app-survey-viewer',
  standalone: true,
  imports: [CommonModule, SurveyModule],
  template: `
    <div class="viewer-container">
      <h2>Survey Viewer / Visor de Encuestas</h2>
      <p class="instructions">
        Complete the survey below. All fields are required unless otherwise noted.
      </p>
      <p class="instructions">
        Completa la encuesta a continuación. Todos los campos son obligatorios a menos que se indique lo contrario.
      </p>

      <div *ngIf="loading" class="loading">
        Loading survey... / Cargando encuesta...
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="survey && !loading" class="survey-wrapper">
        <survey [model]="survey"></survey>
      </div>

      <div *ngIf="message" [class]="'message ' + messageType">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .viewer-container {
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

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
      font-size: 18px;
    }

    .error-message {
      padding: 15px;
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      margin: 20px 0;
    }

    .survey-wrapper {
      margin: 20px 0;
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
export class SurveyViewerComponent implements OnInit {
  survey: SurveyModel | null = null;
  loading = false;
  error = '';
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private surveyService: SurveyService) {}

  ngOnInit() {
    this.loadSurvey();
  }

  /**
   * Load survey from backend
   * Cargar encuesta desde el backend
   */
  loadSurvey() {
    this.loading = true;
    this.error = '';
    this.message = '';

    this.surveyService.loadSurvey().subscribe({
      next: (response: any) => {
        this.loading = false;
        const surveyJson = response.survey || response;
        if (surveyJson && Object.keys(surveyJson).length > 0) {
          this.survey = new SurveyModel(surveyJson);
          this.setupSurveyCompleteHandler();
          console.log('Survey loaded:', surveyJson);
        } else {
          this.error = 'No survey found. Please create one first. / No se encontró encuesta. Por favor crea una primero.';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading survey:', error);
        this.error = 'Error loading survey. / Error al cargar encuesta.';
      }
    });
  }

  /**
   * Setup survey complete handler after survey is loaded
   * Configurar el manejador de finalización según la forma oficial de SurveyJS
   * Official docs: https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onComplete
   */
  private setupSurveyCompleteHandler() {
    if (this.survey) {
      // Forma oficial de SurveyJS según la documentación
      this.survey.onComplete.add((sender) => {
        const results = sender.data;
        console.log('Survey completed:', results);

        this.surveyService.saveResults(results).subscribe({
          next: (response) => {
            if (response.success) {
              this.showMessage('Thank you! Your responses have been saved. / ¡Gracias! Tus respuestas han sido guardadas.', 'success');
            } else {
              this.showMessage('Error saving results / Error al guardar resultados', 'error');
            }
          },
          error: (error) => {
            console.error('Error saving results:', error);
            this.showMessage('Error: ' + (error.message || 'Failed to save / Error al guardar'), 'error');
          }
        });
      });
    }
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    if (type === 'success') {
      setTimeout(() => {
        this.message = '';
      }, 5000);
    }
  }
}

