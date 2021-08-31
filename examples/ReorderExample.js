/**
 * Copyright Schrodinger, LLC
 */

"use strict";

import FakeObjectDataListStore from './helpers/FakeObjectDataListStore';
import { TextCell } from './helpers/cells';
import { Table, Column, Plugins } from 'fixed-data-table-2';
import React from 'react';
import _ from 'lodash';
var columnTitles = {
  firstName: 'First Name',
  lastName: 'Last Name',
  sentence: 'Sentence',
  companyName: 'Company',
  city: 'City',
  street: 'Street',
  zipCode: 'Zip Code',
};

var columnWidths = {
  firstName: 150,
  lastName: 150,
  sentence: 240,
  companyName: 100,
  city: 240,
  street: 260,
  zipCode: 240
};

var fixedColumns = [
 
];

class ReorderExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: new FakeObjectDataListStore(1000000),
      columnOrder: [
        'firstName',
        'lastName',
        'city',
        'street',
        'zipCode',
        'sentence',
        'companyName'
      ],
      
     columns: [],
     columns1:[],
     columns2:[],
      isReordering: {},
    };
  }

  _onColumnReorderEndCallback = (event) => {
    var columnOrder = this.state.columnOrder.filter((columnKey) => {
      return columnKey !== event.reorderColumn;
    });

    if (event.columnAfter) {
      var index = columnOrder.indexOf(event.columnAfter);
      columnOrder.splice(index, 0, event.reorderColumn);
    } else {
      if (fixedColumns.indexOf(event.reorderColumn) !== -1) {
        columnOrder.splice(fixedColumns.length - 1, 0, event.reorderColumn);
      } else {
        columnOrder.push(event.reorderColumn);
      }
    }
    this.setState({
      columnOrder: columnOrder,
      isReordering: {}
    });
  };

  onColumnReorderStart  = (columnKey) => {
    this.setState({
      isReordering: {
        [columnKey]: false,
      },
    });
  };

  render() {
    const { dataList, isReordering ,columns,columns1,columns2} = this.state;
    const onColumnReorderEndCallback = this._onColumnReorderEndCallback;
    const onColumnReorderStart = this.onColumnReorderStart;
  //  var { dataList, columnWidths } = this.state;
    const getFixedColumns= (index)=>{
      return this.state.columns1[index];
    }
    const getScrollableColumns=(index)=>{
      return this.state.columns[index];
    }
    const getFixedRightColumns=(index)=>{
      return this.state.columns2[index];
    }
    
    this.state.columnOrder.map(function (columnKey, i) {
      const column=
        {
          allowCellsisReordering:_.get(isReordering, columnKey, true),
          columnKey:columnKey,
          key:i,
          header:
            <Plugins.ReorderCell
              onColumnReorderStart={onColumnReorderStart}
              onColumnReorderEnd={onColumnReorderEndCallback}
            >
              {columnTitles[columnKey]}
            </Plugins.ReorderCell>
          ,
          cell:<TextCell data={dataList} />,
        //  fixed={}
          width:columnWidths[columnKey]
        }
        columns[i]=column;
        //if(fixedColumns.indexOf(columnKey) === -1)columns[columns.length]=column
        //else columns1[columns1.length]=column
    
    })
    console.log(columns,columns1)
    return (
      <Table
        rowHeight={30}
        headerHeight={50}
        rowsCount={dataList.getSize()}
        isColumnReordering={false}
        width={1000}
        height={500}
        {...this.props}
        getFixedColumns={getFixedColumns}
        getFixedRightColumns={getFixedRightColumns}
        getScrollableColumns={getScrollableColumns}
        fixedColumnsCount={columns1.length}
        fixedRightColumnsCount={columns2.length}
        scrollableColumnsCount={columns.length}
        columnWidth={100}
        
      >
        
      </Table>
    );
  }
}

export default ReorderExample;
