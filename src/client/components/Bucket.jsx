import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { ItemTypes } from '../item-types';
import { DropTarget } from 'react-dnd';
import {DraggableDimension} from './Dimension';

const bucketTarget = {
  drop(props) {
    return {
      dragCallback: props.dragCallback,
      bucketKey: props.bucket.key
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

export const Bucket = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const { connectDropTarget, isOver } = this.props;
    return connectDropTarget(
      <div>
        <label>{this.props.bucket.label}</label>
        <ul>{this.props.items.map(item =>
          <li key={item.columnIndex}>
            <DraggableDimension columnIndex={item.columnIndex} name={item.name} />
          </li>)}
        </ul>
      </div>
    );
  }
})

export const DropTargetBucket = DropTarget(ItemTypes.DIMENSION, bucketTarget, collect)(Bucket);
