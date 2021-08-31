/**
 * Copyright Schrodinger, LLC
 */

"use strict";

import FakeObjectDataListStore from './helpers/FakeObjectDataListStore';
import { DateCell, ImageCell, LinkCell, TextCell } from './helpers/cells';
import { Table, Column, DataCell } from 'fixed-data-table-2';
import React from 'react';

class FixedRightColumnsExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: new FakeObjectDataListStore(1000000),
    };
    this.columns = [];
    this.columns1=[];
    this.columns2=[];
    this.columns1=[{
      columnKey:"avatar",
      cell:<ImageCell data={this.state.dataList} />,
      fixed:true,
      width:50
    },

    
    
  ]
    this.columns2=[{
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
      }]
    this.columns=[{
        columnKey:"city",
        cell:<TextCell data={this.state.dataList} />,
        header:<DataCell>City</DataCell>,
        width:100
      },
      {
        columnKey:"street",
        cell:<TextCell data={this.state.dataList} />,
        header:<DataCell>Street</DataCell>,
        width:200
      },
      {
        columnKey:"zipCode",
        cell:<TextCell data={this.state.dataList} />,
        header:<DataCell>Zip</DataCell>,
        width:200
      },{
        columnKey:"email",
        cell:<LinkCell data={this.state.dataList} />,
        header:<DataCell>Email</DataCell>,
        width:200
      },
      {
        columnKey:"date",
        cell:<DateCell data={this.state.dataList} />,
        header:<DataCell>Date</DataCell>,
        width:200
      },
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
        fixedRightColumnsCount={2}
        scrollableColumnsCount={5}
        columnWidth={100}>
        
      </Table>
    );
  }
}

export default FixedRightColumnsExample;
