/**
 * Copyright Schrodinger, LLC
 */

"use strict";

import FakeObjectDataListStore from './helpers/FakeObjectDataListStore';
import { ImageCell, LinkCell ,TextCell} from './helpers/cells';
import { Table, Column, DataCell } from 'fixed-data-table-2';
import React from 'react';

class AutoScrollExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: new FakeObjectDataListStore(10000),
      scrollTop: 0,
      scrollLeft: 0,
      autoScrollEnabled: true,
      horizontalScrollDelta: 0,
      verticalScrollDelta: 0,
    };

    this.columns = [];
        this.columns1=[];
        this.columns2=[];
        const cellRenderer = ({ columnKey, rowIndex }) =>
          (<div className='autoScrollCell'> {rowIndex}, {columnKey} </div>);
    
        for (let i = 0; i < 100000; i++) {
          this.columns[i] = {
              key:i,
              columnKey:i,
              header:<div> {i} </div>,
              cell:cellRenderer,
              width:100,
              allowCellsRecycling:true
          }
        }
        this.columns1[0]={
          columnKey:"avatar",
          cell:<ImageCell data={this.state.dataList} />,
          fixed:true,
          width:50
        }
        this.columns2=[
          {
          columnKey:"firstName",
          header:<DataCell>First Name</DataCell>,
          cell:<LinkCell data={this.state.dataList} />,
          fixedRight:true,
          width:100
          },
          {
          columnKey:"lastName",
          header:<DataCell>Last Name</DataCell>,
          cell:<TextCell data={this.state.dataList} />,
          fixedRight:true,
          width:100
          }
          ]
          

    this.onVerticalScroll = this.onVerticalScroll.bind(this);
    this.onHorizontalScroll = this.onHorizontalScroll.bind(this);
    this.toggleAutoScroll = this.toggleAutoScroll.bind(this);
    this.setHorizontalScrollDelta = this.setHorizontalScrollDelta.bind(this);
    this.setVerticalScrollDelta = this.setVerticalScrollDelta.bind(this);
  }

  componentDidMount() {
    
    setInterval(() => {
      if (!this.state.autoScrollEnabled) {
        return;
      }
      this.setState((prevState) => ({
        scrollTop: prevState.scrollTop + (prevState.verticalScrollDelta || 0),
        scrollLeft: prevState.scrollLeft + (prevState.horizontalScrollDelta || 0),
      }));
    }, 16);
  }


  render() {
    return (
      <div className='autoScrollContainer'>
        {this.renderControls()}
        {this.renderTable()}
      </div>
    );
  }

  renderControls() {
    return (
      <div className='autoScrollControls'>
        <label>
          Auto Scroll Enabled
          <input type='checkbox' checked={this.state.autoScrollEnabled} onChange={this.toggleAutoScroll} />
        </label>
        <label>
          Horizontal Scroll Delta
          <input type='number' value={this.state.horizontalScrollDelta} onChange={this.setHorizontalScrollDelta} />
        </label>
        <label>
          Vertical Scroll Delta
          <input type='number' value={this.state.verticalScrollDelta} onChange={this.setVerticalScrollDelta} />
        </label>
      </div>
    )
  }

  renderTable() {
    var { dataList, scrollLeft, scrollTop } = this.state;
    const getFixedColumns= (index)=>{
      return this.columns1[index];
    }
    const getScrollableColumns=(index)=>{
      return this.columns[index];
    }
    const getFixedRightColumns=(index)=>{
      return this.columns2[index];
    }
    return (
      <Table
        rowHeight={50}
        headerHeight={50}
        rowsCount={dataList.getSize()}
        width={1000}
        height={500}
        scrollLeft={scrollLeft}
        scrollTop={scrollTop}
        onVerticalScroll={this.onVerticalScroll}
        onHorizontalScroll={this.onHorizontalScroll}
        {...this.props}
        getFixedColumns={getFixedColumns}
        getFixedRightColumns={getFixedRightColumns}
        getScrollableColumns={getScrollableColumns}
        fixedColumnsCount={1}
        fixedRightColumnsCount={2}
        scrollableColumnsCount={10000}
      >
      </Table>
    );
  }

  onVerticalScroll(scrollTop) {
    this.setState({ scrollTop });
  }

  onHorizontalScroll(scrollLeft) {
    this.setState({ scrollLeft });
  }

  toggleAutoScroll() {
    this.setState((prevState) => ({
      autoScrollEnabled: !prevState.autoScrollEnabled,
    }));
  }

  setHorizontalScrollDelta(event) {
    const { value } = event.target;
    if (isNaN(value)) {
      return;
    }
    this.setState({
      horizontalScrollDelta: parseInt(value),
    });
  }

  setVerticalScrollDelta(event) {
    const { value } = event.target;
    if (isNaN(value)) {
      return;
    }
    this.setState({
      verticalScrollDelta: parseInt(value),
    });
  }
}

export default AutoScrollExample;
