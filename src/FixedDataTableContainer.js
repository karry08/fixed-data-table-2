/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableContainer
 * @typechecks
 * @noflow
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import invariant from './stubs/invariant';
import pick from 'lodash/pick';

import * as scrollActions from './actions/scrollActions';
import FixedDataTable from './FixedDataTable';
import FixedDataTableStore from './FixedDataTableStore';
import Scrollbar from './plugins/Scrollbar';
import ScrollContainer from './plugins/ScrollContainer';
import { PluginContext } from './Context';
import shallowEqualSelector from './helper/shallowEqualSelector';
import columnWidths from './selectors/columnWidths';
import { initialize, propChange } from './reducers';


const memoizeContext = shallowEqualSelector([
  state => state.maxScrollX,
  state => state.scrollX,
  state => state.tableSize.height,
  state => columnWidths(state)
], (/*number*/maxScrollX, /*number*/scrollX, /*number*/tableHeight, { /*number*/availableScrollWidth }) => {
  return {
    maxScrollX,
    scrollX,
    tableHeight,
    availableScrollWidth
  }
});

class FixedDataTableContainer extends React.Component {
  static defaultProps = {
    defaultScrollbars: true,
    scrollbarXHeight: Scrollbar.SIZE,
    scrollbarYWidth: Scrollbar.SIZE,
  };

  constructor(props) {
    super(props);

    this.update = this.update.bind(this);

    this.reduxStore = FixedDataTableStore.get();

    this.scrollActions = bindActionCreators(
      scrollActions,
      this.reduxStore.dispatch
    );

    this.reduxStore.dispatch(initialize(props))

    this.unsubscribe = this.reduxStore.subscribe(this.update);
    this.state = this.getBoundState();
   
  }

  componentWillReceiveProps(nextProps) {
    invariant(
      nextProps.height !== undefined || nextProps.maxHeight !== undefined,
      'You must set either a height or a maxHeight'
    );

    this.reduxStore.dispatch(propChange({
      newProps: nextProps,
      oldProps: this.props
    }))
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.reduxStore = null;
  }

  render() {
    const contextValue = {
      ...memoizeContext({ ...this.state, ...this.props }),
      isRTL: this.props.isRTL,
      touchEnabled: this.props.touchEnabled,
    };
    const fdt = (
      <FixedDataTable
        {...this.props}
        {...this.state}
        scrollActions={this.scrollActions}
      />
    );
  //  console.log(this.props)
    // For backward compatibility, by default we render FDT-2 scrollbars
    if (this.props.defaultScrollbars) {
      return (
        <PluginContext.Provider value={contextValue}>
          <ScrollContainer {...this.props}>{fdt}</ScrollContainer>
        </PluginContext.Provider>
      );
    }
    return (
      <PluginContext.Provider value={contextValue}>
        {fdt}
      </PluginContext.Provider>
    );
  }

  getBoundState() {
    const state = this.reduxStore.getState();
    const boundState = pick(state, [
      'columnGroupProps',
      'columnProps',
      'columnReorderingData',
      'columnResizingData',
      'elementHeights',
      'firstRowIndex',
      'endRowIndex',
      'isColumnReordering',
      'isColumnResizing',
      'maxScrollX',
      'maxScrollY',
      'rows',
      'rowOffsets',
      'rowSettings',
      'scrollContentHeight',
      'scrollFlags',
      'scrollX',
      'scrollY',
      'scrolling',
      'scrollJumpedX',
      'scrollJumpedY',
      'tableSize',
      'scrollContentWidth',
      'fixedRightColumnsWidth',
      'fixedColumnsWidth',
      'fixedContentWidth',
      'scrollLeft',
    'scrollToColumn',
    'colSettings',
    'firstColIndex',
    'firstBufferIdx',
     'firstColOffset',
     'endColIndex',
     'cols',
     'fixedCols',
     'fixedRightCols',
     'colOffsets',
     'fixedColOffsets',
      'fixedRightColOffsets',
     'colBufferSet',
     'fixedColumnGroups',
    'fixedColumns',
    'fixedRightColumnGroups',
    'fixedRightColumns',
    'scrollableColumnGroups',
    'bufferScrollableColumns',
     
    ]);
   
    return boundState;
  }

  update() {
    this.setState(this.getBoundState());
  }
}

export default FixedDataTableContainer;
