import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {KeycloakService} from "./services/keycloak.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular client';
  private isAuthenticated: boolean = false;
  private username: string | null = null;
  private authSubscription?: Subscription;
  private usernameSubscription?: Subscription;

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit() {
    this.authSubscription = this.keycloakService.getIsAuthenticated().subscribe((authenticated: boolean) => {
      this.isAuthenticated = authenticated;
      if (authenticated) {
        console.log('User is authenticated');
      } else {
        console.log('User is not piska');
      }
    });

    this.usernameSubscription = this.keycloakService.getUsername().subscribe((username: string | null) => {
      this.username = username;
      if (username) {
        console.log("Username:", username);
      }
    });

    this.keycloakService.init().then(() => {
      console.log("Keycloak Initialized Successfully");
    }).catch((error: any) => {
      console.error("Error during Keycloak initialization", error);
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.usernameSubscription?.unsubscribe();
  }

  logout() {
    this.keycloakService.logout();
  }

  getUsername(): string | null {
    return this.username;
  }
}
