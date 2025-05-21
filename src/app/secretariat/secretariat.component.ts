import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourrierService } from '../services/courrier.service';

@Component({
  selector: 'app-secretariat',
  templateUrl: './secretariat.component.html',
  styleUrls: ['./secretariat.component.scss']
})
export class SecretariatComponent implements OnInit {
  courrierForm: FormGroup;
  fichiers: File[] = [];
  message: string = '';

  constructor(private fb: FormBuilder, private courrierService: CourrierService) {
    this.courrierForm = this.fb.group({
      num_CA: ['', Validators.required],
      num_origine: [''],
      origine_courrier: [''],
      date_signature: [''],
      objet_courrier: ['']
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.fichiers = Array.from(event.target.files);
    }
  }

  enregistrerCourrier() {
    const formData = new FormData();
    Object.entries(this.courrierForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    this.fichiers.forEach(file => {
      formData.append('pieces_jointes', file);
    });

    // Appel au service pour enregistrer le courrier
    this.courrierService.ajouterCourrier(formData).subscribe({
      next: () => {
        this.message = 'Courrier enregistré avec succès !';
        this.courrierForm.reset();
        this.fichiers = [];
      },
      error: () => {
        this.message = "Erreur lors de l'enregistrement du courrier.";
      }
    });
  }
}