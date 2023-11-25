import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HeaderComponent} from "./components/header/header.component";
import {ReactiveFormsModule} from "@angular/forms";
import { MainPageComponent } from './pages/main-page/main-page.component';
import {HttpClientModule} from "@angular/common/http";
import { ToastService, AngularToastifyModule } from 'angular-toastify';
import { CoordinatesFormComponent } from './components/coordinates-form/coordinates-form.component';
import { GraphComponent } from './components/graph/graph.component';
import { ResultsTableComponent } from './components/results-table/results-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainPageComponent,
    CoordinatesFormComponent,
    GraphComponent,
    ResultsTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularToastifyModule
  ],
  providers: [ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
