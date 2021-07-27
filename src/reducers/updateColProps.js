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
 export default function updateColProps(state,props) {
   //const { storedWidths } = state;
  var {scrollableColumns}=state;
    var bufferScrollableColumns={
        cell:[],
        header:[],
        footer:[]
    }
    bufferScrollableColumns.cell.length=state.endBufferIdx-state.firstBufferIdx+1;
    bufferScrollableColumns.header.length=state.endBufferIdx-state.firstBufferIdx+1;
    bufferScrollableColumns.footer.length=state.endBufferIdx-state.firstBufferIdx+1;
 for(var idx=state.firstBufferIdx;idx<=state.endBufferIdx;idx++){
     
    bufferScrollableColumns.cell[idx-state.firstBufferIdx]=scrollableColumns.cell[idx]
    bufferScrollableColumns.header[idx-state.firstBufferIdx]=scrollableColumns.header[idx]
    bufferScrollableColumns.footer[idx-state.firstBufferIdx]=scrollableColumns.footer[idx]
    
    // scrollableColumns.cell[idx].props.width=props.scrollableColumns[idx].width
 }
 //console.log(1)
 return Object.assign({},state,{bufferScrollableColumns});
 }
 