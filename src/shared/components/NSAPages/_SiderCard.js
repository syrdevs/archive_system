import React from 'react';
import AntTabs from '../AntTabs';
import moment from 'moment';

import ClassificationInfo from './ClassificationInfo';
import ClassificationHierarchy from './ClassificationHierarchy';
import ClassificationRequisites from './ClassificationRequisites';

class SiderCard extends React.PureComponent {
  
 render() {
    const { t, tofiConstants, initialValues, record, activeKey, hierarchyData } = this.props;
    
    return (
      <div className="card">  
        {this.props.closer}
        <AntTabs activeKey={activeKey} tabs={[
          {
            tabKey: 'description',
            tabName: t('DESCRIPTION'),
            tabContent: <ClassificationInfo tofiConstants={tofiConstants} t={t} initialValues={initialValues} record={record} />
          },
          {
            tabKey: 'hierarchy',
            tabName: t('HIERARCHY'),
            tabContent: <ClassificationHierarchy tofiConstants={tofiConstants} t={t} data={hierarchyData} />
          },
          {
            tabKey: 'requisites',
            tabName: t('REQUISITES'),
            tabContent: <ClassificationRequisites tofiConstants={tofiConstants} t={t} />
          }
        ]} onTabClick={this.props.onTabClick} />
      </div>
    )

  }
}

export default SiderCard;