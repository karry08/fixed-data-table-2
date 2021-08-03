/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule updateColWidth
 */

 'use strict';
import { _extractTemplates,_addToColumn,_extractProps } from "./getColumnTemplates";
 /**
  * Update our cached col width for a specific index
  * based on the value from colWidthGetter
  *
  * NOTE (jordan) This alters state so it shouldn't be called
  * without state having been cloned first.
  *
  * @param {!Object} state
  * @param {number} colIdx
  * @return {number} The new col width
  */
 export default function updateColProps(state,flag) {
   state= updateScrollableColProps(state)
   if(flag){
     state =updateFixedColProps(state);
     state=updateFixedRightColProps(state)
   }
   return state;
    
 }
 function updateScrollableColProps(state){
  var bufferScrollableColumns={
    cell:[],
    header:[],
    footer:[]
}

for(var idx=state.firstBufferIdx;idx<state.endBufferIdx;idx++){
const child=state.getScrollableColumns(idx)
const columnProp=_extractProps(child)
const elementTemplates=_extractTemplates(child)
columnProp.width=state.storedWidths[idx];
_addToColumn(bufferScrollableColumns,columnProp,elementTemplates)
 

}
return Object.assign({},state,{bufferScrollableColumns});
   
 }
 function updateFixedColProps(state){
  var bufferFixedColumns={
    cell:[],
    header:[],
    footer:[]
}

for(var idx=0;idx<state.fixedColumnsCount;idx++){
const child=state.getFixedColumns(idx)
const columnProp=_extractProps(child)
const elementTemplates=_extractTemplates(child)
columnProp.width=state.fixedStoredWidths[idx];
_addToColumn(bufferFixedColumns,columnProp,elementTemplates)
 

}
return Object.assign({},state,{bufferFixedColumns});
 }
 function updateFixedRightColProps(state){
  var bufferFixedRightColumns={
    cell:[],
    header:[],
    footer:[]
}

for(var idx=0;idx<state.fixedRightColumnsCount;idx++){
const child=state.getFixedRightColumns(idx)
const columnProp=_extractProps(child)
const elementTemplates=_extractTemplates(child)
columnProp.width=state.fixedRightStoredWidths[idx];
_addToColumn(bufferFixedRightColumns,columnProp,elementTemplates)
 

}
return Object.assign({},state,{bufferFixedRightColumns});
 }

 