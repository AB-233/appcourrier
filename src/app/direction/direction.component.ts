import { Component, OnInit } from '@angular/core';
import { CourrierService } from '../services/courrier.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss']
})
export class DirectionComponent implements OnInit {
  courriers: any[] = [];
  actions: any[] = [];
  affectationForm: FormGroup;
  selectedCourrierId: number | null = null;
  message = '';
// Ajoute ceci dans ta classe DirectionComponent
services: any[] = [];

constructor(private courrierService: CourrierService, private fb: FormBuilder) {
    this.affectationForm = this.fb.group({
      remarque_direction: ['']
    });
  }

  ngOnInit(): void {
    this.loadCourriers();
    this.loadActions();
    this.loadServices();

  }

  loadServices() {
  this.courrierService.getServices().subscribe(data => {
    this.services = data;
  });
}

  loadCourriers() {
    this.courrierService.getCourriersPourDirection().subscribe(data => {
      // Ajoute les propriétés pour la sélection dynamique
      this.courriers = data.map((c: any) => ({
  ...c,
  servicesAffectes: [],
  actionsSelectionnees: []
}));
    });
  }

  loadActions() {
    this.courrierService.getActions().subscribe(data => {
      this.actions = data;
    });
  }

  ouvrirAffectation(courrier: any) {
    this.selectedCourrierId = courrier.id;
    // Pré-remplir le formulaire si besoin
    this.affectationForm.reset();
  }

  affecter() {
    const courrier = this.courriers.find(c => c.id === this.selectedCourrierId);
if (courrier) {
  const { remarque_direction } = this.affectationForm.value;
  this.courrierService.affecterCourrierAvecActions(
    courrier.id,
    courrier.servicesAffectes, // tableau d'emails/services
    remarque_direction,
    courrier.actionsSelectionnees
  ).subscribe({ next: () => {
              console.log("hello3")

          this.message = 'Courrier affecté avec succès !';
          this.selectedCourrierId = null;
          this.loadCourriers();
        },
        error: () => {
          this.message = "Erreur lors de l'affectation.";
        }
      });
    }
  }
}