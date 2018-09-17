import React, { Component } from 'react';
import {Button, Form} from 'antd';
import { Field, reduxForm } from 'redux-form';
import {
  renderDatePicker, renderInput, renderInputLang, renderSelect, renderSelectVirt
} from '../../../utils/form_components';
import {isEmpty, isEqual, pickBy} from 'lodash';
import {getAccessLevels, getPropVal} from '../../../actions/actions';
import {
  FORM_OF_ADMISSION, FUND_MAKER_ARCHIVE, IS_ACTIVE, LEGAL_STATUS, ORG_DOC_TYPE, ORG_INDUSTRY
} from '../../../constants/tofiConstants';
import {connect} from 'react-redux';
import {normalizePhone} from '../../../utils/form_normalizing';

class MainInfoFundMaker extends Component {

  constructor(props) {
    super(props);

    const lng = localStorage.getItem('i18nextLng');
    this.state = {
      lang: {
        shortName: lng,
        name: lng,
        orgAddress: lng,
        orgFormationDoc: lng,
        orgReorganizationDoc: lng,
        orgLiquidationDoc: lng
      },
      loading: {
        legalStatusLoading: false,
        formOfAdmissionLoading: false,
        orgIndustryLoading: false,
        isActiveLoading: false,
        fundmakerArchiveLoading: false,
        orgDocTypeLoading: false
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
    /*[LEGAL_STATUS, FORM_OF_ADMISSION, ORG_INDUSTRY, IS_ACTIVE, FUND_MAKER_ARCHIVE].forEach(c => {
      this.loadOptions(c)()
    });*/
    if(!this.props.accessLevelOptions) {
      this.props.getAccessLevels();
    }
  }

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  shortNameValue = {...this.props.initialValues.shortName} || {kz: '', ru: '', en: ''};
  nameValue = {kz: '', ru: '', en: ''};
  orgAddressValue = {...this.props.initialValues.orgAddress} || {kz: '', ru: '', en: ''};
  orgFormationDocValue = {...this.props.initialValues.orgFormationDoc} || {kz: '', ru: '', en: ''};
  orgReorganizationDocValue = {...this.props.initialValues.orgReorganizationDoc} || {kz: '', ru: '', en: ''};
  orgLiquidationDocValue = {...this.props.initialValues.orgLiquidationDoc} || {kz: '', ru: '', en: ''};

  onSubmit = values => {
    if(isEmpty(this.props.initialValues)) {
      this.props.onCreateObj(pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])))
    } else {
      this.props.onSaveCubeData(pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])));
    }
  };

  render() {
    if(!this.props.tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, reset, dirty, error, submitting,
      tofiConstants: {legalStatus, formOfAdmission, orgIndustry, isActive, fundmakerArchive, orgPhone, orgFax,
        orgEmail, orgAddress, orgFormationDoc, orgReorganizationDoc, orgLiquidationDoc, contractNumber, orgDocType},
      legalStatusOptions, accessLevelOptions, orgDocTypeOptions,
      formOfAdmissionOptions, orgIndustryOptions, isActiveOptions, fundmakerArchiveOptions } = this.props;
    const { lang, loading } = this.state;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
        <Field
          name="shortName"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.shortName] : '')}
          parse={value => { this.shortNameValue[lang.shortName] = value; return {...this.shortNameValue} }}
          label={t('SHORT_NAME')}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />
        <Field
          name="name"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.name] : '')}
          parse={value => { this.nameValue[lang.name] = value; return {...this.nameValue} }}
          label={t('NAME')}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />
        <Field
          name="dbeg"
          component={ renderDatePicker }
          format={null}
          label={t('DBEG')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="dend"
          component={ renderDatePicker }
          format={null}
          label={t('DEND')}
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
          data={accessLevelOptions ? accessLevelOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onOpen={!accessLevelOptions ? this.props.getAccessLevels : undefined}
        />
        {contractNumber && <Field
          name="contractNumber"
          component={ renderInput }
          placeholder={contractNumber.name[lng]}
          label={contractNumber.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {legalStatus && <Field
          name="legalStatus"
          component={ renderSelect }
          label={legalStatus.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          searchable={false}
          data={legalStatusOptions ? legalStatusOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onOpen={this.loadOptions(LEGAL_STATUS)}
          isLoading={loading.legalStatusLoading}
          // validate={required}
          // colon={true}
        />}
        {formOfAdmission && <Field
          name="formOfAdmission"
          component={ renderSelect }
          searchable={false}
          label={formOfAdmission.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={formOfAdmissionOptions ? formOfAdmissionOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onOpen={this.loadOptions(FORM_OF_ADMISSION)}
          isLoading={loading.formOfAdmissionLoading}
          // validate={requiredLabel}
          // colon={true}
        />}
        {orgDocType && <Field
          name="orgDocType"
          multi
          component={ renderSelect }
          searchable={false}
          label={orgDocType.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={orgDocTypeOptions ? orgDocTypeOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onOpen={this.loadOptions(ORG_DOC_TYPE)}
          isLoading={loading.orgDocTypeLoading}
          // validate={requiredLabel}
          // colon={true}
        />}
        {orgIndustry && <Field
          name="orgIndustry"
          component={ renderSelect }
          label={orgIndustry.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          searchable={false}
          data={orgIndustryOptions ? orgIndustryOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onOpen={this.loadOptions(ORG_INDUSTRY)}
          isLoading={loading.orgIndustryLoading}
          // validate={requiredLabel}
          // colon={true}
        />}
        {isActive && <Field
          name="isActive"
          component={ renderSelect }
          label={isActive.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          searchable={false}
          data={isActiveOptions ? isActiveOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onOpen={this.loadOptions(IS_ACTIVE)}
          isLoading={loading.isActiveLoading}
          // validate={requiredLabel}
          // colon={true}
        />}
        {fundmakerArchive && <Field
          name="fundmakerArchive"
          component={ renderSelectVirt }
          label={fundmakerArchive.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          options={fundmakerArchiveOptions ? fundmakerArchiveOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onOpen={this.loadOptions(FUND_MAKER_ARCHIVE)}
          isLoading={loading.fundmakerArchiveLoading}
          // validate={requiredLabel}
          // colon={true}
        />}
        {orgAddress && <Field
          name="orgAddress"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.orgAddress] : '')}
          parse={value => { this.orgAddressValue[lang.orgAddress] = value; return {...this.orgAddressValue} }}
          label={orgAddress.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {orgPhone && <Field
          name="orgPhone"
          component={ renderInput }
          placeholder='+7 ('
          label={orgPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={normalizePhone}
        />}
        {orgFax && <Field
          name="orgFax"
          component={ renderInput }
          placeholder='+7 ('
          label={orgFax.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={normalizePhone}
        />}
        {orgEmail && <Field
          name="orgEmail"
          component={ renderInput }
          placeholder='example@example.com'
          label={orgEmail.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {orgFormationDoc && <Field
          name="orgFormationDoc"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.orgFormationDoc] : '')}
          parse={value => { this.orgFormationDocValue[lang.orgFormationDoc] = value; return {...this.orgFormationDocValue} }}
          label={orgFormationDoc.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {orgReorganizationDoc && <Field
          name="orgReorganizationDoc"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.orgReorganizationDoc] : '')}
          parse={value => { this.orgReorganizationDocValue[lang.orgReorganizationDoc] = value; return {...this.orgReorganizationDocValue} }}
          label={orgReorganizationDoc.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {orgLiquidationDoc && <Field
          name="orgLiquidationDoc"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.orgLiquidationDoc] : '')}
          parse={value => { this.orgLiquidationDocValue[lang.orgLiquidationDoc] = value; return {...this.orgLiquidationDocValue} }}
          label={orgLiquidationDoc.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
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
    legalStatusOptions: state.generalData[LEGAL_STATUS],
    formOfAdmissionOptions: state.generalData[FORM_OF_ADMISSION],
    orgIndustryOptions: state.generalData[ORG_INDUSTRY],
    isActiveOptions: state.generalData[IS_ACTIVE],
    fundmakerArchiveOptions: state.generalData[FUND_MAKER_ARCHIVE],
    orgDocTypeOptions: state.generalData[ORG_DOC_TYPE],
    accessLevelOptions: state.generalData.accessLevel
  }
}

export default connect(mapStateToProps, { getPropVal, getAccessLevels })(reduxForm({ form: 'MainInfoFundMaker', enableReinitialize: true })(MainInfoFundMaker));
