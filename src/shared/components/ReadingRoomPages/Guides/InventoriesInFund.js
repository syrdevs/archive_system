import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { isEmpty, isEqual } from 'lodash';

import {parseCube_new} from '../../../utils/cubeParser';
import AntTable from '../../AntTable';
import {getCube} from '../../../actions/actions';
import {
    CUBE_FOR_AF_INV, DO_FOR_INV, DP_FOR_INV
} from '../../../constants/tofiConstants';

class InventoriesInFund extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: false,
            errors: {},
            selectedInventory: null
        }
    }

    parsedCudeData = [];

    componentDidMount() {
        const filters = {
            filterDOAnd: [
                {
                    dimConst: DO_FOR_INV,
                    concatType: "and",
                    conds: [
                        {
                            data: {
                                valueRef: {
                                    id: `${this.props.selectedFund.key}`
                                }
                            }
                        }
                    ]
                }
            ] 
        };
        // if (isEmpty(this.props.inventories)) {
            this.setState({loading: true});
            this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(filters));
        // }
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(this.props.tofiConstants))
            return;

        if (this.props.inventories && prevProps.inventories != this.props.inventories) {
            const {inventories, tofiConstants: {doForInv, dpForInv}} = this.props;
            this.parsedCudeData = parseCube_new(
                inventories['cube'],
                [],
                'dp',
                'do',
                inventories[`do_${doForInv.id}`],
                inventories[`dp_${dpForInv.id}`],
                `do_${doForInv.id}`,
                `dp_${dpForInv.id}`
            );
            this.setState({
                loading: false,
                data: this.parsedCudeData.map(this.renderTableDataWithChildren)
            });
        } else if (!isEqual(this.props.selectedFund, prevProps.selectedFund)){
            const filters = {
                filterDOAnd: [
                    {
                        dimConst: DO_FOR_INV,
                        concatType: "and",
                        conds: [
                            {
                                data: {
                                    valueRef: {
                                        id: `${this.props.selectedFund.key}`
                                    }
                                }
                            }
                        ]
                    }
                ]
            };
            this.setState({loading: true});
            this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(filters));
          }
    }

    changeSelectedInventory = rec => {
        if(isEmpty(this.state.selectedInventory)){
          this.setState({ selectedInventory: rec })
        } else {
          if (this.props.onInventorySelect){
              this.props.onInventorySelect(rec);
          }
        }
    };

    renderTableDataWithChildren = (item, idx) => {
        const { invNumber, invDates, invType, fundNumberOfCases, fundNumberOfCasesWithFiles } = this.props.tofiConstants;
        const invNumbObj = item.props.find(element =>  element.prop == invNumber.id),
          invTypeObj = item.props.find(element => element.prop == invType.id),
          dbegObj = item.props.find(element => element.prop == invDates.id),
          fundNumberOfCasesObj = item.props.find(element => element.prop == fundNumberOfCases.id),
          fundNumberOfCasesWithFilesObj = item.props.find(element => element.prop == fundNumberOfCasesWithFiles.id);
        if(this.parsedCudeData.some(p => p.parent == item.idVer)) {
            return {
                key: item.id,
                title: !!item.name ? item.name[localStorage.getItem('i18nextLng')] || '' : '',
                inventNumb: !!invNumbObj ? invNumbObj.value || '' : '',
                invDates: !!dbegObj ? dbegObj.value || '' : '',
                inventType: !!invTypeObj ? invTypeObj.value || '' : '',
                fundNumberOfCases: !!fundNumberOfCasesObj ? fundNumberOfCasesObj.value || '' : '',
                fundNumberOfCasesWithFiles: !!fundNumberOfCasesWithFilesObj ? fundNumberOfCasesWithFilesObj.value || '' : '',
                amount: 0,
                children: this.parsedCudeData.filter(elem => elem.parent == item.idVer).map(this.renderTableDataWithChildren)
            }
        } else {
            return {
                key: item.id,
                title: !!item.name ? item.name[localStorage.getItem('i18nextLng')] || '' : '',
                inventNumb: !!invNumbObj ? invNumbObj.value || '' : '',
                invDates: !!dbegObj ? dbegObj.value || '' : '',
                inventType: !!invTypeObj ? invTypeObj.value || '' : '',
                fundNumberOfCases: !!fundNumberOfCasesObj ? fundNumberOfCasesObj.value || '' : '',
                fundNumberOfCasesWithFiles: !!fundNumberOfCasesWithFilesObj ? fundNumberOfCasesWithFilesObj.value || '' : '',
                amount: 0
            }
        }
    };

    render() {
        const {data, loading} = this.state;
        const {fundNumber, fundNumberOfCases} = this.props.tofiConstants;

        console.log('inv', data);

        const lng = localStorage.getItem('i18nextLng');
        const {t} = this.props;
        return (
            <div className="Inventories">
                <div className="Inventories__header">
                    <h2 className="Inventories__heading">{t('INVENTORIES')}</h2>
                </div>
                <div className="Inventories__body">
                    <AntTable
                        openedBy='Inventories'
                        loading={loading}
                        hidePagination={true}
                        columns={
                            [
                                {
                                    key: 'inventNumb',
                                    title: fundNumber.name[lng],
                                    dataIndex: 'inventNumb',
                                    width: '15%'
                                },
                                {
                                    key: 'title',
                                    title: t('TITLE'),
                                    dataIndex: 'title',
                                    width: '15%'
                                },
                                {
                                    key: 'invDates',
                                    title: t('DEADLINE'),
                                    dataIndex: 'invDates',
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
                        dataSource={Array.isArray(data) && data.length > 0 ? data : []}
                        changeSelectedRow={this.changeSelectedInventory}
                    />
                </div>
            </div>
        )
    }
}{}

function mapStateToProps(state) {
  return {
    inventories: state.cubes[CUBE_FOR_AF_INV],
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, { getCube })(InventoriesInFund);
