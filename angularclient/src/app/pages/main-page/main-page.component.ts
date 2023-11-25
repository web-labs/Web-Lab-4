import { Component, OnInit } from '@angular/core';
import {KeycloakService} from "../../services/keycloak.service";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(private keycloakService: KeycloakService, private appComponent: AppComponent) { }


  logout(){
    this.keycloakService.logout()
  }
  ngOnInit(): void {
  }

  printUsername(): string | null{
    return this.appComponent.getUsername();
  }



}
