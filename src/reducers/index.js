/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule reducers
 */

'use strict';

import pick from 'lodash/pick';

import IntegerBufferSet from '../vendor_upstream/struct/IntegerBufferSet';
import PrefixIntervalTree from '../vendor_upstream/struct/PrefixIntervalTree';
import shallowEqual from '../vendor_upstream/core/shallowEqual';

import columnTemplates from '../selectors/columnTemplates';
import convertColumnElementsToData from '../helper/convertColumnElementsToData';
import { getScrollAnchor, scrollTo } from './scrollAnchor';
import {getScrollAnchorX,scrollTox} from './scrollAnchorX';
import columnStateHelper from './columnStateHelper'
import computeRenderedRows from './computeRenderedRows';
import Scrollbar from '../plugins/Scrollbar';
import { createSlice } from '@reduxjs/toolkit';
import computeRenderedCols from './computeRenderedCols';
import updateColProps from './updateColProps';
import getColumnTemplates from './getColumnTemplates';
import clamp from 'lodash/clamp';
import { object } from 'prop-types';


/**
 * Returns the default initial state for the redux store.
 * This must be a brand new, independent object for each table instance
 * or issues may occur due to multiple tables sharing data.
 *
 * @return {!Object}
 */
function getInitialState() {
  return {
    /*
     * Input state set from props
     */
    columnProps: [],
    columnGroupProps: [],
    elementTemplates: {
      cell: [],
      footer: [],
      groupHeader: [],
      header: [],
    },
    elementHeights: {
      footerHeight: 0,
      groupHeaderHeight: 0,
      headerHeight: 0,
    },
    rowSettings: {
      bufferRowCount: undefined,
      rowAttributesGetter: undefined,
      rowHeight: 0,
      rowHeightGetter: () => 0,
      rowsCount: 0,
      subRowHeight: 0,
      subRowHeightGetter: () => 0,
    },
    colSettings: {
      bufferColCount: undefined,
      colAttributesGetter: undefined,
      colWidth: 0,
      colWidthGetter: () => 0,
      colsCount: 0,
     minColumn:0
    },
    scrollFlags: {
      overflowX: 'auto',
      overflowY: 'auto',
      showScrollbarX: true,
      showScrollbarY: true,
    },
    tableSize: {
      height: undefined,
      maxHeight: 0,
      maxWidth:0,
      ownerHeight: undefined,
      useMaxHeight: false,
      width: 0,
    },

    /*
     * Output state passed as props to the the rendered FixedDataTable
     * NOTE (jordan) rows may contain undefineds if we don't need all the buffer positions
     */
    firstRowIndex: 0,
    firstRowOffset: 0,
    firstColIndex: 0,
    firstColOffset:0,
    firstBufferIdx:0,
    endBufferIdx:0,
    maxScrollX: 0,
    maxScrollY: 0,
    rowOffsets: {},
    colOffsets:{},
    fixedColOffsets:{},
    fixedRightColOffsets:{},
    colGroupOffsets:{},
    fixedColGroupOffsets:{},
    fixedRightColGroupOffsets:{},
    rows: [], // rowsToRender
    cols:[],
    fixedCols:[],
    fixedRightCols:[],
    groups:[],
    fixedGroups:[],
    fixedRightGroups:[],
    scrollContentHeight: 0,
    scrollContentWidth: 0,
    fixedColumnsWidth:0,
    fixedRightColumnsWidth:0,
    fixedContentWidth:0,
    scrollX: 0,
    scrollbarXHeight: Scrollbar.SIZE,
    scrollY: 0,
    scrollbarYWidth: Scrollbar.SIZE,
    scrolling: false,
    scrollingX:false,
    scrollableColumns:[],
    bufferFixedColumns:[],
    bufferScrollableColumns:[],
    bufferFixedRightColumns:[],
    bufferFixedGroups:[],
    bufferFixedRightGroups:[],
    bufferScrollableGroups:[],
    fixedColumns:[],
    fixedRightColumns:[],
    fixedColumnsCount:0,
    fixedRightColumnsCount:0,
    scrollableColumnsCount:0,
    totalFlexGrow:0,
    widthVacant:0,

    /*
     * Internal state only used by this file
     * NOTE (jordan) internal state is altered in place
     * so don't trust it for redux history or immutability checks
     * TODO (jordan) investigate if we want to move this to local or scoped state
     */
    rowBufferSet: new IntegerBufferSet(),
    storedHeights: [],
    fixedStoredWidths:[],
    fixedRightStoredWidths:[],
    rowOffsetIntervalTree: null, // PrefixIntervalTree
    colBufferSet: new IntegerBufferSet(),
    storedWidths:[],
    colOffsetIntervalTree:null
  };
}

const slice = createSlice({
  name: 'FDT',
  initialState: getInitialState(),
  reducers: {
    initialize(state, action) {
      const props = action.payload;
   
      let newState = setStateFromProps(state, props);
      newState = initializeRowHeightsAndOffsets(newState);
      newState= initializeColWidthsAndOffsets(newState);
      const scrollAnchor = getScrollAnchor(newState, props);
      const scrollAnchorX=getScrollAnchorX(newState,props);
      newState = computeRenderedRows(newState, scrollAnchor);
      newState=computeRenderedCols(newState,scrollAnchorX,1);
      newState=updateColProps(newState,1)
      newState= columnStateHelper.initialize(newState, props, {});
      Object.assign(state,newState);
  //    return newState
      
    },
    propChange(state, action) {
      const { newProps, oldProps } = action.payload;
      
      let newState;
      if(oldProps.fixedColumnsCount !==newProps.fixedColumnsCount  ||
        oldProps.scrollableColumnsCount !==newProps.scrollableColumnsCount   ||
        oldProps.fixedRightColumnsCount !==newProps.fixedRightColumnsCount){
          newState=setStateFromProps(state,newProps)
          newState=initializeColWidthsAndOffsets(newState);
          
        }
        else{
          newState = setStateFromPropsChange(state, newProps);
        }
 //     console.log(newState)
      if (oldProps.rowsCount !== newProps.rowsCount ||
        oldProps.rowHeight !== newProps.rowHeight ||
        oldProps.subRowHeight !== newProps.subRowHeight) {
        newState = initializeRowHeightsAndOffsets(newState);
      }
      
   //   

      if (oldProps.rowsCount !== newProps.rowsCount) {
        // NOTE (jordan) bad practice to modify state directly, but okay since
        // we know setStateFromProps clones state internally
        newState.rowBufferSet = new IntegerBufferSet();
      }

      const scrollAnchor = getScrollAnchor(newState, newProps, oldProps);
      const scrollAnchorX=getScrollAnchorX(newState,newProps,oldProps);
      // If anything has changed in state, update our rendered rows
      if(!shallowEqual(state, newState)){
        newState = computeRenderedRows(newState, scrollAnchor);
        newState = computeRenderedCols(newState, scrollAnchorX,1);
        newState= updateColProps(newState);
      }
      
      else if(scrollAnchor.changed){
        newState = computeRenderedRows(newState, scrollAnchor);
      }
      else if(scrollAnchorX.changed){
       newState = computeRenderedCols(newState, scrollAnchorX,1);
       newState= updateColProps(newState);
      }
   
   //  newState = columnStateHelper.initialize(newState, newProps, oldProps);
   
      // if scroll values have changed, then we're scrolling!
      if (newState.scrollX !== state.scrollX || newState.scrollY !== state.scrollY) {
        newState.scrolling = newState.scrolling || true;
      }

      // TODO REDUX_MIGRATION solve w/ evil-diff
      // TODO (jordan) check if relevant props unchanged and
      // children column widths and flex widths are unchanged
      // alternatively shallow diff and reconcile props
     // state=newState
     //
     newState=updateColProps(newState,1)
     Object.assign(state,newState);

    },
    scrollEnd(state) {
      var newState = Object.assign({}, state, {
        scrolling: false,
      });
      const previousScrollAnchor = {
        firstIndex: state.firstRowIndex,
        firstOffset: state.firstRowOffset,
        lastIndex: state.lastIndex,
      };
      const previousScrollAnchorX={
        firstIndex: state.firstColIndex,
        firstOffset: state.firstColOffset,
        lastIndex: state.lastIndex,
      }
      newState=computeRenderedCols(newState,previousScrollAnchorX,0)
      return computeRenderedRows(newState, previousScrollAnchor);
    },
    scrollToY(state, action) {
      let scrollY = action.payload;
      const newState = Object.assign({}, state, {
        scrolling: true,
      });
      const scrollAnchor = scrollTo(newState, scrollY);
      return computeRenderedRows(newState, scrollAnchor);
    },
    scrollToX(state, action) {
      const scrollX = action.payload;
      var newState = Object.assign({}, state, {
        scrolling: true
      });
      const scrollAnchorX=scrollTox(newState,scrollX);  
      newState= computeRenderedCols(newState,scrollAnchorX,0);
      //return newState
      return updateColProps(newState,0)
    }
  }
})

/**
 * Initialize row heights (storedHeights) & offsets based on the default rowHeight
 *
 * @param {!Object} state
 * @private
 */
function initializeRowHeightsAndOffsets(state) {
  const { rowHeight, rowsCount, subRowHeight } = state.rowSettings;
  const defaultFullRowHeight = rowHeight + subRowHeight;
  const rowOffsetIntervalTree = PrefixIntervalTree.uniform(rowsCount, defaultFullRowHeight);
  const scrollContentHeight = rowsCount * defaultFullRowHeight;
  const storedHeights = new Array(rowsCount);
  for (let idx = 0; idx < rowsCount; idx++) {
    storedHeights[idx] = defaultFullRowHeight;
  }
  return Object.assign({}, state, {
    rowOffsetIntervalTree,
    scrollContentHeight,
    storedHeights,
  });
}
function initializeColWidthsAndOffsets(state) {
 
  
  var {colSettings}=state;
  

 
  var scrollContentWidth =0;
  var fixedColumnsWidth=0;
  var fixedRightColumnsWidth=0;
  const storedWidths = [];
  const fixedStoredWidths = [];
  const fixedRightStoredWidths = [];
  let minColumn=-1;
  var fixedContentWidth=0;
  for (var idx =0;idx<state.scrollableColumnsCount;idx++){
    var width=state.columnWidth;
    storedWidths.push(width);

    if(minColumn==-1)minColumn=width;
    minColumn=Math.min(minColumn,width);
   
    scrollContentWidth+=width; 
  }
  for (var idx =0;idx<state.fixedColumnsCount;idx++){
    fixedColumnsWidth+=state.columnWidth;
    fixedStoredWidths[idx]=state.columnWidth;
  }
  for (var idx =0;idx<state.fixedRightColumnsCount;idx++){
    fixedRightColumnsWidth+=state.columnWidth;
    fixedRightStoredWidths[idx]=state.columnWidth
  }
  
  fixedContentWidth=fixedRightColumnsWidth+fixedColumnsWidth;

  const colOffsetIntervalTree =new PrefixIntervalTree(storedWidths);
  return Object.assign({}, state, {
   colOffsetIntervalTree,
    scrollContentWidth,
    fixedColumnsWidth,
    fixedRightColumnsWidth,
    storedWidths,
    fixedStoredWidths,
    fixedRightStoredWidths,
    fixedContentWidth,
    colSettings:{...colSettings,minColumn:minColumn}
  });
}

/**
 * @param {!Object} state
 * @param {!Object} props
 * @return {!Object}
 * @private
 */
function setStateFromProps(state, props) {
  const {fixedColumnsCount,fixedRightColumnsCount,scrollableColumnsCount,getFixedColumns,
  getFixedRightColumns,getScrollableColumns,getColumnGroups,columnWidth}=props;
  var newState=Object.assign({},state,{fixedColumnsCount,fixedRightColumnsCount,scrollableColumnsCount,
    getFixedColumns,getFixedRightColumns,getScrollableColumns,getColumnGroups,columnWidth})
  
  newState.elementHeights = Object.assign({}, newState.elementHeights,
    pick(props, ['cellGroupWrapperHeight', 'footerHeight', 'groupHeaderHeight', 'headerHeight']));
 /* if (!useGroupHeader) {
    newState.elementHeights.groupHeaderHeight = 0;
  }*/

  newState.rowSettings = Object.assign({}, newState.rowSettings,
    pick(props, ['bufferRowCount', 'rowHeight', 'rowsCount', 'subRowHeight']));
  const { rowHeight, subRowHeight } = newState.rowSettings;
  newState.rowSettings.rowHeightGetter =
    props.rowHeightGetter || (() => rowHeight);
  newState.rowSettings.subRowHeightGetter =
    props.subRowHeightGetter || (() => subRowHeight || 0);
  newState.rowSettings.rowAttributesGetter = props.rowAttributesGetter;

 
  newState.scrollFlags = Object.assign({}, newState.scrollFlags,
    pick(props, ['overflowX', 'overflowY', 'showScrollbarX', 'showScrollbarY']));

  newState.tableSize = Object.assign({}, newState.tableSize,
    pick(props, ['height', 'maxHeight', 'ownerHeight', 'width']));
  newState.tableSize.useMaxHeight =
    newState.tableSize.height === undefined;

  newState.scrollbarXHeight = props.scrollbarXHeight;
  newState.scrollbarYWidth = props.scrollbarYWidth;

 
  return {...newState, colSettings:{...newState.colSettings,colsCount:scrollableColumnsCount}}
  
}
function setStateFromPropsChange(state, props) {
 var rowSettings= Object.assign({}, state.rowSettings,
    pick(props, ['bufferRowCount', 'rowHeight', 'rowsCount', 'subRowHeight']));
 var newState = Object.assign({}, state,{rowSettings});
  const { rowHeight, subRowHeight } = newState.rowSettings;
  newState.rowSettings.rowHeightGetter =
    props.rowHeightGetter || (() => rowHeight);
  newState.rowSettings.subRowHeightGetter =
    props.subRowHeightGetter || (() => subRowHeight || 0);
  newState.rowSettings.rowAttributesGetter = props.rowAttributesGetter;

 
  newState.scrollFlags = Object.assign({}, newState.scrollFlags,
    pick(props, ['overflowX', 'overflowY', 'showScrollbarX', 'showScrollbarY']));

  newState.tableSize = Object.assign({}, newState.tableSize,
    pick(props, ['height', 'maxHeight', 'ownerHeight', 'width']));
  newState.tableSize.useMaxHeight =
    newState.tableSize.height === undefined;

  newState.scrollbarXHeight = props.scrollbarXHeight;
  newState.scrollbarYWidth = props.scrollbarYWidth;
  
  return newState;
  
}

const { reducer, actions } = slice
export const { initialize, propChange, scrollEnd, scrollToX, scrollToY } = actions
export default reducer;
