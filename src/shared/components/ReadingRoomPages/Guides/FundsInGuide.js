import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { isEmpty, isEqual } from 'lodash';

import {parseCube_new} from '../../../utils/cubeParser';
import AntTable from '../../AntTable';
import {getCube} from '../../../actions/actions';
import {
  CUBE_FOR_FUND_AND_IK, DO_FOR_FUND_AND_IK, DP_FOR_FUND_AND_IK 
} from '../../../constants/tofiConstants';

class FundsInGuide extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      errors: {},
      selectedFund: null
    }
  }

  parsedCudeData = [];

  componentDidMount() {
    const filters = {
        filterDOAnd: [
            {
                dimConst: DO_FOR_FUND_AND_IK,
                concatType: "and",
                conds: [
                    {
                        data: {
                            valueRef: {
                                id: `${this.props.selectedGuide.key}`
                            }
                        }
                    }
                ]
            }
        ]
    };
    // if(isEmpty(this.props.funds)) {
        this.setState({loading: true});
        this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(filters));
    // }
  }

  componentDidUpdate(prevProps){
      if(isEmpty(this.props.tofiConstants)) 
        return;

      if (this.props.funds && prevProps.funds !== this.props.funds) {
        const { funds, tofiConstants: { doForFundAndIK, dpForFundAndIK } } = this.props;
        if (funds['cube']){
            this.parsedCudeData = parseCube_new(
                funds['cube'],
                [],
                'dp',
                'do',
                funds[`do_${doForFundAndIK.id}`],
                funds[`dp_${dpForFundAndIK.id}`],
                `do_${doForFundAndIK.id}`,
                `dp_${dpForFundAndIK.id}`
            );
            this.setState({
                loading: false,
                data: this.parsedCudeData.map(this.renderTableDataWithChildren)
            });
        } else{
            this.setState({ 
                loading: false, 
                data: []
            });
        }
      } else if (!isEqual(this.props.selectedGuide, prevProps.selectedGuide)){
        const filters = {
            filterDOAnd: [
                {
                    dimConst: DO_FOR_FUND_AND_IK,
                    concatType: "and",
                    conds: [
                        {
                            data: {
                                valueRef: {
                                    id: `${this.props.selectedGuide.key}`
                                }
                            }
                        }
                    ]
                }
            ]
        };
        this.setState({loading: true});
        this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(filters));
      }
  }

  changeSelectedFund = rec => {
    if(isEmpty(this.state.selectedFund)){
      this.setState({ selectedFund: rec })
    } else {
      if (this.props.onFundSelect){
          this.props.onFundSelect(rec);
      }
    }
  };

  renderTableDataWithChildren = item => {
    const { fundDbeg, fundDend, fundNumber, fundIndex, fundCategory, fundNumberOfCases } = this.props.tofiConstants;
    const fundNumbObj = item.props.find(element =>  element.prop == fundNumber.id),
          fundIndexObj = item.props.find(element => element.prop == fundIndex.id),
          fundCategoryObj = item.props.find(element => element.prop == fundCategory.id),
          fundNumberOfCasesObj = item.props.find(element => element.prop == fundNumberOfCases.id),
          dendObj = item.props.find(element => element.prop == fundDend.id),
          dbegObj = item.props.find(element => element.prop == fundDbeg.id);
    if(this.parsedCudeData.some(p => p.parent == item.idVer)) {
      return {
        key: item.id,
        fundType: this.props.tofiConstants[['fundOrg','fundLP','collectionOrg','collectionLP','jointOrg','jointLP'].find(c => this.props.tofiConstants[c].id == item.clsORtr)].name[this.lng],
        title: !!item.name ? item.name[localStorage.getItem('i18nextLng')] || '' : '',
        fundNumb: !!fundNumbObj ? fundNumbObj.value || '' : '',
        fundIndex: !!fundIndexObj ? fundIndexObj.value || '' : '',
        fundDend: !!dendObj ? dendObj.value || '' : '',
        fundDbeg: !!dbegObj ? dbegObj.value || '' : '',
        fundAnnotation: '',
        deadline: (!!dbegObj ? dbegObj.value || '' : '') + ' - ' + (!!dendObj ? dendObj.value || '' : ''),
        fundCategory: !!fundCategoryObj ? fundCategoryObj.value || '' : '',
        fundNumberOfCases: !!fundNumberOfCasesObj ? fundNumberOfCasesObj.value || '' : '',
        children: this.parsedCudeData.filter(elem => elem.parent == item.idVer).map(this.renderTableDataWithChildren)
      }
    } else {
      return {
        key: item.id,
        fundType: this.props.tofiConstants[['fundOrg','fundLP','collectionOrg','collectionLP','jointOrg','jointLP'].find(c => this.props.tofiConstants[c].id == item.clsORtr)].name[this.lng],
        title: !!item.name ? item.name[localStorage.getItem('i18nextLng')] || '' : '',
        fundNumb: !!fundNumbObj ? fundNumbObj.value || '' : '',
        fundIndex: !!fundIndexObj ? fundIndexObj.value || '' : '',
        fundDend: !!dendObj ? dendObj.value || '' : '',
        fundDbeg: !!dbegObj ? dbegObj.value || '' : '',
        fundAnnotation: '',
        deadline: (!!dbegObj ? dbegObj.value || '' : '') + ' - ' + (!!dendObj ? dendObj.value || '' : ''),
        fundNumberOfCases: !!fundNumberOfCasesObj ? fundNumberOfCasesObj.value || '' : '',
        fundCategory: !!fundCategoryObj ? fundCategoryObj.value || '' : '',
      }
    }
  };

  render() {
    const { data, loading } = this.state; 
    const {fundNumber, fundNumberOfCases} = this.props.tofiConstants;
    
    const lng = localStorage.getItem('i18nextLng');
    const { t } = this.props;
    return (
      <div className="Funds">
        <div className="Funds__header">
          <h2 className="Funds__heading">{t('FUNDS')}</h2>
        </div>
        <div className="Funds__body">
            <AntTable
              openedBy='Funds'
              loading={ loading }
              hidePagination={true}
              columns={
                [
                  {
                    key: 'fundNumb',
                    title: fundNumber.name[lng],
                    dataIndex: 'fundNumb',
                    width: '15%'
                  },
                  {
                    key: 'title',
                    title: t('TITLE'),
                    dataIndex: 'title',
                    width: '15%'
                  },
                  {
                    key: 'fundAnnotation',
                    title: t('FUNDANNOTATION'),
                    dataIndex: 'fundAnnotation',
                    width: '20%'
                  },
                  {
                    key: 'deadline',
                    title: t('DEADLINE'),
                    dataIndex: 'deadline',
                    width: '15%'
                  },
                  {
                    key: 'fundNumberOfCases',
                    title: fundNumberOfCases.name[lng],
                    dataIndex: 'fundNumberOfCases',
                    width: '15%'
                  }
                ]
              }
              dataSource={ Array.isArray(data) && data.length > 0 ? data : [] }
              changeSelectedRow={this.changeSelectedFund}
            />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    funds: state.cubes[CUBE_FOR_FUND_AND_IK],
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, { getCube })(FundsInGuide);
