import React, { Component } from 'react';
import papa from 'papaparse';
import Upload from './Upload';

export default class FileArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            inProgress: false,
            processOnLoad: false,
            errorState: false,
            queued: null,
        };
    }

    dragOver() {
        this.setState({ hover: true });
    }

    dragLeave() {
        this.setState({ hover: false });
    }

    handleDrop(e) {
        this.loadFiles(e.dataTransfer.files);
    }

    handleSelect(e) {
        if (e.target.files.length)
        this.loadFiles(e.target.files);
    }

    loadFiles(files) {
        const file = files[0];
        if (file.type === 'text/csv') {
            this.setState({ hover: false, inProgress: true, processOnLoad: false, queued: null }, () => {
                setTimeout(() => {
                    if (this.state.queued) {
                        this.props.loadData(this.state.queued, files);
                        this.setState({ queued: null, inProgress: false, processOnLoad: false });
                    } else {
                        this.setState({ inProgress: false, processOnLoad: true });
                    }
                }, 1000);
                this.loadFile(files, file.type);
            });
        } else {
            return this.typeError(file.type);
        }
    }

    loadFile(files) {
        papa.parse(files[0], {
            preview: 3,
            complete: (results) => {
                console.log(this.state.processOnLoad);
                this.state.processOnLoad
                    ? this.props.loadData(results.data, files[0].name, files)
                    : this.setState({ queued: results.data });
            },
        });
    }

    typeError(type) {
        this.setState({ errorState: true }, () => {
            setTimeout(() => {
                this.setState({ errorState: false });
            }, 600);
        });
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
                {this.props.file[0].name}
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
        if (this.state.errorState) classes.push('app-file-area--error');
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
