import React from 'react';
import { Breadcrumb } from 'antd';
import { isEmpty, isEqual } from 'lodash';

import AntTable from '../../AntTable';
import FundsInGuide from './FundsInGuide';
import InventoriesInFund from './InventoriesInFund';
import CasesInInventory from './CasesInInventory';


const Breadcrumbs = ({handleBreadcrumbClick, breadcurmbItems, lng}) => <Breadcrumb>
{
  breadcurmbItems.map((el, ix) => {
    if (ix == 0 && breadcurmbItems.length == 1){
      return (<Breadcrumb.Item key={'bradcrumb' + ix}>{el.title[lng] || el.title}</Breadcrumb.Item>);
    } else{
      return (<Breadcrumb.Item key={'bradcrumb' + ix}><a role="button" tabIndex={ix} data-index={ix} onClick={() => handleBreadcrumbClick(el, ix)}>{el.title[lng] || el.title}</a></Breadcrumb.Item>);
    }
    // return (<Breadcrumb.Item key={'bradcrumb' + ix}>{ ix > 0 && ' / ' }<a role="button" tabIndex={ix} data-index={ix} onClick={handleBreadcrumbClick(el)}>{el}</a></Breadcrumb.Item>);
  })
}
</Breadcrumb>

class Guides extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          data: [],
          loading: true,
          errors: {},
          selectedGuide: null,
          selectedFund: null,
          selectedInventory: null,
          activePart: 0,
          breadcurmbItems: []
      }
  }

    lng = '';

  componentDidMount() {
    if(Array.isArray(this.props.guidesData) && this.props.guidesData.length > 0) {
      this.setState({
        loading: false,
        data: this.props.guidesData.map(this.renderTableData)
      });
    } else {
      this.setState({
        loading: false,
        data: []
      });
    }
  }

  componentDidUpdate(prevProps){
      if (this.props.guidesData && prevProps.guidesData != this.props.guidesData) {
            this.setState({
              loading: false,
              data: this.props.guidesData.map(this.renderTableData)
            });
      }
  }

  // при втором клике путеводителя обновляем стейт, чтобы рендерить дом фондов
  onGuideSelect = rec => {
    if (!rec.children){
      if(isEmpty(this.state.selectedGuide)){
        this.setState({ selectedGuide: rec });
      } else if (rec){
        this.setState({
            selectedGuide: rec,
            activePart: 1,
            breadcurmbItems: [{...rec}]
        });
      }
    }
  };

  // аналогично, чтобы рендерить дом описей
    onFundSelect = fund => {
      this.setState({
        selectedFund: fund,
        activePart: 2,
        breadcurmbItems: [{...this.state.breadcurmbItems[0]}, {...fund}]
      });
    };

    // аналогично, чтобы рендерить дом дел
    onInventorySelect = inventory => {
      this.setState({
        selectedInventory: inventory,
        activePart: 3,
        breadcurmbItems: [{...this.state.breadcurmbItems[0]}, {...this.state.breadcurmbItems[1]}, {...inventory}]
      });
    };

  renderTableData = (item, idx) => {
        if(item.children) {
          return {
            id: item.own,
            key: item.id,
            numb: idx + 1,
            title: !!item.name ? item.name : {kz: '', ru: '', en: ''},
            children: item.children.map(this.renderTableData)
          }
        } else {
          return {
            id: item.own,
            key: item.id,
            numb: idx + 1,
            title: !!item.name ? item.name : {kz: '', ru: '', en: ''},
          }
        }
      };

    // здесь происходит перерендер фондов/описей/дел
    renderChildData = () => {
        const { activePart, selectedGuide, selectedFund, selectedInventory } = this.state;
        switch(activePart) {
            case 1:
                return <FundsInGuide 
                        onFundSelect={this.onFundSelect} 
                        selectedGuide={selectedGuide} 
                        t={this.props.t}
                        />;

            case 2:
                return <InventoriesInFund 
                        onInventorySelect={this.onInventorySelect} 
                        selectedGuide={selectedGuide} 
                        selectedFund={selectedFund} 
                        t={this.props.t}
                        />;

            case 3:
                return <CasesInInventory 
                        selectedGuide={selectedGuide} 
                        selectedFund={selectedFund} 
                        selectedInventory={selectedInventory} 
                        t={this.props.t}
                        />;
            default:
                return null;
        }
    }

    handleBreadcrumbClick = (item, ix) => {
      if (item){
        switch(ix){
          case 0:
            this.onGuideSelect(item);
            break;
          case 1:
            this.onFundSelect(item);
            break;
          case 2:
            this.onInventorySelect(item);
          default:
            break;
        }
      }
    }

  render() {
    const { data, loading, breadcurmbItems } = this.state;
    // const {fundNumber} = this.props.tofiConstants

    this.lng = localStorage.getItem('i18nextLng');
    // this.filteredData = data.filter(item => {
    //   return (
    //     item.fundTitle.toLowerCase().includes(search.toLowerCase()) ||
    //     item.fundNumb.includes(search.toLowerCase()) ||
    //     item.fundAnnotation.toLowerCase().includes(search.toLowerCase()) ||
    //     item.deadline.toLowerCase().includes(search.toLowerCase()) ||
    //     item.amount.toLowerCase().includes(search.toLowerCase())
    //   )
    // });
    const { t } = this.props;
    return (
      <div className="Guides">
        <div className="Guides__header">
        </div>
        <div className="Guides__body">
          <div className="guidesTree">
            <AntTable
              openedBy='ArchiveFundList'
              loading={ loading }
              hidePagination={true}
              columns={
                [
                  {
                    key: 'title',
                    title: t('GUIDE'),
                    dataIndex: 'title',
                    width: '20%',
                    render: obj => {return obj ? obj[this.lng] : ''}
                  }
                ]
              }
              dataSource={ Array.isArray(data) && data.length > 0 ? data : [] }
              changeSelectedRow={this.onGuideSelect}
            />
          </div>
          <div className="guidesChild">
              <Breadcrumbs handleBreadcrumbClick={this.handleBreadcrumbClick} breadcurmbItems={breadcurmbItems} lng={this.lng} />
              { this.renderChildData() }
          </div>
        </div>
      </div>
    )
  }
}

export default Guides;
