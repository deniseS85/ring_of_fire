import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  @Input() name: string;
  @Input() image: string = '2.png';
  @Input() playerActive: boolean = false;
}
