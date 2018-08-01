import React, { Component } from 'react';
import FileArea from './FileArea';
import Mapper from './Mapper';
import Output from './Output';
import { DATA_TABLE } from './../utils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      file: null,
      mappings: {},
      allow_custom: false,
      input_name: '',
      list_name: '',
    };
  }

  componentDidMount() {
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.fetchColumns();
    this.fetchSettings();
  }

  fetchColumns() {
    const parent = this.root.parentElement;
    const json = parent.dataset.columns;
    if (json) {
      const columns = JSON.parse(json);
      this.setState({ columns });
    }
  }

  fetchSettings() {
    const parent = this.root.parentElement;
    const state = {};
    state.allow_custom = parent.dataset.allowCustom !== undefined;
    state.input_name = parent.dataset.inputName;
    state.list_name = parent.dataset.listName;
    this.setState(state);
  }

  resetMappings() {
    const mappings = this.state.columns.reduce((a, item) => {
      const obj = {...a};
      obj[item.name] = Object.assign({}, item, { value: null, table: 'core' });
      obj[item.name].deafult = obj[item.name].default || null;
      if (obj[item.name].default) delete obj[item.name].default;
      return obj;
    } , {});
    this.setState({ mappings }, () => {
      if (this.state.data.length) this.guessMappings();
    }); 
  }

  guessMappings(columns) {
    const mappings = {...this.state.mappings};
    const rawHeaders = this.state.data[0];
    const headers = rawHeaders.map(h => h.toLowerCase());
    Object.keys(mappings)
      .filter(column => columns ? columns.indexOf(column) > -1 : true)
      .forEach((column) => {
        const label = mappings[column].label.toLowerCase();
        const idx = headers.indexOf(label)
        if (idx > -1) {
          mappings[column].value = headers[idx];
        }
      });
    this.setState({ mappings });
  }

  handleData(data, file) {
    this.setState({ data, file }, this.resetMappings);
    this.fileInput.files = file;
  }

  clearData() {
    this.setState({ data: [], file: null, mappings: {} });
    this.fileInput.files = null;
  }

  handleMap(header, column) {
    const mappings = {...this.state.mappings};
    Object.keys(mappings).forEach((k) => {
      if (mappings[k].value === header) mappings[k].value = null;
    });
    mappings[column].value = header;
    this.setState({ mappings });
  }

  handleDeMap(column) {
    const mappings = {...this.state.mappings};
    mappings[column].value = null;
    this.setState({ mappings });
  }

  handleRequest(action, column) {
    const mappings = {...this.state.mappings};
    let callback;
    switch(action) {
      case 'custom':
        const map = window.prompt(`Set ${column} custom mapping`, mappings[column].value || '');
        if (map) mappings[column].value = map;
        break;
      case 'clear':
        mappings[column].value = null;
        break;
      case 'default':
        const def = window.prompt(`Set ${column} default value`, mappings[column].deafult || '');
        if (def !== null) mappings[column].deafult = def;
        break;
      case 'table':
        if (window.confirm('Faux select list')) {
          const headings = [];
          DATA_TABLE.forEach((d) => {
            headings.push(d.name);
            const obj = Object.assign({}, d, { table: 'address', value: null });
            obj.deafult = obj.default || null;
            if (obj.default) delete obj.default;
            mappings[d.name] = obj;
          });
          callback = () => {
            this.guessMappings(headings);
          };
        }
        break;
      default:
    }
    this.setState({ mappings }, callback);
  }

  getHeaders() {
    return (this.state.data.length)
      ? this.state.data[0].map(header => ({
        value: header,
        shadow: Object.values(this.state.mappings).map(i => i.value).indexOf(header) > -1,
      })) : [];
  }

  getMenuActions() {
    const actions = [];
    if (this.state.allow_custom) actions.push({ label: 'Custom mapping', action: 'custom' });
    actions.push({ label: 'Set default', action: 'default' });
    return actions;
  }

  render() {
    const headers = this.getHeaders();
    const columns = Object.keys(this.state.mappings);
    const mapperHeight = Math.max(headers.length, columns.length);
    const menuActions = this.getMenuActions();
    const inProgress = !!this.state.data.length;
    return (
      <div className="app" ref={c => { this.root = c }}>
        <FileArea
          loadData={this.handleData.bind(this)}
          clearData={this.clearData.bind(this)}
          active={this.state.data.length}
          file={this.state.file}
          listname={this.state.list_name} />
        <Mapper
          height={mapperHeight}
          mappings={this.state.mappings}
          headers={headers}
          inProgress={inProgress}
          menuActions={menuActions}
          onMap={this.handleMap.bind(this)}
          onDeMap={this.handleDeMap.bind(this)}
          request={this.handleRequest.bind(this)} />
        <Output
          mappings={this.state.mappings}
          name={this.state.input_name} />
        <input
          type="file"
          style={{display: 'none'}}
          name={`${this.state.input_name}-file`}
          ref={c => {this.fileInput = c}} />
      </div>
    );
  }
}

export default App;
