/**
 * Copyright Schrodinger, LLC
 */

 "use strict";

 import FakeObjectDataListStore from './helpers/FakeObjectDataListStore';
 import { DateCell, ImageCell, LinkCell, TextCell } from './helpers/cells';
 import { Table, Column, DataCell } from 'fixed-data-table-2';
 import React from 'react';
 
 class MyExample extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          dataList: new FakeObjectDataListStore(1000000),
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
          
        

        }

    
      
    
      render() {
        const getFixedColumns= (index)=>{
          return this.columns1[index];
        }
        const getScrollableColumns=(index)=>{
          return this.columns[index];
        }
        const getFixedRightColumns=(index)=>{
          return this.columns2[index];
        }
        var {dataList} = this.state;
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
            scrollableColumnsCount={100000}
            >
          </Table>
        );
      }
 }
 
 export default MyExample;
 