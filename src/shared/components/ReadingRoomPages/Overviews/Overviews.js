import React from 'react';
import AntTable from '../../AntTable';

class Overviews extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          data: [],
          loading: false,
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
    if(Array.isArray(this.props.overviewsData) && this.props.overviewsData.length > 0) {
      this.setState({
        loading: false,
        data: this.props.overviewsData.map(this.renderTableData)
      });
    } else {
      this.setState({
        loading: false,
        data: []
      });
    }
  }

  componentDidUpdate(prevProps){
      if (this.props.overviewsData && prevProps.overviewsData != this.props.overviewsData) {
            this.setState({
              loading: false,
              data: this.props.overviewsData.map(this.renderTableData)
            });
      }
  }

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

  render() {
    const { data, loading, breadcurmbItems } = this.state;
    // const {fundNumber} = this.props.tofiConstants

    this.lng = localStorage.getItem('i18nextLng');
    console.log('data', data);
    console.log('this.props.overviewsData', this.props.overviewsData);
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
                    title: t('OVERVIEWS'),
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
        </div>
      </div>
    )
  }
}

export default Overviews;
