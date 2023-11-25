import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {CoordinatesService} from "../../services/coordinates.service";
import {Coordinates} from "../../models/Coordinates";
import {Point} from "../../models/Point";
import {KeycloakService} from "../../services/keycloak.service";
import {AppComponent} from "../../app.component";
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss', '../results-table/results-table.component.scss']
})
export class GraphComponent implements AfterViewInit, OnDestroy  {

  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>
  @ViewChild('resultsTable') tableRef: ElementRef<HTMLTableElement>

  currentRValue: number = 1;

  private ctx: CanvasRenderingContext2D

  private pointSubscription: Subscription

  private authSubscription: Subscription;

  private username: string | null = null;
  constructor(private coordinatesService: CoordinatesService, private keycloakService: KeycloakService, private appComponent: AppComponent) {
    this.authSubscription = this.keycloakService.getUsername().subscribe((username: string | null) => {
      this.username = username;
      if (username) {
        this.initCanvasAndRestorePoints();
      }
    });
  }

  ngOnDestroy(): void {
        this.pointSubscription.unsubscribe()
    }

  ngAfterViewInit(): void {

  }


  restorePoint(point: Point){
    point.r = this.currentRValue
    this.drawPoint(point.x, point.y, point.r, point.result)
    this.addToTable(point)
  }

  private initCanvasAndRestorePoints() {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = context;
    this.drawCoordsPlane(this.currentRValue);

    if (this.username) {
      this.coordinatesService.updateRValue(this.currentRValue, this.username).subscribe(() => {
        this.coordinatesService.getAllPoints(this.username).subscribe(
          (points: Point[]) => {
            points.forEach(point => {
              this.restorePoint(point);
            });
          },
          error => {
            console.log("Error with DB", error);
          }
        );
      });
    }
  }

  //TODO: много повторения кода, убрать вложенность и повыносить все в функции
  updateRValue(r: number): void {
    this.currentRValue = r;
    this.drawCoordsPlane(this.currentRValue);
    this.clearTable()

    if (this.username) {
      this.coordinatesService.updateRValue(this.currentRValue, this.username).subscribe(() => {
        this.coordinatesService.getAllPoints(this.username).subscribe(
          (points: Point[]) => {
            points.forEach(point => {
              this.restorePoint(point);
            });
          },
          error => {
            console.log("Error with DB", error);
          }
        );
      });
    }
  }

  clearCanvas(){
    if (this.ctx){
      this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
      this.drawCoordsPlane(this.currentRValue);
    }
  }

  clearTable(){
    const table = this.tableRef.nativeElement
    while (table.rows.length > 1){
      table.deleteRow(1)
    }
  }

  drawDot(x: number, y: number, radius: number, startAngle: number, endAngle: number): void{
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, startAngle, endAngle);
    this.ctx.fill();
  }

  putDots(): void {
    this.ctx.fillStyle = "black"
    const radius = 4;
    this.drawDot(262.5, 175, radius, 0, Math.PI * 2);
    this.drawDot(345, 175, radius, 0, Math.PI * 2);
    this.drawDot(175, 5, radius, 0, Math.PI * 2);
    this.drawDot(175, 87.5, radius, 0, Math.PI * 2);
    this.drawDot(87.5, 175, radius, 0, Math.PI * 2);
    this.drawDot(5, 175, radius, 0, Math.PI * 2);
    this.drawDot(175, 262.5, radius, 0, Math.PI * 2);
    this.drawDot(175, 345, radius, 0, Math.PI * 2);
  }

  drawPoint(x: number, y: number, r: number, result: boolean){
    if (r === undefined){
      r = 0
    }

    const pointSize = 10;
    this.ctx.beginPath();
    const canvasCoords = this.toCanvasCoords(x, y, r, 350)
    this.ctx.arc(canvasCoords.x, canvasCoords.y, pointSize/2, 0, Math.PI * 2);
    this.ctx.fillStyle = result ? '#1E5945' : 'red';
    this.ctx.fill();
  }

  drawCoordsPlane(r: number){
    this.canvasRef.nativeElement.width = 350;
    this.canvasRef.nativeElement.height = 350;

    const halfWidth = this.canvasRef.nativeElement.width / 2;
    const halfHeight = this.canvasRef.nativeElement.height / 2;
    const quarterWidth = this.canvasRef.nativeElement.width / 4;
    const quarterHeight = this.canvasRef.nativeElement.height / 4;
    const arrowSize = 10;


    this.ctx.fillStyle = '#4169E1';
    //1st quarter - empty

    //2nd quarter - 1/4 circle
    this.ctx.beginPath();
    this.ctx.arc(halfWidth, halfHeight, halfWidth, Math.PI, 1.5*Math.PI);
    this.ctx.lineTo(halfWidth, halfHeight);
    this.ctx.fill();

    //3rd quarter - triangle

    this.ctx.beginPath();
    this.ctx.moveTo(0, halfHeight);
    this.ctx.lineTo(halfWidth, this.canvasRef.nativeElement.height);
    this.ctx.lineTo(halfWidth, halfHeight);
    this.ctx.closePath();
    this.ctx.fill();

    //4th quarter - square
    this.ctx.fillRect(halfWidth, halfHeight, halfWidth, halfHeight);

    this.ctx.beginPath();
    this.putDots();
    this.ctx.font = "15px Arial";
    this.ctx.fillText('y', 150, 15);
    this.ctx.fillText('x', 340, 195);
    this.ctx.fillText(String(r/2), halfWidth+quarterWidth, halfHeight-10);
    this.ctx.fillText(String(r), 322, halfHeight-10);
    this.ctx.fillText(String(r), 190, 15);
    this.ctx.fillText(String(-r/2), 87.5, halfHeight-10);
    this.ctx.fillText(String(-r), 0, halfHeight-10);

    this.ctx.fillText(String(-r), 187, this.canvasRef.nativeElement.height);
    this.ctx.fillText(String(-r/2), 187, 262.5);

// Axes
    this.ctx.beginPath();
    this.ctx.moveTo(0, halfHeight);
    this.ctx.lineTo(this.canvasRef.nativeElement.width, halfHeight);
    this.ctx.moveTo(halfWidth, 0);
    this.ctx.lineTo(halfWidth, this.canvasRef.nativeElement.height);

    this.ctx.strokeStyle = "black";
    this.ctx.stroke();

    // Стрелочки для осей
    this.ctx.moveTo(this.canvasRef.nativeElement.width - arrowSize, halfHeight - arrowSize);
    this.ctx.lineTo(this.canvasRef.nativeElement.width, halfHeight);
    this.ctx.lineTo(this.canvasRef.nativeElement.width - arrowSize, halfHeight + arrowSize);

    this.ctx.moveTo(halfWidth - arrowSize, arrowSize);
    this.ctx.lineTo(halfWidth, 0);
    this.ctx.lineTo(halfWidth + arrowSize, arrowSize);
    this.ctx.fillStyle = "black";
    this.ctx.fillText(String(r/2), 185, 87.5);
    this.ctx.stroke();
  }

  toCanvasCoords(x: number, y: number, r: number, canvasSize: number): { x: number; y: number }{
    const scale = canvasSize / 2;
    return {
      x: scale / r * x + scale,
      y: canvasSize - (scale / r * y + scale)
    };
  }

  toNormalCoords(canvasX: number, canvasY: number, r: number, canvasSize: number): {x: number, y: number}{
    const scale = canvasSize / 2;
    return {
      x: r * (canvasX - scale) / scale,
      y: r * (canvasSize - canvasY - scale) / scale
    }
  }

  addToTable(point: Point){
    const row = this.tableRef.nativeElement.insertRow(1)
    const cell1 = row.insertCell(0)
    const cell2 = row.insertCell(1)
    const cell3 = row.insertCell(2)
    const cell4 = row.insertCell(3)

    cell1.textContent = String(point.x.toFixed(4))
    cell1.className = "new-cell"
    cell2.textContent = String(point.y.toFixed(4))
    cell2.className = "new-cell"
    cell3.textContent = String(point.r)
    cell3.className = "new-cell"
    cell4.textContent = point.result ? "In" : "Out"

    if (point.result){
      cell4.className = "result-cell-in"
    } else {
      cell4.className = "result-cell-out"
    }
  }

  onCanvasClick(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const normalCoords = this.toNormalCoords(x, y, this.currentRValue, this.canvasRef.nativeElement.width)

    this.sendCoords(normalCoords.x, normalCoords.y)
  }


  sendCoords(x: number, y: number): void{
    console.log(x, y)
    this.coordinatesService.sendCoordinates({x: x, y: y, r: this.currentRValue, username: this.appComponent.getUsername()} as Coordinates).subscribe(
      (point: Point) => {
        this.drawPoint(point.x, point.y, point.r, point.result)
        this.addToTable(point)
      },
      error => {
        console.log("Error", error)
      }
    )
  }


}
