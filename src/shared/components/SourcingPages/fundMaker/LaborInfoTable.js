import React from 'react';
import {Table, Input, Popconfirm, Button, Icon, message} from 'antd';
import { map } from 'lodash';

import {four_digits} from '../../../utils/form_normalizing';
import {CUBE_FOR_FUND_AND_IK, DO_FOR_FUND_AND_IK} from '../../../constants/tofiConstants';
import {getPropMeta} from '../../../utils/cubeParser';
import moment from 'moment';
import {updateCubeData} from '../../../actions/actions';

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

const EditableYearCell = ({ editable, value: {personLaborBeginYear, personLaborEndYear}, onChange }) => (
    editable
      ? <div style={{display: 'flex', alignItems: 'center'}}>
          <Input style={{ margin: '-5px 0' }} size='small' value={personLaborBeginYear} onChange={onChange} name="personLaborBeginYear" placeholder="yyyy"/>
          <span> - </span>
          <Input style={{ margin: '-5px 0' }} size='small' value={personLaborEndYear} onChange={onChange} name="personLaborEndYear" placeholder="yyyy"/>
      </div>
      : <span>{personLaborBeginYear} - {personLaborEndYear}</span>
);

/*const EditCell = ({ value, onChange, record: {editable, key} }) => (
  editable
    ?
    <div>
      <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      <span>
        <a onClick={() => this.save(key)}><Icon type="check"/></a>
        <Popconfirm title="Отменить?" onConfirm={() => this.cancel(key)}>
          <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
        </Popconfirm>
      </span>
    </div>
    :
    <div>
      <span>value</span>
      <span>
        <a><Icon type="edit" className="editable-cell-icon" onClick={() => this.edit(key)}/></a>
        <a style={{color: '#f14c34', marginLeft: '10px'}}><Icon type="delete" className="editable-cell-icon" onClick={() => this.edit(key)}/></a>
      </span>
    </div>
);*/

class LaborInfoTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  renderColumnYears(obj, record, column) {
    return <EditableYearCell
      editable={record.editable}
      value={obj}
      onChange={e => this.handleChangeYears(e, record.key, column)}
    />
  }
  handleChangeYears(e, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column][e.target.name] = four_digits(e.target.value);
      this.setState({ data: newData });
    }
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      const { years, key, editable, ...rest } = target;
      const values = { personLaborBeginYear: years.personLaborBeginYear, personLaborEndYear: years.personLaborEndYear, ...rest};
      const datas = [{
        own: [{doConst: DO_FOR_FUND_AND_IK, doItem: this.props.recKey, isRel: "0", objData: {}}],
        props: [{propConst: 'personLaborActivity', val: {kz: `${this.props.recKey}_laborActivity`, ru: `${this.props.recKey}_laborActivity`, en: `${this.props.recKey}_laborActivity`}, typeProp: '71', periodDepend: "0", isUniq: '2', mode: 'ins'},
          ...map(values, (val, key) => {
            const propMetaData = getPropMeta(this.props.LPdimObj, this.props.tofiConstants[key]);
            let value = val;
            if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {kz: val, ru: val, en: val};
            if(typeof val === 'object' && val.value) value = String(val.value);
            if(propMetaData.isUniq === 2 && val[0].value) {
              value = val.map(v => String(v.value)).join(",");
            }
            return {
              propConst: key,
              val: value,
              typeProp: String(propMetaData.typeProp),
              periodDepend: String(propMetaData.periodDepend),
              isUniq: String(propMetaData.isUniq),
              parentPropConst: 'personLaborActivity'
            }
          })
        ],
        periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
      }];
      const hideLoading = message.loading('UPDATING_PROPS', 0);
      return updateCubeData(CUBE_FOR_FUND_AND_IK, moment().format('YYYY-MM-DD'), JSON.stringify(datas))
        .then(res => {
          hideLoading();
          if(res.success) {
            message.success('PROPS_SUCCESSFULLY_UPDATED');
            delete target.editable;
            this.setState({ data: newData });
          } else {
            message.error('PROPS_UPDATING_ERROR');
            if(res.errors) {
              res.errors.forEach(err => {
                message.error(err.text);
              });
              return {success: false}
            }
          }
        })
    }
  }
  remove = key => {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({data: newData});
  };
  cancel = key => {
    const newData = [...this.state.data];
    if(key.includes('newData')) {
      this.setState({ data: newData.filter(item => item.key !== key) });
      return;
    }
    const target = newData.find(item => key === item.key);
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
    }
  };
  renderTableHeader = () => {
    return (
      <div className="flex">
        <Button
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          type="primary"
          shape='circle'
          icon='plus'
          onClick={() =>
            this.setState({
              data: [
                ...this.state.data,
                {
                  key: `newData_${this.state.data.length}`,
                  editable: true,
                  years: {
                    personLaborBeginYear: '',
                    personLaborEndYear: ''
                  },
                  personLaborPosition: '',
                  personLaborOrg: ''
                }]
            })}/>
      </div>
    )
  };
  render() {
    const { personLaborPosition, personLaborOrg } = this.props.tofiConstants;
    const lng = localStorage.getItem('i18nextLng');
    return <Table
      bordered
      columns={[
        {
          key: 'years',
          title: <div dangerouslySetInnerHTML={{__html:this.props.year && this.props.year[lng]}}></div>,
          dataIndex: 'years',
          width: '20%',
          render: (obj, record) => this.renderColumnYears(obj, record, 'years'),
        }, {
          key: 'personLaborPosition',
          title: personLaborPosition.name[lng],
          dataIndex: 'personLaborPosition',
          width: '35%',
          render: (text, record) => this.renderColumns(text, record, 'personLaborPosition'),
        }, {
          key: 'personLaborOrg',
          title: personLaborOrg.name[lng],
          dataIndex: 'personLaborOrg',
          widht: '35%',
          render: (text, record) => this.renderColumns(text, record, 'personLaborOrg'),
        }, {
          key: 'action',
          title: '',
          dataIndex: '',
          width: '10%',
          render: (text, record) => {
            const { editable, personLaborPosition, personLaborOrg, years: {personLaborBeginYear, personLaborEndYear} } = record;
            const disable = !personLaborPosition | !personLaborOrg | !personLaborBeginYear | !personLaborEndYear;
            return (
              <div className="editable-row-operations">
                {
                  editable ?
                    <span>
                      <a onClick={() => this.save(record.key)} disabled={disable}><Icon type="check"/></a>
                      <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key)}>
                        <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                      </Popconfirm>
                    </span>
                    : <span>
                      <a><Icon type="edit" style={{fontSize: '14px'}} onClick={() => this.edit(record.key)}/></a>
                      <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key)}>
                        <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}}><Icon type="delete" className="editable-cell-icon"/></a>
                      </Popconfirm>
                    </span>
                }
              </div>
            );
          },
        }
      ]}
      dataSource={this.state.data}
      size='small'
      title={this.renderTableHeader}
      pagination={false}
      scroll={{y: 500}}
      style={{height: 'auto', minHeight: 'unset', marginLeft: '5px'}}
    />;
  }
}

export default LaborInfoTable;