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

import { func } from "prop-types";

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
 export function updateColWidth(state, colIdx) {
   const { storedWidths, colOffsetIntervalTree} = state;
  
   const oldWidth = storedWidths[colIdx];
   var {width,flexGrow}=state.getScrollableColumns(colIdx);
   if(state.totalFlexGrow && flexGrow){
    width+= Math.floor(flexGrow*(state.widthVacant)/(state.totalFlexGrow));
  }
   if (width !== oldWidth) {
     colOffsetIntervalTree.set(colIdx, width);
     storedWidths[colIdx] = width;
     state.scrollContentWidth += width - oldWidth;
   }
   
   return storedWidths[colIdx];
 }
 export function updateFixedColWidth(state,colIdx){
  const {fixedStoredWidths}=state;
  const oldWidth=fixedStoredWidths[colIdx];
  var {width,flexGrow}=state.getFixedColumns(colIdx);
  if(state.totalFlexGrow && flexGrow){
    width+= Math.floor(flexGrow*(state.widthVacant)/(state.totalFlexGrow));
  }
  if(width!=oldWidth){
    fixedStoredWidths[colIdx]=width;
    state.fixedColumnsWidth+=width-oldWidth
    state.fixedContentWidth+=width-oldWidth;
  }
  return fixedStoredWidths[colIdx];

 }
 export function updateFixedRightColWidth(state,colIdx){
  const {fixedRightStoredWidths}=state;
  const oldWidth=fixedRightStoredWidths[colIdx];
  var {width,flexGrow}=state.getFixedRightColumns(colIdx);
  if(state.totalFlexGrow && flexGrow){
    width+= Math.floor(flexGrow*(state.widthVacant)/(state.totalFlexGrow));
  }
  if(width!=oldWidth){
    fixedRightStoredWidths[colIdx]=width;
    state.fixedRightColumnsWidth+=width-oldWidth;
    state.fixedContentWidth+=width-oldWidth;
  }
  return fixedRightStoredWidths[colIdx];
}
 