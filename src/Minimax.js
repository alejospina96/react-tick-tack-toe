export class Minimax {
    currentState:Play;
    constructor(squares:String[]){
        this.currentState = new Play(squares);
    }
    goTo(nextSquares) {
        let state = this.currentState.possiblePlays.find(value => value.squares.equals(nextSquares));
        if (!state) {
            state = this.currentState.possiblePlays.find(value => value.possiblePlays.find(value1 => value1.squares.equals(nextSquares)));
        }
        this.currentState = state;
    }
    giveNext(squares): [] {
        console.log(this.currentState);
        this.goTo(squares);
        console.log(this.currentState);
        let index = -1;
        let max = null;
        if (this.currentState.possiblePlays.length > 0) {
            for (let i = 0; i < this.currentState.possiblePlays.length; i++) {
                if (Play.calculateWinner(this.currentState.possiblePlays[i].squares)) {
                    return this.currentState.possiblePlays[i].squares;
                }
                if (!this.currentState.possiblePlays[i].nextLose()) {
                    let val = this.currentState.possiblePlays[i].calculateValue();
                    if (max === null || val > max) {
                        max = val;
                        index = i;
                    }
                }
            }
            console.log(index);
            console.log(this.currentState.possiblePlays[index].squares);
            return this.currentState.possiblePlays[index].squares;
        }
        return null;
    }
}
export class Play {
    static X ='X';
    static O = 'O';
    static TIE = 'TIE';
    squares:[] = Array(9);
    possiblePlays:Play[]=[];
    value: number = 0;
    currentPlayer:String;
    nextPlayer:String;
    constructor(squares:String[], fillVal:String=Play.X) {
        this.squares = squares;
        this.currentPlayer = fillVal;
        if(fillVal===Play.X){
            this.nextPlayer = Play.O;
        }else{
            this.nextPlayer = Play.X;
        }
        this.possiblePlays = this.buildPossiblePlays();
    }

    nextLose() {
        return this.possiblePlays.find(value => Play.calculateWinner(value.squares) === Play.X);
    }

    calculateValue() {
        let winner = Play.calculateWinner(this.squares);
        if (winner === Play.O) {
            this.value = 1;
            return 1;
        } else if (winner === Play.X) {
            this.value = -1;
            return -1;
        } else if (winner === Play.TIE) {
            return 1;
        } else {
            const val = this.possiblePlays
                .map(value => value.calculateValue())
                .reduce((previousValue, currentValue) => previousValue + currentValue);
            this.value = val;
            return val;
        }
    }
    static calculateWinner(squares):string {
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
                return squares[a];
            }
        }
        if(Play.end(squares)){
            return Play.TIE;
        }else {
            return null;
        }
    }
    static end(squares):boolean {
        return squares.filter(value => value===null).length===0;
    }
    buildPossiblePlays():Play[] {
        let plays = [];
        if(!Play.calculateWinner(this.squares)) {
            for (let i = 0; i < this.squares.length; i++) {
                if(!this.squares[i]) {
                    let newSquares = this.squares.slice();
                    newSquares.splice(i,1,this.currentPlayer);
                    plays.push(new Play(newSquares,this.nextPlayer));
                }
            }
        }
        return plays;
    }

}