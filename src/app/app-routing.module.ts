import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SecretariatComponent } from './secretariat/secretariat.component';
import { DirectionComponent } from './direction/direction.component';
import { ServiceComponent } from './service/service.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Route par défaut
   { path: 'secretariat', component:SecretariatComponent },
    { path: 'direction', component:DirectionComponent },
    { path: 'service', component: ServiceComponent },
  { path: '**', redirectTo: '' } // Redirection pour les routes non trouvées
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }