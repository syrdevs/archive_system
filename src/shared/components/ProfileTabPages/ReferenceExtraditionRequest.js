import React from 'react';
import AntTable from '../AntTable';

const ReferenceExtraditionRequest = (props) => {
  return (
    <div className="ReferenceExtraditionRequest">
      <h3 className="ReferenceExtraditionRequest__heading">Список требований на выдачу архивных справок</h3>

      <div className="ReferenceExtraditionRequest__body">
        <AntTable
          dataSource={[]}
          loading={false}
          columns={
            [
              {
                key: 'name',
                title: 'Наименование',
                dataIndex: 'name',
              },
              {
                key: 'reqDate',
                title: 'Дата требования',
                dataIndex: 'reqDate',
              },
              {
                key: 'referenceType',
                title: 'Вид справки',
                dataIndex: 'referenceType'
              },
              {
                key: 'status',
                title: 'Статус',
                dataIndex: 'status',
              },
              {
                key: 'elecViewReference',
                title: 'Электронный вариант справки',
                dataIndex: 'elecViewReference',
              }
            ]
          }
        />
      </div>
    </div>
  )
};

export default ReferenceExtraditionRequest;
