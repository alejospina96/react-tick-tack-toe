import React, { Component } from 'react';
import './App.css';
import {Minimax, Play} from './Minimax';

class App extends Component {
    minimax: Minimax;
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                win: 0,
                lose: 0,
                tie: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }
    static startMinimax(squares) {
        return new Minimax(squares);
    }
    handleClick(i) {
        if(!this.minimax) {
            this.minimax =App.startMinimax(Array(9).fill(null))
        }
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (Play.calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? Play.X : Play.O;
        this.setState({
            history: history.concat([{
                squares: squares,
                win:this.minimax.countWins(squares),
                lose:this.minimax.countLoses(squares),
                tie:this.minimax.countTies(squares)
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
        this.minimax.goTo(squares)
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    render() {
          const history = this.state.history;
          const current = history[this.state.stepNumber];
          const winner = Play.calculateWinner(current.squares);

          const moves = history.map((step, move) => {
              const desc = move ?
                  'Go to move #' + move :
                  'Go to game start';
              return (
                  <li key={move}>
                      <button onClick={() => this.jumpTo(move)}>{desc}</button>
                  </li>
              );
          });
          let status;
          if (winner) {
              status = 'Winner: ' + winner;
          } else {
              status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
          }

        return (
              <div className="game">
                  <div>
                      possibilities to lose {current.lose}<br/>
                      possibilities to win {current.win}<br/>
                      possibilities to tie {current.tie}
                  </div>
                  <div className="game-board">
                      <Board
                          squares={current.squares}
                          onClick={(i) => this.handleClick(i)}
                      />
                  </div>
                  <div className="game-info">
                      <div>{status}</div>
                      <ol>{moves}</ol>
                  </div>
              </div>
          );
    }
}
class Board extends Component{
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

}
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
export default App;
