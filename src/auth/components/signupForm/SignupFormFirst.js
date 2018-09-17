import React from "react";
import {Field, reduxForm} from "redux-form";

import {required, requiredEmail} from "../../../shared/utils/form_validations";
import {
  renderFileUpload,
  renderFileUploadBtn,
  renderInput,
  renderSelect
} from "../../../shared/utils/form_components";
import {
  digits, normalizePhone
} from '../../../shared/utils/form_normalizing'
import SignupForm from "../SignupForm";

const SignupFormFirst = props => {
  const {handleSubmit, t} = props;
  return (
    <form onSubmit={handleSubmit} className='antForm-spaceBetween'>
      <Field
        name="lastName"
        formItemClass="signup-form__input"
        component={renderInput}
        placeholder={t("LAST_NAME_PLACEHOLDER")}
        label={t("LASTNAME")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        validate={required}
        colon={true}
      />
      <Field
        name="firstName"
        formItemClass="signup-form__input"
        component={renderInput}
        placeholder={t("FIRST_NAME_PLACEHOLDER")}
        label={t("FIRSTNAME")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        validate={required}
        colon={true}
      />
      <Field
        name="middleName"
        formItemClass="signup-form__input"
        component={renderInput}
        placeholder={t("MIDDLE_NAME_PLACEHOLDER")}
        label={t("MIDDLENAME")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name="login"
        formItemClass="signup-form__input"
        component={renderInput}
        placeholder="login"
        validate={required}
        colon={true}
        label={t("LOGIN")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name="NID"
        formItemClass="signup-form__input wrap-normal unset-lh"
        component={renderInput}
        placeholder="111222333"
        label={t('NID')}
        formItemLayout={
          {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }
        }
        normalize={digits(12)}
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
        tooltip={{ title: 'на этот адрес будет отправлено сообщение о регистрации с указанием вашего пароля' }}
        validate={requiredEmail}
        colon={true}
      />
      <Field
        name="phone"
        formItemClass="signup-form__input"
        label={ t('PHONE') }
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
        onPressEnter={handleSubmit}
        normalize={normalizePhone}
      />
    </form>
  );
};

export default reduxForm({
  form: "signUpForm", // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true // <------ unregister fields on unmount
})(SignupFormFirst);
