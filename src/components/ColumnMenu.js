import React, { Component } from 'react';
import { addEventListeners, removeEventListeners } from './../utils';

const cancel_events = ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup'];

export default class ColumnMenu extends Component {
    constructor(props) {
        super(props);
        this.cancel = this.cancel.bind(this);
    }

    getOptions() {
        return this.props.actions.map(o => {
            if (o.disable) return <li className="disabled" key={o.action}>{o.label}</li>;
            return <li key={o.action} onClick={() => this.handle(o.action)}>{o.label}</li>;
        });
    }

    handle(action) {
        this.props.request(action);
    }

    cancel(e) {
        if (this.node && !this.node.contains(e.target)) {
            removeEventListeners(cancel_events, this.cancel);
            this.props.request();
        }
    }

    componentDidMount() {
        setTimeout(() => {
            addEventListeners(cancel_events, this.cancel);
        });
    }

    render() {
        const options = this.getOptions();
        return (
            <ul className="column-menu" ref={c => { this.node = c; }}>
                {options}
            </ul>
        );
    }
}