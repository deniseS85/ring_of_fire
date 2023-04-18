import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent implements OnInit {
  player: FormGroup;
  name: string;
  profile: string;
  allProfileImg = ['1.png', '2.png', '3.png', '4.png'];

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) {}

  ngOnInit(): void {
      this.player = new FormGroup({
          name: new FormControl('', Validators.required),
          profile: new FormControl('', Validators.required)
      });
  }
  
  
  onNoClick(){
    this.dialogRef.close();
  }
}
