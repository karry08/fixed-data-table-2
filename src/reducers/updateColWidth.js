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
 export default function updateColWidth(state, colIdx,props) {
   //const { storedWidths } = state;
  
 
  
  // const colIdx=state.colMaptoIdx[key];
   const oldWidth = state.storedWidths[colIdx];
   var newWidth;
   if(!props.scrollableColumns[colIdx].width){
     newWidth=oldWidth;
   }
   else {
    newWidth=props.scrollableColumns[colIdx].width;
   }
  // const newWidth = state.columnResizingData.width || oldWidth;
   if (newWidth !== oldWidth) {
     state.colOffsetIntervalTree.set(colIdx, newWidth);
     state.storedWidths[colIdx] = newWidth;
     state.scrollContentWidth += newWidth - oldWidth;
     
   }
   return state.storedWidths[colIdx];
 }
 