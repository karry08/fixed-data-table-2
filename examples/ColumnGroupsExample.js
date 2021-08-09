/**
 * Copyright Schrodinger, LLC
 */

"use strict";

import FakeObjectDataListStore from './helpers/FakeObjectDataListStore';
import { TextCell } from './helpers/cells';
import { Table, Column, ColumnGroup, DataCell } from 'fixed-data-table-2';
import React from 'react';

class ColumnGroupsExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: new FakeObjectDataListStore(1000000),
    };
    
        this.columns = [];
        this.columns1=[];
        this.columns2=[];
        this.columnGroups=[
          { header:<DataCell>Name</DataCell>},
          { header:<DataCell>About</DataCell>}
        ]
        this.columns1=[{ 
          columnKey:"firstName",
          header:<DataCell>First Name</DataCell>,
          cell:<TextCell data={this.state.dataList} />,
          columnGroup:0,
          width:150
        },
        {columnKey:"lastName",
        width:150,
        header:<DataCell>Last Name</DataCell>,
        columnGroup:0,
        cell:<TextCell data={this.state.dataList} />}
      ]
        this.columns=[
          
        
     
          {columnKey:"sentence",
          header:<DataCell>Sentence! (flexGrow greediness=2)</DataCell>,
          cell:<TextCell data={this.state.dataList} />,
          flexGrow:1,
          columnGroup:1,
          width:150},
   
        
        {  columnKey:"companyName",
          header:<DataCell>Company (flexGrow greediness=1)</DataCell>,
          cell:<TextCell data={this.state.dataList} />,
          flexGrow:1,
          columnGroup:1,
          width:150  },
   
       
         
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
    const getColumnGroups=(index)=>{
      return this.columnGroups[index];
    }
    return (
      <Table
        rowHeight={30}
        groupHeaderHeight={30}
        headerHeight={30}
        rowsCount={dataList.getSize()}
        width={1000}
        height={500}
        {...this.props}
        getFixedColumns={getFixedColumns}
        getFixedRightColumns={getFixedRightColumns}
        getScrollableColumns={getScrollableColumns}
        getColumnGroups={getColumnGroups}
        fixedColumnsCount={2}
        fixedRightColumnsCount={0}
        scrollableColumnsCount={2}
        columnWidth={100}
        >
       
      </Table>
    );
  }
}

export default ColumnGroupsExample;
