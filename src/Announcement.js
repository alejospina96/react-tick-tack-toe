import React, {Component} from 'react';

export class Announcement extends Component {
    render() {
        return (
            <div>The winner is {this.props.winner}</div>
        );
    }
}