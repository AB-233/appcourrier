import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourrierService {
  private apiUrl = 'http://localhost:3000/api/courriers'; // À adapter selon ton backend

  constructor(private http: HttpClient) {}

  ajouterCourrier(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getCourriersPourDirection() {
    return this.http.get<any[]>('http://localhost:3000/api/courriers/direction');
  }

  affecterCourrier(id: number, service_affecte: string, remarque_direction: string) {
    return this.http.put(`http://localhost:3000/api/courriers/${id}/affecter`, {
      service_affecte,
      remarque_direction
    });
  }

  getActions() {
  return this.http.get<any[]>('http://localhost:3000/api/actions');
}

affecterCourrierAvecActions(id: number, service_affecte: string, remarque_direction: string, actions: number[]) {
  return this.http.put(`http://localhost:3000/api/courriers/${id}/affecter`, {
    service_affecte,
    remarque_direction,
    actions
  });
}
getServices() {
  return this.http.get<any[]>('http://localhost:3000/api/services');
}
}