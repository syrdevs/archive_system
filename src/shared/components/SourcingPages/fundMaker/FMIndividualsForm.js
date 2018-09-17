import React, { Component } from 'react';
import {Button, Form} from 'antd';
import {Field, Fields, reduxForm} from 'redux-form';
import {
  renderDoubleDatePicker, renderInput, renderInputLang,
  renderSelect
} from '../../../utils/form_components';
import {getAccessLevels, getPropVal} from '../../../actions/actions';
import {normalizePhone} from '../../../utils/form_normalizing';
import {connect} from 'react-redux';
import {
  OWNER_STATUS, PERSON_ACADEMIC_DEGREE, PERSON_ACADEMIC_TITLE,
  PERSON_SPECIALTY
} from '../../../constants/tofiConstants';
import {isEmpty, isEqual, pickBy} from 'lodash';

class FMIndividualsForm extends Component {

  constructor(props) {
    super(props);

    const lng = localStorage.getItem('i18nextLng');
    this.state = {
      lang: {
        personLastName: lng,
        personName: lng,
        personPatronymic: lng,
        personAddress: lng,
        ownerLastName: lng,
        ownerName: lng,
        ownerPatronymic: lng,
        ownerAddress: lng,
      },
      loading: {
        personAcademicDegreeLoading: false,
        personAcademicTitleLoading: false,
        personSpecialtyLoading: false,
        ownerStatusLoading: false
      }
    };
  }

  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({loading: {...this.state.loading, [c+'Loading']: true}});
        this.props.getPropVal(c)
          .then(() => this.setState({loading: {...this.state.loading, [c+'Loading']: false}}));
      }
    }
  };
  componentDidMount() {
    /*[PERSON_SPECIALTY, PERSON_ACADEMIC_TITLE, PERSON_ACADEMIC_DEGREE, OWNER_STATUS].forEach(c => {
      this.loadOptions(c)()
    });*/
    if(isEmpty(this.props.accessLevelOptions)) {
      this.props.getAccessLevels();
    }
  }

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  personLastNameValue = {kz: '', ru: '', en: ''};
  personNameValue = {kz: '', ru: '', en: ''};
  personPatronymicValue = {kz: '', ru: '', en: ''};
  personAddressValue = {kz: '', ru: '', en: ''};
  ownerLastNameValue = {kz: '', ru: '', en: ''};
  ownerNameValue = {kz: '', ru: '', en: ''};
  ownerPatronymicValue = {kz: '', ru: '', en: ''};
  ownerAddressValue = {kz: '', ru: '', en: ''};

  onSubmit = values => {
    if(isEmpty(this.props.initialValues)) {
      this.props.onCreateObj({...pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])),
        personLastName: values.personLastName, personName: values.personName, personPatronymic: values.personPatronymic})
    } else {
      this.props.onSaveCubeData({...pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])),
        personLastName: values.personLastName, personName: values.personName, personPatronymic: values.personPatronymic});
    }
  };

  render() {
    if(!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, reset, dirty, error, submitting, tofiConstants: {personLastName, personName, personPatronymic,
          personAcademicDegree, personAcademicTitle, personSpecialty, personAddress, personPhone, personEmail,
          ownerLastName, ownerName, ownerPatronymic, ownerStatus, ownerAddress, ownerPhone, ownerEmail},
          ownerStatusOptions, personAcademicDegreeOptions, personSpecialtyOptions, personAcademicTitleOptions, accessLevelOptions } = this.props;
    const { lang, loading } = this.state;
    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
        {personLastName && <Field
          name="personLastName"
          component={renderInputLang}
          format={value => (!!value ? value[lang.personLastName] : '')}
          parse={value => { this.personLastNameValue[lang.personLastName] = value; return {...this.personLastNameValue} }}
          label={personLastName.name[this.lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {personName && <Field
          name="personName"
          component={renderInputLang}
          format={value => (!!value ? value[lang.personName] : '')}
          parse={value => { this.personNameValue[lang.personName] = value; return {...this.personNameValue} }}
          label={personName.name[this.lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {personPatronymic && <Field
          name="personPatronymic"
          component={renderInputLang}
          format={value => (!!value ? value[lang.personPatronymic] : '')}
          parse={value => { this.personPatronymicValue[lang.personPatronymic] = value; return {...this.personPatronymicValue} }}
          label={personPatronymic.name[this.lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        <Fields
          names={[ 'dateOfBirth', 'dateOfDeath' ]}
          component={renderDoubleDatePicker}
          label={t('LIFE')}
          format={null}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="accessLevel"
          component={ renderSelect }
          label={t('ACCESS_LEVEL')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          searchable={false}
          data={accessLevelOptions ? accessLevelOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onOpen={!accessLevelOptions ? this.props.getAccessLevels : undefined}
        />
        {personAcademicDegree && <Field
          name="personAcademicDegree"
          component={ renderSelect }
          searchable={false}
          label={personAcademicDegree.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={personAcademicDegreeOptions ? personAcademicDegreeOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onOpen={this.loadOptions(PERSON_ACADEMIC_DEGREE)}
          isLoading={loading.personAcademicDegreeLoading}
          // loadOptions={this.getPersonAcademicDegreeOptions}
          // validate={required}
          // colon={true}
        />}
        {personAcademicTitle && <Field
          name="personAcademicTitle"
          component={ renderSelect }
          searchable={false}
          label={personAcademicTitle.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={personAcademicTitleOptions ? personAcademicTitleOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onOpen={this.loadOptions(PERSON_ACADEMIC_TITLE)}
          isLoading={loading.personAcademicTitleLoading}
          // validate={required}
          // colon={true}
        />}
        {personSpecialty && <Field
          name="personSpecialty"
          multi
          component={ renderSelect }
          searchable={false}
          label={personSpecialty.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={personSpecialtyOptions ? personSpecialtyOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onOpen={this.loadOptions(PERSON_SPECIALTY)}
          isLoading={loading.personSpecialtyLoading}
          // validate={required}
          // colon={true}
        />}
        {personAddress && <Field
          name="personAddress"
          component={renderInputLang}
          format={value => (!!value ? value[lang.personAddress] : '')}
          parse={value => { this.personAddressValue[lang.personAddress] = value; return {...this.personAddressValue} }}
          label={personAddress.name[this.lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {personPhone && <Field
          name="personPhone"
          component={ renderInput }
          label={personPhone.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          placeholder="+7 ("
          normalize={normalizePhone}
        />}
        {personEmail && <Field
          name="personEmail"
          component={ renderInput }
          label={personEmail.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        <Form.Item style={{marginBottom: '5px'}}><h2>{t('OWNER_INFO_INDIVIDUAL')}</h2></Form.Item>
        {ownerLastName && <Field
          name="ownerLastName"
          component={renderInputLang}
          format={value => (!!value ? value[lang.ownerLastName] : '')}
          parse={value => { this.ownerLastNameValue[lang.ownerLastName] = value; return {...this.ownerLastNameValue} }}
          label={ownerLastName.name[this.lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {ownerName && <Field
          name="ownerName"
          component={renderInputLang}
          format={value => (!!value ? value[lang.ownerName] : '')}
          parse={value => { this.ownerNameValue[lang.ownerName] = value; return {...this.ownerNameValue} }}
          label={ownerName.name[this.lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {ownerPatronymic && <Field
          name="ownerPatronymic"
          component={renderInputLang}
          format={value => (!!value ? value[lang.ownerPatronymic] : '')}
          parse={value => { this.ownerPatronymicValue[lang.ownerPatronymic] = value; return {...this.ownerPatronymicValue} }}
          label={ownerPatronymic.name[this.lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {ownerStatus && <Field
          name="ownerStatus"
          component={ renderSelect }
          searchable={false}
          label={ownerStatus.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={ownerStatusOptions ? ownerStatusOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onOpen={this.loadOptions(OWNER_STATUS)}
          isLoading={loading.ownerStatusLoading}
          // validate={required}
          // colon={true}
        />}
        {ownerAddress && <Field
          name="ownerAddress"
          component={renderInputLang}
          format={value => (!!value ? value[lang.ownerAddress] : '')}
          parse={value => { this.ownerAddressValue[lang.ownerAddress] = value; return {...this.ownerAddressValue} }}
          label={ownerAddress.name[this.lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {ownerPhone && <Field
          name="ownerPhone"
          component={ renderInput }
          label={ownerPhone.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          placeholder="+7 ("
          normalize={normalizePhone}
        />}
        {ownerEmail && <Field
          name="ownerEmail"
          component={ renderInput }
          label={ownerEmail.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {dirty && <Form.Item className="ant-form-btns">
          <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? t('LOADING...') : t('SAVE') }
          </Button>
          <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting} style={{marginLeft: '10px'}} onClick={reset}>
            {submitting ? t('LOADING...') : t('CANCEL') }
          </Button>
          {error && <span className="message-error"><i className="icon-error" />{error}</span>}
        </Form.Item>}
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    ownerStatusOptions: state.generalData[OWNER_STATUS],
    personAcademicDegreeOptions: state.generalData[PERSON_ACADEMIC_DEGREE],
    personAcademicTitleOptions: state.generalData[PERSON_ACADEMIC_TITLE],
    personSpecialtyOptions: state.generalData[PERSON_SPECIALTY],
    accessLevelOptions: state.generalData.accessLevel
  }
}

export default connect(mapStateToProps, { getAccessLevels, getPropVal })(reduxForm({ form: 'FMIndividualsForm', enableReinitialize: true })(FMIndividualsForm));
