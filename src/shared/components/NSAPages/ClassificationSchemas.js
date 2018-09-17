import React from 'react';
import {Button, Icon, Table as AntTable, DatePicker, Input, Popconfirm, message} from 'antd';
import SelectVirt from 'react-virtualized-select';
import SiderCard from './_SiderCard';
//import AntTable from '../AntTable'
import AntModal from '../AntModal';
import {connect} from 'react-redux';
import moment from "moment";
import CSSTransition from "react-transition-group/CSSTransition";
import {isEmpty, isEqual, map, orderBy} from "lodash";
import { SYSTEM_LANG_ARRAY } from '../../constants/constants';
import {createObj, getCube, getObjByObjVal, updateCubeData} from '../../actions/actions';
import {getPropMeta, parseCube_new} from '../../utils/cubeParser';

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);
const EditableDatePicker = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <DatePicker style={{ margin: '-5px 0' }} format="DD-MM-YYYY" value={value ? moment(value, 'DD-MM-YYYY') : null} onChange={e => onChange(e)} />
      : value
    }
  </div>
);
const EditableSelect = ({ editable, value, onChange, getObjByObjVal, idRef, options }) => (
  <div>
    {editable
      ? <SelectVirt
        style={{ margin: '-5px 0' }}
        value={value}
        onChange={e => onChange(e)}
        options={options}
        optionHeight={40}
      />
      : value ? value.label : ''
    }
  </div>
);

class ClassificationSchemas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTablePage: null,
      selectedTableRowKey: '',
      data: [],
      dataChildren: [],
      loading: false,
      openCard: false,
      openNewRec: false,
      initialValues: {},
      selectedRow: null,
      search: '',
      newRec: {
        referenceName: '',
        referenceType: ''
      },
      sidbarActiveKey: 'description',
    }
  }

  changeSelectedRow = (rec,openAtOnce) => {
    //console.log(rec);
    if (rec.editable) {
      const { openCard } = this.state; 
      if (openCard) this.setState({openCard: false});
      return;
    }
    if (this.state.data[0].editable) return;
    const recEdit = {
      referenceName: rec.referenceName,
      referenceType: rec.referenceType.label,
      vidGuidebook: rec.vidGuidebook, 
      vidKatalog: rec.vidKatalog, 
      vidUkaz: rec.vidUkaz, 
      vidObzora: rec.vidObzora,
      theme: rec.theme,
      group: rec.group,
      goalSprav: rec.goalSprav,
      method: rec.method,
      metodikaText: rec.metodikaText,
      approvalDateMetodika: rec.approvalDateMetodika,
      protocol: rec.protocol,
      lastChangeDateScheme: rec.lastChangeDateScheme,
      changesAuthor: rec.changesAuthor,
    }
    
    if (openAtOnce === true) {
      this.setState({ initialValues: recEdit, openCard: true, sidbarActiveKey: 'description', selectedRow: rec, selectedTableRowKey: rec.key })
      return;
    }
    
    if((isEmpty(this.state.selectedRow) && !this.state.openCard) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)){
      this.setState({ selectedRow: rec, selectedTableRowKey: rec.key })
    } else {
      this.setState({ initialValues: recEdit, openCard: true, sidbarActiveKey: 'description', selectedRow: rec, selectedTableRowKey: rec.key })
    }
  };

  componentDidMount(){
    if (isEmpty(this.props.tofiConstants)) return;
      
    this.filters = {
      filterDOAnd: [
        {
          dimConst: 'doForSchemClas',
          concatType: "and",
          conds: [
            {
              clss: 'clsPutev,clsKatalog,clsUkaz,clsObzor'
            }
          ] 
        }
      ]
    };    
    this.props.getCube('csClassificationShem', JSON.stringify(this.filters));
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.csClassificationShem) && !isEmpty(nextProps.tofiConstants) && this.props.csClassificationShem !== nextProps.csClassificationShem) {
      const { doForSchemClas, dpForSchemClas } = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: orderBy(parseCube_new(
            nextProps.csClassificationShem['cube'],
            [],
            'dp',
            'do',
            nextProps.csClassificationShem[`do_${doForSchemClas.id}`],
            nextProps.csClassificationShem[`dp_${dpForSchemClas.id}`],
            `do_${doForSchemClas.id}`,
            `dp_${dpForSchemClas.id}`).map(this.renderTableData), 'dateCreateShem', 'desc')
        }
      );
    } else if(nextProps.csClassificationShem && typeof nextProps.csClassificationShem === 'object') {
      this.setState({
        loading: false
      })
    }
    if(!isEmpty(nextProps.csClassificationShemChildren) && !isEmpty(nextProps.tofiConstants) 
        && this.props.csClassificationShemChildren !== nextProps.csClassificationShemChildren) {
      
      const { doForSchemClas, dpForSchemClas } = nextProps.tofiConstants;
      
      // const data1 = [
      //   {key: '1',    parent: '0',  referenceName: 'item1'},
      //   {key: '1.1',  parent: '1',  referenceName: 'item1.1'},
      //   {key: '1.1.1',  parent: '1.1',  referenceName: 'item1.1.1'},
      //   {key: '1.1.2',  parent: '1.1',  referenceName: 'item1.1.2'},
      //   {key: '1.1.3',  parent: '1.1',  referenceName: 'item1.1.3'},
      //   {key: '1.2',  parent: '1',  referenceName: 'item1.2'},
      //   {key: '1.3',  parent: '1',  referenceName: 'item1.3'},
      //   {key: '2',    parent: '0',  referenceName: 'item2'},
      //   {key: '2.1',  parent: '2',  referenceName: 'item2.1'},
      //   {key: '2.2',  parent: '2',  referenceName: 'item2.2'},
      //   {key: '2.3',  parent: '2',  referenceName: 'item2.3'},
      //   {key: '3',    parent : '0',  referenceName: 'item3'},
      //   {key: '3.1',  parent: '3',  referenceName: 'item3.1'},
      //   {key: '3.2',  parent: '3',  referenceName: 'item3.2'},
      //   {key: '3.3',  parent: '3',  referenceName: 'item3.3'},
      // ];
      const parseCubeData = parseCube_new(
        nextProps.csClassificationShemChildren['cube'],
        [],
        'dp',
        'do',
        nextProps.csClassificationShemChildren[`do_${doForSchemClas.id}`],
        nextProps.csClassificationShemChildren[`dp_${dpForSchemClas.id}`],
        `do_${doForSchemClas.id}`,
        `dp_${dpForSchemClas.id}`).map(this.renderChildrenData)
      
      this.setState(
        {
          //dataChildren: getChildren('0', data1)
          dataChildren: getChildren(this.state.selectedRow.key, parseCubeData)
        }
      )
      function getChildren(parentId, array) {
        let children= [];
        array.forEach((item) => {
          if (item.parent === parentId) {
            let child = item;
            let myChildren = getChildren(item.key, array)            
            if (myChildren.length > 0) child.children = myChildren;
            children.push(child);
          }
        })
        return children;
      }
    }
  }

  renderChildrenData = (item, idx) => {
    const { indexSceme, spellVariant, requisites } = this.props.tofiConstants;
    
    const indexScemeObj = item.props.find(element => element.prop == indexSceme.id);
    const spellVariantObj = item.props.find(element => element.prop == spellVariant.id);
    const requisitesObj = item.props.find(element => element.prop == requisites.id);
    
    return {
      key: item.id,
      numb: idx + 1,
      referenceName: item.name[this.lng],
      parent: item.parent,

      indexSceme: !!indexScemeObj && indexScemeObj.value ? indexScemeObj.value : '',
      spellVariant: !!spellVariantObj && spellVariantObj.value ? spellVariantObj.value : '',
      requisites: !!requisitesObj && requisitesObj.value ? requisitesObj.value : '',
    }
  };
  
  renderTableData = (item, idx) => {
    const cls = ['clsPutev', 'clsKatalog', 'clsUkaz', 'clsObzor'];
    const { dateCreateShem, dateApproveShem } = this.props.tofiConstants;
    const { vidGuidebook, vidKatalog, vidUkaz, vidObzora, theme, group, goalSprav, 
            method, metodikaText, approvalDateMetodika, protocol,
            lastChangeDateScheme, changesAuthor } = this.props.tofiConstants;
    
    const dateCreateShemObj = item.props.find(element => element.prop == dateCreateShem.id);
    const dateApproveShemObj = item.props.find(element => element.prop == dateApproveShem.id);
    const referenceTypeObj = cls.find(c => this.props.tofiConstants[c].id == item.clsORtr);
    const vidGuidebookObj = item.props.find(element => element.prop == vidGuidebook.id);
    const vidKatalogObj = item.props.find(element => element.prop == vidKatalog.id);
    const vidUkazObj = item.props.find(element => element.prop == vidUkaz.id);
    const vidObzoraObj = item.props.find(element => element.prop == vidObzora.id);
    const themeObj = item.props.find(element => element.prop == theme.id);
    const groupObj = item.props.find(element => element.prop == group.id);
    const goalSpravObj = item.props.find(element => element.prop == goalSprav.id);
    const methodObj = item.props.find(element => element.prop == method.id);
    const metodikaTextObj = item.props.find(element => element.prop == metodikaText.id);
    const approvalDateMetodikaObj = item.props.find(element => element.prop == approvalDateMetodika.id);
    const protocolObj = item.props.find(element => element.prop == protocol.id);
    const lastChangeDateSchemeObj = item.props.find(element => element.prop == lastChangeDateScheme.id);
    const changesAuthorObj = item.props.find(element => element.prop == changesAuthor.id);
    
    return {
      key: item.id,
      numb: idx + 1,
      referenceName: item.name[this.lng],
      referenceType: referenceTypeObj ? {value: this.props.tofiConstants[referenceTypeObj].id, label: this.props.tofiConstants[referenceTypeObj].name[this.lng], referenceTypeObj} : null,
      dateApproveShem: !!dateApproveShemObj && dateApproveShemObj.value ? moment(dateApproveShemObj.value, 'DD-MM-YYYY') : null,
      dateCreateShem: !!dateCreateShemObj && dateCreateShemObj.value ? moment(dateCreateShemObj.value, 'DD-MM-YYYY') : null,
      vidGuidebook: !!vidGuidebookObj && vidGuidebookObj.refId ? {value:vidGuidebookObj.refId, label:vidGuidebookObj.value} : null,
      vidKatalog: !!vidKatalogObj && vidKatalogObj.refId ? {value:vidKatalogObj.refId, label:vidKatalogObj.value} : null,
      vidUkaz: !!vidUkazObj && vidUkazObj.refId ? {value:vidUkazObj.refId, label:vidUkazObj.value} : null,
      vidObzora: !!vidObzoraObj && vidObzoraObj.refId ? {value:vidObzoraObj.refId, label:vidObzoraObj.value} : null,
      theme: !!themeObj && themeObj.value ? themeObj.value : '',
      group: !!groupObj && groupObj.refId ? {value:groupObj.refId, label:groupObj.value} : null,
      goalSprav: !!goalSpravObj && goalSpravObj.value ? goalSpravObj.value : '',
      method: !!methodObj && methodObj.value ? methodObj.value : '',
      metodikaText: !!metodikaTextObj && metodikaTextObj.value ? metodikaTextObj.value : '',
      approvalDateMetodika: !!approvalDateMetodikaObj && approvalDateMetodikaObj.value ? moment(approvalDateMetodikaObj.value, 'DD-MM-YYYY') : '',
      protocol: !!protocolObj && protocolObj.value ? protocolObj.value : '',
      lastChangeDateScheme: !!lastChangeDateSchemeObj && lastChangeDateSchemeObj.value ? lastChangeDateSchemeObj.value : '',
      changesAuthor: !!changesAuthorObj && changesAuthorObj.value ? changesAuthorObj.value : '',
    }
  };
  
  getHierarchy() {
    const options = {
      customKey: 'csClassificationShemChildren',
      nodeWithChilds: 1
    };
    console.log(this.state.selectedRow.key);
    this.filtersChild = {
      filterDOAnd: [
        {
          dimConst: 'doForSchemClas',
          concatType: "and",
          conds: [
            {
              ids: this.state.selectedRow.key
            }
          ] 
        }
      ]
    };    
    this.props.getCube('csClassificationShem', JSON.stringify(this.filtersChild), options);
  }

  // openCard = () => {
  //   this.setState({
  //     openCard: true,
  //     selectedRow: null,
  //     initialValues: {
  //       // workAuthor: this.props.user.name,
  //       workDate: moment().startOf('day')
  //     }
  //   })
  // };

  closeCard = () => {
    this.setState({ openCard: false })
  };
  
  addNew = () => {
    this.setState({
      currentTablePage: 1,
      openNewRec: true,
      openCard: false,
      selectedTableRowKey: `newData_${this.state.data.length}`,
      data: [
        {
          key: `newData_${this.state.data.length}`,
          editable: true,
          numb: this.state.data.length + 1,
          referenceName: '',
        },
        ...this.state.data
      ]
    })
  };
  cancel = key => {
    const newData = [...this.state.data];
    if(key.includes('newData')) {
      this.setState({ 
        data: newData.filter(item => item.key !== key) ,
        openNewRec: false
      });
      return;
    }
    const target = newData.find(item => key === item.key);
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
    }
  };
  remove = (key) => {
    //
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit = key => {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.editable = true;
      target.valOld = {...target};
      this.setState({ data: newData });
    }
  };
  save(key) {
    this.setState({openNewRec: false});
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      const { key, numb, referenceName, editable, valOld, referenceType, ...rest } = target;

      const cube = {
        cubeSConst: 'csClassificationShem',
        doConst: 'doForSchemClas',
        dpConst: 'dpForSchemClas'
      };
      if(target.key.startsWith('newData')) {
        const name = {};
        SYSTEM_LANG_ARRAY.forEach(lang => {
           name[lang] = referenceName
        });
        const obj = {
          name,
          fullName: name,
          clsConst: referenceType.constName
        };
        const hideCreateObj = message.loading('CREATING_NEW_OBJECT', 0);
        createObj(cube, obj)
          .then(res => {
            hideCreateObj();
            if(res.success) {
              target.key = res.data.idItemDO;
              this.onSaveCubeData({cube, obj}, {...rest, dateCreateShem: moment()}, res.data.idItemDO, {}, {})
                .then(resp => {
                  if(resp.success) {
                    delete target.editable;
                    // this.setState({ data: newData });
                  }
                }).catch(err => console.log(err));
            }
          }).catch(err => {
          hideCreateObj();
          console.log(err);
        });
      } else {
        this.onSaveCubeData({cube}, rest, target.key, {}, valOld)
          .then(resp => {
            if(resp.success) {
              delete target.editable;
              // this.setState({ data: newData });
            }
          })
      }
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
  renderSelectColumns(text, record, column) {
    const { clsPutev, clsKatalog, clsUkaz, clsObzor } = this.props.tofiConstants;
    const referenceTypes = [clsPutev, clsKatalog, clsUkaz, clsObzor];
    return (
      <EditableSelect
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
        idRef={this.props.tofiConstants.isActiveTrue.id}
        getObjByObjVal={this.props.getObjByObjVal}
        options={referenceTypes ? referenceTypes.map(o => ({value: o.id, label: o.name[this.lng], constName: o.constName})) : []}
      />
    );
  };

  onSaveCubeData = (objVerData, values, doItemProp, objDataProp, valOld) => {
    let datas = [];
    try {
      datas = [{
        own: [{doConst: objVerData.cube.doConst, doItem: doItemProp, isRel: "0", objData: objDataProp }],
        props: map(values, (val, key) => {
          console.log(values, val, key)
          const propMetaData = getPropMeta(this.props[objVerData.cube.cubeSConst]["dp_" + this.props.tofiConstants[objVerData.cube.dpConst].id], this.props.tofiConstants[key]);
          console.log(val, valOld, valOld[key], key);
          let value = val;
          let oldValue = valOld[key];
          if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string'){
            value = {kz: val, ru: val, en: val};
            oldValue = oldValue && {kz: valOld[key], ru: valOld[key], en: valOld[key]};
          }
          if(propMetaData.typeProp === 312 && typeof value === 'string') {
            value = value.split('-').reverse().join('-');
            oldValue = oldValue && oldValue.split('-').reverse().join('-');
          }
          if(val && typeof val === 'object' && val.value) {
            value = String(val.value);
            oldValue = oldValue && String(valOld[key].value);
          }
          if(val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
          if(propMetaData.isUniq === 2 && val[0].value) {
            propMetaData.mode = val[0].mode;
            value = val.map(v => String(v.value)).join(",");
            oldValue = oldValue && valOld[key].map(v => String(v.value)).join(",");
          }
          return {propConst: key, val: value, oldValue, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq), mode: propMetaData.mode }
        }),
        periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
      }];
    } catch(err) {
      console.error(err);
      return err;
    }
    const hideLoading = message.loading('UPDATING_PROPS', 0);
    return updateCubeData(objVerData.cube.cubeSConst, moment().format('YYYY-MM-DD'), JSON.stringify(datas))
      .then(res => {
        hideLoading();
        if(res.success) {
          message.success('PROPS_SUCCESSFULLY_UPDATED');
          if(this.filters) {
            this.setState({loading: true});
            return this.props.getCube('csClassificationShem', JSON.stringify(this.filters))
              // .then(() => {
              //   this.setState({loading: false});
              //   return {success: true}
              // })
          } else {
            return {success: true}
          }
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
  };
  
  onSideBarTabClick = (key) => {
    this.setState({sidbarActiveKey: key}, (key) => {
      if (this.state.sidbarActiveKey !== 'hierarchy') return;
      this.getHierarchy();
      });
  };

  render(){
    if(isEmpty(this.props.tofiConstants)) return null;
    const { loading, data, search } = this.state;
    const { t, tofiConstants, tofiConstants: {dateCreateShem, dateApproveShem}, workStatusDeliveryOptions, workStatusAdmissionAndExpertiseOptions, workStatusSearchOptions, staffOptions } = this.props;
    
    this.lng = localStorage.getItem('i18nextLng');

    return(
      <div className="Classification-Schemas">
        <div className="Title">
          <h2>Схемы классификации</h2>
        </div>
        <div className="Classification-Schemas__heading">
          <div className="table-header">
            <Button disabled={this.state.openNewRec} onClick={this.addNew}>{this.props.t('ADD')}</Button>
          </div>
        </div>
        <div className="Classification-Schemas__body">
          <AntTable
            loading={loading}
            columns={[
              {
                key: 'referenceName',
                title: this.props.t('REFERENCE_NAME'),
                dataIndex: 'referenceName',
                width: '60%',
                filterIcon: <Icon type="filter" style={{ color: search.workType ? '#ff9800' : '#aaa' }} />,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.workType.focus());
                },
                render: (obj, record) => this.renderColumns(obj, record, 'referenceName'),
              },
              {
                key: 'referenceType',
                title: this.props.t('REFERENCE_TYPE'),
                dataIndex: 'referenceType',
                width: '10%',
                render: (obj, record) => this.renderSelectColumns(obj, record, 'referenceType'),
              },
              {
                key: 'dateCreateShem',
                title: t('DATE_CREATE_SHEM'),
                dataIndex: 'dateCreateShem',
                width: '10%',
                render: val => val && val.format('DD-MM-YYYY')
              },
              {
                key: 'dateApproveShem',
                title: t('DATE_APPROVE_SHEM'),
                dataIndex: 'dateApproveShem',
                width: '10%',
                render: val => val && val.format('DD-MM-YYYY')
              },
              {
                key: 'action',
                title: '',
                dataIndex: '',
                width: '10%',
                render: (text, record) => {
                  const { editable, referenceName, referenceType, approvalDateMetodika } = record;
                  const disable = (referenceName === '' || isEmpty(referenceType));
                  const closedRec = !isEmpty(approvalDateMetodika);
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
                        : 
                          <span>
                            {/* <a><Icon type="edit" style={{fontSize: '14px'}} onClick={() => this.edit(record.key)}/></a> */}
                            <a><Icon type="edit" style={{fontSize: '14px'}} onClick={() => this.changeSelectedRow(record, true)}/></a>
                            {!closedRec &&
                              <span>
                                {/* <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={(e) => this.remove(e, record.key)}> */}
                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onClick={e => e.stopPropagation()} onConfirm={() => this.remove(record.key)}>
                                  <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}}><Icon type="delete" className="editable-cell-icon"/></a>
                                </Popconfirm>
                              </span>
                            }
                        </span>
                      }
                    </div>
                  );
                },
              }
            ]}
            scroll={{y: '100%'}}
            pagination={{ pageSize: 20, showQuickJumper:true, current: this.state.currentTablePage }}
            dataSource={ data }
            rowClassName={record => this.state.selectedTableRowKey === record.key ? 'row-selected' : ''}
            onRowClick={this.changeSelectedRow}
            onChange={(pagination, filters, sorter, currentPageData) => this.setState({currentTablePage: pagination.current})}
            openedBy="ClassificationSchemas"
            hidePagination
            bordered
            size='small'/>
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard t={t} tofiConstants={tofiConstants} initialValues={this.state.initialValues} record={this.state.selectedRow}
                       closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}
                       onCreateObj={this.onCreateObj} onSaveCubeData={this.onSaveCubeData} 
                       hierarchyData={this.state.dataChildren}
                       onTabClick={this.onSideBarTabClick} activeKey={this.state.sidbarActiveKey}
                       clsFirstStatusMap={this.clsFirstStatusMap}
            />
          </CSSTransition>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    csClassificationShem: state.cubes.csClassificationShem,
    csClassificationShemChildren: state.cubes.csClassificationShemChildren,
    tofiConstants: state.generalData.tofiConstants,
    user: state.auth.user
  }
}

export default connect(mapStateToProps, { getCube, getObjByObjVal })(ClassificationSchemas);