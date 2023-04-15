import { Component, HostListener, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { CollectionReference, DocumentData, addDoc, collection, deleteDoc, doc, updateDoc,} from '@firebase/firestore';
import { Firestore, collectionData, docData, setDoc } from '@angular/fire/firestore';
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
  game: Game;
  isMobile: boolean;
  gameId: string = '';
 

  constructor(public dialog: MatDialog, private firestore: Firestore, private route: ActivatedRoute) {
    this.gamesCollection = collection(this.firestore, 'games');
  }


  ngOnInit() {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.getGameData(params);
    });
  }


  /**
   * get game data from the database
   * @param params of URL for get ID of current game
   */
  async getGameData(params: any) {
    this.gameId = params['id'];
    let docRef = doc(this.gamesCollection, this.gameId);
    let game$ = docData(docRef);
    game$.subscribe((game: any) => {
      this.setGameData(game);
    });   
  }


  /**
   * set the local game data to the data from the database
   * @param game update data in game
   */
  setGameData(game: any) {
    this.game.player = game.player;
    this.game.cards = game.cards;
    this.game.playedCards = game.playedCards;
    this.game.currentPlayer = game.currentPlayer;
    this.game.takeCardAnimation = game.takeCardAnimation;
    this.game.currentCard = game.currentCard;
  }


  newGame() {
    this.game = new Game();
  }

  
  /**
   * take card and show currentplayer, update in array and database
   */
  takeCard() {
    if (!this.game.takeCardAnimation) {
      this.game.currentCard = this.game.cards.pop();
      this.game.takeCardAnimation = true;  
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.player.length;
      this.updateGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.takeCardAnimation = false;
        this.updateGame();
      }, 1200);
    }
  }


  /**
   * open dialog window to add new player
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.player.push(name);
        this.updateGame();
      }
    });
  }


  /**
   * update data in database
   */
  updateGame() {
    const docRef = doc(this.firestore, 'games', this.gameId);
    const gameData = this.game.toJson();
    updateDoc(docRef, gameData).then(() => {
    });
  }


  /**
   * if windowsize change, then boolean isMobile change value to true or false
   * @param event 
   */
  @HostListener('window:resize', ['$event'])
    onResize(event: { 
      target: { innerWidth: number;}; 
    }) {
    
      if (event.target.innerWidth <= 543) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    }
}
