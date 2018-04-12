export class Minimax {
    currentState:Play;
    constructor(squares:String[]){
        this.currentState = new Play(squares);
        // this.currentState.calculateValue();
    }
    goTo(nextSquares) {
        this.currentState = this.currentState.possiblePlays.find(value => value.squares.equals(nextSquares));
        console.log(this.currentState.calculateValue())
    }
    giveNext():number {
        console.log(this.currentState.possiblePlays);
        let index = -1;
        let max = null;
        if(this.currentState.possiblePlays.length>0){
            for (let i = 0; i < this.currentState.possiblePlays.length; i++) {
                let val = this.currentState.possiblePlays[i].calculateValue()
                if(max ===null ||val<max){
                    max = val;
                    index = i;
                }
            }
        }
        return index;
    }
}
export class Play {
    static X ='X';
    static O = 'O';
    static TIE = '.';
    squares:[] = Array(9);
    possiblePlays:Play[]=[];
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
        this.buildPossiblePlays();
    }
    calculateValue(){
        let winner = Play.calculateWinner(this.squares);
        if(winner===Play.O){
            return 1;
        }else if(winner===Play.X){
            return -1;
        }else if(winner===Play.TIE){
            return 0;
        }else {
            return this.possiblePlays
                .map(value => value.calculateValue())
                .reduce((previousValue, currentValue) => previousValue+currentValue);
        }
    }
    static calculateWinner(squares):string{
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
    buildPossiblePlays():Play[]{
        for (let i = 0; i < this.squares.length; i++) {
            if(!this.squares[i]){
                let newSquares = this.squares.slice();
                newSquares.splice(i,1,this.currentPlayer);
                this.possiblePlays.push(new Play(newSquares,this.nextPlayer));
            }
        }
    }

}