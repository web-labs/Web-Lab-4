import { Injectable } from '@angular/core';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloakAuth: Keycloak.KeycloakInstance;
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private username = new BehaviorSubject<string | null>(null);

  constructor() {
    this.keycloakAuth = new Keycloak({
      url: 'http://localhost:8080/',
      realm: 'SpringBootKeycloak',
      clientId: 'login-app',
    });
  }

  init(): Promise<boolean> {
    return new Promise((resolve, reject) => {

      this.keycloakAuth.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
      })
        .then((authenticated) => {
          this.isAuthenticated.next(authenticated);
          if (authenticated) {
            console.log('User is authenticated');
            this.keycloakAuth.loadUserProfile().then(profile => {
              // @ts-ignore
              this.username.next(profile.username);
              resolve(true);
            });
          } else {
            console.log('User is not authenticated');
            reject(false);
          }
        })
        .catch((error) => {
          console.error('Error during Keycloak initialization', error);
          reject(error);
        });
    });
  }

  logout(): void {
    this.keycloakAuth.logout({ redirectUri: window.location.origin })
      .then(() => {
        this.isAuthenticated.next(false);
        this.username.next(null);
        console.log("Logout successful");
      });
  }

  getIsAuthenticated(): BehaviorSubject<boolean> {
    return this.isAuthenticated;
  }

  getUsername(): BehaviorSubject<string | null> {
    return this.username;
  }


  getToken(): string {
    // @ts-ignore
    return this.keycloakAuth.token;
  }


  getUsernameObservable(): Observable<string | undefined> {
    return new Observable<string | undefined>((subscriber) => {
      if (this.keycloakAuth.authenticated) {
        this.keycloakAuth.loadUserProfile().then(profile => {
          subscriber.next(profile.username);
        }).catch(error => {
          console.error("Failed to load user profile", error);
          subscriber.error(error);
        });
      } else {
        subscriber.next(undefined);
      }
    });
  }

}
