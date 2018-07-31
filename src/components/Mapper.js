import React, { Component } from 'react';
import Column from './Column';

export default class Mapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: null,
            position: {},
            offset: {},
            width: 0,
        };
        this.mousy = this.mousy.bind(this);
        this.degrab = this.degrab.bind(this);
    }

    grab(e, header, column) {
        e.preventDefault();
        if (column) {
            this.props.onDeMap(column);
        }
        // figure out the offset based on where in the target you clicked
        const rect = e.target.getBoundingClientRect();
        const offset = {
            top: e.clientY - rect.y,
            left: e.clientX - rect.x,
        };
        this.setState({
            active: header,
            width: this.headers.getBoundingClientRect().width - 24,
            offset,
        });
        this.setPosition(e.clientY, e.clientX);
        window.addEventListener('mousemove', this.mousy);
        window.addEventListener('mouseup', this.degrab);
    }

    mousy(e) {
        this.setPosition(e.clientY, e.clientX);
    }

    setPosition(top, left) {
        const position = { top, left };
        this.setState({ position });
    }

    degrab() {
        window.removeEventListener('mousemove', this.mousy);
        window.addEventListener('mouseup', this.degrab);
        this.setState({ active: null });
    }

    drop(column) {
        if (this.state.active) {
            this.props.onMap(this.state.active, column);
        }
    }

    addDataTable() {
        this.props.request('table');
    }

    renderHeaders() {
        return this.props.headers.map(h => {
            const state = (this.state.active === h.value || h.shadow) ? 'state--shadow' : '';
            const classes = `mapper-item mapper-item--header ${state}`;
            return (
              <li 
                className={classes} 
                key={h.value}
                onMouseDown={e => this.grab(e, h.value)}>
                <span className="item--header">{h.value}</span>
              </li>
            );
        });
    }

    renderColumns() {
        return Object.entries(this.props.mappings).map(([column, data]) => {
            return (
              <Column
                key={column}
                column={column}
                data={data}
                menuActions={this.props.menuActions}
                grab={e => this.grab(e, data.value, column)}
                drop={() => this.drop(column)}
                request={this.props.request} />
            );
        });
    }

    getActive() {
        const styles = {
            top: `${this.state.position.top - this.state.offset.top}px`,
            left: `${this.state.position.left - this.state.offset.left}px`,
            width: `${this.state.width}px`,
        };
        return (this.state.active)
            ? (
                <div className="mapper-item mapper-item--hover state--bad" style={styles}>
                  <span className="item--header">{this.state.active}</span>
                </div>
            ) : '';
    }

    render() {
        const headers = this.renderHeaders();
        const columns = this.renderColumns();
        const active = this.getActive();
        const classes = ['app-mapper'];
        const styles = {
            height: (this.props.height) ?  `${((this.props.height + 1) * 48)}px` : '0px',
        }
        if (this.state.active) classes.push('app-mapper--active');
        const listClass = this.props.inProgress ? 'mapper-list--loaded' : '';
        return (
            <div className={classes.join(' ')} style={styles}>
                <ul className={`mapper-list headers ${listClass}`} ref={c => this.headers = c}>
                    <li className="list-item"><h2 className="list-header">CSV columns</h2></li>
                    {headers}
                </ul>
                <ul className={`mapper-list columns ${listClass}`}>
                    <li className="list-item">
                        <h2 className="list-header">Table columns</h2>
                        <button 
                            className="link-button"
                            onClick={this.addDataTable.bind(this)}>
                            Add data table
                        </button>
                    </li>
                    {columns}
                </ul>
                {active}
            </div>
        );
    }
};
