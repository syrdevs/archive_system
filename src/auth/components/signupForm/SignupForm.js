import React from "react";
import {Steps, Button, message} from "antd";
import {translate} from "react-i18next";

import SignupFormFirst from "./SignupFormFirst";
import SignupFormSecond from "./SignupFormSecond";

const Step = Steps.Step;

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }

  steps = [
    {
      title: "First"
    },
    {
      title: "Second",
      content: "Second-content"
    }
  ];
  next = () => {
    const current = this.state.current + 1;
    this.setState({current});
  };
  prev = () => {
    const current = this.state.current - 1;
    this.setState({current});
  };
  onSubmit = values => {
    alert(JSON.stringify(values, null, 2))
  };

  render() {
    const {current} = this.state;
    return (
      <div>
        <Steps current={current}>
          {this.steps.map(item => (
            <Step key={item.title} title={item.title}/>
          ))}
        </Steps>
        <div className="steps-content">
          <h2>{this.props.t("REGISTRATION")}</h2>
          {
            this.state.current === 0 && <SignupFormFirst
              t={this.props.t}
              tofiConstants={this.props.t}
              onSubmit={this.next}
            />
          }
          {
            this.state.current === 1 && <SignupFormSecond
              t={this.props.t}
              tofiConstants={this.props.t}
              onSubmit={this.onSubmit}
            />
          }
        </div>
        <div className="steps-action">
          {this.state.current < this.steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => this.props.submit("signUpForm")}
            >
              Next
            </Button>
          )}
          {this.state.current === this.steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => this.props.submit("signUpForm")}
            >
              Done
            </Button>
          )}
          {this.state.current > 0 && (
            <Button style={{marginLeft: 8}} onClick={() => this.prev()}>
              Previous
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default translate("signUpForm")(SignupForm);
