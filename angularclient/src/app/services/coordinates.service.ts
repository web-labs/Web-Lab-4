import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Coordinates} from "../models/Coordinates";
import {Observable} from "rxjs";
import {Point} from "../models/Point";

@Injectable({
  providedIn: 'root'
})

export class CoordinatesService{

  constructor(private http: HttpClient) {
  }

  sendCoordinates(credentials: Coordinates): Observable<Point>{
    return this.http.post<Point>('/api/points/check', credentials)
  }

  getAllPoints(username: string | null ): Observable<Point[]>{
    let params = new HttpParams();
    if (username) {
      params = params.append('username', username);
    }

    return this.http.get<Point[]>('/api/points', { params });
  }

  clearPoints(username: string):Observable<void>{
    let params = new HttpParams();
    if (username) {
      params = params.append('username', username);
    }

    return this.http.delete<void>('/api/points', { params });
  }

  updateRValue(currentRVal: number, username: string | null): Observable<void> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<void>('/api/points/r-value', {currentRVal, username}, { headers });
  }


}
