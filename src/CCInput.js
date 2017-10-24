import React, { Component, PropTypes } from "react";
import RCTTextInput from 'react-native-textinput-utils';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const s = StyleSheet.create({
  baseInputStyle: {
    color: "black",
  },
});

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(["valid", "invalid", "incomplete"]),

    containerStyle: View.propTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
  };

  static defaultProps = {
    label: "",
    value: "",
    status: "incomplete",
    keyboardType: "numeric",
    containerStyle: {},
    inputStyle: {},
    labelStyle: {},
    onFocus: () => {},
    onChange: () => {},
    onBecomeEmpty: () => {},
    onBecomeValid: () => {},
  };

  componentWillReceiveProps = newProps => {
    const { status, value, onBecomeEmpty, onBecomeValid, field, handleFocusOnBackspace } = this.props;
    const { status: newStatus, value: newValue } = newProps;

    if (!handleFocusOnBackspace && value !== "" && newValue === "") onBecomeEmpty(field)
    if (status !== "valid" && newStatus === "valid") onBecomeValid(field);
  };

  focus = () => this.refs.input.focus();

  _onFocus = () => this.props.onFocus(this.props.field);
  _onChange = value => this.props.onChange(this.props.field, value);
  _handleKeyDown = e => {
    const { value, field, onBecomeEmpty, handleFocusOnBackspace } = this.props;
    if (handleFocusOnBackspace && e.nativeEvent.key == "Backspace" && value === "" ){
      onBecomeEmpty(field);
    }
  };

  render() {
    const { label, value, placeholder, status, keyboardType,
            containerStyle, inputStyle, labelStyle,
            validColor, invalidColor, placeholderColor, phoneProps, isTablet = true } = this.props;

    const commonInputProps = {
        ref: "input",
        keyboardType,
        autoCapitalise: "words",
        autoCorrect: false,
        underlineColorAndroid: "transparent",
        placeholderTextColor: placeholderColor,
        placeholder,
        value,
        onFocus: this._onFocus,
        onSubmitEditing: this.props.onSubmitEditing,
        onKeyPress: this._handleKeyDown,
        onChangeText: this._onChange,
        style: [
              s.baseInputStyle,
              inputStyle,
              ((validColor && status === "valid") ? { color: validColor } :
              (invalidColor && status === "invalid") ? { color: invalidColor } :
              {}),
              ]
    };

    return (
      <TouchableOpacity onPress={this.focus}
          activeOpacity={0.99}>
        <View style={[containerStyle]}>
          { !!label && <Text style={[labelStyle]}>{label}</Text>}
          {isTablet ?
            <TextInput {...commonInputProps} />
          :
            <RCTTextInput {...commonInputProps}
              leftButtonText={(phoneProps && phoneProps.leftButtonText) ? phoneProps.leftButtonText : ''}
              onCancel={(phoneProps && phoneProps.leftButtonAction) ? phoneProps.leftButtonAction : null}
              rightButtonText={(phoneProps && phoneProps.rightButtonText) ? phoneProps.rightButtonText : ''}
              onDone={(phoneProps && phoneProps.rightButtonAction) ? phoneProps.rightButtonAction : null}
            />
          }
        </View>
      </TouchableOpacity>
    );
  }
}
