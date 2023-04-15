import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { CollectionReference, DocumentData, addDoc, collection, deleteDoc, doc, updateDoc,} from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  public gamesCollection: CollectionReference<DocumentData>;
  takeCardAnimation = false;
  currentCard: string = '';
  game: Game;
  isMobile: boolean;
 

  constructor(public dialog: MatDialog, private firestore: Firestore, private route: ActivatedRoute) {
    this.gamesCollection = collection(this.firestore, 'games');

  }

  ngOnInit() {
    if (window.innerWidth <= 543) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']);
    });

  }


  newGame() {
    this.game = new Game();
   /*  addDoc(this.gamesCollection, this.game.toJson()); */
  }


  takeCard() {
    if (!this.takeCardAnimation) {
      this.currentCard = this.game.cards.pop();
      this.takeCardAnimation = true;  
     
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.player.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.takeCardAnimation = false;
      }, 1200);
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.player.push(name);
      }
    });
  }
}
