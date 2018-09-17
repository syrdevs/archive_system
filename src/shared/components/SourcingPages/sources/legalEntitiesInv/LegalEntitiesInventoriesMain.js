import React from 'react';
import {Button, Table, Tree, Icon, Popconfirm, Input, DatePicker, message} from 'antd';
import {CSSTransition} from 'react-transition-group';
import SiderCardLegalEntities from '../SiderCardLegalEntities';
import {isEmpty, map} from 'lodash';
import Select from 'react-select';
import SelectVirt from 'react-virtualized-select';

import {SYSTEM_LANG_ARRAY} from '../../../../constants/constants';
import {connect} from 'react-redux';
import { createObj, getCube, getObjFromProp, getObjListNew, getPropVal, updateCubeData } from '../../../../actions/actions';
import moment from 'moment';
import {getPropMeta, parseCube_new} from '../../../../utils/cubeParser';
import {CUBE_FOR_AF_CASE, CUBE_FOR_AF_INV} from '../../../../constants/tofiConstants';
import LegalEntitiesInventoryProps from './LegalEntitiesInventoryProps';

/*eslint eqeqeq:0*/

const EditableCell = ({ editable, value, onChange,  onPressEnter}) => (
  <span className="editable-cell">
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} onPressEnter={onPressEnter}/>
      : value
    }
  </span>
);
const EditableDatePicker = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <DatePicker style={{ margin: '-5px 0' }} format="DD-MM-YYYY" value={value} onChange={e => onChange(e)} />
      : value ? value.format('DD-MM-YYYY') : ''
    }
  </div>
);

const EditableSelectVirt = ({ editable, value, onChange, getObjByObjVal, idRef, options }) => (
  <div>
    {editable
      ? <SelectVirt
        style={{ margin: '-5px 0' }}
        value={value}
        onChange={e => onChange(e)}
        options={options}
        optionHeight={40}
        /*onOpen={() => {
          if(options.length === 0) {
            const fd = new FormData();
            fd.append('clsConst', 'sourceOrgList');
            fd.append('propConst', 'fundmakerOfIK');
            fd.append('propConstOfVal', 'isActive');
            fd.append('idRef', idRef);
            fd.append('valueType', 'factorVal');
            getObjByObjVal(fd, 'IK_FUNDMAKER_ACTIVE')
          }
        }}*/
      />
      : value ? value.label : ''
    }
  </div>
);

const EditableSelect = ({ editable, value, onChange, loadOptions, options }) => (
  <div>
    {editable
      ? <Select
        style={{ margin: '-5px 0' }}
        value={value}
        onChange={e => onChange(e)}
        options={options}
        onOpen={loadOptions}
      />
      : value ? value.label : ''
    }
  </div>
);

const TreeNode = Tree.TreeNode;

class LegalEntitiesInventoriesMain extends React.Component {

  //=============================================================columns===================================================
  buildTableColumns = (invType, documentType) => {
    const { invTypePerm, uprDoc, uprNTD, invTypeVideo, videoDoc,
      caseNumber, caseDbeg, caseDend, caseNumberOfPages, caseOCD, fundIndex, caseNotes, uprDocType, documentAuthor,
      addressee, question, terrain, documentDate, inaccurateDate, inaccurateDateFeature, day, month, year,
      numberOfOriginals, typeOfPaperCarrier, caseNomenItem, objectСode, projectName, projectStage, projectPartName,
      volumeNumber, yearOfCompletion, accountingUnitNumber, authorTitle, cameraOperator, artistOfTheWork,
      documentLanguage, dateOfRecording, timingOfVideoRecording, TypeAndFormatOfRecording, copy, original, numberOfVideoItems,
      compositionOfTextDocumentation,
    } = this.props.tofiConstants;
    switch (true) {
      case (invType == invTypePerm.id && documentType == uprDoc.id):
        return [
          {
            key: 'caseNumber',
            title: caseNumber.name[this.lng],
            dataIndex: 'caseNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'caseNumber'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'fundIndex',
            title: fundIndex.name[this.lng],
            dataIndex: 'fundIndex',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'fundIndex'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 20;
              }
              return obj;
            }
          },
          {
            key: 'cases',
            title: 'Заголовок дела',
            dataIndex: 'cases',
            width: '12%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'cases')
              }
              return obj;
            }
          },
          {
            key: 'uprDocType',
            title: uprDocType.name[this.lng],
            dataIndex: 'uprDocType',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderSelectColumns(value, rec, 'uprDocType'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'documentAuthor',
            title: documentAuthor.name[this.lng],
            dataIndex: 'documentAuthor',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'documentAuthor'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'addressee',
            title: addressee.name[this.lng],
            dataIndex: 'addressee',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'addressee'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'question',
            title: question.name[this.lng],
            dataIndex: 'question',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'question'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'terrain',
            title: terrain.name[this.lng],
            dataIndex: 'terrain',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'terrain'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'documentDate',
            title: documentDate.name[this.lng],
            dataIndex: 'documentDate',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'documentDate'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            title: inaccurateDate.name[this.lng],
            children: [
              {
                key: 'inaccurateDateFeature',
                title: inaccurateDateFeature.name[this.lng],
                dataIndex: 'inaccurateDateFeature',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: this.renderSelectColumns(value, rec, 'inaccurateDateFeature'),
                    props: {}
                  };
                  if(rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  }
                  return obj;
                }
              },
              {
                key: 'day',
                title: day.name[this.lng],
                dataIndex: 'day',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: this.renderColumns(value, rec, 'day'),
                    props: {}
                  };
                  if(rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  }
                  return obj;
                }
              },
              {
                key: 'month',
                title: month.name[this.lng],
                dataIndex: 'month',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: this.renderColumns(value, rec, 'month'),
                    props: {}
                  };
                  if(rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  }
                  return obj;
                }
              },
              {
                key: 'year',
                title: year.name[this.lng],
                dataIndex: 'year',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: this.renderColumns(value, rec, 'year'),
                    props: {}
                  };
                  if(rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  }
                  return obj;
                }
              }
            ]
          },
          {
            key: 'caseDbeg',
            title: caseDbeg.name[this.lng],
            dataIndex: 'caseDbeg',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: this.renderDateColumns(value, rec, 'caseDbeg'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseDend',
            title: caseDend.name[this.lng],
            dataIndex: 'caseDend',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: this.renderDateColumns(value, rec, 'caseDend'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNumberOfPages',
            title: caseNumberOfPages.name[this.lng],
            dataIndex: 'caseNumberOfPages',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'caseNumberOfPages'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseOCD',
            title: caseOCD.name[this.lng],
            dataIndex: 'caseOCD',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: value,
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.children = this.renderColumns(value, rec, 'caseOCD');
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNotes',
            title: caseNotes.name[this.lng],
            dataIndex: 'caseNotes',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'caseNotes'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'numberOfOriginals',
            title: numberOfOriginals.name[this.lng],
            dataIndex: 'numberOfOriginals',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'numberOfOriginals'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'typeOfPaperCarrier',
            title: typeOfPaperCarrier.name[this.lng],
            dataIndex: 'typeOfPaperCarrier',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderSelectColumns(value, rec, 'typeOfPaperCarrier'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNomenItem',
            title: caseNomenItem.name[this.lng],
            dataIndex: 'caseNomenItem',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value && value.label, rec, 'caseNomenItem'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
        ];
      case (invType == invTypePerm.id && documentType == uprNTD.id):
        return [
          {
            key: 'caseNumber',
            title: caseNumber.name[this.lng],
            dataIndex: 'caseNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'caseNumber'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'fundIndex',
            title: fundIndex.name[this.lng],
            dataIndex: 'fundIndex',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'fundIndex'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 20;
              }
              return obj;
            }
          },
          {
            key: 'cases',
            title: 'Заголовок дела',
            dataIndex: 'cases',
            width: '12%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'cases')
              }
              return obj;
            }
          },
          {
            key: 'objectСode',
            title: objectСode.name[this.lng],
            dataIndex: 'objectСode',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'objectСode')
              }
              return obj;
            }
          },
          {
            key: 'projectName',
            title: projectName.name[this.lng],
            dataIndex: 'projectName',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'projectName')
              }
              return obj;
            }
          },
          {
            key: 'projectStage',
            title: projectStage.name[this.lng],
            dataIndex: 'projectStage',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'projectStage')
              }
              return obj;
            }
          },
          {
            key: 'projectPartName',
            title: projectPartName.name[this.lng],
            dataIndex: 'projectPartName',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'projectPartName')
              }
              return obj;
            }
          },
          {
            key: 'volumeNumber',
            title: volumeNumber.name[this.lng],
            dataIndex: 'volumeNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'volumeNumber')
              }
              return obj;
            }
          },
          {
            key: 'documentAuthor',
            title: documentAuthor.name[this.lng],
            dataIndex: 'documentAuthor',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'documentAuthor')
              }
              return obj;
            }
          },
          {
            key: 'yearOfCompletion',
            title: yearOfCompletion.name[this.lng],
            dataIndex: 'yearOfCompletion',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'yearOfCompletion')
              }
              return obj;
            }
          },
          {
            key: 'caseDbeg',
            title: caseDbeg.name[this.lng],
            dataIndex: 'caseDbeg',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: this.renderDateColumns(value, rec, 'caseDbeg'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseDend',
            title: caseDend.name[this.lng],
            dataIndex: 'caseDend',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: this.renderDateColumns(value, rec, 'caseDend'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNumberOfPages',
            title: caseNumberOfPages.name[this.lng],
            dataIndex: 'caseNumberOfPages',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'caseNumberOfPages')
              }
              return obj;
            }
          },
          {
            key: 'caseNotes',
            title: caseNotes.name[this.lng],
            dataIndex: 'caseNotes',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'caseNotes')
              }
              return obj;
            }
          },
          {
            key: 'numberOfOriginals',
            title: numberOfOriginals.name[this.lng],
            dataIndex: 'numberOfOriginals',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'numberOfOriginals')
              }
              return obj;
            }
          },
          {
            key: 'typeOfPaperCarrier',
            title: typeOfPaperCarrier.name[this.lng],
            dataIndex: 'typeOfPaperCarrier',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderSelectColumns(value, rec, 'typeOfPaperCarrier'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
          {
            key: 'caseNomenItem',
            title: caseNomenItem.name[this.lng],
            dataIndex: 'caseNomenItem',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value && value.label, rec, 'caseNomenItem'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
        ]
      case (invType == invTypeVideo.id && documentType == videoDoc.id):
        return [
          {
            key: 'accountingUnitNumber',
            title: accountingUnitNumber.name[this.lng],
            dataIndex: 'accountingUnitNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'accountingUnitNumber'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'caseNumber',
            title: caseNumber.name[this.lng],
            dataIndex: 'caseNumber',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'caseNumber'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.children = value;
                obj.props.colSpan = 1;
              }
              return obj;
            }
          },
          {
            key: 'fundIndex',
            title: fundIndex.name[this.lng],
            dataIndex: 'fundIndex',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value, rec, 'fundIndex'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 20;
              }
              return obj;
            }
          },
          {
            key: 'cases',
            title: 'Заголовок дела',
            dataIndex: 'cases',
            width: '12%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'cases')
              }
              return obj;
            }
          },
          {
            key: 'authorTitle',
            title: authorTitle.name[this.lng],
            dataIndex: 'authorTitle',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'authorTitle')
              }
              return obj;
            }
          },
          {
            key: 'cameraOperator',
            title: cameraOperator.name[this.lng],
            dataIndex: 'cameraOperator',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'cameraOperator')
              }
              return obj;
            }
          },
          {
            key: 'artistOfTheWork',
            title: artistOfTheWork.name[this.lng],
            dataIndex: 'artistOfTheWork',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'artistOfTheWork')
              }
              return obj;
            }
          },
          {
            key: 'documentLanguage',
            title: documentLanguage.name[this.lng],
            dataIndex: 'documentLanguage',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'documentLanguage')
              }
              return obj;
            }
          },
          {
            key: 'dateOfRecording',
            title: dateOfRecording.name[this.lng],
            dataIndex: 'dateOfRecording',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'dateOfRecording')
              }
              return obj;
            }
          },
          {
            key: 'timingOfVideoRecording',
            title: timingOfVideoRecording.name[this.lng],
            dataIndex: 'timingOfVideoRecording',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'timingOfVideoRecording')
              }
              return obj;
            }
          },
          {
            key: 'TypeAndFormatOfRecording',
            title: TypeAndFormatOfRecording.name[this.lng],
            dataIndex: 'TypeAndFormatOfRecording',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'TypeAndFormatOfRecording')
              }
              return obj;
            }
          },
          {
            title: numberOfVideoItems.name[this.lng],
            children: [
              {
                key: 'original',
                title: original.name[this.lng],
                dataIndex: 'original',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: '',
                    props: {}
                  };
                  if(rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  } else {
                    obj.children = this.renderColumns(value, rec, 'original')
                  }
                  return obj;
                }
              },
              {
                key: 'copy',
                title: copy.name[this.lng],
                dataIndex: 'copy',
                width: '4%',
                render: (value, rec) => {
                  const obj = {
                    children: '',
                    props: {}
                  };
                  if(rec.objClass === 'structuralSubdivisionList') {
                    obj.props.colSpan = 0;
                  } else {
                    obj.children = this.renderColumns(value, rec, 'copy')
                  }
                  return obj;
                }
              }
            ]
          },
          {
            key: 'compositionOfTextDocumentation',
            title: compositionOfTextDocumentation.name[this.lng],
            dataIndex: 'compositionOfTextDocumentation',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: '',
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              } else {
                obj.children = this.renderColumns(value, rec, 'compositionOfTextDocumentation')
              }
              return obj;
            }
          },
          /*{
            key: 'typeOfPaperCarrier',
            title: typeOfPaperCarrier.name[this.lng],
            dataIndex: 'typeOfPaperCarrier',
            width: '4%',
            render: (value, rec) => {
              const obj = {
                children: this.renderSelectColumns(value, rec, 'typeOfPaperCarrier'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },*/
          {
            key: 'caseNomenItem',
            title: caseNomenItem.name[this.lng],
            dataIndex: 'caseNomenItem',
            width: '5%',
            render: (value, rec) => {
              const obj = {
                children: this.renderColumns(value && value.label, rec, 'caseNomenItem'),
                props: {}
              };
              if(rec.objClass === 'structuralSubdivisionList') {
                obj.props.colSpan = 0;
              }
              return obj;
            }
          },
        ]
      default: return []
    }
  };
  //=============================================================columns===================================================

  state = {
    data: [],
    loading: false,
    formData: {},
    treeData: [],
    selectedRow: {},
    openCard: false,
    lInv: {},
    checkedKeys: [],
    nomenOptions: []
  };

  onCheck = (checkedKeys, e) => {
    const lastCheckedKeys = checkedKeys.filter(key => e.checkedNodes.find(o => o.key === key).props.isLeaf);
    this.setState({ checkedKeys: lastCheckedKeys });
  };

  addNew = () => {
    this.setState({
      data: [
        ...this.state.data,
        {
          key: `newData_${this.state.data.length}`,
          parent: this.state.lInv.id,
          objClass: 'structuralSubdivisionList',
          editable: true,
          caseOCD: ''
        }
      ]
    })
  };
  addNewChild = type => {
    const newData = this.state.data.slice();
    const key = this.state.selectedRow.key;

    const row = this.getObject(newData, key);

    if(row) {
      switch (type) {
        case 'structuralSubdivisionList':
          if(!row.children) row.children = [];
          row.children.push({
            key: `newData_${row.key}_${row.children.length}`,
            parent: key,
            objClass: 'structuralSubdivisionList',
            editable: true,
          });
          break;
        case 'caseList':
          row.children = [];
          this.state.checkedKeys.forEach(key => {
            const branch = this.getObject(this.state.treeData, key);
            if(branch) {
              row.children.push({
                key: `newData_${key}`,
                parent: row.key,
                objClass: 'caseList',
                editable: true,
                caseNomenItem: {label: branch.title, value: key},
                fundIndex: branch.nomenIndex
              });
            }
          });
          break;
        default: break;
      }

      this.setState({
        data: newData,
        openCard: false
      })
    }
  };

  getObject = (theObject, key) => {
    let result = null;
    if(theObject instanceof Array) {
      for(let i = 0; i < theObject.length; i++) {
        result = this.getObject(theObject[i], key);
        if(result) return result;
      }
    }
    else if(theObject instanceof Object) {
      if(theObject.key == key) {
        return theObject;
      }
      result = this.getObject(theObject.children, key);
    } else return null;
    return result;
  };
  removeObject = (theObject, key) => {
    let result = null;
    if(theObject instanceof Array) {
      for(let i = 0; i < theObject.length; i++) {
        result = this.removeObject(theObject[i], key);
        if(result) {
          // eslint-disable-next-line
          theObject.forEach((item, idx) => {
            if(item.key === result.key) {
              theObject.splice(idx, 1);
              return;
            }
          });
        }
      }
    }
    else if(theObject instanceof Object) {
      if(theObject.key === key) {
        return theObject;
      }
      result = this.removeObject(theObject.children, key);
    } else return null;
    return result;
  };

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item}/>;
    });
  };
  closeCard = () => {
    this.setState({ openCard: false })
  };
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
        onPressEnter={record.objClass === 'structuralSubdivisionList' ? this.save(record.key) : undefined}
      />
    );
  }
  renderSelectColumns(text, record, column) {
    return (
      <EditableSelect
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
        loadOptions={this.loadOptions(column)}
        options={this.props[column + 'Options'] ? this.props[column + 'Options'].map(o => ({value: o.id, label: o.name[this.lng]})) : []}
      />
    );
  };
  renderDateColumns = (text, record, column) => {
    return (
      <EditableDatePicker
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    )
  };
  handleChange(value, key, column) {
    const newData = this.state.data.slice();
    const target = this.getObject(newData, key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }

  stopPropagation = e => {
    e.stopPropagation();
  };
  save = key => {
    return e => {
      e.stopPropagation();
      const newData = this.state.data.slice();
      const target = this.getObject(newData, key);

      if (target) {
        const { parent, editable, cases, key, objClass, ...rest } = target;

        if(objClass === 'structuralSubdivisionList') {
          const name = {};
          SYSTEM_LANG_ARRAY.forEach(lang => {
            name[lang] = rest.fundIndex
          });
          const cube = {
            cubeSConst: 'CubeForAF_Inv',
            doConst: 'doForInv',
            dpConst: 'dpForInv'
          };
          const obj = {
            name,
            fullName: name,
            clsConst: objClass,
            parent: parent.split('_')[1]
          };
          if(target.key.startsWith('newData')) {
            const hideCreateObj = message.loading('CREATING_NEW_OBJECT', 0);
            createObj(cube, obj)
              .then(res => {
                hideCreateObj();
                if(res.success) {
                  target.key = res.data.idItemDO;
                  message.success('OBJECT_CREATED_SUCCESSFULLY');
                  delete target.editable;
                  this.setState({ data: newData });
                }
              }).catch(err => {
              hideCreateObj();
              console.log(err);
            });
          } else {
            this.onSaveCubeData({cube, obj}, {}, target.key, {name})
              .then(resp => {
                if(resp.success) {
                  delete target.editable;
                  this.setState({ data: newData });
                }
              }).catch(err => {
              console.log(err);
            });
          }
        }
        else {
          const name = {};
          SYSTEM_LANG_ARRAY.forEach(lang => {
            name[lang] = cases
          });
          const cube = {
            cubeSConst: 'CubeForAF_Case',
            doConst: 'doForCase',
            dpConst: 'dpForCase'
          };
          const obj = {
            name,
            fullName: name,
            clsConst: objClass,
            parent: parent.split('_')[1]
          };
          if(target.key.startsWith('newData')) {
            const hideCreateObj = message.loading('CREATING_NEW_OBJECT', 0);
            createObj(cube, obj)
              .then(res => {
                hideCreateObj();
                if(res.success) {
                  target.key = res.data.idItemDO;
                  const filters = {
                    filterDOAnd: [
                      {
                        dimConst: cube.doConst,
                        concatType: "and",
                        conds: [
                          {
                            ids: res.data.idItemDO
                          }
                        ]
                      }
                    ]
                  };
                  return this.props.getCube(cube.cubeSConst, JSON.stringify(filters));
                }
              })
              .then(() => {
                this.filters = null;
                return this.onSaveCubeData({cube, obj}, rest, target.key, {})
              })
              .then(resp => {
                if(resp.success) {
                  delete target.editable;
                  this.setState({ data: newData });
                }
              })
              .catch(err => {
              hideCreateObj();
              console.log(err);
            });
          } else {
            this.onSaveCubeData({cube, obj}, rest, target.key, {})
              .then(resp => {
                if(resp.success) {
                  delete target.editable;
                  this.setState({ data: newData });
                }
              }).catch(err => {
              console.log(err);
            });
          }
        }
      }
    }
  };
  remove = key => {
    const newData = this.state.data.slice();
    this.removeObject(newData, key);
    this.setState({ data: newData });
  };
  cancel = key => {
    const newData = this.state.data.slice();
    if(key.includes('newData')) {
      this.removeObject(newData, key);
      this.setState({data: newData, selectedRow: {} });
      return;
    }
    const target = this.getObject(newData, key);
    if (target) {
      delete target.editable;
      this.setState({ data: newData, selectedRow: {} });
    }
  };
  edit = key => {
    return e => {
      e.stopPropagation();
      const newData = this.state.data.slice();
      const target = this.getObject(newData, key);

      if (target) {
        target.editable = true;
        this.setState({ data: newData });
      }
    }
  };

  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.props.getPropVal(c)
      }
    }
  };

  onRowClick = record => {
    this.setState({ selectedRow: record });
  };

  openArticles = () => {
    const invNomenValue = this.state.formData.invNomen.map(obj => obj.value);
    invNomenValue.forEach(val => {
      const fd = new FormData();
      fd.append('parent', String(val));
      fd.append('propConsts', 'nomenIndex');
      getObjListNew(fd)
        .then(res => {
          if(res.success) {
            this.setState({ loading: false,
              treeData: this.state.treeData.concat(res.data.map(o => ({
                key: o.id,
                title: o.name[this.lng],
                isLeaf: !o.hasChild,
                nomenIndex: o.nomenIndex && o.nomenIndex[this.lng]
              })))
            })
          } else {
            console.log(res);
            this.setState({ loading: false, openCard: false })
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, openCard: false })
        });
      this.setState({ openCard: true, cardLoading: true })
    });
  };
  onLoadData = (treeNode) => {
    if(treeNode.props.dataRef.children) {
      return Promise.resolve({success: true})
    }
    const fd = new FormData();
    fd.append('parent', treeNode.props.dataRef.key);
    fd.append('propConsts', 'nomenIndex');
    return getObjListNew(fd)
      .then(res => {
        if(res.success) {
          treeNode.props.dataRef.children = res.data.map(o => ({
            key: o.id,
            title: o.name[this.lng],
            isLeaf: !o.hasChild,
            nomenIndex: o.nomenIndex && o.nomenIndex[this.lng]
            // perechenNote: o.perechenNote,
            // shelfLifeOfPerechen: o.shelfLifeOfPerechen
          }));
          this.setState({
            treeData: [...this.state.treeData],
          });
          return {success: true}
        }
      })
      .catch(err => {
        console.log(err);
      })
  };

  createNewObj = async (objVerData, values, objData) => {
    const hideCreateObj = message.loading('CREATING_NEW_OBJECT', 100);
    try {
      const createdObj = await createObj(objVerData.cube, objVerData.obj);
      hideCreateObj();
      if (createdObj.success) {
        const filters = {
          filterDOAnd: [
            {
              dimConst: objVerData.cube.doConst,
              concatType: "and",
              conds: [
                {
                  ids: createdObj.data.idItemDO
                }
              ]
            }
          ]
        };
                              await this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(filters));
        const savedCubeData = await this.onSaveCubeData(objVerData, values, createdObj.data.idItemDO, objData);
        if(savedCubeData.success) {
          const { doForInv, dpForInv } = this.props.tofiConstants;
          this.setState({
            loading: false,
            formData: values,
            lInv: parseCube_new(
              this.props.CubeForAF_Inv['cube'],
              [],
              'dp',
              'do',
              this.props.CubeForAF_Inv[`do_${doForInv.id}`],
              this.props.CubeForAF_Inv[`dp_${dpForInv.id}`],
              `do_${doForInv.id}`,
              `dp_${dpForInv.id}`)[0]
          })
        }
        console.log(savedCubeData);
        // return Promise.resolve();
      }
    } catch(err) {
      return Promise.reject();
      console.error(err);
    }
  };
  onSaveCubeData = (objVerData, {agreementProtocol, agreement2Protocol, approvalProtocol ,...values}, doItemProp, objDataProp) => {
    let datas = [];
    try {
      datas = [{
        own: [{doConst: objVerData.cube.doConst, doItem: doItemProp, isRel: "0", objData: objDataProp }],
        props: map(values, (val, key) => {
          const propMetaData = getPropMeta(this.props[objVerData.cube.cubeSConst]["dp_" + this.props.tofiConstants[objVerData.cube.dpConst].id], this.props.tofiConstants[key]);
          let value = val;
          if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {kz: val, ru: val, en: val};
          if(typeof val === 'object' && val.value) value = String(val.value);
          if(typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
          if(propMetaData.isUniq === 2 && val instanceof File) {

          }
          if(propMetaData.isUniq === 2 && val[0] && val[0].value) {
            propMetaData.mode = val[0].mode;
            value = val.map(v => String(v.value)).join(",");
          }
          return {propConst: key, val: value, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq), mode: propMetaData.mode }
        }),
        periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
      }];
    } catch(err) {
      console.error(err);
      return Promise.reject();
    }
    const hideLoading = message.loading('UPDATING_PROPS', 100);
    return updateCubeData(objVerData.cube.cubeSConst, moment().format('YYYY-MM-DD'), JSON.stringify(datas), {}, {approvalProtocol, agreementProtocol, agreement2Protocol})
      .then(res => {
        hideLoading();
        if(res.success) {
          message.success('PROPS_SUCCESSFULLY_UPDATED');
          if(this.filters) {
            this.setState({loading: true});
            return this.props.getCube(objVerData.cube.cubeSConst, JSON.stringify(this.filters))
              .then(() => {
                this.setState({loading: false});
                return {success: true}
              })
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
      .catch(err => {
        console.error(err);
        return Promise.reject();
      })
  };

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { openCard, data, treeData, lInv, formData } = this.state;
    const { t, invTypeOptions, invCaseSystemOptions, documentTypeOptions, tofiConstants } = this.props;

    this.lng = localStorage.getItem('i18nextLng');
    return (
      <div className="LegalEntitiesInventoriesMain">
        <div className="LegalEntitiesInventoriesMain__property">
          <LegalEntitiesInventoryProps
            tofiConstants={tofiConstants}
            lng={this.lng}
            user={this.props.user}
            createNewObj={this.createNewObj}
            t={t}
            getNomenOptions={() => {
              const fd = new FormData();
              fd.append('objId', this.props.location.state.record.key.split('_')[1]);
              fd.append('propConst', 'nomen');
              getObjFromProp(fd)
                .then(res => {
                  if(res.success) {
                    this.setState({nomenOptions: res.data.length !== 0 ? res.data.map(option => ({ value: option.id, label: option.name[this.lng] })) : []})
                  }
                })
            }}
            record={this.props.location && this.props.location.state && this.props.location.state.record}
            nomenOptions={this.state.nomenOptions}
            invTypeOptions={invTypeOptions}
            documentTypeOptions={documentTypeOptions}
            invCaseSystemOptions={invCaseSystemOptions}
            loadOptions={this.loadOptions}
          />
        </div>
        <div className="LegalEntitiesInventoriesMain__table">
          <div className="LegalEntitiesInventoriesMain__table__heading">
            <div className="table-header">
              <Button onClick={this.addNew} disabled={!lInv.id}>{t('ADD')}</Button>
              <Button onClick={() => this.addNewChild('structuralSubdivisionList')} disabled={isEmpty(this.state.selectedRow)}>{t('ADD_FIRST_LEVEL_CHILD')}</Button>
              <Button onClick={this.openArticles} disabled={isEmpty(this.state.selectedRow)}>{t('ADD_SECOND_LEVEL_CHILD')}</Button>
              {lInv.name && <h3 style={{textAlign: 'right', textTransform: 'uppercase', fontWeight: 'bold', paddingRight: '10px'}}>{lInv.name.kz}</h3>}
            </div>
          </div>
          <div className="LegalEntitiesInventoriesMain__table__body">
            <div className="LegalEntitiesInventoriesMain__table__body--main">
             <Table
              columns={[
                ...this.buildTableColumns(formData.invType && formData.invType.value, formData.documentType && formData.documentType.value),
                {
                  key: 'action',
                  title: 'action',
                  dataIndex: 'a',
                  width: '4%',
                  render: (text, record) => {
                    const { editable } = record;
                    const disable = false;
                    return (
                      <span className="editable-row-operations">
                        {
                          editable ?
                            <span>
                              <a onClick={this.save(record.key)} disabled={disable}><Icon type="check"/></a>
                              <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key)}>
                                <a style={{marginLeft: '5px'}} onClick={this.stopPropagation}><Icon type="close"/></a>
                              </Popconfirm>
                            </span>
                            : <span>
                                <a><Icon type="edit" style={{fontSize: '14px'}} onClick={this.edit(record.key)}/></a>
                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key)}>
                                  <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}} onClick={this.stopPropagation}><Icon type="delete" className="editable-cell-icon"/></a>
                                </Popconfirm>
                              </span>
                        }
                      </span>
                    );
                  }
                }
              ]}
              size="small"
              bordered
              dataSource={data}
              onRowClick={this.onRowClick}
              scroll={{y: '100%'}}
              rowClassName={record => this.state.selectedRow.key === record.key ? 'row-selected' : ''}
            />
            </div>
            <CSSTransition
              in={openCard}
              timeout={300}
              classNames="card"
              unmountOnExit
            >
              <SiderCardLegalEntities closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="close"/>} >
                <Tree
                  checkable
                  loadData={this.onLoadData}
                  onCheck={this.onCheck}
                  checkedKeys={this.state.checkedKeys}
                >
                  {this.renderTreeNodes(treeData)}
                </Tree>
                <div className="ant-form-btns">
                  <Button onClick={() => this.addNewChild('caseList')}>Сформировать</Button>
                </div>
              </SiderCardLegalEntities>
            </CSSTransition>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    CubeForAF_Inv: state.cubes[CUBE_FOR_AF_INV],
    CubeForAF_Case: state.cubes[CUBE_FOR_AF_CASE],
    invTypeOptions: state.generalData.invType,
    invCaseSystemOptions: state.generalData.invCaseSystem,
    documentTypeOptions: state.generalData.documentType,
    typeOfPaperCarrierOptions: state.generalData.typeOfPaperCarrier,
    inaccurateDateFeatureOptions: state.generalData.inaccurateDateFeature,
    uprDocTypeOptions: state.generalData.uprDocType
  }
}

export default connect(mapStateToProps, {getPropVal, getCube})(LegalEntitiesInventoriesMain);