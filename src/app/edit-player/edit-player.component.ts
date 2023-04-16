import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {
  allProfileImg = ['1.png', '2.png', '3.png', '4.png'];

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}
}


