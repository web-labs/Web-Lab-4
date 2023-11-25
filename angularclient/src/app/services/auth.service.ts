import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Login} from "../models/login";

@Injectable({
  providedIn: 'root'
})

export class AuthService{
  constructor(private http: HttpClient) {
  }

  login(credentials: Login) {
    return this.http.post('/api/login', credentials);
  }

}
