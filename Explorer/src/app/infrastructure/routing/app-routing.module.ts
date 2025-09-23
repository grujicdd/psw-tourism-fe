// src/app/infrastructure/routing/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { TourManagementComponent } from 'src/app/feature-modules/tour-authoring/tour-management/tour-management.component';
import { TourBrowsingComponent } from 'src/app/feature-modules/tour-browsing/tour-browsing/tour-browsing.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard]},
  {path: 'tours', component: TourManagementComponent, canActivate: [AuthGuard]},
  {path: 'browse-tours', component: TourBrowsingComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }