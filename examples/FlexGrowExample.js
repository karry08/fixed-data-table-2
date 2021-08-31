/**
 * Copyright Schrodinger, LLC
 */

"use strict";

import FakeObjectDataListStore from './helpers/FakeObjectDataListStore';
import { TextCell, ColoredTextCell } from './helpers/cells';
import { Table, Column, DataCell } from 'fixed-data-table-2';
import React from 'react';

class FlexGrowExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: new FakeObjectDataListStore(1000000),
    };
    this.columns = [];
        this.columns1=[];
        this.columns2=[];
        this.columns1[0]={
          columnKey:"firstName",
          header:<DataCell>First Name</DataCell>,
          cell:<TextCell data={this.state.dataList} />,
          fixedRight:true,
          width:100
        }
        this.columns=[
          
        
     
          {columnKey:"sentence",
          header:<DataCell>Sentence! (flexGrow greediness=2)</DataCell>,
          cell:<ColoredTextCell data={this.state.dataList} />,
          flexGrow:2,
          width:200},
   
        
        {  columnKey:"companyName",
          header:<DataCell>Company (flexGrow greediness=1)</DataCell>,
          cell:<TextCell data={this.state.dataList} />,
          flexGrow:1,
          width:200  },
   
       
          {columnKey:"lastName",
          width:100,
          header:<DataCell>Last Name</DataCell>,
          cell:<TextCell data={this.state.dataList} />},
        ]
       
  }

  render() {
    var {dataList} = this.state;
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
        {...this.props}
        getFixedColumns={getFixedColumns}
        getFixedRightColumns={getFixedRightColumns}
        getScrollableColumns={getScrollableColumns}
        fixedColumnsCount={1}
        fixedRightColumnsCount={0}
        scrollableColumnsCount={3}
        columnWidth={100}
        >
        
      </Table>
    );
  }
}

export default FlexGrowExample;
