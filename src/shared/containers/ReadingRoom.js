import React from 'react';
import { translate } from 'react-i18next';
import { Input } from 'antd';
import {compose} from "redux";
import { connect } from 'react-redux';

import AntTabs from '../components/AntTabs';
import {Guides} from '../components/ReadingRoomPages/Guides';
import {Catalogs} from '../components/ReadingRoomPages/Catalogs';
import {Pointers} from '../components/ReadingRoomPages/Pointers';
import {Overviews} from '../components/ReadingRoomPages/Overviews';
import { isEmpty } from 'lodash';
import {parseCube_new} from '../utils/cubeParser';
import {getCube} from '../actions/actions';

const Search = Input.Search;

class ReadingRoom extends React.Component {

  constructor(props) {
    super (props);

    this.state = {
      search: '',
      guidesData: [],
      catalogsData: [],
      pointersData: [],
      overviewsData:[]
    }
  }

  parsedCudeData = [];

  componentDidMount() {
    if(isEmpty(this.props.allData)) {
        this.setState({loading: true});
        this.props.getCube("cubeTest", null, {nodeWithChilds: 1});
    } else {
      const { allData, tofiConstants: { doTest, dpTest, clsPutev, clsKatalog, clsUkaz, clsObzor } } = this.props;
      this.parsedCudeData = parseCube_new(
        allData['cube'],
        [],
        'dp',
        'do',
        allData[`do_${doTest.id}`],
        allData[`dp_${dpTest.id}`],
        `do_${doTest.id}`,
        `dp_${dpTest.id}`
      );
          this.setState({
            loading: false,
            guidesData: this.parsedCudeData.map(this.initChildrens).filter(p => p.clsORtr == clsPutev.id),
            catalogsData: this.parsedCudeData.map(this.initChildrens).filter(p => p.clsORtr == clsKatalog.id),
            pointersData: this.parsedCudeData.map(this.initChildrens).filter(p => p.clsORtr == clsUkaz.id),
            overviewsData: this.parsedCudeData.map(this.initChildrens).filter(p => p.clsORtr == clsObzor.id)
          });
    }
  }

  componentDidUpdate(prevProps){
      if(isEmpty(this.props.tofiConstants))
        return;

      if (this.props.allData && prevProps.allData != this.props.allData) {
        const { allData, tofiConstants: { doTest, dpTest, clsPutev, clsKatalog, clsUkaz, clsObzor } } = this.props;
        this.parsedCudeData = parseCube_new(
          allData['cube'],
          [],
          'dp',
          'do',
          allData[`do_${doTest.id}`],
          allData[`dp_${dpTest.id}`],
          `do_${doTest.id}`,
          `dp_${dpTest.id}`
        );
            this.setState({
              loading: false,
              guidesData: this.parsedCudeData.map(this.initChildrens).filter(p => p.clsORtr == clsPutev.id),
              catalogsData: this.parsedCudeData.map(this.initChildrens).filter(p => p.clsORtr == clsKatalog.id),
              pointersData: this.parsedCudeData.map(this.initChildrens).filter(p => p.clsORtr == clsUkaz.id),
              overviewsData: this.parsedCudeData.map(this.initChildrens).filter(p => p.clsORtr == clsObzor.id)
            });
      }
  }

  initChildrens = item => {
    if(item.hasChild || this.parsedCudeData.some(p => p.parent == item.idVer)) {
      return {
        ...item,
        children: this.parsedCudeData.filter(elem => elem.parent == item.idVer).map(this.initChildrens)
      }
    } else {
      return {
        ...item,
      }
    }
  };

  searchUpdate = e => {
    this.setState({ search: e.target.value })
  };

  render() {
    const { guidesData, catalogsData, pointersData, overviewsData, search } = this.state;
    const { t } = this.props;
    return (
      <div className="readingRoom">
        <div className="readingRoom__head flex">
          <h2 className="readingRoom__heading">{ t('READING_ROOM') }</h2>
          <div className="readingRoom__globalSearch">
          <Search onChange={this.searchUpdate}/>
          </div>
        </div>
        <div className="readingRoom__content">
          <AntTabs tabs={[
                    {
                      tabKey: 'guides',
                      tabName: t('GUIDES'),
                      tabContent: <Guides guidesData={guidesData} search={search} t={ t }/>
                    },
                    {
                      tabKey: 'catalogs',
                      tabName: t('CATALOGS'),
                      tabContent: <Catalogs catalogsData={catalogsData} search={search} t={ t }/>
                    },
                    {
                      tabKey: 'pointers',
                      tabName: t('POINTERS'),
                      tabContent: <Pointers pointersData={pointersData} search={search} t={ t }/>
                    },
                    {
                      tabKey: 'overviews',
                      tabName: t('OVERVIEWS'),
                      tabContent: <Overviews overviewsData={overviewsData} search={search} t={ t }/>
                    }
                ]}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allData: state.cubes['cubeTest'],
    tofiConstants: state.generalData.tofiConstants
  }
}

export default  compose(
        connect(mapStateToProps, { getCube }), 
        translate('readingRoom')
)(ReadingRoom);


