import { Map, List, fromJS } from 'immutable';

export function draggedToBucket(state, columnIndex, bucketKey, columns, schemaBuckets) {
  let columnKey = String(columnIndex);
  let name = columns.get(columnIndex);
  return state.update('bucketMapping', old => {
    let bucketMapping = old.updateIn(['columnMap', columnKey], () => bucketKey)
    let colMap = bucketMapping.get('columnMap')
    return bucketMapping
      .update('bucketMap', () => genBucketMap(colMap, schemaBuckets, columns));
  })
}

function genBucketMap(columnMap, schemaBuckets, columns) {
  return Map(schemaBuckets.map(bucket => {
    let bucketKey = bucket.key;
    let list = columns.filter((colName, i) => {
      return columnMap.get(String(i)) === bucketKey;
    })
    return [bucketKey, list]
  }))
}
