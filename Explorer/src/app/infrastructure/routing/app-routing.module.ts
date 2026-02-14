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
import { ShoppingCartComponent } from 'src/app/feature-modules/tour-purchasing/shopping-cart/shopping-cart.component';
import { PurchaseHistoryComponent } from 'src/app/feature-modules/tour-purchasing/purchase-history/purchase-history.component';
import { TourDetailsComponent } from 'src/app/feature-modules/tour-details/tour-details/tour-details.component';
import { TouristProfileComponent } from 'src/app/feature-modules/stakeholders/tourist-profile/tourist-profile.component';
import { BlockedUsersComponent } from 'src/app/feature-modules/administration/blocked-users/blocked-users.component';
import { TourReplacementManagementComponent } from 'src/app/feature-modules/tour-authoring/tour-replacement-management/tour-replacement-management.component';
import { AvailableReplacementsComponent } from 'src/app/feature-modules/tour-authoring/available-replacements/available-replacements.component';
import { MyTourProblemsComponent } from 'src/app/feature-modules/tour-purchasing/my-tour-problems/my-tour-problems.component';
import { GuideTourProblemsComponent } from 'src/app/feature-modules/tour-authoring/guide-tour-problems/guide-tour-problems.component';
import { AdminTourProblemsComponent } from 'src/app/feature-modules/administration/admin-tour-problems/admin-tour-problems.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard]},
  {path: 'tours', component: TourManagementComponent, canActivate: [AuthGuard]},
  {path: 'browse-tours', component: TourBrowsingComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: ShoppingCartComponent, canActivate: [AuthGuard]},
  {path: 'purchase-history', component: PurchaseHistoryComponent, canActivate: [AuthGuard]},
  {path: 'tour-details/:id', component: TourDetailsComponent, canActivate: [AuthGuard]},
  {path: 'tourist-profile', component: TouristProfileComponent, canActivate: [AuthGuard]},
  {path: 'blocked-users', component: BlockedUsersComponent, canActivate: [AuthGuard]},
  {path: 'my-replacement-requests', component: TourReplacementManagementComponent, canActivate: [AuthGuard]},
  {path: 'available-replacements', component: AvailableReplacementsComponent, canActivate: [AuthGuard]},
  {path: 'my-problems', component: MyTourProblemsComponent, canActivate: [AuthGuard]},
  {path: 'tour-problems', component: GuideTourProblemsComponent, canActivate: [AuthGuard]},
  {path: 'admin-tour-problems', component: AdminTourProblemsComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }