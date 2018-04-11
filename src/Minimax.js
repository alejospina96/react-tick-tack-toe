export class Minimax {
    currentState:Play;
    constructor(squares:String[]){
        this.currentState = new Play(squares);
        this.currentState.calculateValue();
    }
    goTo(nextSquares) {
        this.currentState = this.currentState.possiblePlays.find(value => value.squares.equals(nextSquares));
    }
    giveNext(squares:[]):number {

    }
    countLoses(){
        const loses = this.currentState.countLoses();
        console.log("found "+loses+" loses");
        return loses;
    }
    countWins(){
        const wins = this.currentState.countWins();
        console.log("found "+wins+" wins");
        return wins;
    }


    countTies(){
        const ties = this.currentState.countTies();
        console.log("found "+ties+" ties");
        return ties;
    }
}
export class Play {
    static X ='X';
    static O = 'O';
    squares:[] = Array(9);
    possiblePlays:Play[];
    currentPlayer:String;
    nextPlayer:String;
    value:number;
    constructor(squares:String[], fillVal:String=Play.X) {
        // console.log('building a play from ');
        // console.log(squares);
        this.squares = squares;
        this.currentPlayer = fillVal;
        if(fillVal===Play.X){
            this.nextPlayer = Play.O;
        }else{
            this.nextPlayer = Play.X;
        }
        if(this.notEnd() && !Play.calculateWinner(this.squares)){
            this.possiblePlays = this.buildPossiblePlays();
        }
        // console.log(this.possiblePlays)
    }
    countLoses(){
        if(this.possiblePlays){
            return this.possiblePlays
                .map(value1 => {
                    if(value1.value===-1){
                        return 1;
                    }
                    return value1.countLoses();
                })
                .reduce((previousValue, currentValue) => previousValue+currentValue);
        }
        return 0;

    }
    countWins(){
        if(this.possiblePlays){
            return this.possiblePlays
                .map(value1 => {
                    if(value1.value===1){
                        return 1;
                    }
                    return value1.countWins();
                })
                .reduce((previousValue, currentValue) => previousValue+currentValue);
        }
        return 0;
    }


    countTies(){
        if(this.possiblePlays){
            return this.possiblePlays
                .map(value1 => {
                    if(value1.value===-0){
                        return 1;
                    }return value1.countTies();
                })
                .reduce((previousValue, currentValue) => previousValue+currentValue);
        }
        return 0;
    }

    notEnd() :boolean{
        return this.squares.filter(value => !value).length>0;
    }
    calculateValue() :number{
        const winner = Play.calculateWinner(this.squares);
        if(winner===Play.X) {
            this.value = -1;
            return -1;
        }else if(winner===Play.O){
            this.value = 1;
            return 1;
        }else if(this.end()){
            this.value = 0;
            return 0;
        } else if(this.possiblePlays){
            const values=this.possiblePlays
                .filter(map=>map)
                .map(play=>play.calculateValue());
            if(values.find(winner=>winner===1)) {
                return 1;
            }else if(values.find(winner=>winner===0)) {
                return 0;
            } else {
                return -1;
            }
        }
    }
    static calculateWinner(squares):string=>Play.O|Play.X|null {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                if(squares[a]===Play.O){
                   return Play.O;
                }
                return Play.X;
            }
        }
        return null;
    }
    buildPossiblePlays():Play[]{
        return this.squares.map((square, i) => {
            let newPlay = this.squares.slice();
            if (!square) {
                newPlay[i] = this.currentPlayer;
                return new Play(newPlay, this.nextPlayer);
            }return null;
        }).filter(val => val);
    }

    end() {
        return this.squares.filter(value => value===null).length===0;
    }
}