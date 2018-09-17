import React, { Component } from "react";
import { Button, Form, Row, Col } from "antd";
import { Field, reduxForm } from "redux-form";
import moment from "moment";
import { isEqual, pickBy } from "lodash";
import {
  renderDatePicker,
  renderInput,
  renderSelect,
  renderSelectVirt
} from "../../../../../utils/form_components";
import {
  getAllObjOfCls,
  getObjByObjVal,
  getObjByProp,
  getPropVal
} from "../../../../../actions/actions";
import {
  requiredDate,
  requiredLabel
} from "../../../../../utils/form_validations";
import { WORK_PRIORITY } from "../../../../../constants/tofiConstants";

/*eslint eqeqeq:0*/
class Form_invTypePerm_uprDoc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: {
        workListName: localStorage.getItem("i18nextLng")
      },
      loading: {
        uprDocTypeLoading: false,
        inaccurateDateFeatureLoading: false,
        typeOfPaperCarrierLoading: false
      }
    };
  }

  changeLang = e => {
    this.setState({
      lang: { ...this.state.lang, [e.target.name]: e.target.value }
    });
  };

  onSubmit = values => {
    if (!this.props.initialValues.key) {
      return this.props.onCreateObj({
        ...pickBy(
          values,
          (val, key) => !isEqual(val, this.props.initialValues[key])
        ),
        caseNumber: String(this.props.user.obj),
        workStatusReg: values.workStatusReg,
        workDate: values.workDate
      });
    } else {
      let workStatusReg = values.workStatusReg;
      if (
        [
          "caseSearch",
          "caseDisposal",
          "caseRegistration",
          "descriptionOfValuableDocs"
        ].includes(values.workType.workTypeClass)
      ) {
        workStatusReg = {
          value: this.props.tofiConstants.appointed.id,
          label: this.props.tofiConstants.appointed.name[this.lng]
        };
      }

      return this.props.onSaveCubeData({
        ...pickBy(
          values,
          (val, key) => !isEqual(val, this.props.initialValues[key])
        ),
        workType: values.workType,
        workStatusReg,
        workDate: moment().format("YYYY-MM-DD"),
        caseNumber: String(this.props.user.obj)
      });
    }
  };
  loadClsObj = (cArr, propConsts, dte = moment().format("YYYY-MM-DD")) => {
    return () => {
      cArr.forEach(c => {
        if (!this.props[c + "Options"]) {
          this.setState({
            loading: { ...this.state.loading, [c + "Loading"]: true }
          });
          this.props.getAllObjOfCls(c, dte, propConsts).then(() =>
            this.setState({
              loading: { ...this.state.loading, [c + "Loading"]: false }
            })
          );
        }
      });
    };
  };
  loadOptions = c => {
    return () => {
      if (!this.props[c + "Options"]) {
        this.setState({
          loading: { ...this.state.loading, [c + "Loading"]: true }
        });
        this.props.getPropVal(c).then(() =>
          this.setState({
            loading: { ...this.state.loading, [c + "Loading"]: false }
          })
        );
      }
    };
  };
  loadOptionsArr = cArr => {
    return () => {
      cArr.forEach(c => {
        if (!this.props[c + "Options"]) {
          this.setState({
            loading: { ...this.state.loading, [c + "Loading"]: true }
          });
          this.props.getPropVal(c).then(() =>
            this.setState({
              loading: { ...this.state.loading, [c + "Loading"]: false }
            })
          );
        }
      });
    };
  };

  disabledStartDate = startValue => {
    const endValue = this.props.workPlannedEndDateValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };
  disabledEndDate = endValue => {
    const startValue = this.props.workPlannedStartDateValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  render() {
    if (!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem("i18nextLng");
    const {
      t,
      handleSubmit,
      reset,
      dirty,
      error,
      submitting,
      uprDocTypeOptions,
      inaccurateDateFeatureOptions,
      typeOfPaperCarrierOptions,
      tofiConstants: {
        caseNumber,
        caseDbeg,
        caseDend,
        caseNumberOfPages,
        caseOCD,
        fundIndex,
        caseNotes,
        uprDocType,
        documentAuthor,
        addressee,
        question,
        terrain,
        documentDate,
        inaccurateDate,
        inaccurateDateFeature,
        day,
        month,
        year,
        numberOfOriginals,
        typeOfPaperCarrier,
        caseNomenItem
      }
    } = this.props;
    const {
      loading: {
        workAssignedToRegLoading,
        workPriorityLoading,
        deliveryPurposeLoading
      }
    } = this.state;

    return (
      <Form
        className="antForm-spaceBetween"
        onSubmit={handleSubmit(this.onSubmit)}
        style={dirty ? { paddingBottom: "43px" } : {}}
      >
        <Row>
          <Col md={{ span: 10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
            {caseNumber && (
              <Field
                name="caseNumber"
                component={renderInput}
                label={caseNumber.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {fundIndex && (
              <Field
                name="fundIndex"
                component={renderInput}
                label={fundIndex.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            <Field
              name="caseTitle"
              component={renderInput}
              label={t("CASE_TITLE")}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
            {uprDocType && (
              <Field
                name="uprDocType"
                component={renderSelectVirt}
                searchable
                matchProp="label"
                matchPos="start"
                label={uprDocType.name[this.lng]}
                optionHeight={40}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
                isLoading={this.state.loading.uprDocTypeLoading}
                onOpen={this.loadOptions("uprDocType")}
                options={
                  uprDocTypeOptions
                    ? uprDocTypeOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                      }))
                    : []
                }
                // validate={requiredLabel}
                // colon={true}
              />
            )}
            {documentAuthor && (
              <Field
                name="documentAuthor"
                component={renderInput}
                label={documentAuthor.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {addressee && (
              <Field
                name="addressee"
                component={renderInput}
                label={addressee.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {question && (
              <Field
                name="question"
                component={renderInput}
                label={question.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {terrain && (
              <Field
                name="terrain"
                component={renderInput}
                label={terrain.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {documentDate && (
              <Field
                name="documentDate"
                component={renderDatePicker}
                format={null}
                label={documentDate.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
                // colon
                // validate={requiredDate}
              />
            )}
            {inaccurateDateFeature && (
              <Field
                name="inaccurateDateFeature"
                component={renderSelect}
                label={inaccurateDateFeature.name[this.lng]}
                optionHeight={40}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
                isLoading={this.state.loading.inaccurateDateFeatureLoading}
                onOpen={this.loadOptions("inaccurateDateFeature")}
                data={
                  inaccurateDateFeatureOptions
                    ? inaccurateDateFeatureOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                      }))
                    : []
                }
                // validate={requiredLabel}
                // colon={true}
              />
            )}
          </Col>
          <Col md={{ span: 10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
            {day && (
              <Field
                name="day"
                component={renderInput}
                label={day.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {month && (
              <Field
                name="month"
                component={renderInput}
                label={month.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {year && (
              <Field
                name="year"
                component={renderInput}
                label={year.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {caseDbeg && (
              <Field
                name="caseDbeg"
                disabledDate={this.disabledStartDate}
                component={renderDatePicker}
                format={null}
                label={caseDbeg.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
                // colon
                // validate={requiredDate}
              />
            )}
            {caseDend && (
              <Field
                name="caseDend"
                disabledDate={this.disabledEndDate}
                component={renderDatePicker}
                format={null}
                searchable={false}
                label={caseDend.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
                colon
                validate={requiredDate}
              />
            )}
            {caseNumberOfPages && (
              <Field
                name="caseNumberOfPages"
                component={renderInput}
                label={caseNumberOfPages.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {caseNotes && (
              <Field
                name="caseNotes"
                component={renderInput}
                label={caseNotes.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {numberOfOriginals && (
              <Field
                name="numberOfOriginals"
                component={renderInput}
                label={numberOfOriginals.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {typeOfPaperCarrier && (
              <Field
                name="typeOfPaperCarrier"
                component={renderSelect}
                label={typeOfPaperCarrier.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
                isLoading={this.state.typeOfPaperCarrierLoading}
                data={
                  typeOfPaperCarrierOptions
                    ? typeOfPaperCarrierOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                      }))
                    : []
                }
                onOpen={this.loadOptions(["typeOfPaperCarrier"])}
                // validate={requiredLabel}
                // colon={true}
              />
            )}
            {caseNomenItem && (
              <Field
                name="caseNomenItem"
                component={renderInput}
                label={caseNomenItem.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
          </Col>
        </Row>
        {dirty && (
          <Form.Item className="ant-form-btns">
            <Button
              className="signup-form__btn"
              type="primary"
              htmlType="submit"
              disabled={submitting}
            >
              {submitting ? t("LOADING...") : t("SAVE")}
            </Button>
            <Button
              className="signup-form__btn"
              type="danger"
              htmlType="button"
              disabled={submitting}
              style={{ marginLeft: "10px" }}
              onClick={reset}
            >
              {submitting ? t("LOADING...") : t("CANCEL")}
            </Button>
            {error && (
              <span className="message-error">
                <i className="icon-error" />
                {error}
              </span>
            )}
          </Form.Item>
        )}
      </Form>
    );
  }
}

export default reduxForm({
  form: "Form_invTypePerm_uprDoc",
  enableReinitialize: true
})(Form_invTypePerm_uprDoc);
