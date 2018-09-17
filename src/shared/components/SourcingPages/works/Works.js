import React from 'react';
import {Button, Input, Popconfirm, Icon, Dropdown, Menu, DatePicker, message} from 'antd';
import Select from 'react-select';
import SelectVirt from "react-virtualized-select";
import {connect} from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition'
import moment from 'moment';

import {SYSTEM_LANG_ARRAY} from '../../../constants/constants';
import AntTable from '../../AntTable';
import SiderCard from './SiderCard';
import {isEmpty, isEqual, map} from 'lodash';
import {
  CUBE_FOR_WORKS, WORK_PRIORITY, WORK_STATUS, DO_FOR_WORKS, CHECKING_TYPE, DP_FOR_WORKS
} from '../../../constants/tofiConstants';
import {createObj, dObj, getAllObjOfCls, getCube, getPropVal, updateCubeData} from '../../../actions/actions';
import {getPropMeta, parseCube_new} from '../../../utils/cubeParser';

/*eslint eqeqeq:0*/
class Works extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      priority: [],
      workPriorityLoading: false,
      status: [],
      workStatusSourceLoading: false,
      sourcing: null,
      form: null,
      search: {
        workPlannedStartDate: {
          dbeg: moment().subtract(1, 'w'),
          dend: moment().add(1, 'w')
        },
        workPlannedEndDate: {
          dbeg: null,
          dend: null
        },
        workActualStartDate: {
          dbeg: null,
          dend: null
        },
        workActualEndDate: {
          dbeg: null,
          dend: null
        },
        acceptanceDate: {
          dbeg: null,
          dend: null
        },
        workType: '',
        workSource: '',
        workPriority: '',
        workStatusSource: '',
        workAssignedToSource: ''
      },
      openCard: false,
      selectedRow: null,
      performer: [],
      workAssignedToSourceLoading: false,
      initialValues: {},
      loading: false
    }
  }

  onPriorityChange = s => {this.setState({priority: s})};
  onStatusChange = s => {this.setState({status: s})};
  onSourcingChange = s => {this.setState({sourcing: s})};
  onPerformerChange = s => {this.setState({performer: s})};

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)){
      this.setState({ selectedRow: rec })
    } else {
      const initialValues = {
        key: rec.key,
        workListName: rec.workListNameObj,
        workType: rec.workType,
        workPlannedEndDate: rec.workPlannedEndDateObj,
        workPriority: rec.workPriority,
        workStatusSource: rec.workStatusSource,
        workSource: rec.workSource,
        checkingType: rec.checkingType,
        workAuthor: rec.workAuthor,
        workDate: rec.workDate,
        workAssignedTo: rec.workAssignedTo,
        workPlannedStartDate: rec.workPlannedStartDateObj,
        workActualStartDate: rec.workActualStartDateObj,
        workActualEndDate: rec.workActualEndDateObj,
        acceptanceDate: rec.acceptanceDateObj
      };
      this.setState({ initialValues, openCard: true, selectedRow: rec })
    }
  };

  openCard = () => {
    this.setState({
      openCard: true,
      initialValues: {
        workAuthor: this.props.user.name,
        workDate: moment().startOf('day'),
        workStatusSource: {value: this.props.tofiConstants.appointed.id, label: this.props.tofiConstants.appointed.name[this.lng]}}
    })
  };

  closeCard = () => {
    this.setState({ openCard: false })
  };

  onDateChange = (name, dateType) => {
    return date => {
      this.setState({search: {...this.state.search, [name]: {...this.state.search[name], [dateType]: date}}})
    }
  };

  componentDidMount() {
    this.getCubeAct();
  }

  getCubeAct = () => {
    this.setState({loading: true});
    this.filters = {
      filterDOAnd: [
        {
          dimConst: DO_FOR_WORKS,
          concatType: "and",
          conds: [
            {
              clss: "createAndEditFundmaker,createAndEditNomen,createAndEditInv,check,createAndEditDocuments,createPassport,advising"
            }
          ]
        }
      ]
    };
    this.props.getCube(CUBE_FOR_WORKS, JSON.stringify(this.filters))
  };

  componentDidUpdate(prevProps) {
    if(isEmpty(this.props.tofiConstants)) return;
    const {tofiConstants: {doForWorks, dpForWorks}} = this.props;
    if(prevProps.works !== this.props.works) {
      try {
       this.setState(
         {
           loading: false,
           data: parseCube_new(
             this.props.works['cube'],
             [],
             'dp',
             'do',
             this.props.works[`do_${doForWorks.id}`],
             this.props.works[`dp_${dpForWorks.id}`],
             `do_${doForWorks.id}`,
             `dp_${dpForWorks.id}`).map(this.renderTableData)
         }
       );
      } catch(err) {
        console.log(err);
        this.setState({ loading: false, data: [] })
      }
    }
  }

  stopPropagation = e => {
    e.stopPropagation();
  };

  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({[c+'Loading']: true});
        this.props.getPropVal(c)
          .then(() => this.setState({[c+'Loading']: false}))
      }
    }
  };
  getAllObjOfCls = (cArr, dte = moment().format('YYYY-MM-DD')) => {
    return () => {
      cArr.forEach(c => {
        if(!this.props[c + 'Options']) {
          this.setState({[c+'Loading']: true});
          this.props.getAllObjOfCls(c, dte)
            .then(() => this.setState({[c+'Loading']: false}))
        }
      });
    }
  };

  onCreateObj = ({workType ,...rest}) => {
    const { workSource } = rest;

    const cube = {
      cubeSConst: CUBE_FOR_WORKS
    };

    const name = {};
    SYSTEM_LANG_ARRAY.forEach(lang => {
      name[lang] = (workType ? workType.label : '') + ' ' +
        (workSource ? workSource.label : '')
    });
    const obj = {
      name,
      fullName: name,
      clsConst: workType.workTypeClass,
    };

    const hideCreateObj = message.loading('CREATING_NEW_OBJECT', 0);
    createObj(cube, obj)
      .then(res => {
        hideCreateObj();
        if(res.success) {
          this.onSaveCubeData(rest, res.data.idItemDO, {})
        } else {
          if(res.errors) {
            res.errors.forEach(err => {
              message.error(err.text)
            })
          }
        }
      });
  };

  onSaveCubeData = (values, doItemProp, objDataProp) => {

    const name = {};
    if(!doItemProp) {
      const { selectedRow: {workType, workSource} } = this.state;
      SYSTEM_LANG_ARRAY.forEach(lang => {
        name[lang] = (workType ? workType.label : '') + ' ' +
          (workSource ? workSource.label : '')
      });
    }
    let datas = [];
    try {
      datas = [{
        own: [{doConst: DO_FOR_WORKS, doItem: (doItemProp || this.state.selectedRow.key), isRel: "0", objData: (objDataProp || {name: name, fullName: name }) }],
        props: map(values, (val, key) => {
          const propMetaData = getPropMeta(this.props.works["dp_" + this.props.tofiConstants[DP_FOR_WORKS].id], this.props.tofiConstants[key]);
          let value = val;
          if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {kz: val, ru: val, en: val};
          if(val && typeof val === 'object' && val.value) value = String(val.value);
          if(val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
          if(propMetaData.isUniq === 2 && val[0].value) {
            propMetaData.mode = val[0].mode;
            value = val.map(v => String(v.value)).join(",");
          }
          return {propConst: key, val: value, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq), mode: propMetaData.mode}
        }),
        periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
      }];
    } catch(err) {
      console.log(err);
    }
    const hideLoading = message.loading('UPDATING_PROPS', 30);
    return updateCubeData(CUBE_FOR_WORKS, moment().format('YYYY-MM-DD'), JSON.stringify(datas))
      .then(res => {
        hideLoading();
        if(res.success) {
          message.success('PROPS_SUCCESSFULLY_UPDATED');
          this.setState({loading: true});
          return this.props.getCube(CUBE_FOR_WORKS, JSON.stringify(this.filters))
            .then(() => {
              this.setState({loading: false});
              return {success: true}
            })
        } else {
          message.error('PROPS_UPDATING_ERROR');
          if(res.errors) {
            res.errors.forEach(err => {
              message.error(err.text);
              return {success: false}
            })
          }
        }
      })
  };

  onInputChange = e => {
    this.setState({
      search: {
        ...this.state.search,
        [e.target.name]: e.target.value
      }
    })
  };
  emitEmpty = e => {
    this.setState({search: {
      ...this.state.search,
      [e.target.dataset.name]: ''
    }})
  };

  addSpecialDate = (key, name) => {
    return e => {
      e.stopPropagation();
      const newData = this.state.data.slice();
      const target = newData.find(el => el.key === key);
      if(target) {
        if(name === 'workActualStartDate') {
          this.onSaveCubeData({workStatusSource: {value: this.props.tofiConstants.during.id}, [name]: moment().format('YYYY-MM-DD')}, key, {})
            .then(res => {
              if(res.success) {
                if(target.workType.value === this.props.tofiConstants.check.id) {
                  this.props.history.push(`/sourcing/works/checking/${target.workSource}`)
                }
              }
            });
        } else if(name === 'workActualEndDate') {
          this.onSaveCubeData({workStatusSource: {value: this.props.tofiConstants.completed.id}, [name]: moment().format('YYYY-MM-DD')}, key, {})
        } else if(name === 'acceptanceDate') {
          this.onSaveCubeData({workStatusSource: {value: this.props.tofiConstants.accepted.id}, [name]: moment().format('YYYY-MM-DD')}, key, {})
        } else if(name === 'notAccepted') {
          this.onSaveCubeData({workStatusSource: {value: this.props.tofiConstants.notAccepted.id}, acceptanceDate: moment().format('YYYY-MM-DD')}, key, {})
        }
      }
      this.setState({ data: newData });
    };
  };

  renderTableData = (item, idx) => {
    const workTypeClasses = ['createAndEditFundmaker','createAndEditNomen','createAndEditInv','check','createAndEditDocuments','createPassport','advising'];
    const { workPlannedEndDate, workStatusSource, workAuthor, workSource,
      workPriority, workDate, workAssignedTo, workPlannedStartDate, workActualStartDate, workActualEndDate, acceptanceDate, checkingType } = this.props.tofiConstants;
    const workPlannedEndDateObj = item.props.find(element => element.prop == workPlannedEndDate.id),
      workStatusSourceObj = item.props.find(element => element.prop == workStatusSource.id),
      workAuthorObj = item.props.find(element => element.prop == workAuthor.id),
      workPriorityObj = item.props.find(element => element.prop == workPriority.id),
      workDateObj = item.props.find(element => element.prop == workDate.id),
      workAssignedToObj = item.props.find(element => element.prop == workAssignedTo.id),
      workPlannedStartDateObj = item.props.find(element => element.prop == workPlannedStartDate.id),
      workActualStartDateObj = item.props.find(element => element.prop == workActualStartDate.id),
      workActualEndDateObj = item.props.find(element => element.prop == workActualEndDate.id),
      acceptanceDateObj = item.props.find(element => element.prop == acceptanceDate.id),
      checkingTypeObj = item.props.find(element => element.prop == checkingType.id),
      workSourceObj = item.props.find(element => element.prop == workSource.id),
      workTypeClass = workTypeClasses.find(cls => this.props.tofiConstants[cls].id == item.clsORtr);

    return {
      key: item.id,
      numb: idx + 1,
      // workListName: !!item.name ? item.name[this.lng] || '' : '',
      workType: workTypeClass ? {value: this.props.tofiConstants[workTypeClass].id, label: this.props.tofiConstants[workTypeClass].name[this.lng], workTypeClass} : null,
      workPlannedStartDate: !!workPlannedStartDateObj ? workPlannedStartDateObj.value || '' : '',
      workPlannedStartDateObj: !!workPlannedStartDateObj && workPlannedStartDateObj.value ? moment(workPlannedStartDateObj.value, 'DD-MM-YYYY') : null,
      workPlannedEndDate: !!workPlannedEndDateObj ? workPlannedEndDateObj.value || '' : '',
      workPlannedEndDateObj: !!workPlannedEndDateObj && workPlannedEndDateObj.value ? moment(workPlannedEndDateObj.value, 'DD-MM-YYYY') : null,
      workStatusSource: workStatusSourceObj && workStatusSourceObj.refId ? {value: workStatusSourceObj.refId, label: workStatusSourceObj.value} : null,
      checkingType: checkingTypeObj && checkingTypeObj.refId ? {value: checkingTypeObj.refId, label: checkingTypeObj.value} : null,
      workListNameObj: item.name,
      workPriority: workPriorityObj && workPriorityObj.refId ? {value: workPriorityObj.refId, label: workPriorityObj.value} : null,
      workSource: !!workSourceObj && workSourceObj.cube && workSourceObj.cube.idRef ? { value: workSourceObj.cube.idRef, label: workSourceObj.cube.name[this.lng] } : null,
      workAuthor: !!workAuthorObj ? workAuthorObj.value || '' : '',
      workDate: !!workDateObj && workDateObj.value ? moment(workDateObj.value, 'DD-MM-YYYY') : null,
      workAssignedTo: !!workAssignedToObj && workAssignedToObj.cube.idRef ? {value: workAssignedToObj.cube.idRef, label: workAssignedToObj.cube.name[this.lng]} : null,
      workActualStartDate: !!workActualStartDateObj ? workActualStartDateObj.value || '' : '',
      workActualStartDateObj: !!workActualStartDateObj && workActualStartDateObj.value ? moment(workActualStartDateObj.value, 'DD-MM-YYYY') : null,
      workActualEndDate: !!workActualEndDateObj ? workActualEndDateObj.value || '' : '',
      workActualEndDateObj: !!workActualEndDateObj && workActualEndDateObj.value ? moment(workActualEndDateObj.value, 'DD-MM-YYYY') : null,
      acceptanceDate: !!acceptanceDateObj ? acceptanceDateObj.value || '' : '',
      acceptanceDateObj: !!acceptanceDateObj && acceptanceDateObj.value ? moment(acceptanceDateObj.value, 'DD-MM-YYYY') : null
    }
  };

  menu = (
    <Menu>
      <Menu.Item key="first">{this.props.t('REPORT_1')}</Menu.Item>
      <Menu.Item key="second">{this.props.t('REPORT_2')}</Menu.Item>
    </Menu>
  );
  content = (
    <div className="comment-content">
      <Input.TextArea rows={4} />
      <span>
        <a onClick={() => console.log('ok')}><Icon type="check"/></a>
        <Popconfirm title="Отменить?" onConfirm={() => console.log('cancel')}>
          <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
        </Popconfirm>
      </span>
    </div>
  );

  render() {
    const { search, loading, performer, status, priority, workPriorityLoading, workStatusSourceLoading, workAssignedToSourceLoading, data } = this.state;
    const { t, tofiConstants } = this.props;
    if(isEmpty(tofiConstants)) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { workPlannedStartDate, workPlannedEndDate, workActualStartDate, workActualEndDate, acceptanceDate, workSource } = tofiConstants;

    this.filteredData = data.filter(item => {
      return (
        // item.numb === Number(search) ||
        ( item.workType ? item.workType.label.toLowerCase().includes(search.workType.toLowerCase()) : search.workType === '' ) &&
        ( item.workSource ? item.workSource.label.toLowerCase().includes(search.workSource.toLowerCase()) : search.workSource === '' ) &&
        ( priority.length === 0  || priority.some(p => (item.workPriority && p.value == item.workPriority.value)) ) &&
        ( status.length === 0  || status.some(p => (item.workStatusSource && p.value == item.workStatusSource.value)) ) &&
        ( performer.length === 0  || performer.some(p => (item.workAssignedTo && p.value == item.workAssignedTo.value)) ) &&
        ( !search.workPlannedStartDate.dbeg || moment(item.workPlannedStartDate, 'DD-MM-YYYY').isSameOrAfter(search.workPlannedStartDate.dbeg, 'day') ) &&
        ( !search.workPlannedStartDate.dend || moment(item.workPlannedStartDate, 'DD-MM-YYYY').isSameOrBefore(search.workPlannedStartDate.dend, 'day') ) &&
        ( !search.workPlannedEndDate.dbeg || moment(item.workPlannedEndDate, 'DD-MM-YYYY').isSameOrAfter(search.workPlannedEndDate.dbeg, 'day') ) &&
        ( !search.workPlannedEndDate.dend || moment(item.workPlannedEndDate, 'DD-MM-YYYY').isSameOrBefore(search.workPlannedEndDate.dend, 'day') ) &&
        ( !search.workActualStartDate.dbeg || moment(item.workActualStartDate, 'DD-MM-YYYY').isSameOrAfter(search.workActualStartDate.dbeg, 'day') ) &&
        ( !search.workActualStartDate.dend || moment(item.workActualStartDate, 'DD-MM-YYYY').isSameOrBefore(search.workActualStartDate.dend, 'day') ) &&
        ( !search.workActualEndDate.dbeg || moment(item.workActualEndDate, 'DD-MM-YYYY').isSameOrAfter(search.workActualEndDate.dbeg, 'day') ) &&
        ( !search.workActualEndDate.dend || moment(item.workActualEndDate, 'DD-MM-YYYY').isSameOrBefore(search.workActualEndDate.dend, 'day') ) &&
        ( !search.acceptanceDate.dbeg || moment(item.acceptanceDate, 'DD-MM-YYYY').isSameOrAfter(search.acceptanceDate.dbeg, 'day') ) &&
        ( !search.acceptanceDate.dend || moment(item.acceptanceDate, 'DD-MM-YYYY').isSameOrBefore(search.acceptanceDate.dend, 'day') )
      )
    });

    return (
      <div className="Works">
        <div className="title">
          <h2>Работы по комплектованию</h2>
        </div>
        <div className="Works__heading">
          <div className="table-header">
            <Button onClick={this.openCard}>{this.props.t('ADD')}</Button>
            <div className="label-select">
              <Select
                name="priority"
                multi
                searchable={false}
                value={priority}
                onChange={this.onPriorityChange}
                isLoading={workPriorityLoading}
                options={this.props.workPriorityOptions ? this.props.workPriorityOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('PRIORITY')}
                onOpen={this.loadOptions(WORK_PRIORITY)}
              />
            </div>
            <div className="label-select">
              <Select
                name="status"
                multi
                searchable={false}
                value={status}
                onChange={this.onStatusChange}
                isLoading={workStatusSourceLoading}
                options={this.props.workStatusSourceOptions ? this.props.workStatusSourceOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('STATUS')}
                onOpen={this.loadOptions(WORK_STATUS)}
              />
            </div>
            <div className="label-select">
              <SelectVirt
                name="performer"
                multi
                searchable
                className="long-selected-menu"
                // async
                isLoading={workAssignedToSourceLoading}
                onOpen={this.getAllObjOfCls(['workAssignedToSource'])}
                optionHeight={40}
                value={performer}
                onChange={this.onPerformerChange}
                options={this.props.workAssignedToSourceOptions ? this.props.workAssignedToSourceOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('PERFORMER')}
              />
            </div>
            <div className="label-select">
              <Dropdown overlay={this.menu} trigger={['click']}>
                <Button style={{ marginLeft: 8 }}>
                  {this.props.t('REPORT')} <Icon type="printer" />
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="Works__body">
          <AntTable
            loading={loading}
            columns={[
              {
                key: 'numb',
                title: '№',
                dataIndex: 'numb',
                width: '5%'
              },
              {
                key: 'workType',
                title: t('WORK_TYPE'),
                dataIndex: 'workType',
                width: '15%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="workType"
                      suffix={search.workType ? <Icon type="close-circle" data-name="workType" onClick={this.emitEmpty} /> : null}
                      ref={ele => this.workType = ele}
                      placeholder="Поиск"
                      value={search.workType}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: search.workType ? '#ff9800' : '#aaa' }} />,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.workType.focus());
                },
                render: text => text ? text.label : ''
              },
              {
                key: 'workSource',
                title: workSource.name[this.lng],
                dataIndex: 'workSource',
                width: '15%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="workSource"
                      suffix={search.workSource ? <Icon type="close-circle" data-name="workSource" onClick={this.emitEmpty} /> : null}
                      ref={ele => this.workSource = ele}
                      placeholder="Поиск"
                      value={search.workSource}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: search.workSource ? '#ff9800' : '#aaa' }} />,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.workSource.focus());
                },
                render: text => (text ? text.label : '')
              },
              {
                key: 'workPlannedStartDate',
                title: workPlannedStartDate.name[this.lng],
                dataIndex: 'workPlannedStartDate',
                width: '10%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <div className="flex">
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.search.workPlannedStartDate.dbeg}
                        style={{marginRight: '16px'}}
                        showToday={false}
                        onChange={this.onDateChange('workPlannedStartDate', 'dbeg')}
                      />
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.search.workPlannedStartDate.dend}
                        showToday={false}
                        onChange={this.onDateChange('workPlannedStartDate', 'dend')}
                      />
                    </div>
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: (search.workPlannedStartDate.dbeg || search.workPlannedStartDate.dend) ? '#ff9800' : '#aaa' }} />
              },
              {
                key: 'workPlannedEndDate',
                title: workPlannedEndDate.name[this.lng],
                dataIndex: 'workPlannedEndDate',
                width: '12%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <div className="flex">
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.search.workPlannedEndDate.dbeg}
                        style={{marginRight: '16px'}}
                        showToday={false}
                        onChange={this.onDateChange('workPlannedEndDate', 'dbeg')}
                      />
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.search.workPlannedEndDate.dend}
                        showToday={false}
                        onChange={this.onDateChange('workPlannedEndDate', 'dend')}
                      />
                    </div>
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: (search.workPlannedEndDate.dbeg || search.workPlannedEndDate.dend) ? '#ff9800' : '#aaa' }} />
              },
              {
                key: 'workActualStartDate',
                title: workActualStartDate.name[this.lng],
                dataIndex: 'workActualStartDate',
                width: '13%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <div className="flex">
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.search.workActualStartDate.dbeg}
                        style={{marginRight: '16px'}}
                        showToday={false}
                        onChange={this.onDateChange('workActualStartDate', 'dbeg')}
                      />
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.search.workActualStartDate.dend}
                        showToday={false}
                        onChange={this.onDateChange('workActualStartDate', 'dend')}
                      />
                    </div>
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: (search.workActualStartDate.dbeg || search.workActualStartDate.dend) ? '#ff9800' : '#aaa' }} />,
                render: (text, record) => {
                  return (
                    text ?
                      <div className="editable-cell-text-wrapper">
                        {/*<Popover placement="bottomLeft" title='COMMENTARY' content={this.content} trigger="click" defaultVisible destroyPopupOnHide>
                          <span onClick={this.stopPropagation}>{text || ' '}</span>
                        </Popover>*/}
                        {text || ' '}
                        <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() =>
                          this.onSaveCubeData({workStatusSource: {value: this.props.tofiConstants.appointed.id}, workActualStartDate: {mode: "del"}}, record.key, {})
                        }>
                          <Icon
                            type="close-circle"
                            className="editable-cell-icon"
                            onClick={this.stopPropagation}
                          />
                        </Popconfirm>
                      </div>
                      :
                      <div className="editable-row-operations">
                        <Button title="Начать" icon="play-circle" onClick={this.addSpecialDate(record.key, 'workActualStartDate')} className='green-btn'/>
                        {/*<Button title="CANCEL" icon="close" onClick={this.addSpecialDate(record.key, 'workActualStartDate', 'red')} className='green-btn'/>*/}
                      </div>
                  )
                }
              },
              {
                key: 'workActualEndDate',
                title: workActualEndDate.name[this.lng],
                dataIndex: 'workActualEndDate',
                width: '13%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <div className="flex">
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.search.workActualEndDate.dbeg}
                        style={{marginRight: '16px'}}
                        showToday={false}
                        onChange={this.onDateChange('workActualEndDate', 'dbeg')}
                      />
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.search.workActualEndDate.dend}
                        showToday={false}
                        onChange={this.onDateChange('workActualEndDate', 'dend')}
                      />
                    </div>
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: (search.workActualEndDate.dbeg || search.workActualEndDate.dend) ? '#ff9800' : '#aaa' }} />,
                render: (text, record) => {
                  return (
                    text ?
                      <div className="editable-cell-text-wrapper">
                        {text || ' '}
                        <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() =>
                          this.onSaveCubeData({workStatusSource: {value: this.props.tofiConstants.during.id}, workActualEndDate: {mode: "del"}}, record.key, {})
                        }>
                          <Icon
                            type="close-circle"
                            className="editable-cell-icon"
                            onClick={this.stopPropagation}
                          />
                        </Popconfirm>
                      </div>
                      :
                      <div className="editable-row-operations">
                        <Button title="Завершить" icon="poweroff" onClick={this.addSpecialDate(record.key, 'workActualEndDate')} className='green-btn'/>
                        {/*<Button title="CANCEL" icon="close" onClick={this.addSpecialDate(record.key, 'workActualEndDate')} className='green-btn'/>*/}
                      </div>
                  )
                }
              },
              {
                key: 'acceptanceDate',
                title: acceptanceDate.name[this.lng],
                dataIndex: 'acceptanceDate',
                width: '11%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <div className="flex">
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.search.acceptanceDate.dbeg}
                        style={{marginRight: '16px'}}
                        showToday={false}
                        onChange={this.onDateChange('acceptanceDate', 'dbeg')}
                      />
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.search.acceptanceDate.dend}
                        showToday={false}
                        onChange={this.onDateChange('acceptanceDate', 'dend')}
                      />
                    </div>
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: (search.acceptanceDate.dbeg || search.acceptanceDate.dend) ? '#ff9800' : '#aaa' }} />,
                render: (text, record) => {
                  return (
                    text ?
                      <div className="editable-cell-text-wrapper">
                        <span style={record.workStatusSource && record.workStatusSource.value == this.props.tofiConstants.accepted.id ? {color: 'green'} : {color: 'red'}}>{text || ' '}</span>
                        <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() =>
                          this.onSaveCubeData({workStatusSource: {value: this.props.tofiConstants.completed.id}, acceptanceDate: {mode: "del"}}, record.key, {})
                        }>
                          <Icon
                            type="close-circle"
                            className="editable-cell-icon"
                            onClick={this.stopPropagation}
                          />
                        </Popconfirm>
                      </div>
                      :
                      <div className="editable-row-operations">
                        <Button title="Принять" icon="check-circle" className='green-btn' onClick={this.addSpecialDate(record.key, 'acceptanceDate')} />
                        <Button title="CANCEL" icon="close" onClick={this.addSpecialDate(record.key, 'notAccepted')} className='green-btn'/>
                      </div>
                  )
                }
              },
              {
                key: 'action',
                title: '',
                dataIndex: 'action',
                width: '5%',
                render: (text, record) => {
                  return (
                    <div className="editable-row-operations">
                      <span>
                        <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                          const fd = new FormData();
                          fd.append("cubeSConst", CUBE_FOR_WORKS);
                          fd.append("dimObjConst", DO_FOR_WORKS);
                          fd.append("objId", record.key.split('_')[1]);
                          const hideLoading = message.loading('REMOVING', 30);
                          dObj(fd)
                            .then(res => {
                              hideLoading();
                              if(res.success) {
                                message.success('SUCCESSFULLY_REMOVED');
                                this.getCubeAct()
                              } else {
                                throw res
                              }
                            }).catch(err => {
                              console.log(err);
                              message.error('REMOVING_ERROR')
                          })
                        }}>
                          <Button title="Удалить" icon="delete" onClick={this.stopPropagation} disabled={!!record.workActualStartDate} className='green-btn yellow-bg'/>
                        </Popconfirm>
                      </span>
                    </div>
                  );
                },
              }
            ]}
            dataSource={this.filteredData}
            changeSelectedRow={this.changeSelectedRow}
            openedBy="Works"
            // size="small"
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard t={t} tofiConstants={tofiConstants} initialValues={this.state.initialValues}
                       closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}
                       onCreateObj={this.onCreateObj} onSaveCubeData={this.onSaveCubeData}
            />
          </CSSTransition>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants,
    works: state.cubes[CUBE_FOR_WORKS],
    workPriorityOptions: state.generalData[WORK_PRIORITY],
    workStatusSourceOptions: state.generalData[WORK_STATUS],
    workAssignedToSourceOptions: state.generalData.workAssignedToSource,
    checkingTypeOptions: state.generalData[CHECKING_TYPE],
    user: state.auth.user
  }
}

export default connect(mapStateToProps, {getCube, getPropVal, getAllObjOfCls})(Works);