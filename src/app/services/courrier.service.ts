import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourrierService {
  private apiUrl = 'http://localhost:3000/api/courriers'; // À adapter selon ton backend

  constructor(private http: HttpClient) {}

  ajouterCourrier(formData: FormData) {
    return this.http.post('http://localhost:3000/api/courriers', formData);
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

affecterCourrierAvecActions(id: number, services: string[], remarque_direction: string, actions: number[]) {
  return this.http.put(`http://localhost:3000/api/courriers/${id}/affecter`, {
    services,
    remarque_direction,
    actions
  });
}
getServices() {
  return this.http.get<any[]>('http://localhost:3000/api/services');
}
getCourriersPourService() {
  return this.http.get<any[]>('http://localhost:3000/api/courriers/service');
}

mettreAJourEtatCourrier(id: number, etat_traitement: string, commentaire_service: string, traite_par: string) {
  return this.http.put(`http://localhost:3000/api/courriers/${id}/etat`, {
    etat_traitement,
    commentaire_service,
    traite_par
  });
}
 }