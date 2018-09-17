import React from 'react';
import {Form, Input, Radio, Checkbox, DatePicker, Select as AntSelect, Tooltip} from 'antd';
import Select, { Async } from 'react-select';
import SelectVirt from "react-virtualized-select";

import UploadImage from './UploadImage';
import UploadButton from './UploadButton';

const FormItem = Form.Item;
const Search = Input.Search;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export const renderInput = ({ input, formItemClass, meta: { submitFailed, error }, tooltip, formItemLayout, colon, ...rest }) => {
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      className={formItemClass}
      label={rest.label}
      {...formItemLayout}
    >
      {
        tooltip ?
          <Tooltip
            // trigger={['focus, hover']}
            title={tooltip.title}
            placement="topLeft"
          >
            <Input
              {...input}
              {...rest}
            />
          </Tooltip>
          :
          <Input
            {...input}
            {...rest}
          />
      }

      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
    );
};

export const renderInputLang = ({ input, formItemClass, meta: { submitFailed, error }, formItemLayout, changeLang, colon, ...rest }) => {
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      className={formItemClass}
      label={rest.label}
      {...formItemLayout}
    >
      <Input
        {...input}
        {...rest}
      />

      <RadioGroup onChange={changeLang} defaultValue={localStorage.getItem('i18nextLng')} name={input.name}>
        <RadioButton value="kz">kz</RadioButton>
        <RadioButton value="ru">ru</RadioButton>
        <RadioButton value="en">en</RadioButton>
      </RadioGroup>

      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
    );
};

export const renderDatePicker = ({ input, formItemClass, meta: { submitFailed, error }, formItemLayout, colon, ...rest }) => {
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      className={formItemClass}
      label={rest.label}
      {...formItemLayout}
    >
      <DatePicker
        format="DD-MM-YYYY"
        {...input}
        {...rest}
        value={input.value ? input.value : rest.defaultValue}
      />

      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  )
};

export const renderSelect = ({ input, meta: { submitFailed, error }, formItemLayout, colon,  ...rest }) => {
  const { data } = rest;
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      label={rest.label}
      {...formItemLayout}
    >
      <Select
        {...input}
        {...rest}
        options={data}
        onBlur={() => input.onBlur(input.value)}
      />
      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};

export const renderTaggedSelect = ({ input, meta: { submitFailed, error }, formItemLayout, colon,  ...rest }) => {
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      label={rest.label}
      {...formItemLayout}
    >
      <AntSelect
        {...input}
        {...rest}
        value={input.value ? input.value : []}
        mode="tags"
        style={{ width: '100%' }}
        tokenSeparators={[',']}
        // onBlur={() => input.onBlur(input.value)}
      />
      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};

export const renderSelect_new = ({ input, meta: { submitFailed, error }, formItemLayout, colon,  ...rest }) => {
  const { data } = rest;
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      label={rest.label}
      {...formItemLayout}
    >
      <Select
        {...input}
        {...rest}
        onBlur={() => input.onBlur(input.value)}
        options={data}
      />
      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};

export const renderAsyncSelect = ({ input, meta: { submitFailed, error }, formItemLayout, colon, selectedValue, ...rest }) => {
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      label={rest.label}
      {...formItemLayout}
    >
      <Async
        {...input}
        {...rest}
        onBlur={() => input.onBlur(input.value)}
      />
      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};
export const renderAsyncSelectVirt = ({ input, meta: { submitFailed, error }, formItemLayout, colon, selectedValue, ...rest }) => {
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      label={rest.label}
      {...formItemLayout}
    >
      <SelectVirt
        async
        optionHeight={40}
        {...input}
        {...rest}
        onBlur={() => input.onBlur(input.value)}
      />
      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};
export const renderSelectVirt = ({ input, meta: { submitFailed, error }, formItemLayout, colon, ...rest }) => {
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      label={rest.label}
      {...formItemLayout}
    >
      <SelectVirt
        optionHeight={40}
        {...input}
        {...rest}
        onBlur={() => input.onBlur(input.value)}
      />
      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};

export const renderSearchBox = ({ input, formItemClass, meta: { submitFailed, error }, formItemLayout, colon, ...rest }) => {
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      className={formItemClass}
      label={rest.label}
      {...formItemLayout}
    >

      <Search
        {...input}
        {...rest}
      />

      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};

export const renderRadioGroup = ({ input, meta: { submitFailed, error }, formItemLayout, formItemClass, colon, data, label, ...rest }) => {
  return (
    <FormItem
      className={formItemClass}
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      label={label}
      {...formItemLayout}
    >
      <Radio.Group
        value={rest.value}
        {...input}
        {...rest}
        options={data}
      />
      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};

export const renderCheckboxGroup = ({ input, meta: { submitFailed, error }, formItemLayout, formItemClass, colon, ...rest }) => {
  const { data } = rest;
  return (
    <FormItem
      className={formItemClass}
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      label={rest.label}
      {...formItemLayout}
    >
      <Checkbox.Group
        {...input}
        {...rest}
        options={data}
        onBlur={() => input.onBlur(input.value)}
      />
      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};

export const renderCheckbox = ({ input, meta: { submitFailed, error }, formItemLayout, formItemClass, colon, ...rest }) => {
  return (
    <FormItem
      className={formItemClass}
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      label={rest.label}
      {...formItemLayout}
    >
      <Checkbox
        {...input}
        {...rest}
      />
    </FormItem>
  );
};

export const renderFileUpload = ({ input, meta: { submitFailed, error }, formItemLayout, formItemClass, colon, ...rest }) => {
  const { uploadText } = rest;
  return (
    <FormItem
      className={formItemClass}
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      label={rest.label}
      {...formItemLayout}
    >
      <UploadImage
        {...input}
        uploadText={uploadText}
        // getFile={getFile}
      />
      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};

export const renderFileUploadBtn = ({ input, meta: { submitFailed, error }, formItemLayout, formItemClass, colon, ...rest }) => {
  const { uploadText } = rest;
  return (
    <FormItem
      className={formItemClass}
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      label={rest.label}
      {...formItemLayout}
    >
      <UploadButton
        {...input}
        uploadText={uploadText}
        // getFile={getFile}
      />
      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};

export const renderFileUploadButton = ({ input: {name}, meta: { submitFailed, error }, formItemLayout, formItemClass, colon, ...rest}) => {
  const { uploadText, getFile } = rest;
  return(
    <FormItem
        className={formItemClass}
        colon={colon || false}
        validateStatus={submitFailed ? (error && 'error') : ''}
        label={rest.label}
        {...formItemLayout}
      >
        <UploadImage
          fieldName={name}
          uploadText={uploadText}
          getFile={getFile}
        />
        {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};

export const renderTextarea = ({ input, formItemClass, meta: { submitFailed, error }, formItemLayout, colon, ...rest }) => {
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailed ? (error && 'error') : ''}
      className={formItemClass}
      label={rest.label}
      {...formItemLayout}
    >
      <Input.TextArea
        {...input}
        {...rest}
      />

      {submitFailed && (error && <span className="message-error">{error}</span>)}
    </FormItem>
  );
};

export class renderCheckboxWithInput extends React.Component {
  state = {
    disable: false
  };

  onChange = e => {
    this.setState({
      disable: e.target.checked
    })
  };

  render() {
    const { input, formItemClass, meta: { submitFailed, error }, formItemLayout, colon, ...rest } = this.props;
    return (
      <FormItem
        colon={colon || false}
        validateStatus={submitFailed ? (error && 'error') : ''}
        className={formItemClass}
        label={rest.label}
        {...formItemLayout}
      >
        <Checkbox
          onChange={this.onChange}
        />

        <Input
          {...input}
          {...rest}
          disabled={!this.state.disable}
        />

        {submitFailed && (error && <span className="message-error">{error}</span>)}
      </FormItem>
    );
  }
}

export const renderDoubleDatePicker = fields => {
  const { names, formItemLayout, colon, formItemClass, label } = fields;
  const { input: inputFirst, meta: { submitFailed: submitFailedFirst, error: errorFirst }, ...restFirst } = fields[names[0]];
  const { input: inputSecond, meta: { submitFailed: submitFailedSecond, error: errorSecond }, ...restSecond } = fields[names[1]];
  return (
    <FormItem
      colon={colon || false}
      validateStatus={submitFailedFirst ? (errorFirst && 'error') : ''}
      className={formItemClass}
      label={label}
      {...formItemLayout}
    >
      <div className="flex">
        <DatePicker
          format="DD-MM-YYYY"
          {...inputFirst}
          {...restFirst}
          style={{marginRight: '16px'}}
          // value={input.value ? input.value : rest.defaultValue}
        />
        {submitFailedFirst && (errorFirst && <span className="message-error">{errorFirst}</span>)}
        <DatePicker
          format="DD-MM-YYYY"
          {...inputSecond}
          {...restSecond}
          // value={input.value ? input.value : rest.defaultValue}
        />
      </div>
      {submitFailedSecond && (errorSecond && <span className="message-error">{errorSecond}</span>)}
    </FormItem>
  )
};

export const renderFields = (fields) => {
  console.log(fields);
  return (
    <div>
      <div className="input-row">
        <input {...fields.firstName.input} type="text"/>
        {fields.firstName.meta.touched && fields.firstName.meta.error &&
        <span className="error">{fields.firstName.meta.error}</span>}
      </div>
      <div className="input-row">
        <input {...fields.lastName.input} type="text"/>
        {fields.lastName.meta.touched && fields.lastName.meta.error &&
        <span className="error">{fields.lastName.meta.error}</span>}
      </div>
    </div>
  )
}