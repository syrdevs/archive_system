import React, { PropTypes } from 'react';
import _ from 'lodash';

const Table = (props) => {

  const { tableH, tableBody} = props;

  const renderTableHeader = (item, i) => {
    return <th key={i} style={{width: `${tableH[item]}` }}>{item}</th>
  };

  const renderTableBody = (item, i) => {
    return (
        props.clickAble ?
          <tr key={i} onClick={props.nextState} className="clickable-tableRow">
            {props.withCheckbox ? <td> <input type="checkbox" id={'Checkbox_'+i}/> </td> : null}
            {
              Object.keys(tableH).map((key, idx) => {
                return <td key={idx}> {item[key]} </td>
              })
            }
          </tr>
            :
          <tr key={i}>
            {props.withCheckbox ? <td> <input type="checkbox"/> </td> : null}
            {
              Object.keys(tableH).map((key, idx) => {
                return <td key={idx}> {item[key]} </td>
              })
            }
          </tr>
    );
  };

  return (
    <div className="Table">
      <table>
        <thead>
          <tr>
            {props.withCheckbox ? <th></th> : null}
            {Object.keys(tableH).map(renderTableHeader)}
          </tr>
        </thead>
        <tbody>
          {tableBody.map(renderTableBody)}
        </tbody>
      </table>
    </div>
  )
};

Table.propTypes = {
  tableH: PropTypes.object.isRequired,
  tableBody: PropTypes.array.isRequired,
  withCheckbox: PropTypes.boolean,
  clickAble: PropTypes.boolean
};

export default Table;
