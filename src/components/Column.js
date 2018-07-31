import React, { Component } from 'react';
import ColumnMenu from './ColumnMenu';

export default class Column extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: false,
        };
    }

    toggleMenu() {
        this.setState({ menu: !this.state.menu });
    }

    menuAction(action) {
        this.clearMenu();
        setTimeout(() => {
            this.props.request(action, this.props.column);
        });
    }

    clearMenu() {
        this.setState({ menu: false });
    }

    render() {
        const { table, label, value, deafult, required } = this.props.data;
        const classes = ['mapper-item mapper-item--column'];
        if (value) classes.push('state--good');
        const actions = this.props.menuActions.slice();
        actions.push({label: 'Clear', action: 'clear', disable: !value});
        return (
          <li className={classes.join(' ')} onMouseUp={() => this.props.drop()}>
            <span className="item--header" title={this.props.data.value} onMouseDown={this.props.grab}>
                {value && <span>{value}</span>}
                {(!value &&!deafult) && <em>&lt;blank&gt;</em>}
                {deafult && <span className="default-value">"{deafult}"</span>}
            </span>
            <span className="item--column">
                {table !== 'core' && <span className="table-block">{table}/</span>}
                {label}
                {required && <em>&nbsp;(required)</em>}
                {actions.length && <button className="menu-button" onClick={() => this.toggleMenu()}>Actions</button>}
            </span>
            {this.state.menu && actions.length && <ColumnMenu request={this.menuAction.bind(this)} actions={actions}/>}
          </li>
        );
    }
}