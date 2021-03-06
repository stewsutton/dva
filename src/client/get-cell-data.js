import { List, Map, fromJS } from 'immutable';

import { parseData } from '../parsers';
import * as Babel from 'babel-standalone';

const TRANSFORM_LOCALS = [{
  name: 'List', ref: List,
},{
  name: 'Map', ref: Map
},{
  name: 'fromJS', ref: fromJS
}];

function getDataFromDataCell(cell, options = {}) {
  let parsedData = cell.get('parsedData');
  if (parsedData && Object.keys(options).length === 0) {
    return fromJS(parsedData);
  } else {
    const override = key => current => options[key] || current;
    const get = key => cell.update(key, override(key)).get(key);
    return fromJS(parseData(get('parser'),get('data'))) || List();
  }
}

export default function getCellData(cellsById, cellId, options = {}) {
  let root = cellsById.get(cellId).update('parentId', parentId => {
    if (options.parentOverride) return options.parentOverride;
    else return parentId;
  })
  let getParent = cell => cellsById.get(cell.get('parentId'));
  switch (root.get('cellType')) {
    case 'DATA':
      return getDataFromDataCell(root, options);
    case 'TRANSFORM':
      return transformTo(getParent, root, List(), options);
    case 'VISUALIZATION':
      return transformTo(getParent, getParent(root), List(), options);
  }
  return List();
}

function transformTo(getCellParent, cell, _chain = List(), options = {}) {
  if (cell) {
    const parentId = cell.get('parentId');
    if (parentId) {
      const funcStr = options.funcOverride || cell.get('func');
      const func = Function('data', ...TRANSFORM_LOCALS.map(i=>i.name), babelCompile(funcStr));
      const chain = _chain.push(func);
      const parentCell = getCellParent(cell)
      switch (parentCell.get('cellType')) {
        case 'DATA':
          return applyTransformChain(chain,  getDataFromDataCell(parentCell));
        case 'TRANSFORM':
          return transformTo(getCellParent, parentCell, chain);
      }
    } else {
      return getDataFromDataCell(cell);
    }
  } else {
    return List();
  }
}

function babelCompile(fbody) {
  const conf = { presets: ['es2015'] };
  const lines = Babel.transform(`()=>{${fbody}}`, conf).code.split('\n');
  return lines.slice(3, lines.length-1).join('\n');
}

function applyTransformChain(chain, data) {
  return chain.reverse().reduce((data,fn) => {
    let args = [data].concat(TRANSFORM_LOCALS.map(i=>i.ref));
    return fn(...args)
  }, data);
}

export function isCircular(cellsById, cellId, seen=Map()) {
  if (seen.get(cellId)) return true;
  if (cellId) {
    return isCircular(
      cellsById,
      cellsById.getIn([cellId, 'parentId']),
      seen.update(cellId, () => true)
    );
  } else {
    return false;
  }
}

export function getParentCandidates(cells, cellsById, cellId) {
  return cells.filter( id => {
    // you cannot make a cell a parent of itself
    if (id === cellId) return false;

    const type = cellsById.getIn([id, 'cellType']);

    // a DATA cell can always be a parent to other cells
    if (type === 'DATA') return true;

    // transforms can be parents
    if (type === 'TRANSFORM') {
      // but be wary of circular dependencies
      const parentId = cellsById.getIn([id, 'parentId']);

      return isCircular(
        cellsById.updateIn([ cellId, 'parentId' ], () => id),
        cellId
      ) ? false : true
    }

    // otherwise do not show this cell as an option
    return false;
  })
}
