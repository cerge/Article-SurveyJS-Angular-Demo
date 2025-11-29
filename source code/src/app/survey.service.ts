import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SurveySchema {
  pages?: any[];
  questions?: any[];
  [key: string]: any;
}

export interface SurveyResult {
  timestamp: string;
  results: any;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  // API URL - Adjust if your Laragon setup uses a different path
 
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Save survey schema to backend
   
   */
  saveSurvey(survey: SurveySchema): Observable<any> {
    return this.http.post(`${this.apiUrl}/save_survey.php`, { survey });
  }

  /**
   * Load survey schema from backend
 
   */
  loadSurvey(): Observable<SurveySchema> {
    return this.http.get<SurveySchema>(`${this.apiUrl}/load_survey.php`);
  }

  /**
   * Save survey results
  
   */
  saveResults(results: any): Observable<any> {
    const data: SurveyResult = {
      timestamp: new Date().toISOString(),
      results
    };
    return this.http.post(`${this.apiUrl}/save_results.php`, data);
  }

  /**
   * Load survey results
 
   */
  loadResults(): Observable<SurveyResult[]> {
    return this.http.get<SurveyResult[]>(`${this.apiUrl}/load_results.php`);
  }
}

