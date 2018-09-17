import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { Link } from 'react-router-dom';
import { Field, reduxForm, change } from 'redux-form';
import {required} from '../../shared/utils/form_validations';
import {renderFileUpload, renderFileUploadBtn, renderInput, renderSelect} from '../../shared/utils/form_components';
import { translate } from 'react-i18next';

const FormItem = Form.Item;

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      country: null,
      city: null,
      research: null,
      Photo: null,
      Identity: null
    };

  }

  onSubmit = (props) => {
    const { city, country, research, Photo, Identity } = this.state;
    return this.props.onSubmit({ ...props, city, country, research, Photo, Identity});
  };

  getResearchTypesData = () => {
    return this.props.researchTypes.map(item => ({value: item.id, label: item.name[localStorage.getItem('i18nextLng')]}))
  };

  getCountriesListData = () => {
    return this.props.countriesList.map(item => ({value: item.id, label: item.name[localStorage.getItem('i18nextLng')]}));
  };

  getCitiesListData = () => {
    return this.props.citiesList.map(item => ({value: item.id, label: item.name[localStorage.getItem('i18nextLng')]}));
  };

  getFile = file => {
    this.setState(file);
  };

  render() {
    const { handleSubmit, error, submitting, t, getCities, researchTypesLoading, countriesLoading, dispatch } = this.props;
    const { country, city, research } = this.state;

    return (
      <Form className="signup-form" onSubmit={handleSubmit(this.onSubmit)}>
        <FormItem>
          <span className="signup-form__title">{t('SIGNUP')}</span>
        </FormItem>
        <Field
          name="lastName"
          formItemClass="signup-form__input"
          component={renderInput}
          placeholder={ t('LAST_NAME_PLACEHOLDER') }
          label={ t('LASTNAME') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          validate={required}
          colon={true}
        />
        <Field
          name="firstName"
          formItemClass="signup-form__input"
          component={renderInput}
          placeholder={ t('FIRST_NAME_PLACEHOLDER') }
          label={ t('FIRSTNAME') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          validate={required}
          colon={true}
        />
        <Field
          name="middleName"
          formItemClass="signup-form__input"
          component={ renderInput }
          placeholder={ t('MIDDLE_NAME_PLACEHOLDER') }
          label={ t('MIDDLENAME') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="login"
          formItemClass="signup-form__input"
          component={renderInput}
          placeholder="login@email.com"
          validate={required}
          colon={true}
          label={ t('LOGIN') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="NID"
          formItemClass="signup-form__input wrap-normal unset-lh"
          component={renderInput}
          type="number"
          placeholder="111222333"
          label={ t('NID') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="Identity"
          formItemClass="signup-form__input"
          component={ renderFileUpload }
          getFile={this.getFile}
          uploadText={ t('UPLOAD') }
          label={ t('IDENTITY') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="Photo"
          formItemClass="signup-form__input"
          component={ renderFileUploadBtn }
          uploadText={ t('UPLOAD') }
          getFile={this.getFile}
          label={ t('PHOTO') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="Country"
          formItemClass="signup-form__input"
          label={ t('COUNTRY') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          isLoading={countriesLoading}
          component={renderSelect}
          handleSelect={country =>  {
            console.log(country);
            this.setState({ country, city: null }, () => { if(!!country) getCities(country.value) });
            dispatch(change('signUpForm', 'Country', !!country ? country.label : undefined))}
          }
          placeholder={ t('COUNTRY_PLACEHOLDER') }
          selectedValue={country}
          data={this.getCountriesListData()}
          // validate={requiredLabel}
          colon={true}
        />
        <Field
          name="City"
          formItemClass="signup-form__input"
          label={ t('CITY') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          component={renderSelect}
          selectedValue={city}
          handleSelect={value => this.setState({ city: value })}
          data={this.getCitiesListData()}
          placeholder={ t('CITY_PLACEHOLDER') }
          disabled={!country}
          validate={required}
          colon={true}
        />
        {/*<Field
          name="Workplace"
          formItemClass="signup-form__input"
          component={renderInput}
          placeholder="Место работы"
        />
        <Field
          name="Studyplace"
          formItemClass="signup-form__input"
          component={renderInput}
          placeholder="Место учебы"
        />
        <Field
          name="Position"
          formItemClass="signup-form__input"
          component={renderInput}
          placeholder="Должность"
        />
        <Field
          name="Education"
          formItemClass="signup-form__input"
          component={renderSelect}
          selectedValue={education}
          handleSelect={(value) => this.setState({ education: value })}
          data={educations}
          placeholder="Образование"
        />
        <Field
          name="degree"
          formItemClass="signup-form__input"
          component={renderSelect}
          selectedValue={degree}
          handleSelect={(value) => this.setState({ degree: value })}
          data={degrees}
          placeholder="Ученая степень"
        />
        <Field
          name="Academic"
          formItemClass="signup-form__input"
          component={renderSelect}
          selectedValue={academic}
          handleSelect={(value) => this.setState({ academic: value })}
          data={academics}
          placeholder="Ученое звание"
        />*/}
        <Field
          name="Research"
          formItemClass="signup-form__input"
          label={ t('RESEARCH') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          placeholder={ t('RESEARCH_TYPE') }
          component={renderSelect}
          isLoading={researchTypesLoading}
          searchable={false}
          selectedValue={research}
          handleSelect={value => this.setState({ research: value })}
          data={this.getResearchTypesData()}
        />
        <Field
          name="Address"
          formItemClass="signup-form__input"
          label={ t('ADDRESS') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          component={renderInput}
          placeholder="Арай, 53"
        />
        <Field
          name="phone"
          formItemClass="signup-form__input"
          label={ t('PHONE') }
          type="number"
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          component={renderInput}
          placeholder="+7 (XXX)-111-11-11"
          validate={required}
          colon={true}
        />
        <Field
          name="email"
          formItemClass="signup-form__input"
          type="email"
          label='email'
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          component={renderInput}
          placeholder="login@email.com"
          validate={required}
          colon={true}
        />
        <FormItem>
          <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? t('LOADING...') : t('SIGNUP') }
          </Button>
          {error && <span className="message-error"><i className="icon-error" />{error}</span>}
        </FormItem>
        <FormItem>
          <span className="signup-form__link">
            { t('HAS_LOGIN') }<Link to="login"> { t('ENTER') }</Link>
          </span>
        </FormItem>
      </Form>
    );
  }
}

SignupForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  researchTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.object.isRequired,
      fullName: PropTypes.object
    })
  ).isRequired,
  countriesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.object.isRequired,
      fullName: PropTypes.object
    })
  ).isRequired,
  countriesLoading: PropTypes.bool.isRequired,
  researchTypesLoading: PropTypes.bool.isRequired
};

SignupForm.defaultProps = { error: '' };

export default reduxForm({ form: 'signUpForm' })(translate('signUpForm')(SignupForm));
