import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { forEach } from "lodash";
import { Modal } from "antd";
import { submit } from "redux-form";

import SignupForm from "./components/signupForm/SignupForm";
import {
  factorValLoaded,
  countriesLoaded,
  citiesLoaded,
  regNewUserSuccess
} from "../shared/actions/actions";
import { RESEARCH_TYPES } from "../shared/constants/tofiConstants";

class SignupScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      countriesLoading: true,
      researchTypesLoading: true
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    const lng = localStorage.getItem("i18nextLng");
    const valuesMap = {
      ["researcherName_" + lng]: values.firstName,
      ["researcherLastName_" + lng]: values.lastName,
      ["researcherFamilyName_" + lng]: values.middleName
        ? values.middleName
        : "",
      login: values.login,
      email: values.email,
      idCardNumber: values.NID ? values.NID : "",
      city: values.city.value,
      ["country_" + lng]: values.Country,
      purposeOfStudy: values.research ? values.research.value : "",
      phone: values.phone,
      ["homeAddress_" + lng]: values.Address
        ? values.Address.replace(/\s/g, "_")
        : "",
      photofileid: values.Photo,
      idCard: values.Identity
    };

    const fd = new FormData();
    forEach(valuesMap, (value, key) => {
      fd.append(key, value);
    });

    this.props
      .regNewUserSuccess(fd)
      .then(res => res.data)
      .then(data => {
        data.data.toLowerCase() === "ok"
          ? Modal.success({
              title: "REGISTRATION_SUCCESS_TITLE",
              content: "REGISTRATION_SUCCESS_CONTENT",
              onOk: () => {
                this.props.push("/");
              }
            })
          : Modal.error({
              title: "REGISTRATION_FAILED_TITLE",
              content: "REGISTRATION_FAILED_CONTENT"
            });
      })
      .catch(err => {
        console.log(err);
        Modal.error({
          title: "REGISTRATION_FAILED_TITLE",
          content: "REGISTRATION_FAILED_CONTENT"
        });
      });
  }

  componentDidMount() {
    this.props
      .factorValLoaded(RESEARCH_TYPES)
      .then(() => this.setState({ researchTypesLoading: false }));
    this.props
      .countriesLoaded()
      .then(() => this.setState({ countriesLoading: false }));
  }

  render() {
    return (
      <div className="signup-container">
        <SignupForm
          submit={this.props.submit}
          onSubmit={this.onSubmit}
          researchTypes={this.props.researchTypes || []}
          countriesList={this.props.countriesList || []}
          citiesList={this.props.citiesList || []}
          getCities={this.props.citiesLoaded}
          countriesLoading={this.state.countriesLoading}
          researchTypesLoading={this.state.researchTypesLoading}
        />
      </div>
    );
  }
}

SignupScreen.propTypes = {
  push: PropTypes.func.isRequired,
  factorValLoaded: PropTypes.func.isRequired,
  researchTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.object.isRequired,
      fullName: PropTypes.object
    })
  ),
  countriesLoaded: PropTypes.func.isRequired,
  countriesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.object.isRequired,
      fullName: PropTypes.object
    })
  ),
  citiesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.object.isRequired,
      fullName: PropTypes.object
    })
  ).isRequired,
  citiesLoaded: PropTypes.func.isRequired,
  regNewUserSuccess: PropTypes.func.isRequired,
  signUpForm: PropTypes.object
};

function mapStateToProps(state) {
  return {
    researchTypes: state.generalData.researchTypes,
    countriesList: state.generalData.countriesList,
    citiesList: state.generalData.citiesList,
    signUpForm: state.form.signUpForm
  };
}

export default connect(
  mapStateToProps,
  {
    push,
    factorValLoaded,
    countriesLoaded,
    citiesLoaded,
    regNewUserSuccess,
    submit
  }
)(SignupScreen);
