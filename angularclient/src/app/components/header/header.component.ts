import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls:
    ['../../output.scss',
    './header.styles.scss'
    ]
})

export class HeaderComponent{
  @Input() content!: string



}
