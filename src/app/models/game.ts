export class Game {
    public player: string[] = [];
    public cards: string[] = [];
    public playedCards: string[]  = [];
    public currentPlayer: number = 0;

    constructor() {
        for (let i = 1; i < 14; i++) {
            this.cards.push('ace_' + i);
            this.cards.push('clubs_' + i);
            this.cards.push('diamonds_' + i);
            this.cards.push('hearts_' + i);
        }

        shuffle(this.cards);
    }

    public toJson() {
        return {
            player: this.player,
            cards: this. cards,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer
        };
    }
}

function shuffle(array: string[]) {
    let currentIndex = array.length, randomIndex;
  
    while (currentIndex != 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}
  