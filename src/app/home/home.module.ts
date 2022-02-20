import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';

import { CountDownComponent } from '../core/count-down/count-down.component';
import { GoogleWazeNavigationComponent } from '../core/google-waze-navigation/google-waze-navigation.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    CountDownComponent,
    GoogleWazeNavigationComponent
  ]
})
export class HomePageModule {}
