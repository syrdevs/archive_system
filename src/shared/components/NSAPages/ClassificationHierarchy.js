import React, {Component} from 'react';
import AntTable from '../AntTable'
import { Button } from 'antd'

class ClassificationHierarchy extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      //expandedRowKeys: []
      selectedRow: null,
      selectedRowKey: '',
    }
  }
  //expandedRowRender = (o) => {
   // console.log(o);
  //}

  onTableRowExpand = (expanded, record) => {
    //console.log(expanded)
    //console.log(record)
    var keys = [];
    if(expanded){
        keys.push(record.key); // I have set my record.id as row key. Check the documentation for more details.
    }

    this.setState({expandedRowKeys: keys}, () => console.log(this.state.expandedRowKeys));
  }
  changeSelectedRow = (rec) => {
    console.log(rec);
    this.setState({
      selectedRow: rec,
      selectedRowKey: rec.key
    });
  }
  render() {
    const { loading } = this.state;

    const columns = [
      { title: 'Раздел', dataIndex: 'referenceName', key: 'referenceName' },
      { title: 'Индекс', dataIndex: 'indexSceme', key: 'indexSceme' },
      { title: 'Версия', dataIndex: 'spellVariant', key: 'spellVariant' }
    ];

    return(
      <div>
        <Button style={{margin:'5px'}}>{this.props.t('ADD_SECTION')}</Button>
        <Button style={{margin:'5px'}} disabled={this.state.selectedRowKey ===''}>{this.props.t('ADD_SUB_SECTION')}</Button>
        <Button style={{margin:'5px'}} disabled={this.state.selectedRowKey ===''}>{this.props.t('REMOVE')}</Button>
        <AntTable
          loading={loading}
          columns={columns}
          openedBy={'ClassificationHierarchy'}
          changeSelectedRow={this.changeSelectedRow}
          rowClassName={record => this.state.selectedRowKey === record.key ? 'row-selected' : ''}
          //expandedRowKeys={this.state.expandedRowKeys}
          onExpand={this.onTableRowExpand}
          //expandedRowRender={this.expandedRowRender}
          dataSource={this.props.data}
        />
      </div>
    )
  }
}

export default ClassificationHierarchy;