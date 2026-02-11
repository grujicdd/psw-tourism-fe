import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BlockedUsersComponent } from './blocked-users/blocked-users.component';
import { AdminTourProblemsComponent } from './admin-tour-problems/admin-tour-problems.component';

@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    BlockedUsersComponent,
    AdminTourProblemsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent
  ]
})
export class AdministrationModule { }
