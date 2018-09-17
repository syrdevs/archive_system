import React from 'react';
import {Table, Popconfirm, Button, Icon, message} from 'antd';
import {isEmpty} from 'lodash';
import {Link} from 'react-router-dom';
import {parseCube_new} from '../../../utils/cubeParser';
import {dObj} from '../../../actions/actions';

/*eslint eqeqeq:0*/
class LegalEntitiesNomenclatureSmall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  remove = key => {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
  };

  stopPropagation = e => {
    e.stopPropagation();
  };
  renderInvTableHeader = () => {
    return (
      <div className="flex">
        <Link to={`/sourcing/sourcesMaintenance/legalEntities/${this.props.IK}/nomenclature`}><Button
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'}}
          type="primary"
          shape='circle'
          icon='plus'
        />
        </Link>
      </div>
    )
  };

  componentDidMount() {
    if(isEmpty(this.props.tofiConstants)) return;
    if(this.props.cubeSNomen) {
      const { dimObjNomen, dimPropNomen } = this.props.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(
            this.props.cubeSNomen['cube'],
            [],
            'dp',
            'do',
            this.props.cubeSNomen[`do_${dimObjNomen.id}`],
            this.props.cubeSNomen[`dp_${dimPropNomen.id}`],
            `do_${dimObjNomen.id}`,
            `dp_${dimPropNomen.id}`).map(this.renderTableData)
        }
      );
    } else {
      this.setState({ data: [] });
    }
  }

  componentDidUpdate(prevProps) {
    if(!this.props.cubeSNomen && prevProps.cubeSNomen) {
      this.setState({ data: [] })
    }
  }
  renderTableData = item => {
    const { nomenNumber, nomenAgreementDate, nomenPerechen } = this.props.tofiConstants;

    const nomenNumberObj = item.props.find(element => element.prop == nomenNumber.id),
      nomenAgreementDateObj = item.props.find(element => element.prop == nomenAgreementDate.id),
      nomenPerechenObj = item.props.find(element => element.prop == nomenPerechen.id);

    return {
      key: item.id,
      nomenNumber: nomenNumberObj ? nomenNumberObj.value || '' : '',
      nomenAgreementDate: nomenAgreementDateObj && nomenAgreementDateObj.value ? nomenAgreementDateObj.value : '',
      nomenPerechen: nomenPerechenObj && nomenPerechenObj.cube && nomenPerechenObj.cube.idRef ? { value: nomenPerechenObj.cube.idRef, label: nomenPerechenObj.cube.name[this.lng] } : null
    }
  };

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { tofiConstants: { nomenNumber, nomenAgreementDate, nomenPerechen } } = this.props;

    this.lng = localStorage.getItem('i18nextLng');
    return <div className="LegalEntitiesInventoriesSmall">
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', margin: '5px 0'}}>Номенклатура</h3>
      <Table
        bordered
        columns={[
          {
            key: 'nomenNumber',
            title: nomenNumber.name[this.lng],
            dataIndex: 'nomenNumber',
            width: '10%',
          }, {
            key: 'nomenAgreementDate',
            title: nomenAgreementDate.name[this.lng],
            dataIndex: 'nomenAgreementDate',
            width: '25%',
          }, {
            key: 'nomenPerechen',
            title: nomenPerechen.name[this.lng],
            dataIndex: 'nomenPerechen',
            width: '35%',
            render: value => value ? value.label : ''
          }, {
            key: 'action',
            title: '',
            dataIndex: '',
            width: '15%',
            render: (text, record) => {
              return (
                <div className="editable-row-operations">
                  <Link to={`/sourcing/sourcesMaintenance/legalEntities/${this.props.IK}/nomenclature/${record.key}`}><Icon type="edit" style={{fontSize: '14px'}}/></Link>
                  <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                    const fd = new FormData();
                    fd.append("cubeSConst", 'cubeSNomen');
                    fd.append("dimObjConst", 'dimObjNomen');
                    fd.append("objId", record.key.split('_')[1]);
                    const hideLoading = message.loading('REMOVING', 30);
                    dObj(fd)
                      .then(res => {
                        hideLoading();
                        if(res.success) {
                          message.success('SUCCESSFULLY_REMOVED');
                          this.remove(record.key, record.table)
                        } else {
                          throw res
                        }
                      }).catch(err => {
                      console.error(err);
                      message.error('REMOVING_ERROR')
                    })
                  }}>
                    <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}} onClick={this.stopPropagation}><Icon type="delete" className="editable-cell-icon"/></a>
                  </Popconfirm>
                </div>
              );
            },
          }
        ]}
        dataSource={this.state.data}
        size='small'
        title={this.renderInvTableHeader}
        pagination={false}
        scroll={{y: '100%'}}
        onRowClick={this.handleRowClick}
        style={{minHeight: 'unset', marginLeft: '5px', marginBottom: '30px'}}
      />
    </div>
  }
}

export default LegalEntitiesNomenclatureSmall;