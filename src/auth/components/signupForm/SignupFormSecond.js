import React from "react";
import {Field, reduxForm} from "redux-form";

import {
  renderDatePicker,
  renderFileUploadBtn,
  renderInput,
  renderSelect
} from "../../../shared/utils/form_components";

const SignupFormSecond = props => {
  const {handleSubmit, t} = props;
  return (
    <form onSubmit={handleSubmit} className='antForm-spaceBetween'>
      <Field
        name="gender"
        formItemClass="signup-form__input"
        component={renderSelect}
        placeholder={t("GENDER_PLACEHOLDER")}
        label={t("GENDER")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name="birthday"
        formItemClass="signup-form__input"
        component={renderDatePicker}
        format={null}
        label={t("BIRTHDAY")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name="nomer"
        formItemClass="signup-form__input"
        component={renderInput}
        placeholder={t("NOMER_PLACEHOLDER")}
        label={t("NOMER")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name="country"
        formItemClass="signup-form__input"
        component={renderSelect}
        placeholder="country"
        label={t("COUNTRY")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name="city"
        formItemClass="signup-form__input"
        component={renderSelect}
        placeholder="city"
        label={t("CITY")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name="address"
        formItemClass="signup-form__input wrap-normal unset-lh"
        component={renderInput}
        placeholder="address"
        label={t('ADDRESS')}
        formItemLayout={
          {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }
        }
      />
      <Field
        name="workplace"
        formItemClass="signup-form__input wrap-normal unset-lh"
        component={renderInput}
        placeholder="workplace"
        label={t('WORKPLACE')}
        formItemLayout={
          {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }
        }
      />
      <Field
        name="position"
        formItemClass="signup-form__input wrap-normal unset-lh"
        component={renderInput}
        placeholder="position"
        label={t('POSITION')}
        formItemLayout={
          {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }
        }
      />
      <Field
        name="education"
        formItemClass="signup-form__input"
        component={renderSelect}
        placeholder="education"
        label={t("EDUCATION")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name="degree"
        formItemClass="signup-form__input"
        component={renderSelect}
        placeholder="degree"
        label={t("DEGREE")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name="status"
        formItemClass="signup-form__input"
        component={renderSelect}
        placeholder="status"
        label={t("STATUS")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name='skan'
        component={renderFileUploadBtn}
        label={'SKAN'}
        formItemLayout={
          {
            labelCol: {span: 12},
            wrapperCol: {span: 12}
          }
        }
      />
      <Field
        name="themes"
        formItemClass="signup-form__input"
        component={renderSelect}
        placeholder="themes"
        label={t("THEMES")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name='photo'
        component={renderFileUploadBtn}
        label={'PHOTO'}
        formItemLayout={
          {
            labelCol: {span: 12},
            wrapperCol: {span: 12}
          }
        }
      />
    </form>
  );
};

export default reduxForm({
  form: "signUpForm", // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true // <------ unregister fields on unmount
})(SignupFormSecond);
