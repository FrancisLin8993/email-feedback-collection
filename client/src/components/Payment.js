import React from "react";
import { connect } from "react-redux";
import StripeCheckout from "react-stripe-checkout";
import * as actions from "../actions";

class Payment extends React.Component {
  render() {
    return (
      <StripeCheckout
        name="Emailfc"
        description="$5 for 5 emailfc credits"
        amount={500}
        token={token => this.props.handleStripeToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <button className="btn">Add Credits</button>
      </StripeCheckout>
    );
  }
}

export default connect(
  null,
  actions
)(Payment);
