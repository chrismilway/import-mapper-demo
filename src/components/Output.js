import React, { Component } from 'react';

export default class Output extends Component {
    getMappings() {
        return JSON.stringify(
            Object.values(this.props.mappings).reduce((o, i) => {
                const obj = {...o};
                obj[i.name] = i.value || null;
                return obj;
            }, {})
        );
    }

    getDefaults() {
        return JSON.stringify(
            Object.values(this.props.mappings)
                .filter(v => v.deafult)
                .reduce((o, i) => {
                    const obj = {...o};
                    obj[i.name] = i.deafult;
                    return obj;
                }, {})
        );
    }

    render() {
        const value = this.getMappings();
        const defaults = this.getDefaults();
        return (
            <div>
                <input 
                    type="hidden"
                    name={`${this.props.name}-map`}
                    value={value} />
                <input
                    type="hidden"
                    name={`${this.props.name}-defaults`}
                    value={defaults} />
            </div>
        );
    }
}