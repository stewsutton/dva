import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import * as actionCreators from '../action-creators';
import { List, Map, fromJS } from 'immutable';

import { Datatable } from './Datatable';
import { NotebookCell } from './NotebookCell';


import './Notebook.css';

export const Notebook = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <ul className="notebook">{ this.props.cells.map(id =>
      <li key={id}>
        <NotebookCell
          cellsById={this.props.cellsById}
          cellId={id}
        />
      </li>)}
    </ul>;
  }
})

function mapStateToProps(state) {
  return {
    cells: state.getIn(['notebook', 'cells']) || List(),
    cellsById: state.getIn(['notebook', 'cellsById']) || Map()
  };
}

export const NotebookContainer = connect(
  mapStateToProps,
  actionCreators
)(Notebook);
