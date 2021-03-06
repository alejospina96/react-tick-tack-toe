import React, {Component} from 'react';
import './App.css';
import {Announcement} from './Announcement';
import {Tile} from './Tile';
import {ResetButton} from './ResetButton';

export default class App extends Component {
    static X = 'X';
    static O = 'O';
    static TIE = 'TIE';
    static EMPTY_SPACE = null;
    static START_BOARD = [
        App.EMPTY_SPACE, App.EMPTY_SPACE, App.EMPTY_SPACE,
        App.EMPTY_SPACE, App.EMPTY_SPACE, App.EMPTY_SPACE,
        App.EMPTY_SPACE, App.EMPTY_SPACE, App.EMPTY_SPACE
    ];
    static START_STATE = {
        gameBoard: App.START_BOARD,
        turn: App.X,
        winner: null,
        maxPlayer: App.X,
        minPlayer: App.O
    };

    constructor() {
        super();
        this.state = App.START_STATE;
    }

    static copyBoard(board) {
        return board.slice();
    }

    static validMove(move, player, board) {
        let newBoard = App.copyBoard(board);
        if (newBoard[move] === App.EMPTY_SPACE) {
            newBoard[move] = player;
            return newBoard;
        }
        return null;
    }

    static calculateWinner(board): string {
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
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (App.end(board)) {
            return App.TIE;
        } else {
            return null;
        }
    }

    static end(squares): boolean {
        return squares.filter(value => value === null).length === 0;
    }

    resetBoard() {
        this.setState(App.START_STATE)
    }

    render() {
        return (
            <div className="container">
                <div className="menu">
                    <h1>Minimax Algorithm - Tic Tac Toe</h1>
                    <Announcement winner={this.state.winner}/>
                </div>
                <div className="board">
                    {this.state.gameBoard.map((value, index) => {
                        return (
                            <Tile
                                key={index}
                                loc={index}
                                value={value}
                                gameLoop={this.gameLoop.bind(this)}
                            />
                        );
                    })}
                </div>
                <ResetButton reset={this.resetBoard.bind(this)}/>
            </div>
        );
    }

    static compare(predictedMoveValue, bestMoveValue, maxScore) {
        return maxScore ? predictedMoveValue > bestMoveValue : predictedMoveValue < bestMoveValue;
    }

    findAiMove(board) {
        let bestMoveScore = 100;
        let move = null;
        if (App.calculateWinner(board)) {
            return null;
        }
        for (let i = 0; i < board.length; i++) {
            let newBoard = App.validMove(i, this.state.minPlayer, board);
            if (newBoard) {
                let moveScore = this.giveScore(newBoard);
                if (moveScore < bestMoveScore) {
                    bestMoveScore = moveScore;
                    move = i;
                }
            }
        }
        return move;
    }

    giveValues(maxScore) {
        return {
            bestMoveValue: maxScore ? -100 : 100,
            player: maxScore ? this.state.maxPlayer : this.state.minPlayer
        };
    }

    giveScore(board, maxScore = true) {
        const values = this.giveValues(maxScore);
        const winner = App.calculateWinner(board);
        switch (winner) {
            case App.X:
                return 10;
            case App.O:
                return -10;
            case App.TIE:
                return 0;
            default:
                let bestMoveValue = values.bestMoveValue;
                for (let i = 0; i < board.length; i++) {
                    let newBoard = App.validMove(i, values.player, board);
                    if (newBoard) {
                        let predictedMoveValue = this.giveScore(newBoard, !maxScore);
                        if (App.compare(predictedMoveValue, bestMoveValue, maxScore)) {
                            bestMoveValue = predictedMoveValue;
                        }
                    }
                }
                return bestMoveValue;
        }
    }

    changeWinner(player, currentGameBoard) {
        let winner = App.calculateWinner(currentGameBoard);
        if (winner === player) {
            this.setState({
                gameBoard: currentGameBoard,
                winner: player
            });
            return true;
        }
        if (winner === App.TIE) {
            this.setState({
                gameBoard: currentGameBoard,
                winner: App.TIE
            });
            return true;
        }
        return false;
    }
    gameLoop(move) {
        let player = this.state.turn;
        let currentGameBoard = App.validMove(move, player, this.state.gameBoard);
        if (this.changeWinner(player, currentGameBoard)) return;
        player = App.O;
        currentGameBoard = App.validMove(this.findAiMove(currentGameBoard), player, currentGameBoard);
        if (this.changeWinner(player, currentGameBoard)) return;
        this.setState({
            gameBoard: currentGameBoard
        });
    }
}