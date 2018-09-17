import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { renderInput, renderSelect } from '../../../shared/utils/form_components';
import { countries, cities, researchs } from '../../constants/constants';
import UploadImage from '../../utils/UploadImage';
import {renderFileUpload} from '../../utils/form_components';
import {Button} from 'antd';

class PersonalInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      changeMode: false
    }
  }

  render() {

    return (
      <form className="PersonalInfo">
        <Field
          name="avatarWrapper"
          className="PersonalInfo__avatarWrapper"
          component={UploadImage}
        />

        <div className="PersonalInfo__main">
          <div className="PersonalInfo__main__btnContainer">
            <button type="button">Редактировать</button>
            <button type="button">Изменить пароль</button>
            <button type="button">Добавить тему</button>
          </div>
          <table>
            <tbody>
              <tr>
                <td><label>Фамилия</label></td>
                <td>
                  <Field
                    name="lastName"
                    component={renderInput}
                    placeholder="Фамилия"
                  />
              </td>
                <td><label htmlFor="researchType">Вид исследования</label></td>
                <td>
                  <Field
                    name="researchType"
                    component={renderSelect}
                    // selectedValue={research}
                    // handleSelect={(value) => this.setState({ research: value })}
                    data={researchs}
                    placeholder="Вид исследования"
                    mode='tags'
                  />
                </td>
              </tr>
              <tr>
                <td><label>Имя</label></td>
                <td>
                  <Field
                    name="firstName"
                    component={renderInput}
                    placeholder="Имя"
                  />
                </td>
                <td><label>Тема исследования</label></td>
                <td>
                  <Field
                    name="researchTopic"
                    component={renderInput}
                    placeholder="Тема исследования"
                  />
                </td>
              </tr>
              <tr>
                <td><label>Отчество</label></td>
                <td>
                  <Field
                    name="middleName"
                    component={renderInput}
                    placeholder="Отчество"
                  />
                </td>
                <td><label>Адрес</label></td>
                <td>
                  <Field
                    name="Address"
                    component={renderInput}
                    placeholder="Домашний адрес"
                  />
                </td>
              </tr>
              <tr>
                <td><label>№ документа, удостоверяющего личность</label></td>
                <td>
                  <Field
                    name="NID"
                    component={renderInput}
                    placeholder="№ документа, удостоверяющего личность"
                    type="number"
                  />
                </td>
                <td><label>Телефон</label></td>
                <td>
                  <Field
                    name="phone"
                    component={renderInput}
                    placeholder="Телефон"
                    type='number'
                  />
                </td>
              </tr>
              <tr>
                <td><label>Документ, удостоверяющий личность</label></td>
                <td>
                  <Field
                    name="Identity"
                    component={renderFileUpload}
                    placeholder="Документ, удостоверяющий личность"
                    type="file"
                  />
                </td>
                <td><label>e-mail</label></td>
                <td>
                  <Field
                    name="email"
                    component={renderInput}
                    placeholder="email"
                    type="email"
                  />
                </td>
              </tr>
              <tr>
                <td><label>Страна</label></td>
                <td>
                  <Field
                    name="Country"
                    component={renderSelect}
                    // handleSelect={(value) => this.setState({ country: value })} dispatch
                    placeholder="Страна"
                    // selectedValue={country} this.props.country
                    data={countries}
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="infoCity">Город</label></td>
                <td>
                  <Field
                    name="City"
                    component={renderSelect}
                    // selectedValue={city} dispatch an action
                    placeholder="Город"
                    // handleSelect={(value) => this.setState({ city: value })} props
                    data={cities}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <Button>OK</Button>
          <Button type="danger">CANCEL</Button>
        </div>
      </form>
    );
  }
}

export default reduxForm({ form: 'personalInfoForm' })(PersonalInfo);
