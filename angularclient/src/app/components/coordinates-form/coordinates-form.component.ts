import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CoordinatesService} from "../../services/coordinates.service";
import {Coordinates} from "../../models/Coordinates";
import {Point} from "../../models/Point";
import {numberValidator} from "../../functional/numberValidator";
import {KeycloakService} from "../../services/keycloak.service";
import {AppComponent} from "../../app.component";
import {tap} from "rxjs";
import {GraphComponent} from "../graph/graph.component";

@Component({
  selector: 'app-coordinates-form',
  templateUrl: './coordinates-form.component.html',
  styleUrls: ['./coordinates-form.component.scss']
})
export class CoordinatesFormComponent implements OnInit {

  @Output() rChanged: EventEmitter<number> = new EventEmitter<number>()


  onBlur() {
    if (this.coordinatesForm.controls['r'].valid){
      const rValue = this.coordinatesForm.get('r')?.value;
      // @ts-ignore
      this.rChanged.emit(rValue)
    }
    else{
      console.log('Ashibka!!')
    }
  }

  coordinatesForm = new FormGroup({
    x: new FormControl(0,
      [Validators.required,
        numberValidator,
        Validators.max(3),
        Validators.min(-5)]),
    y: new FormControl(0, [Validators.required, numberValidator, Validators.max(3), Validators.min(-5)]),
    r: new FormControl(1, [Validators.required, numberValidator, Validators.max(3), Validators.min(0)])
  })

  get r() {
    return this.coordinatesForm.controls.r
  }

  get x(){
    return this.coordinatesForm.controls.x
  }

  get y(){
    return this.coordinatesForm.controls.y
  }
  constructor(private coordsService: CoordinatesService, private keycloakService: KeycloakService, private graph: GraphComponent, private appComponent: AppComponent) { }

  explodeAtomic() {
    this.keycloakService.getUsername().subscribe(username => {
      if (username) {
        this.coordsService.clearPoints(username).pipe(
          tap(() => {
            console.log("Points cleared for user:", username);
            window.location.reload()
          }),
        ).subscribe(
          () => {
          },
          error => {
            console.error('Error during points clearing:', error);
          }
        );
      } else {
        console.error('Cannot clear points because username is not available');
      }
    });
  }

  ngOnInit(): void {
  }


  onSubmit(){
    if (this.coordinatesForm.valid) {
      this.keycloakService.getUsernameObservable().subscribe(username => {
        if (this.appComponent.getUsername()) {

          const coordinates: Coordinates = {
            // @ts-ignore
            x: this.coordinatesForm.get('x')?.value,
            // @ts-ignore
            y: this.coordinatesForm.get('y')?.value,
            // @ts-ignore
            r: this.coordinatesForm.get('r')?.value,
            //@ts-ignore
            username: this.appComponent.getUsername()
          };

          this.coordsService.sendCoordinates(coordinates).subscribe(
            (point: Point) => {
              this.graph.drawPoint(point.x, point.y, point.r, point.result)
              this.graph.addToTable(point)
            },
            error => {
              console.log("Error", error);
            }
          );
        } else {
          console.log("Cannot send coordinates because username is undefined.");
        }
      }
      );
    }
  }

}
