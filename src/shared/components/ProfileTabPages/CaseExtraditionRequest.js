import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { renderInput, renderSelect, renderSearchBox } from '../../../shared/utils/form_components';
import { statuses } from '../../constants/constants';

import AntTable from '../AntTable';

class CaseExtraditionRequest extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      status: statuses && statuses[0].value
    }
  }

  render() {

    const { status } = this.state;

    return (
      <div className="CaseExtraditionRequest">
        <h3 className="CaseExtraditionRequest__heading">Требования на выдачу дел</h3>

        <div className="CaseExtraditionRequest__filter">
          <div className="flex">
            <span className="center-with-ant-input">За последние </span>
            <Field
              className="CaseExtraditionRequest__filter_inputDay"
              name='caseLastNDays'
              component={renderInput}
              type="number"
            />
            <span className="center-with-ant-input"> дней </span>
          </div>

          <Field
            name='caseStatus'
            component={renderSelect}
            data={statuses}
            handleSelect={(value) => this.setState({ status: value })}
            placeholder="Статус"
            selectedValue={status}
          />

          <Field
            name='caseSearch'
            component={renderSearchBox}
            type="search"
          />

        </div>
        <div className="CaseExtraditionRequest__body">
          <AntTable
            dataSource={
              [
                {
                  key: '1',
                  name: 'case',
                  reqDate: '1111.11.11',
                  researchTopic: 'hero',
                  status: 'approved',
                  children: [
                    {
                      key: '2',
                      name: 'case2',
                      reqDate: '2222.11.11',
                      researchTopic: 'newHero',
                      status: 'approved',
                    }
                  ]
                }
              ]
            }
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
                  key: 'researchTopic',
                  title: 'Тема исследования',
                  dataIndex: 'researchTopic'
                },
                {
                  key: 'status',
                  title: 'Статус',
                  dataIndex: 'status',
                }
              ]
            }
          />
        </div>
      </div>
    )
  }
}

export default reduxForm({ form: 'CaseExtraditionRequest_filter' })(CaseExtraditionRequest);
