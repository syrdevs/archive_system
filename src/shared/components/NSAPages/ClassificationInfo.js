import React, {Component} from 'react';
import {Button, Form} from 'antd';
import {
  renderSelect,
  renderInput,
  renderTextarea,
  renderDatePicker,
  renderFileUpload, renderFileUploadButton
} from "../../utils/form_components";
import {requiredLabel} from "../../utils/form_validations";
import {Field, formValueSelector, reduxForm} from "redux-form";
import connect from "react-redux/es/connect/connect";
import {getAllObjOfCls, getObjByObjVal, getPropVal} from "../../actions/actions";

class ClassificationInfo extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: {
        vidGuidebookLoading: false,
        oblastPutevLoading: false,
        rubrikPutevLoading: false,
        
        vidKatalogLoading: false,
        oblastKatalogLoading: false,
        
        vidUkazLoading: false,
        oblastUkazLoading: false,
        rubrikUkazLoading: false,
        
        vidObzoraLoading: false,
        oblastObzorLoading: false,
        
        groupLoading: false,
      }
    }
}

  onSubmit(){

  }
  
  componentDidMount() {
    //
  }
  
  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({loading: { ...this.state.loading ,[c+'Loading']: true }});
        this.props.getPropVal(c)
          .then(() => this.setState({loading: { ...this.state.loading ,[c+'Loading']: false }}))
      }
    }
  };

  showFieldTheme() {
    const { tofiConstants, vidGuidebookValue, vidKatalogValue, vidObzoraValue, vidUkazValue } = this.props;
    const constNames = ['themGuidFund', 'thematicHistoryOrgKatalog', 'thematicAtdKatalog', 'thematicOtherKatalog', 'subjectThematicUkaz', 'thematicObzor']; 
    
    let fields = [];
    vidGuidebookValue &&  fields.push(vidGuidebookValue.value);
    vidKatalogValue &&    fields.push(vidKatalogValue.value);
    vidObzoraValue &&     fields.push(vidObzoraValue.value);
    vidUkazValue &&       fields.push(vidUkazValue.value);
    
    for (let i=0; i<fields.length; i++) {
      for (let j=0; j<constNames.length; j++) {
        if (fields[i] === tofiConstants[constNames[j]].id) {
          return true;
        }
      }
    }
    return false;
  };

  render() {
    if(!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { t, tofiConstants, handleSubmit, dirty, submitting, error, record,
            vidGuidebookOptions, oblastPutevOptions, rubrikPutevOptions,
            vidKatalogOptions, oblastKatalogOptions,
            vidUkazOptions, oblastUkazOptions, rubrikUkazOptions,
            vidObzoraOptions, oblastObzorOptions,
            groupOptions,
          } = this.props;
    const { loading } = this.state;
    
    return (
      <Form className="antForm-spaceBetween" style={dirty ? {paddingBottom: '43px'} : {}}>
        <Field
          name="referenceType"
          component={ renderInput }
          label={t('ARCHIVE_REFERENCE_TYPE')}
          readOnly={true}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        {record && record.referenceType.referenceTypeObj === 'clsPutev' &&
          <span>
            <Field
              name="vidGuidebook"
              component={ renderSelect }
              // disabled={!!this.props.initialValues.key}
              label={tofiConstants.vidGuidebook.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              isLoading={loading.vidGuidebookLoading}
              onOpen={this.loadOptions('vidGuidebook')}
              data={vidGuidebookOptions ? vidGuidebookOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="oblastPutev"
              component={ renderSelect }
              // disabled={!!this.props.initialValues.key}
              label={tofiConstants.oblastPutev.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              isLoading={loading.oblastPutevLoading}
              onChange={(e, newValue) => console.log(newValue)}
              onOpen={this.loadOptions('oblastPutev')}
              data={oblastPutevOptions ? oblastPutevOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="rubrikPutev"
              component={ renderSelect }
              // disabled={!!this.props.initialValues.key}
              label={tofiConstants.rubrikPutev.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              isLoading={loading.rubrikPutevLoading}
              onOpen={this.loadOptions('rubrikPutev')}
              data={rubrikPutevOptions ? rubrikPutevOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
          </span>
        }
        {record && record.referenceType.referenceTypeObj === 'clsKatalog' &&
          <span>
            <Field
              name="vidKatalog"
              component={ renderSelect }
              // disabled={!!this.props.initialValues.key}
              label={tofiConstants.vidKatalog.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              isLoading={loading.vidKatalogLoading}
              onOpen={this.loadOptions('vidKatalog')}
              data={vidKatalogOptions ? vidKatalogOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="oblastKatalog"
              component={ renderSelect }
              // disabled={!!this.props.initialValues.key}
              label={tofiConstants.oblastKatalog.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              isLoading={loading.oblastKatalogLoading}
              onOpen={this.loadOptions('oblastKatalog')}
              data={oblastKatalogOptions ? oblastKatalogOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
          </span>
        }
        {record && record.referenceType.referenceTypeObj === 'clsUkaz' &&
          <span>
            <Field
              name="vidUkaz"
              component={ renderSelect }
              // disabled={!!this.props.initialValues.key}
              label={tofiConstants.vidUkaz.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              isLoading={loading.vidUkazLoading}
              onOpen={this.loadOptions('vidUkaz')}
              data={vidUkazOptions ? vidUkazOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="oblastUkaz"
              component={ renderSelect }
              // disabled={!!this.props.initialValues.key}
              label={tofiConstants.oblastUkaz.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              isLoading={loading.oblastUkazLoading}
              onOpen={this.loadOptions('oblastUkaz')}
              data={oblastUkazOptions ? oblastUkazOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="rubrikUkaz"
              component={ renderSelect }
              // disabled={!!this.props.initialValues.key}
              label={tofiConstants.rubrikUkaz.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              isLoading={loading.rubrikUkazLoading}
              onOpen={this.loadOptions('rubrikUkaz')}
              data={rubrikUkazOptions ? rubrikUkazOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
          </span>
        }
        {record && record.referenceType.referenceTypeObj === 'clsObzor' &&
          <span>
            <Field
              name="vidObzora"
              component={ renderSelect }
              // disabled={!!this.props.initialValues.key}
              label={tofiConstants.vidObzora.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              isLoading={loading.vidObzoraLoading}
              onOpen={this.loadOptions('vidObzora')}
              data={vidObzoraOptions ? vidObzoraOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="oblastObzor"
              component={ renderSelect }
              // disabled={!!this.props.initialValues.key}
              label={tofiConstants.oblastObzor.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              isLoading={loading.oblastObzorLoading}
              onOpen={this.loadOptions('oblastObzor')}
              data={oblastObzorOptions ? oblastObzorOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
          </span>
        }
        <Field
          name="group"
          component={ renderSelect }
          // disabled={!!this.props.initialValues.key}
          label={tofiConstants.group.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isLoading={loading.groupLoading}
          onOpen={this.loadOptions('group')}
          data={groupOptions ? groupOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
        />
        {this.showFieldTheme() &&
          <Field
          name="theme"
          component={ renderInput }
          // disabled={!!this.props.initialValues.key}
          label={tofiConstants.theme.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          />
        }
        <Field
          name="goalSprav"
          component={ renderTextarea }
          // disabled={!!this.props.initialValues.key}
          label={tofiConstants.goalSprav.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="workType"
          component={ renderFileUploadButton }
          formItemClass="classificationInfo_uploadBtn"
          label={tofiConstants.method.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="metodikaText"
          component={ renderTextarea }
          // disabled={!!this.props.initialValues.key}
          label={tofiConstants.metodikaText.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="approvalDateMetodika"
          component={ renderDatePicker }
          // disabled={!!this.props.initialValues.key}
          label={tofiConstants.approvalDateMetodika.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="protocol"
          component={ renderFileUploadButton }
          formItemClass="classificationInfo_uploadBtn"
          label={tofiConstants.protocol.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="lastChangeDateScheme"
          component={ renderInput }
          label={tofiConstants.lastChangeDateScheme.name[this.lng]}
          readOnly={true}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="changesAuthor"
          component={ renderInput }
          label={tofiConstants.changesAuthor.name[this.lng]}
          readOnly={true}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        {dirty && <Form.Item className="ant-form-btns">
          <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? t('LOADING...') : t('SAVE') }
          </Button>
          {error && <span className="message-error"><i className="icon-error" />{error}</span>}
        </Form.Item>}
      </Form>
    )
  }
}

const selector = formValueSelector('ClassificationInfo');

export default connect(state => {
  const vidGuidebookValue = selector(state, 'vidGuidebook');
  const vidKatalogValue = selector(state, 'vidKatalog');
  const vidObzoraValue = selector(state, 'vidObzora');
  const vidUkazValue = selector(state, 'vidUkaz');
  return {
    vidGuidebookValue,
    vidKatalogValue,
    vidObzoraValue,
    vidUkazValue,
    vidGuidebookOptions: state.generalData.vidGuidebook,
    oblastPutevOptions: state.generalData.oblastPutev,
    rubrikPutevOptions: state.generalData.rubrikPutev,
    
    vidKatalogOptions: state.generalData.vidKatalog,
    oblastKatalogOptions: state.generalData.oblastKatalog,
    
    vidUkazOptions: state.generalData.vidUkaz,
    oblastUkazOptions: state.generalData.oblastUkaz,
    rubrikUkazOptions: state.generalData.rubrikUkaz,
    
    vidObzoraOptions: state.generalData.vidObzora,
    oblastObzorOptions: state.generalData.oblastObzor,

    groupOptions: state.generalData.group,
  }
}, { getPropVal })(reduxForm({ form: 'ClassificationInfo', enableReinitialize: true })(ClassificationInfo));