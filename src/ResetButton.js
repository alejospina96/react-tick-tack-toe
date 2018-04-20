import React, {Component} from 'react';
import './ResetButton.css';

export class ResetButton extends Component {
    static resetClick(props) {
        props.reset()
    }

    render() {
        return (
            <button onClick={() => ResetButton.resetClick(this.props)}>Reset</button>
        );
    }
}