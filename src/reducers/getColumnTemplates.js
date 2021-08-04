/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule convertColumnElementsToData
 */

 'use strict';

 import React from 'react';
 import forEach from 'lodash/forEach';
 import invariant from '../stubs/invariant';
 import map from 'lodash/map';
 import pick from 'lodash/pick';
import columnTemplates from '../selectors/columnTemplates';
 
export function _extractProps(column) {
   return pick(column, [
     'align',
     'allowCellsRecycling',
     'cellClassName',
     'columnKey',
     'flexGrow',
     'fixed',
     'fixedRight',
     'maxWidth',
     'minWidth',
     'isReorderable',
     'isResizable',
     'pureRendering',
     'width',
     'columnGroup'
   ]);
 };
 
export function _extractTemplates( columnElement) {
     var elementTemplates={};
   elementTemplates.cell=columnElement.cell;
   elementTemplates.footer=columnElement.footer;
   elementTemplates.header=columnElement.header;
   return elementTemplates;
 };
export function _addToColumn(columnContainer , column,elementTemplates){
    columnContainer.cell.push({
        props: column,
        template: elementTemplates.cell,
      });
      columnContainer.header.push({
        props: column,
        template: elementTemplates.header,
      });
      columnContainer.footer.push({
        props: column,
        template: elementTemplates.footer,
      });

 }
 
 /**
  * Converts React column / column group elements into props and cell rendering templates
  */
 function getColumnTemplates(state) {
   const fixedColumns = {
    cell: [],
    header: [],
    footer: [],
  };
  const fixedRightColumns = {
    cell: [],
    header: [],
    footer: [],
  };
  const scrollableColumns = {
    cell: [],
    header: [],
    footer: [],
  };
   var columnProps=[]
   // Use a default column group
   for(var idx=0;idx<state.fixedColumnsCount;idx++){
       const child=state.getFixedColumns(idx)
        const columnProp=_extractProps(child)
        columnProps.push(columnProp)
        const elementTemplates=_extractTemplates(child)
        _addToColumn(fixedColumns,columnProp,elementTemplates)
   }
   for(var idx=0;idx<state.scrollableColumnsCount;idx++){
    const child=state.getScrollableColumns(idx)
    
    const columnProp=_extractProps(child)
    columnProps.push(columnProp)
    const elementTemplates=_extractTemplates(child)
    //console.log(elementTemplates)
    _addToColumn(scrollableColumns,columnProp,elementTemplates)

   }
   for(var idx=0;idx<state.fixedRightColumnsCount;idx++){
    const child=state.getFixedRightColumns(idx)
    const columnProp=_extractProps(child)
    columnProps.push(columnProp)
        const elementTemplates=_extractTemplates(child)
        _addToColumn(fixedRightColumns,columnProp,elementTemplates)

   }
   
   
   return {
     scrollableColumns,fixedRightColumns,fixedColumns,columnProps
   };
 };
 
 export default getColumnTemplates;
 