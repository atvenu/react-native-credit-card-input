import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  ViewPropTypes,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet, InputAccessoryView, TouchableHighlight,
} from "react-native";

const s = StyleSheet.create({
  baseInputStyle: {
    color: "black",
  },
  accessoryViewContainer: {
    backgroundColor: "#f4f4f4",
    height: 50,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
});

const ccInputAccessoryViewID = 'credit-card-input-CCInput';

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(["valid", "invalid", "incomplete"]),

    containerStyle: ViewPropTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
    additionalInputProps: PropTypes.shape(TextInput.propTypes),
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
    additionalInputProps: {},
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

  renderInputAccessoryView(phoneProps) {

    return <InputAccessoryView nativeID={ccInputAccessoryViewID}>
      <View style={s.accessoryViewContainer}>
        {phoneProps.leftButton1Action && <TouchableHighlight style={{paddingHorizontal: 10}} underlayColor={'transparent'} onPress={phoneProps.leftButton1Action}>
          <Text>{phoneProps.leftButton1Text || ''}</Text>
        </TouchableHighlight>}
        {phoneProps.rightButtonAction && <TouchableHighlight style={{paddingHorizontal: 10}} underlayColor={'transparent'} onPress={phoneProps.rightButtonAction}>
          <Text>{phoneProps.rightButtonText || ''}</Text>
        </TouchableHighlight>}
      </View>
    </InputAccessoryView>
  }

  render() {
    const { label, value, placeholder, status, keyboardType,
            containerStyle, inputStyle, labelStyle,
            validColor, invalidColor, placeholderColor, phoneProps, isTablet = true, additionalInputProps } = this.props;

    const commonInputProps = {
        ref: "input",
        inputAccessoryViewID: ccInputAccessoryViewID,
        ...additionalInputProps,
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
          <TextInput {...commonInputProps} />
          {!isTablet && phoneProps && this.renderInputAccessoryView(phoneProps)}
        </View>
      </TouchableOpacity>
    );
  }
}
