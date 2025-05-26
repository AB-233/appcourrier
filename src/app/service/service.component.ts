import { Component, OnInit } from '@angular/core';
import { CourrierService } from '../services/courrier.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  courriers: any[] = [];
  message = '';

  constructor(private courrierService: CourrierService) {}

  courriersTraites: any[] = [];

ngOnInit(): void {
  this.loadCourriers();
  this.courrierService.getCourriersTraitesPourService().subscribe(data => {
    this.courriersTraites = data;
  });
}
  loadCourriers() {
    this.courrierService.getCourriersPourService().subscribe(data => {
      this.courriers = data.map((c: any) => ({
        ...c,
        etat_traitement: c.etat_traitement || 'non traité',
        commentaire_service: c.commentaire_service || ''
      }));
    });
  }
  
get courriersNonTraites() {
  return this.courriers.filter(c => c.etat_traitement !== 'traité');
}

mettreAJour(courrier: any) {
    // Remplace ceci par la vraie valeur de l'utilisateur connecté
    const traite_par = courrier.service_affecte || 'service@exemple.com';

    this.courrierService.mettreAJourEtatCourrier(
      courrier.id,
      courrier.etat_traitement,
      courrier.commentaire_service,
      traite_par
    ).subscribe({
      next: () => {
        this.message = 'Mise à jour réussie !';
      },
      error: () => {
        this.message = "Erreur lors de la mise à jour.";
      }
    });
  }
}
