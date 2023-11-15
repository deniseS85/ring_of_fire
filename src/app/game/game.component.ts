import { Component, HostListener, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { CollectionReference, DocumentData, collection, doc, updateDoc,} from '@firebase/firestore';
import { Firestore, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import Swal from 'sweetalert2';

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
  take_card = new Audio('assets/sounds/take_card.mp3');
  game_over = new Audio('assets/sounds/end-game.mp3');


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
    this.game.players = game.players;
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

  restartGame() {
    let currentPlayer = this.game.players;
    let currentPlayerImage = this.game.playerImages;
    this.game = null;
    this.gameOver = false;
    this.game = new Game;
    this.game.players = currentPlayer;
    this.game.playerImages = currentPlayerImage;
    this.updateGame();
  }

  
  /**
   * take card and show currentplayer, update in array and database
   */
  takeCard() {
    if (this.game.cards.length == 0) {
          this.gameOver = true;
          this.game_over.play();
    } else if (!this.game.takeCardAnimation && this.game.players.length > 1) {
          this.game.currentCard = this.game.cards.pop();
          this.game.takeCardAnimation = true;  
          this.game.currentPlayer++;
          this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
          this.updateGame();
      
      setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.takeCardAnimation = false;
          this.take_card.play();
          this.updateGame();
      }, 1200);
    } else {
          if(this.game.players.length <= 1) {
              this.addPlayer();
          }
         
    }
  }


  /**
   * open dialog window to add new player, save name and profile image
   */
  addPlayer(): void {
    if (this.game.players.length < 6) {
          const dialogRef = this.dialog.open(DialogAddPlayerComponent);

      dialogRef.afterClosed().subscribe((player: object) => {
          if (player) {
            this.game.players.push(player['name']);
            this.game.playerImages.push(player['profile']);
            this.updateGame();
          }
      });
    } else {
      Swal.fire('Maximum number of players reached!');
    }
  }


  /**
   * edit name or picture of player
   * @param playerID 
   */
  editPlayer(playerID: number){
    const dialogRef = this.dialog.open(EditPlayerComponent, {
      data: {
        playerName: this.game.players[playerID],
        playerProfile: this.game.playerImages[playerID]
      }
    });
    
    dialogRef.afterClosed().subscribe((player: any) => {
      if (player) {
          if (player == 'DELETE'){
            this.game.players.splice(playerID, 1);
            this.game.playerImages.splice(playerID, 1);
            if (this.game.players.length <= 1) {
              this.game.currentPlayer = 0;
            }
          } else {
              this.game.players[playerID] = player.name;
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
    
      if (event.target.innerWidth <= 777) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    }

  }
