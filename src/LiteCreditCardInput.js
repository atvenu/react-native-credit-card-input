import React, { Component, PropTypes } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutAnimation,
  TouchableOpacity,
} from "react-native";

import Icons from "./Icons";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const INFINITE_WIDTH = 1000;

const s = StyleSheet.create({
  container: {
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  icon: {
    width: 48,
    height: 40,
    marginRight: 10,
    resizeMode: "contain",
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    overflow: "hidden",
  },
  rightPart: {
    overflow: "hidden",
    flexDirection: "row",
  },
  last4: {
    flex: 1,
    justifyContent: "center",
  },
  numberInput: {
    width: INFINITE_WIDTH,
    marginLeft: 3,
  },
  expiryInput: {
    width: 80,
    marginLeft: 5,
  },
  cvcInput: {
    width: 80,
    marginRight: -5,
  },
  last4Input: {
    width: 60,
    marginLeft: 0,
  },
  input: {
    height: 40,
    color: "black",
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,

    placeholders: PropTypes.object,

    inputStyle: Text.propTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,
  };

  static defaultProps = {
    placeholders: {
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focusNumber = () => this._focus("number");
  _focusExpiry = () => this._focus("expiry");

  _focus = field => {
    if (!field) return;
    this.refs[field].focus();
    LayoutAnimation.easeInEaseOut();
  };

  _inputProps = field => {
    const {
      inputStyle, validColor, invalidColor, placeholderColor,
      placeholders, values, status, handleFocusOnBackspace,
      onFocus, onChange, onBecomeEmpty, onBecomeValid, isTablet, phoneProps
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],
      handleFocusOnBackspace,
      isTablet, phoneProps,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
    };
  };

  _iconToShow = () => {
    const { values: { type } } = this.props;
    if (type) return type;
    return "placeholder";
  };

  render() {
    const { focused, values: { number }, inputStyle, status: { number: numberStatus } } = this.props;
    const showRightPart = focused && focused !== "number";

    return (
      <View style={s.container}>
        <View style={[
          s.leftPart,
          showRightPart ? s.hidden : s.expanded,
        ]}>
          <CCInput {...this._inputProps("number")}
              onSubmitEditing={showRightPart ? this._focusNumber : this._focusExpiry }
              containerStyle={s.numberInput} />
        </View>
        <TouchableOpacity onPress={showRightPart ? this._focusNumber : this._focusExpiry }>
          <Image style={s.icon}
              source={{ uri: Icons[this._iconToShow()] }} />
        </TouchableOpacity>
        <View style={[
          s.rightPart,
          showRightPart ? s.expanded : s.hidden,
        ]}>
          <TouchableOpacity onPress={this._focusNumber}
              style={s.last4}>
            <View pointerEvents={"none"}>
              <CCInput field="last4"
                  value={ numberStatus === "valid" ? number.substr(number.length - 4, 4) : "" }
                  inputStyle={[s.input, inputStyle]}
                  containerStyle={[s.last4Input]} />
            </View>
          </TouchableOpacity>
          <CCInput {...this._inputProps("expiry")}
            containerStyle={s.expiryInput}
            inputStyle={[s.input, inputStyle, {alignSelf: 'flex-end', flex: 0, width: 50}]}
          />
          <CCInput {...this._inputProps("cvc")}
            containerStyle={s.cvcInput}
            inputStyle={[s.input, inputStyle, {alignSelf: 'flex-end', flex: 0, width: 50}]}
          />
        </View>
      </View>
    );
  }
}
