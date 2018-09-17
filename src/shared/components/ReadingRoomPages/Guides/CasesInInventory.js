import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { isEmpty, isEqual } from 'lodash';

import {parseCube_new} from '../../../utils/cubeParser';
import AntTable from '../../AntTable';
import {addCaseToBasket, casesLoaded, getCube, removeCaseFromBasket} from '../../../actions/actions';
import {Modal} from "antd/lib/index";
import {
    CASE_NUMB, CASES_DBEG, CASES_DEND, CUBE_FOR_AF_CASE, DO_FOR_CASE, DP_FOR_CASE, STATUS
} from '../../../constants/tofiConstants';

class CasesInInventory extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: false,
            errors: {},
            selectedRow: null
        }
    }

    parsedCudeData = [];

    componentDidMount() {
        const filters = {
            filterDOAnd: [
                {
                    dimConst: DO_FOR_CASE,
                    concatType: "and",
                    conds: [
                        {
                            data: {
                                valueRef: {
                                    id: `${this.props.selectedInventory.key}`
                                }
                            }
                        }
                    ]
                }
            ] 
        };
        // if (isEmpty(this.props.cases)) {
            this.setState({loading: true});
            this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters));
        // }
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(this.props.tofiConstants))
            return;

            console.log('this.props.cases', this.props.cases);

        if (this.props.cases && prevProps.cases != this.props.cases) {
            const {cases, tofiConstants: {doForCase, dpForCase}} = this.props;
            if (cases['cube']){
                this.parsedCudeData = parseCube_new(
                    cases['cube'],
                    [],
                    'dp',
                    'do',
                    cases[`do_${doForCase.id}`],
                    cases[`dp_${dpForCase.id}`],
                    `do_${doForCase.id}`,
                    `dp_${dpForCase.id}`
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
        } else if (!isEqual(this.props.selectedInventory, prevProps.selectedInventory)){
            const filters = {
                filterDOAnd: [
                    {
                        dimConst: DO_FOR_CASE,
                        concatType: "and",
                        conds: [
                            {
                                data: {
                                    valueRef: {
                                        id: `${this.props.selectedInventory.key}`
                                    }
                                }
                            }
                        ]
                    }
                ]
            };
            this.setState({loading: true});
            this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters));
          }
    }

    changeSelectedRow = rec => {
        if (isEmpty(this.state.selectedRow)) {
            this.setState({selectedRow: rec})
        } else {
            this.setState({openCard: true, selectedRow: rec})
        }
    };

    onCheckboxChanged = event => {
        let that = this;
        console.log('event', event, event.isChecked);
        // return {
        //     onSelect: (record, selected) => {
        //         const { t } = this.props;
        //         if(selected) {
        //             if(this.props.basket.length < 20) {
        //                 this.props.addCaseToBasket({...record, fundNumb: this.props.selectedFund.fundNumb, inventNumb: this.props.selectedInventory.inventNumb});
        //             } else {
        //                 Modal.info({
        //                     title: t('ABOVE_20_CASES_TITLE'),
        //                     content: t('ABOVE_20_CASES_TEXT'),
        //                     onOk() {},
        //                     okText: t('OK')
        //                 });
        //             }
        //         } else {
        //             this.props.removeCaseFromBasket(record);
        //         }
        //     },
        //     selectedRowKeys: that.props.basket.map(elem => elem.key)
        // }
    };

    rowSelection = () => {
        let that = this;
        return {
            onSelect: (record, selected) => {
                const { t } = this.props;
                if(selected) {
                    if(this.props.basket.length < 20) {
                        this.props.addCaseToBasket({...record, fundNumb: this.props.selectedFund.fundNumb, inventNumb: this.props.selectedInventory.inventNumb});
                    } else {
                        Modal.info({
                            title: t('ABOVE_20_CASES_TITLE'),
                            content: t('ABOVE_20_CASES_TEXT'),
                            onOk() {},
                            okText: t('OK')
                        });
                    }
                } else {
                    this.props.removeCaseFromBasket(record);
                }
            },
            selectedRowKeys: that.props.basket.map(elem => elem.key)
        }
    };

    renderTableDataWithChildren = (item, idx) => {
        const caseNumbObj = item.props.find(element => element.prop === CASE_NUMB),
        dendObj = item.props.find(element => element.prop === CASES_DEND),
        dbegObj = item.props.find(element => element.prop === CASES_DBEG),
        status = item.props.find(element => element.prop === STATUS);
        if(this.parsedCudeData.some(p => p.parent == item.idVer)) {
            return {
                key: item.id,
                fundNumb: item.id,
                inventNumb: item.id,
                caseNumb: caseNumbObj,
                archivalCipher: idx + 1,
                title: !!item.name ? item.name[localStorage.getItem('i18nextLng')] || '' : '',
                deadline: !!item.dend && moment(item.dend).isBefore('3333-12-31') ? moment(item.dend) : 'deadline' + (idx + 1),
                children: this.parsedCudeData.filter(elem => elem.parent == item.idVer).map(this.renderTableDataWithChildren)
            }
        } else{
            return {
                key: item.id,
                fundNumb: this.props.selectedFund.fundNumb,
                inventNumb: this.props.selectedInventory.inventNumb,
                caseNumb: caseNumbObj,
                archivalCipher: idx + 1,
                title: !!item.name ? item.name[localStorage.getItem('i18nextLng')] || '' : '',
                deadline: !!item.dend && moment(item.dend).isBefore('3333-12-31') ? moment(item.dend) : 'deadline' + (idx + 1)
            }
        }
    };

    render() {
        const {data, loading} = this.state;

        // const lng = localStorage.getItem('i18nextLng');
        const {t} = this.props;
        return (
            <div className="Cases">
                <div className="Cases__header">
                    <h2 className="Cases__heading">{t('CASES')}</h2>
                </div>
                <div className="Cases__body">
                    <AntTable
                        openedBy='Cases'
                        loading={loading}
                        hidePagination={true}
                        columns={
                            [
                                {
                                    key: 'archivalCipher',
                                    title: t('ARCHIVALCIPHER'),
                                    dataIndex: 'archivalCipher',
                                    width: '25%'
                                },
                                {
                                    key: 'title',
                                    title: t('TITLE'),
                                    dataIndex: 'title',
                                    width: '30%'
                                },
                                {
                                    key: 'deadline',
                                    title: t('DEADLINE'),
                                    dataIndex: 'deadline',
                                    width: '30%'
                                }
                                // ,
                                // {
                                //     key: 'chooseCases',
                                //     title: t('CHOOSECASES'),
                                //     dataIndex: 'chooseCases',
                                //     width: '35%',
                                //     render: () => {
                                //         return <input type='checkbox' onChange={e => this.onCheckboxChanged(e.target)}/>
                                //     }
                                // }
                            ]
                        }
                        dataSource={Array.isArray(data) && data.length > 0 ? data : []}
                        rowSelection={this.rowSelection()}
                        changeSelectedRow={() => {}}
                    />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
    cases: state.cubes[CUBE_FOR_AF_CASE],
      basket: state.readingRoom.basket,
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, { casesLoaded, addCaseToBasket, removeCaseFromBasket, getCube })(CasesInInventory);
