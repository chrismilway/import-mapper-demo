import React, { Component } from 'react';
import csv from 'csv';
import xlsx from 'xlsx';
import Upload from './Upload';

export default class FileArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            inProgress: false,
        };
    }

    dragOver() {
        this.setState({ hover: true });
    }

    dragLeave() {
        this.setState({ hover: false });
    }

    handleDrop(e) {
        const files = Array.from(e.dataTransfer.files);
        this.loadFiles(files);
    }

    handleSelect(e) {
        if (e.target.files.length)
        this.loadFiles(Array.from(e.target.files));
    }
    
    loadFiles(files) {
        this.setState({ hover: false, inProgress: true }, () => {
            setTimeout(() => {
                files.forEach(this.handleFile.bind(this));
                setTimeout(() => {
                    this.setState({ inProgress: false });
                }, 1000);
            }, 1500);
        });
    }

    handleFile(file) {
        switch (file.type) {
            case 'text/csv':
                return this.loadCSV(file);
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return this.loadXLSX(file);
            default:
                return console.warn('The file you are trying to map is not allowed');
        }
    }

    loadCSV(file) {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
            csv.parse(e.target.result, (err, data) => {
                this.props.loadData(data, file.name);
            });
        });
        reader.readAsText(file);
    }

    loadXLSX(file) {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
            const bstr = e.target.result;
            const wb = xlsx.read(bstr, {type: 'binary'});
            const ws = wb.Sheets[wb.SheetNames[0]];
            this.props.loadData(xlsx.utils.sheet_to_json(ws, {header: 1}), file.name);
        });
        reader.readAsBinaryString(file);
    }

    renderDropArea() {
        return (
            <div
              className="app-file-drop"
              onDragOver={() => this.dragOver()}
              onDragLeave={() => this.dragLeave()}
              onMouseLeave={() => this.dragLeave()}
              onDrop={this.handleDrop.bind(this)}>
                <Upload />
                <h2>Drag file here</h2>
                <label htmlFor="fileme" className="file-button">Choose file
                    <input name="fileme" type="file" className="hidden-input"
                        ref={c => { this.input = c }}
                        onChange={this.handleSelect.bind(this)} />
                </label>
            </div>
        );
    }

    renderFileWidget() {
        return (
          <div className="app-file-widget">
            <strong className="app-file-widget--name">
                {this.props.filename}
                <span className="list-arrow">&#8674;</span>
                {this.props.listname}
            </strong>
            <button className="link-button" onClick={() => this.props.clearData()}>Clear</button>
          </div>
        );
    }

    render() {
        const classes = ['app-file-area'];
        if (this.state.hover) classes.push('app-file-area--hover');
        if (this.props.active) classes.push('app-file-area--active');
        if (this.state.inProgress) classes.push('app-file-area--in-progress');
        const content = (this.props.active)
            ? this.renderFileWidget()
            : this.renderDropArea();
        return (
            <div className={classes.join(' ')}>
              {content}
            </div>
        );
    }
};
