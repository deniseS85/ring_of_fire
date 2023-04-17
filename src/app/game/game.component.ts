import { Component, HostListener, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { CollectionReference, DocumentData, addDoc, collection, deleteDoc, doc, updateDoc,} from '@firebase/firestore';
import { Firestore, collectionData, docData, setDoc } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { object } from '@angular/fire/database';


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
  gameOver: boolean = false;
  sound = new Audio('assets/sounds/take_card.mp3');

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
    this.game.playerImages = game.playerImages;
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
    if (this.game.cards.length == 0) {
      this.gameOver = true;
    } else if (!this.game.takeCardAnimation && this.game.player.length > 1) {
      this.game.currentCard = this.game.cards.pop();
      this.game.takeCardAnimation = true;  
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.player.length;
      this.updateGame();
      
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.takeCardAnimation = false;
        this.sound.play();
        this.updateGame();
      }, 1200);
    } else {
      this.openDialog();
    }
  }


  /**
   * open dialog window to add new player, save name and profile image
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((player: object) => {
      if (player) {
        this.game.player.push(player['name']);
        this.game.playerImages.push(player['profile']);
        this.updateGame();
      }
    });
  }


  /**
   * edit name or picture of player
   * @param playerID 
   */
  editPlayer(playerID: number){
    const dialogRef = this.dialog.open(EditPlayerComponent, {
      data: {
        playerName: this.game.player[playerID]['name'],
        playerProfile: this.game.playerImages[playerID]['profile']
      }
    });
    
    dialogRef.afterClosed().subscribe((player: any) => {
      if (player) {
          if (player == 'DELETE'){
            this.game.player.splice(playerID, 1);
            this.game.playerImages.splice(playerID, 1);
          } else {
              this.game.player[playerID] = player.name;
              this.game.playerImages[playerID] = player.profile;
          } 
      } 
      this.updateGame();
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
