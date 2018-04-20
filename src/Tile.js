import React, {Component} from 'react';
import './Tile.css';

export class Tile extends Component {
    static tileClick(props) {
        if (!props.value) {
            props.gameLoop(props.loc, props.turn);
        }
    }

    render() {
        return (
            <div className={'tile ' + this.props.loc} onClick={() => Tile.tileClick(this.props)}>
                <p>{this.props.value}</p>
            </div>
        );
    }
}