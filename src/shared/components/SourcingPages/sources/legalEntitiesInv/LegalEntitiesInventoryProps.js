import React from 'react';
import {Button, Form} from 'antd';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import moment from 'moment';

import {
  renderDatePicker,
  renderFileUploadBtn,
  renderInput,
  renderSelect,
  renderTaggedSelect
} from '../../../../utils/form_components';
import {required, requiredArr, requiredLabel} from '../../../../utils/form_validations';
import {SYSTEM_LANG_ARRAY} from '../../../../constants/constants';
import {CUBE_FOR_AF_INV, DO_FOR_INV, DP_FOR_INV} from '../../../../constants/tofiConstants';
import {connect} from 'react-redux';

class LegalEntitiesInventoryProps extends React.Component {

  handleFormSubmit = ({name, ...rest}) => {
    const nameLng = {};
    SYSTEM_LANG_ARRAY.forEach(lang => {
      nameLng[lang] = name;
    });
    const obj = {
      name: nameLng,
      fullName: nameLng,
      clsConst: 'invList'
    };
    return this.props.createNewObj({
        obj, cube: {
          cubeSConst: CUBE_FOR_AF_INV,
          doConst: DO_FOR_INV,
          dpConst: DP_FOR_INV
        }
      },
      {
        ...rest,
        fundFeature: String(this.props.tofiConstants.notIncluded.id),
        invFund: this.props.record.key.split('_')[1],
        expert: String(this.props.user.obj),
        nomenLastChangeDate: moment().format('YYYY-MM-DD')
      },
      {});
  };

  render() {
    const {
      tofiConstants, lng, submitting, error, reset,
      t, handleSubmit, loadOptions, getNomenOptions, nomenOptions,
      invTypeOptions, invCaseSystemOptions, invTypeValue, documentTypeOptions
    } = this.props;

    const {
      invNumber, invType, invCaseSystem, invNomen, casesQuantity, invTypePerm, approvalProtocol, agreementProtocol, fundNumberOfCases,
      invDeadline, nomenLastChangeDate, invApprovalDate1, invApprovalDate2, invAgreementDate, lastChangeDate, invDates, documentType, expert, invAgreement2Date, agreement2Protocol
    } = tofiConstants;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.handleFormSubmit)}>
        {invNumber && <Field
          name='invNumber'
          colon
          component={renderInput}
          label={invNumber.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          validate={required}
        />}
        <Field
          name='name'
          component={renderInput}
          label={t('NAME')}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          colon
          validate={required}
        />
        {invType && <Field
          name='invType'
          component={renderSelect}
          label={invType.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          onOpen={loadOptions('invType')}
          data={invTypeOptions ? invTypeOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          colon
          validate={requiredLabel}
        />}
        {documentType && <Field
          name='documentType'
          component={renderSelect}
          label={documentType.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          onOpen={loadOptions('documentType')}
          data={documentTypeOptions ? documentTypeOptions.map(option => ({
            value: option.id,
            label: option.name[lng]
          })) : []}
          colon
          validate={requiredLabel}
        />}
        {fundNumberOfCases && <Field
          name='fundNumberOfCases'
          readOnly
          component={renderInput}
          label={fundNumberOfCases.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invDates && <Field
          name='invDates'
          component={renderTaggedSelect}
          label={invDates.name[lng]}
          format={val => val && val.map(it => it.value || '')}
          parse={val => val && val.map(str => ({value: str, mode: 'ins'}))}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invNomen && <Field
          name='invNomen'
          component={renderSelect}
          multi
          label={invNomen.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          onOpen={getNomenOptions}
          data={nomenOptions}
          colon
          validate={requiredArr}
        />}
        {invCaseSystem && <Field
          name='invCaseSystem'
          component={renderSelect}
          label={invCaseSystem.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          onOpen={loadOptions('invCaseSystem')}
          data={invCaseSystemOptions ? invCaseSystemOptions.map(option => ({
            value: option.id,
            label: option.name[lng]
          })) : []}
        />}
        {casesQuantity && <Field
          name='casesQuantity'
          component={renderInput}
          label={casesQuantity.name[lng]}
          type="number"
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invDeadline && <Field
          name='invDeadline'
          component={renderDatePicker}
          format={null}
          label={invDeadline.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invAgreementDate && <Field
          name='invAgreementDate'
          component={renderDatePicker}
          format={null}
          label={invAgreementDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invAgreement2Date && <Field
          name='invAgreement2Date'
          component={renderDatePicker}
          format={null}
          label={invAgreement2Date.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invTypeValue && invTypeValue.value == invTypePerm.id && invApprovalDate1 && <Field
          name='invApprovalDate1'
          component={renderDatePicker}
          format={null}
          label={invApprovalDate1.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invApprovalDate2 && <Field
          name='invApprovalDate2'
          component={renderDatePicker}
          format={null}
          label={invApprovalDate2.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {lastChangeDate && <Field
          name='lastChangeDate'
          component={renderDatePicker}
          format={null}
          label={lastChangeDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {agreementProtocol && <Field
          name='agreementProtocol'
          component={renderFileUploadBtn}
          label={agreementProtocol.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {agreement2Protocol && <Field
          name='agreement2Protocol'
          component={renderFileUploadBtn}
          label={agreement2Protocol.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {approvalProtocol && <Field
          name='approvalProtocol'
          component={renderFileUploadBtn}
          label={approvalProtocol.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {nomenLastChangeDate && <Field
          name='nomenLastChangeDate'
          component={renderDatePicker}
          disabled
          format={null}
          label={nomenLastChangeDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {expert && <Field
          name='expert'
          component={renderSelect}
          disabled
          label={expert.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        <Form.Item className="ant-form-btns">
          <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? t('LOADING...') : t('SAVE')}
          </Button>
          <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting}
                  style={{marginLeft: '10px'}} onClick={reset}>
            {submitting ? t('LOADING...') : t('CANCEL')}
          </Button>
          {error && <span className="message-error"><i className="icon-error"/>{error}</span>}
        </Form.Item>
      </Form>
    );
  }
};

const selector = formValueSelector('LegalEntitiesInventoryProps');

export default connect(state => {
  const invTypeValue = selector(state, 'invType');
  return {
    invTypeValue
  };
})(reduxForm({ form: 'LegalEntitiesInventoryProps', enableReinitialize: true })(LegalEntitiesInventoryProps));