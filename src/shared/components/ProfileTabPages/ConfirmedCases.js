import React from 'react';
import AntTable from '../AntTable';

const ConfirmedCases = (props) => {
  return (
    <div className="ConfirmedCases">
      <h3 className="ConfirmedCases__heading">Список подтвержденных дел</h3>

      <div className="ConfirmedCases__body">

        <AntTable
          dataSource={[]}
          loading={false}
          columns={
            [
              {
                key: 'numb',
                title: '№',
                dataIndex: 'numb',
              },
              {
                key: 'cases',
                title: 'Дела',
                dataIndex: 'cases',
              },
              {
                key: 'reqDate',
                title: 'Дата требования',
                dataIndex: 'reqDate',
              },
              {
                key: 'accessDbeg',
                title: 'Начало доступа',
                dataIndex: 'accessDbeg',
              },
              {
                key: 'accessDend',
                title: 'Окончание доступа',
                dataIndex: 'accessDend',
              }
            ]
          }
        />
      </div>
    </div>
  )
};

export default ConfirmedCases;
