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
        const cellRenderer = ({ columnKey, rowIndex }) =>
          (<div className='autoScrollCell'> {rowIndex}, {columnKey} </div>);
    
        for (let i = 0; i < 100000; i++) {
          this.columns[i] = (
            <Column
              key={i}
              columnKey={i}
              header={<div> {i} </div>}
              cell={cellRenderer}
              width={100}
              allowCellsRecycling={true}
            />
          )
        }
    
      }
    
      render() {
        var {dataList} = this.state;
        return (
          <Table
            rowHeight={50}
            headerHeight={50}
            rowsCount={dataList.getSize()}
            width={1000}
            height={500}
            {...this.props}>
            <Column
              columnKey="avatar"
              cell={<ImageCell data={dataList} />}
              fixed={true}
              width={50}
            />
            <Column
              columnKey="firstName"
              header={<DataCell>First Name</DataCell>}
              cell={<LinkCell data={dataList} />}
              fixedRight={true}
              width={100}
            />
            <Column
              columnKey="lastName"
              header={<DataCell>Last Name</DataCell>}
              cell={<TextCell data={dataList} />}
              fixedRight={true}
              width={100}
            />
            <Column
              columnKey="city"
              header={<DataCell>City</DataCell>}
              cell={<TextCell data={dataList} />}
              width={100}
            />
            <Column
              columnKey="street"
              header={<DataCell>Street</DataCell>}
              cell={<TextCell data={dataList} />}
              width={200}
            />
            <Column
              columnKey="zipCode"
              header={<DataCell>Zip Code</DataCell>}
              cell={<TextCell data={dataList} />}
              width={200}
            />
            <Column
              columnKey="email"
              header={<DataCell>Email</DataCell>}
              cell={<LinkCell data={dataList} />}
              width={200}
            />
            <Column
              columnKey="date"
              header={<DataCell>DOB</DataCell>}
              cell={<DateCell data={dataList} />}
              width={200}
            />
            {this.columns}
          </Table>
        );
      }
 }
 
 export default MyExample;
 