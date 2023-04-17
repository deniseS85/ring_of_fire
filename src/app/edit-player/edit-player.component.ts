import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent implements OnInit  {
  player: FormGroup;
  name: string;
  profile: string;
  allProfileImg = ['1.png', '2.png', '3.png', '4.png'];

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>,  
  @Inject(MAT_DIALOG_DATA) public data: {
    playerName: string, 
    playerProfile: string}) {}


  ngOnInit(): void {
    this.player = new FormGroup({
        name: new FormControl(this.data.playerName, Validators.required),
        profile: new FormControl(this.data.playerProfile, Validators.required)
    });
    console.log(this.player);
    console.log(this.data);
    console.log(FormControl);
  }
}


