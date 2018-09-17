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
import {isEmpty, isEqual, map, uniqBy} from 'lodash';
import {
  CUBE_FOR_WORKS, WORK_PRIORITY, WORK_STATUS,
  DO_FOR_WORKS, CHECKING_TYPE, DP_FOR_WORKS, CUBE_FOR_AF_CASE, DO_FOR_CASE
} from '../../../constants/tofiConstants';
import {
  changeInvOC, createObj, dObj, getAllObjOfCls, getCube, getObjByProp, getPropVal, rabota1, rabotaAcc, rabotaExp, updateCubeData
} from '../../../actions/actions';
import {getPropMeta, parseCube_new} from '../../../utils/cubeParser';
import AntModal from '../../AntModal';

/*eslint eqeqeq:0*/
class ArchiveFundWorks extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      priority: [],
      workPriorityLoading: false,
      workStatusRegLoading: false,
      sourcing: null,
      form: null,
      search: {
        workPlannedStartDate: {
          // dbeg: moment().subtract(1, 'w'),
          // dend: moment().add(1, 'w')
          dbeg: null,
          dend: null
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
        workRegFund: '',
        workRegInv: '',
        workPriority: '',
        workStatusReg: '',
        workAssignedToReg: ''
      },
      openCard: false,
      selectedRow: null,
      performer: [],
      workAssignedToRegLoading: false,
      initialValues: {},
      loading: false,
      workStatusDeliveryLoading: false,
      workStatusAdmissionAndExpertiseLoading: false,
      status: [],
      workStatusSearchLoading: false,
      staff: [],
      staffLoading: false,
      modal: {
        visible: false
      },
      workRegInvOptions: [],
      workRegInvSelected: null
    };
  }

  onPriorityChange = s => {this.setState({priority: s})};
  onStatusChange = s => {this.setState({status: s})};
  onStaffChange = s => {this.setState({staff: s})};
  onSourcingChange = s => {this.setState({sourcing: s})};
  onPerformerChange = s => {this.setState({performer: s})};

  changeSelectedRow = rec => {
    if((isEmpty(this.state.selectedRow) && !this.state.openCard) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)){
      this.setState({ selectedRow: rec })
    } else {
      this.setState({ initialValues: rec, openCard: true, selectedRow: rec })
    }
  };

  openCard = () => {
    this.setState({
      openCard: true,
      selectedRow: null,
      initialValues: {
        workAuthor: this.props.user.name,
        workDate: moment().startOf('day'),
        // workStatusReg: {value: this.props.tofiConstants.appointed.id, label: this.props.tofiConstants.appointed.name[this.lng]}
      }
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
    if(isEmpty(this.props.tofiConstants)) return;
    this.getCubeAct();

    const getClsId = c => this.props.tofiConstants[c].id;

    this.clsStatusMap = {
      [getClsId('caseRegistration')]: 'workStatusAdmissionAndExpertise',
      [getClsId('caseDisposal')]: 'workStatusRetirement',
      [getClsId('descriptionOfValuableDocs')]: 'workStatusOCD',
      [getClsId('caseAvailabilityCheck')]: 'workStatusAvailabilityCheck',
      [getClsId('casesForTemporaryUse')]: 'workStatusDelivery',
      [getClsId('caseExamination')]: 'workStatusAdmissionAndExpertise',
      [getClsId('processedCases')]: 'workStatusRetirement',
      [getClsId('caseSearch')]: 'workStatusSearch'
    };

    /*this.clsFirstStatusMap = {
      [getClsId('caseRegistration')]: 'appointmentProcess',
      [getClsId('caseDisposal')]: 'appointmentProcess',
      [getClsId('descriptionOfValuableDocs')]: 'appointmentProcess',
      [getClsId('caseAvailabilityCheck')]: 'appointed',
      [getClsId('casesForTemporaryUse')]: 'needFor',
      [getClsId('caseExamination')]: 'appointed',
      [getClsId('processedCases')]: 'appointmentProcess',
      [getClsId('caseSearch')]: 'appointmentProcess'
    };*/
    this.clsFirstStatusMap = {
      [getClsId('caseRegistration')]: 'appointed',
      [getClsId('caseDisposal')]: 'appointed',
      [getClsId('descriptionOfValuableDocs')]: 'appointed',
      [getClsId('caseAvailabilityCheck')]: 'appointed',
      [getClsId('casesForTemporaryUse')]: 'needFor',
      [getClsId('caseExamination')]: 'appointed',
      [getClsId('processedCases')]: 'appointed',
      [getClsId('caseSearch')]: 'appointed'
    };
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
              clss: "caseRegistration,caseDisposal,descriptionOfValuableDocs,caseAvailabilityCheck,casesForTemporaryUse,caseExamination,processedCases,caseSearch"
            },
            {
              data: {
                idRef: this.props.tofiConstants.isActiveTrue.id,
                typeRef: 'factorVal'
              }
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
  loadOptionsArr = cArr => {
    return () => {
      cArr.forEach(c => {
        if(!this.props[c + 'Options']) {
          this.setState({[c+'Loading']: true});
          this.props.getPropVal(c)
            .then(() => this.setState({[c+'Loading']: false}))
        }
      });
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

  onCreateObj = ({parent, ...values}) => {
    const { workRegFund } = values;

    const cube = {
      cubeSConst: CUBE_FOR_WORKS
    };

    const name = {};
    SYSTEM_LANG_ARRAY.forEach(lang => {
      name[lang] = (values.workType ? values.workType.label : '') + ' ' +
        (workRegFund ? workRegFund.label : '')
    });
    const obj = {
      name,
      fullName: name,
      clsConst: values.workType.workTypeClass,
      parent
    };

    const hideCreateObj = message.loading('CREATING_NEW_OBJECT', 0);
    return createObj(cube, obj)
      .then(res => {
        hideCreateObj();
        if(res.success) {
          return this.onSaveCubeData({...values, childWorkFeature: String(this.props.tofiConstants.isActiveTrue.id)}, res.data.idItemDO, {})
        } else {
          if(res.errors) {
            res.errors.forEach(err => {
              message.error(err.text)
            })
          }
        }
      }).catch(err => {
        console.error(err)
    })
  };

  onSaveCubeData = ({workStatusReg, workType, ...values}, doItemProp, objDataProp) => {
    if(workStatusReg) {
      values[this.clsStatusMap[workType.value]] = workStatusReg;
    }

    const name = {};
    if(!doItemProp) {
      const { selectedRow: {workType, workRegFund} } = this.state;
      SYSTEM_LANG_ARRAY.forEach(lang => {
        name[lang] = (workType ? workType.label : '') + ' ' +
          (workRegFund ? workRegFund.label : '')
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
      console.error(err);
      return Promise.reject();
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
              this.setState({loading: false, openCard: false});
              return {success: true}
            })
        } else {
          message.error('PROPS_UPDATING_ERROR');
          if(res.errors) {
            res.errors.forEach(err => {
              message.error(err.text);
            });
            return Promise.reject();
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
          if(target.workType.workTypeClass === 'casesForTemporaryUse') {
            this.onSaveCubeData({
              workStatusReg: { value: this.props.tofiConstants.issued.id},
              workType: target.workType,
              [name]: moment().format('YYYY-MM-DD'),
            }, key, {})
              .catch(err => {
                console.error(err);
              })
          }
          else if(target.workType.workTypeClass === 'descriptionOfValuableDocs') {
            this.setState({ selectedRow: target, modal: {...this.state.modal, visible: true} });
          }
          else if(['caseAvailabilityCheck', 'caseRegistration', 'caseExamination'].includes(target.workType.workTypeClass)) {
            this.onSaveCubeData({
              workStatusReg: { value: this.props.tofiConstants.during.id},
              workType: target.workType,
              [name]: moment().format('YYYY-MM-DD'),
              intermediateResultDate: moment().format('YYYY-MM-DD')
            }, key, {})
              .then(res => {
                if(res.success) {
                  if(target.workType.value === this.props.tofiConstants.caseAvailabilityCheck.id) {
                    rabota1(key.split('_')[1])
                      .then(res => {
                        if(res.success) {
                          // const notAvailableList = this.state.data.filter(item => (item && item.workType && item.workType.workTypeClass == 'casesForTemporaryUse' && item.workStatusReg.value == this.props.tofiConstants.issued.id));
                          // const data = res.data.map(cs => ({...cs, temporaryUse: notAvailableList && notAvailableList.some(obj => obj.workRegCase.value == cs.id)}));
                          this.props.history.push({
                            pathname: `/archiveFund/works/checking/${target.workRegFund.value}_${target.workRegInv.value}`,
                            state: {
                              workId: key,
                              data: res.data
                            }
                          })
                        };
                      }).catch(err => {
                        console.error(err)
                    });
                  } else if (target.workType.value === this.props.tofiConstants.caseRegistration.id) {
                    rabotaAcc(key.split('_')[1])
                      .then(res => {
                        if(res.success) {
                          this.props.history.push({
                            pathname: `/archiveFund/works/accounting/${target.workRegFund.value}_${target.workRegInv ? target.workRegInv.value : ''}`,
                            state: {
                              workId: key,
                              data: res.data
                            }
                          })
                        };
                      }).catch(err => {
                        console.error(err);
                    })
                  } else if (target.workType.value === this.props.tofiConstants.caseExamination.id) {
                    rabotaExp(key.split('_')[1])
                      .then(res => {
                        if(res.success) {
                          this.props.history.push({
                            pathname: `/archiveFund/works/expertize/${target.workRegFund.value}_${target.workRegInv ? target.workRegInv.value : ''}`,
                            state: {
                              workId: key,
                              data: res.data
                            }
                          })
                        };
                      }).catch(err => {
                        console.error(err);
                    })
                  }
                }
              }).catch(err => {
                console.error(err)
            })
          } else {
            this.onSaveCubeData({
              workStatusReg: {value: this.props.tofiConstants.during.id},
              workType: target.workType,
              [name]: moment().format('YYYY-MM-DD'),
            }, key, {})
              .catch(err => {
                console.error(err);
              })
          }
        }
        else if (name === 'workActualStartDateContinue') {
            if(target.workType.value === this.props.tofiConstants.caseAvailabilityCheck.id) {
            rabota1(key.split('_')[1])
              .then(res => {
                if(res.success) {
                  this.props.history.push({
                    pathname: `/archiveFund/works/checking/${target.workRegFund.value}_${target.workRegInv.value}`,
                    state: {
                      workId: key,
                      data: res.data,
                      workIndexNumber: target.workIndexNumber
                    }
                  })
                };
              });
          } else if (target.workType.value === this.props.tofiConstants.caseRegistration.id) {
              rabotaAcc(key.split('_')[1])
                .then(res => {
                  if (res.success) {
                    this.props.history.push({
                      pathname: `/archiveFund/works/accounting/${target.workRegFund.value}_${target.workRegInv ? target.workRegInv.value : ''}`,
                      state: {
                        workId: key,
                        data: res.data,
                        workIndexNumber: target.workIndexNumber
                      }
                    })
                  }
                  ;
                }).catch(err => {
                console.error(err);
              })
            } else if(target.workType.value === this.props.tofiConstants.caseExamination.id) {
              rabotaExp(key.split('_')[1])
                .then(res => {
                  if(res.success) {
                    this.props.history.push({
                      pathname: `/archiveFund/works/expertize/${target.workRegFund.value}_${target.workRegInv ? target.workRegInv.value : ''}`,
                      state: {
                        workId: key,
                        data: res.data,
                        workIndexNumber: target.workIndexNumber
                      }
                    })
                  };
                }).catch(err => {
                console.error(err);
              })
            }
        }
        else if(name === 'workActualEndDate') {
          if(target.workType.workTypeClass === 'casesForTemporaryUse') {
            this.onSaveCubeData({
              workStatusReg: { value: this.props.tofiConstants.returned.id},
              workType: target.workType,
              [name]: moment().format('YYYY-MM-DD'),
            }, key, {}).catch(err => {
                console.error(err);
              })
          } else {
            this.onSaveCubeData({
              workStatusReg: {value: this.props.tofiConstants.completed.id},
              workType: target.workType,
              [name]: moment().format('YYYY-MM-DD')
            }, key, {}).catch(err => {
              console.error(err);
            });
            if(target.workType.workTypeClass === 'caseDisposal' && target.workRegCase) {
              const datas = [{
                own: [{doConst: DO_FOR_CASE, doItem: `wa_${target.workRegCase.value}`, isRel: "0", objData: {}}],
                props: [{propConst: 'fundFeature', val: String(this.props.tofiConstants.excluded.id), typeProp: '11', periodDepend: "0", isUniq: '1'}],
                periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
              }];
              updateCubeData(CUBE_FOR_AF_CASE, moment().format('YYYY-MM-DD'), JSON.stringify(datas))
            }
          }
        }
        else if(name === 'acceptanceDate') {
          if(target.workType.workTypeClass === 'caseSearch') {
            this.onSaveCubeData({
              workStatusReg: {value: this.props.tofiConstants.found.id},
              workType: target.workType,
              [name]: moment().format('YYYY-MM-DD')
            }, key, {}).catch(err => {
              console.error(err);
            })
          } else {
            this.onSaveCubeData({
              workStatusReg: {value: this.props.tofiConstants.accepted.id},
              workType: target.workType,
              [name]: moment().format('YYYY-MM-DD')
            }, key, {}).catch(err => {
              console.error(err);
            })
          }
        }
        else if(name === 'notAccepted') {
          if(target.workType.workTypeClass === 'caseSearch') {
            this.onSaveCubeData({
              workStatusReg: {value: this.props.tofiConstants.notFound.id},
              workType: target.workType,
              acceptanceDate: moment().format('YYYY-MM-DD')
            }, key, {})
              .then(() => {
                this.onCreateObj({
                  parent: key.split('_')[1],
                  workType: {
                    value: String(this.props.tofiConstants.caseDisposal.id),
                    workTypeClass: 'caseDisposal'
                  },
                  workStatusReg: {value: this.props.tofiConstants.appointmentProcess.id},
                  workRegFund: target.workRegFund,
                  workRegInv: target.workRegInv,
                  workRegCase: target.workRegCase,
                  retirementReason: String(this.props.tofiConstants.noResults.id)
                })
              })
              .catch(err => {
                console.error(err);
              })
          } else {
            this.onSaveCubeData({
              workStatusReg: {value: this.props.tofiConstants.notAccepted.id},
              workType: target.workType,
              acceptanceDate: moment().format('YYYY-MM-DD')
            }, key, {}).catch(err => {
              console.error(err);
            })
          }
        }
      }
      this.setState({ data: newData });
    };
  };

  renderTableData = (item, idx) => {
    const workTypeClasses = ['caseRegistration','caseDisposal','descriptionOfValuableDocs','caseAvailabilityCheck','casesForTemporaryUse','caseExamination','processedCases','caseSearch'];
    const { workPlannedEndDate, workAuthor, workRegFund, workRegInv, workIndexNumber, retirementReason,
      workPriority, workDate, workAssignedTo, workPlannedStartDate, workActualStartDate, workRecipient,
      workActualEndDate, acceptanceDate, checkingType, workRegCase, intermediateResultDate, deliveryPurpose } = this.props.tofiConstants;

    const workPlannedEndDateObj = item.props.find(element => element.prop == workPlannedEndDate.id),
      workStatusRegObj = item.props.find(element => element.prop == this.props.tofiConstants[this.clsStatusMap[item.clsORtr]].id),
      workAuthorObj = item.props.find(element => element.prop == workAuthor.id),
      workPriorityObj = item.props.find(element => element.prop == workPriority.id),
      workDateObj = item.props.find(element => element.prop == workDate.id),
      workAssignedToObj = item.props.find(element => element.prop == workAssignedTo.id),
      workRecipientObj = item.props.find(element => element.prop == workRecipient.id),
      workPlannedStartDateObj = item.props.find(element => element.prop == workPlannedStartDate.id),
      workActualStartDateObj = item.props.find(element => element.prop == workActualStartDate.id),
      workActualEndDateObj = item.props.find(element => element.prop == workActualEndDate.id),
      acceptanceDateObj = item.props.find(element => element.prop == acceptanceDate.id),
      checkingTypeObj = item.props.find(element => element.prop == checkingType.id),
      workRegFundObj = item.props.find(element => element.prop == workRegFund.id),
      workRegInvObj = item.props.find(element => element.prop == workRegInv.id),
      workRegCaseObj = item.props.find(element => element.prop == workRegCase.id),
      intermediateResultDateObj = item.props.find(element => element.prop == intermediateResultDate.id),
      workIndexNumberObj = item.props.find(element => element.prop == workIndexNumber.id),
      retirementReasonObj = item.props.find(element => element.prop == retirementReason.id),
      deliveryPurposeObj = item.props.find(element => element.prop == deliveryPurpose.id),
      workTypeClass = workTypeClasses.find(cls => this.props.tofiConstants[cls].id == item.clsORtr);
    return {
      key: item.id,
      numb: idx + 1,
      workType: workTypeClass ? {value: this.props.tofiConstants[workTypeClass].id, label: this.props.tofiConstants[workTypeClass].name[this.lng], workTypeClass} : null,
      workPlannedStartDate: !!workPlannedStartDateObj && workPlannedStartDateObj.value ? moment(workPlannedStartDateObj.value, 'DD-MM-YYYY') : null,
      workPlannedEndDate: !!workPlannedEndDateObj && workPlannedEndDateObj.value ? moment(workPlannedEndDateObj.value, 'DD-MM-YYYY') : null,
      workStatusReg: workStatusRegObj && workStatusRegObj.refId ? {value: workStatusRegObj.refId, label: workStatusRegObj.value} : null,
      checkingType: checkingTypeObj && checkingTypeObj.refId ? {value: checkingTypeObj.refId, label: checkingTypeObj.value} : null,
      retirementReason: retirementReasonObj && retirementReasonObj.refId ? {value: retirementReasonObj.refId, label: retirementReasonObj.value} : null,
      deliveryPurpose: deliveryPurposeObj && deliveryPurposeObj.refId ? {value: deliveryPurposeObj.refId, label: deliveryPurposeObj.value} : null,
      workListName: item.name,
      workPriority: workPriorityObj && workPriorityObj.refId ? {value: workPriorityObj.refId, label: workPriorityObj.value} : null,
      workRegFund: !!workRegFundObj && workRegFundObj.cube && workRegFundObj.cube.idRef ? { value: workRegFundObj.cube.idRef, label: workRegFundObj.cube.name[this.lng] } : null,
      workRegInv: !!workRegInvObj && workRegInvObj.cube && workRegInvObj.cube.idRef ? { value: workRegInvObj.cube.idRef, label: workRegInvObj.cube.name[this.lng] } : null,
      workRegCase: !!workRegCaseObj && workRegCaseObj.cube && workRegCaseObj.cube.idRef ? { value: workRegCaseObj.cube.idRef, label: workRegCaseObj.cube.name[this.lng] } : null,
      workAuthor: !!workAuthorObj ? workAuthorObj.value || '' : '',
      workIndexNumber: !!workIndexNumberObj ? String(workIndexNumberObj.value) : '',
      workDate: !!workDateObj && workDateObj.value ? moment(workDateObj.value, 'DD-MM-YYYY') : null,
      workAssignedTo: !!workAssignedToObj && workAssignedToObj.cube.idRef ? {value: workAssignedToObj.cube.idRef, label: workAssignedToObj.cube.name[this.lng]} : null,
      workRecipient: !!workRecipientObj && workRecipientObj.cube.idRef ? {value: workRecipientObj.cube.idRef, label: workRecipientObj.cube.name[this.lng]} : null,
      workActualStartDate: !!workActualStartDateObj && workActualStartDateObj.value ? moment(workActualStartDateObj.value, 'DD-MM-YYYY') : null,
      workActualEndDate: !!workActualEndDateObj && workActualEndDateObj.value ? moment(workActualEndDateObj.value, 'DD-MM-YYYY') : null,
      acceptanceDate: !!acceptanceDateObj && acceptanceDateObj.value ? moment(acceptanceDateObj.value, 'DD-MM-YYYY') : null,
      intermediateResultDate: !!intermediateResultDateObj && intermediateResultDateObj.value ? moment(intermediateResultDateObj.value, 'DD-MM-YYYY') : null
    }
  };
  onWorkRegInvChange = data => {
    this.setState({ workRegInvSelected: data })
  };

  menu = (
    <Menu>
      <Menu.Item key="first">{this.props.t('REPORT_1')}</Menu.Item>
      <Menu.Item key="second">{this.props.t('REPORT_2')}</Menu.Item>
    </Menu>
  );

  showModal = () => {
    this.setState({
      modal: {
        visible: true,
      }
    });
  };
  handleModalOk = () => {
    changeInvOC(this.state.selectedRow.workRegInv.value, this.state.workRegInvSelected.value)
      .then(res => {
        if(res.success) {
          this.setState({
            modal: {
              visible: false
            }
          });
          return Promise.resolve();
        } else {
          res.errors && res.errors.forEach(error => {
            message.error(error.text);
          });
          return Promise.reject();
        }
      })
      .then(() => {
        this.onSaveCubeData({
          workStatusReg: {value: this.props.tofiConstants.completed.id},
          workType: {value: 1053, workTypeClass: "descriptionOfValuableDocs"},
          workActualStartDate: moment().format('YYYY-MM-DD'),
          workActualEndDate: moment().format('YYYY-MM-DD')
        })
      })
      .catch(err => {
        console.error(err)
    })
  };
  handleModalCancel = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  render() {
    const { search, loading, performer, status, priority, workPriorityLoading, staff,
      workStatusDeliveryLoading, workStatusAdmissionAndExpertiseLoading, workStatusSearchLoading, workAssignedToRegLoading, staffLoading, data } = this.state;
    const { t, tofiConstants, workStatusDeliveryOptions, workStatusAdmissionAndExpertiseOptions, workStatusSearchOptions, staffOptions } = this.props;
    if(isEmpty(tofiConstants)) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { workPlannedStartDate, workPlannedEndDate, workActualStartDate, workActualEndDate, acceptanceDate, workRegFund, workRegInv, workRecipient } = tofiConstants;

    this.filteredData = data.filter(item => {
      return (
        // item.numb === Number(search) ||
        ( item.workType ? item.workType.label.toLowerCase().includes(search.workType.toLowerCase()) : search.workType === '' ) &&
        ( item.workRegFund ? item.workRegFund.label.toLowerCase().includes(search.workRegFund.toLowerCase()) : search.workRegFund === '' ) &&
        ( item.workRegInv ? item.workRegInv.label.toLowerCase().includes(search.workRegInv.toLowerCase()) : search.workRegInv === '' ) &&
        ( priority.length === 0  || priority.some(p => (item.workPriority && p.value == item.workPriority.value)) ) &&
        ( status.length === 0  || status.some(p => (item.workStatusReg && p.value == item.workStatusReg.value)) ) &&
        ( performer.length === 0  || performer.some(p => (item.workAssignedTo && p.value == item.workAssignedTo.value)) ) &&
        ( staff.length === 0  || staff.some(p => (item.workRecipient && p.value == item.workRecipient.value)) ) &&
        ( !search.workPlannedStartDate.dbeg || ( item.workPlannedStartDate && item.workPlannedStartDate.isSameOrAfter(search.workPlannedStartDate.dbeg, 'day') )) &&
        ( !search.workPlannedStartDate.dend || ( item.workPlannedStartDate && item.workPlannedStartDate.isSameOrBefore(search.workPlannedStartDate.dend, 'day') )) &&
        ( !search.workPlannedEndDate.dbeg || ( item.workPlannedEndDate && item.workPlannedEndDate.isSameOrAfter(search.workPlannedEndDate.dbeg, 'day') )) &&
        ( !search.workPlannedEndDate.dend || ( item.workPlannedEndDate && item.workPlannedEndDate.isSameOrBefore(search.workPlannedEndDate.dend, 'day') )) &&
        ( !search.workActualStartDate.dbeg || ( item.workActualStartDate && item.workActualStartDate.isSameOrAfter(search.workActualStartDate.dbeg, 'day') )) &&
        ( !search.workActualStartDate.dend || ( item.workActualStartDate && item.workActualStartDate.isSameOrBefore(search.workActualStartDate.dend, 'day') )) &&
        ( !search.workActualEndDate.dbeg || ( item.workActualEndDate && item.workActualEndDate.isSameOrAfter(search.workActualEndDate.dbeg, 'day') )) &&
        ( !search.workActualEndDate.dend || ( item.workActualEndDate && item.workActualEndDate.isSameOrAfter(search.workActualEndDate.dend, 'day') )) &&
        ( !search.acceptanceDate.dbeg || ( item.acceptanceDate && item.acceptanceDate.isSameOrAfter(search.acceptanceDate.dbeg, 'day') )) &&
        ( !search.acceptanceDate.dend || ( item.acceptanceDate && item.acceptanceDate.isSameOrBefore(search.acceptanceDate.dend, 'day') ))
      )
    });
    return (
      <div className="Works">
        <div className="title">
          <h2>Работы по учету и хранению</h2>
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
                isLoading={workStatusDeliveryLoading || workStatusAdmissionAndExpertiseLoading || workStatusSearchLoading}
                options={workStatusDeliveryOptions && workStatusAdmissionAndExpertiseOptions && workStatusSearchOptions ?
                  uniqBy([...workStatusDeliveryOptions, ...workStatusAdmissionAndExpertiseOptions, ...workStatusSearchOptions], 'id')
                    .map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('STATUS')}
                onOpen={ this.loadOptionsArr(['workStatusDelivery','workStatusAdmissionAndExpertise','workStatusSearch']) }
              />
            </div>
            <div className="label-select">
              <SelectVirt
                name="performer"
                multi
                searchable
                className="long-selected-menu"
                // async
                isLoading={workAssignedToRegLoading}
                onOpen={this.getAllObjOfCls(['workAssignedToReg'])}
                optionHeight={40}
                value={performer}
                onChange={this.onPerformerChange}
                options={this.props.workAssignedToRegOptions ? this.props.workAssignedToRegOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('PERFORMER')}
              />
            </div>
            <div className="label-select">
              <Select
                name="staff"
                multi
                value={staff}
                onChange={this.onStaffChange}
                isLoading={staffLoading}
                options={staffOptions ? staffOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={workRecipient.name[this.lng]}
                onOpen={this.getAllObjOfCls(['staff'])}
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
                width: '10%',
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
                key: 'workRegFund',
                title: workRegFund.name[this.lng],
                dataIndex: 'workRegFund',
                width: '10%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="workRegFund"
                      suffix={search.workRegFund ? <Icon type="close-circle" data-name="workRegFund" onClick={this.emitEmpty} /> : null}
                      ref={ele => this.workRegFund = ele}
                      placeholder="Поиск"
                      value={search.workRegFund}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: search.workRegFund ? '#ff9800' : '#aaa' }} />,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.workRegFund.focus());
                },
                render: text => (text ? text.label : '')
              },
              {
                key: 'workRegInv',
                title: workRegInv.name[this.lng],
                dataIndex: 'workRegInv',
                width: '10%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="workRegInv"
                      suffix={search.workRegInv ? <Icon type="close-circle" data-name="workRegInv" onClick={this.emitEmpty} /> : null}
                      ref={ele => this.workRegInv = ele}
                      placeholder="Поиск"
                      value={search.workRegInv}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: search.workRegInv ? '#ff9800' : '#aaa' }} />,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.workRegInv.focus());
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
                filterIcon: <Icon type="filter" style={{ color: (search.workPlannedStartDate.dbeg || search.workPlannedStartDate.dend) ? '#ff9800' : '#aaa' }} />,
                render: text => (text ? text.format('DD-MM-YYYY') : '')
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
                filterIcon: <Icon type="filter" style={{ color: (search.workPlannedEndDate.dbeg || search.workPlannedEndDate.dend) ? '#ff9800' : '#aaa' }} />,
                render: text => (text ? text.format('DD-MM-YYYY') : '')
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
                        { record.intermediateResultDate ?
                          <Button title={t('CONTINUE')}
                                  icon="forward"
                                  onClick={this.addSpecialDate(record.key, 'workActualStartDateContinue')}
                                  className='green-btn'
                          /> :
                          text.format('DD-MM-YYYY') || ' ' }
                        {/*<Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() =>
                          this.onSaveCubeData({workStatusReg: {value: this.props.tofiConstants.appointed.id}, workType: record.workType, workActualStartDate: {mode: "del"}}, record.key, {})
                        }>
                          <Icon
                            type="close-circle"
                            className="editable-cell-icon"
                            onClick={this.stopPropagation}
                          />
                        </Popconfirm>*/}
                      </div>
                      :
                      <div className="editable-row-operations">
                        <Button
                          title={record.workType.workTypeClass === 'casesForTemporaryUse' ? t("ISSUED") : t("START")}
                          disabled={!record.workAssignedTo}
                          icon={record.workType.workTypeClass === 'casesForTemporaryUse' ? "reload" : "play-circle"}
                          onClick={this.addSpecialDate(record.key, 'workActualStartDate')}
                          className='green-btn'
                        />
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
                        {text.format('DD-MM-YYYY') || ' '}
                        {/*<Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() =>
                          this.onSaveCubeData({workStatusReg: {value: this.props.tofiConstants.during.id}, workType: record.workType, workActualEndDate: {mode: "del"}}, record.key, {})
                        }>
                          <Icon
                            type="close-circle"
                            className="editable-cell-icon"
                            onClick={this.stopPropagation}
                          />
                        </Popconfirm>*/}
                      </div>
                      :
                      <div className="editable-row-operations">
                        {record.workType &&
                        !['caseRegistration', 'caseAvailabilityCheck', 'caseExamination', 'descriptionOfValuableDocs'].includes(record.workType.workTypeClass) &&
                        <Button title={record.workType.workTypeClass === 'casesForTemporaryUse' ? t("GET_BACK") : t("COMPLETE")}
                                icon={record.workType.workTypeClass === 'casesForTemporaryUse' ? "sync" : "poweroff"}
                                disabled={!record.workActualStartDate}
                                onClick={this.addSpecialDate(record.key, 'workActualEndDate')}
                                className='green-btn'
                        />}
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
                        <span style={record.workStatusReg && (record.workStatusReg.value == this.props.tofiConstants.accepted.id || record.workStatusReg.value == this.props.tofiConstants.found.id) ? {color: 'green'} : {color: 'red'}}>{text.format('DD-MM-YYYY') || ' '}</span>
                        <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() =>
                          this.onSaveCubeData({workStatusReg: {value: this.props.tofiConstants.completed.id}, workType: record.workType, acceptanceDate: {mode: "del"}}, record.key, {})
                        }>
                          <Icon
                            type="close-circle"
                            className="editable-cell-icon"
                            onClick={this.stopPropagation}
                          />
                        </Popconfirm>
                      </div>
                      :
                      record.workType.workTypeClass !== 'casesForTemporaryUse' && <div className="editable-row-operations">
                        <Button disabled={!record.workActualEndDate} title={record.workType.workTypeClass === 'caseSearch' ? t('FOUND') : t("ACCEPT")} icon="check-circle" className='green-btn' onClick={this.addSpecialDate(record.key, 'acceptanceDate')} />
                        <Button disabled={!record.workActualEndDate} title={record.workType.workTypeClass === 'caseSearch' ? t('NOT_FOUND') : t("DECLINE")} icon="close" onClick={this.addSpecialDate(record.key, 'notAccepted')} className='green-btn'/>
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
                       clsFirstStatusMap={this.clsFirstStatusMap}
            />
          </CSSTransition>
        </div>
        <AntModal
          visible={this.state.modal.visible}
          width={400}
          title={this.state.selectedRow && this.state.selectedRow.workRegFund && this.state.selectedRow.workRegFund.label}
          onCancel={this.handleModalCancel}
          onOk={this.handleModalOk}
        >
          <SelectVirt
            name="inventories"
            searchable
            className="long-selected-menu"
            // isLoading={workRegInvLoading}
            onOpen={() => {
              const fd = new FormData();
              fd.append('clsConst', 'invList');
              fd.append('propConst', 'invFund');
              fd.append('withProps', 'invNumber,invType');
              fd.append('value', this.state.selectedRow.workRegFund.value);
              getObjByProp(fd)
                .then(res => {
                  if(res.success) {
                    this.setState({ workRegInvOptions: res.data })
                  } else {
                    throw res
                  }
                }).catch(err => console.error(err))
            }}
            optionHeight={40}
            value={this.state.workRegInvSelected}
            onChange={this.onWorkRegInvChange}
            options={this.state.selectedRow && this.state.workRegInvOptions.length !== 0 ?
              this.state.workRegInvOptions
                .filter(obj => (obj.invType && obj.invType.idRef === this.props.tofiConstants.invOCD.id && obj.id !== this.state.selectedRow.workRegInv.value))
                .map(option => ({value: option.id, label: `${option.invNumber[this.lng]} - ${option.name[this.lng]}`})) :
              []
            }
          />
        </AntModal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants,
    works: state.cubes[CUBE_FOR_WORKS],
    workPriorityOptions: state.generalData[WORK_PRIORITY],
    workStatusDeliveryOptions: state.generalData.workStatusDelivery,
    workStatusAdmissionAndExpertiseOptions: state.generalData.workStatusAdmissionAndExpertise,
    workStatusSearchOptions: state.generalData.workStatusSearch,
    workStatusRegOptions: state.generalData[WORK_STATUS],
    workAssignedToRegOptions: state.generalData.workAssignedToReg,
    checkingTypeOptions: state.generalData[CHECKING_TYPE],
    staffOptions: state.generalData.staff,
    user: state.auth.user
  }
}

export default connect(mapStateToProps, {getCube, getPropVal, getAllObjOfCls})(ArchiveFundWorks);