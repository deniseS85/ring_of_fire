import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from '../models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  gamesCollection: any;
  game: Game;

  constructor(private router: Router, private firestore: Firestore) {
    this.gamesCollection = collection(this.firestore, 'games');
  }


  /**
   * start a new game and get the id of the game from the database
   */
  newGame() {
    this.game = new Game();
    addDoc(this.gamesCollection, this.game.toJson()).then((gameInfo:any) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });
  }
}


