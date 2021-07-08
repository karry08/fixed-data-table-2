/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule columnTemplates
 */
import forEach from 'lodash/forEach';

import shallowEqualSelector from '../helper/shallowEqualSelector';
import columnWidths from './columnWidths';

/**
 * @typedef {{
 *   props: !Object,
 *   template: React.ReactElement,
 * }}
 */
let cellDetails;

/**
 * @typedef {{
 *   cell: !Array.<cellDetails>,
 *   footer: !Array.<cellDetails>,
 *   header: !Array.<cellDetails>,
 * }}
 */
let columnDetails;

/**
 * Lists of cell templates & component props for
 * the fixed and scrollable columns and column groups
 *
 * @param {{
 *   columnGroupProps: !Array.<!Object>,
 *   columnProps: !Array.<!Object>,
 * }} columnWidths
 * @param {{
 *   cell: !Array.<React.ReactElement>,
 *   footer: !Array.<React.ReactElement>,
 *   groupHeader: !Array.<React.ReactElement>,
 *   header: !Array.<React.ReactElement>,
 * }} elementTemplates
 * @return {{
 *   fixedColumnGroups: !Array.<cellDetails>,
 *   fixedRightColumnGroups: !Array.<cellDetails>,
 *   scrollableColumnGroups: !Array.<cellDetails>,
 *   fixedColumns: !Array.<columnDetails>,
 *   fixedRightColumns: !Array.<columnDetails>,
 *   scrollableColumns: !Array.<columnDetails>,
 * }}
 */
function columnTemplates(columnWidths, elementTemplates) {
  const { columnGroupProps, columnProps } = columnWidths;

  // Ugly transforms to extract data into a row consumable format.
  // TODO (jordan) figure out if this can efficiently be merged with
  // the result of convertColumnElementsToData.
  const fixedColumnGroups = [];
  const fixedRightColumnGroups = [];
  const scrollableColumnGroups = [];
  forEach(columnGroupProps, (columnGroup, index) => {
    const groupData = {
      props: columnGroup,
      template: elementTemplates.groupHeader[index],
      offset:0
    };
    if (columnGroup.fixed) {
      if(fixedColumnGroups.length){
        const prevobj=fixedColumnGroups[fixedColumnGroups.length-1];
        groupData.offset=prevobj.offset+prevobj.width
      }
      
      fixedColumnGroups.push(groupData);
      //fixedColumnGroups.offset
    } else if (columnGroup.fixedRight) {
      if(fixedRightColumnGroups.length){
        const prevobj=fixedRightColumnGroups[fixedRightColumnGroups.length-1];
        groupData.offset=prevobj.offset+prevobj.width
      }
      fixedRightColumnGroups.push(groupData);
    } else {
      if(scrollableColumnGroups.length){
        const prevobj=scrollableColumnGroups[scrollableColumnGroups.length-1];
        groupData.offset=prevobj.offset+prevobj.width
      }
      scrollableColumnGroups.push(groupData);
    }
  });


  const fixedColumns = {
    cell: [],
    header: [],
    footer: [],
    offsets:[0]
  };
  const fixedRightColumns = {
    cell: [],
    header: [],
    footer: [],
    offsets:[0]
  };
  const scrollableColumns = {
    cell: [],
    header: [],
    footer: [],
    offsets:[0],
    width:0
  };
 
  forEach(columnProps, (column, index) => {
    let columnContainer= scrollableColumns ;
    if (column.fixed) {
      columnContainer = fixedColumns;
    } else if (column.fixedRight) {
      columnContainer = fixedRightColumns;
    }

   

    columnContainer.cell.push({
      props: column,
      template: elementTemplates.cell[index],
      offset :0 
    });
    columnContainer.header.push({
      props: column,
      template: elementTemplates.header[index],
      offset:0
    });
    columnContainer.footer.push({
      props: column,
      template: elementTemplates.footer[index],
      offset:0
    });
    columnContainer.width+=column.width;
    let len=columnContainer.cell.length;
  
    if(len>1){
      const prevObj=columnContainer.cell[len-2];
      columnContainer.cell[len-1].offset=prevObj.props.width+prevObj.offset;
      columnContainer.header[len-1].offset=prevObj.props.width+prevObj.offset;
      columnContainer.footer[len-1].offset=prevObj.props.width+prevObj.offset;
    }
  
  });


  return {
    fixedColumnGroups,
    fixedColumns,
   
    fixedRightColumnGroups,
    fixedRightColumns,
  
    scrollableColumnGroups,
    scrollableColumns,
   
  };
}

export default shallowEqualSelector([
  state => columnWidths(state),
  state => state.elementTemplates,
], columnTemplates);
