import styled from 'styled-components';
import { colors, dimensions, typography } from '../../styles';

const inputPadding = '0px';
const inputHeight = '16px';
const inputScale = '12px';
const inputBorderWidth = '1px';
const textInputHeight = '34px';

const Label = styled.label`
  text-transform: uppercase;
  display: inline-block;
  font-weight: ${typography.fontWeightMedium};
  color: ${colors.textSecondary};
  font-size: ${typography.fontSizeUppercase}px;
  margin-bottom: 5px;
`;

const Formgroup = styled.div`
  margin-bottom: 20px;

  label {
    margin-right: ${dimensions.unitSpacing}px;
  }
`;

const Input = styled.input`
  display: block;
  border: none;
  width: 100%;
  height: ${textInputHeight};
  padding: ${dimensions.unitSpacing}px;
  color: ${colors.textPrimary};
  border-bottom: 1px solid ${colors.colorShadowGray};
  background: ${colors.colorWhite};
  transition: all 0.3s ease;

  ${props => {
    if (props.round) {
      return `
        font-size: 13px;
        border: 1px solid #ddd;
        border-radius: 20px;
        padding: 5px 20px;
      `;
    }
  }};

  &:hover {
    border-color: ${colors.colorLightGray};
  }

  &:focus {
    outline: none;
    border-color: ${colors.colorSecondary};
  }
`;

const SelectWrapper = styled.div`
  overflow: hidden;
  border-bottom: 1px solid ${colors.colorShadowGray};
  width: 100%;
  height: ${textInputHeight};
  position: relative;

  &:after {
    position: absolute;
    right: 10px;
    top: 12px;
    content: '\f123';
    font-size: 12px;
    display: inline-block;
    font-family: 'Ionicons';
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    text-rendering: auto;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
  }
`;

const Select = Input.withComponent('select').extend`
  border: none;
  height: ${textInputHeight};
  padding: 0 ${dimensions.unitSpacing}px;
  width: calc(100% + ${dimensions.coreSpacing}px);
  -webkit-appearance: none;
`;

const Textarea = Input.withComponent('textarea').extend`
	height: 80px;
`;

const FormLabel = styled.label`
  position: relative;
  display: inline-block;
  font-weight: normal;

  span {
    cursor: pointer;
    display: inline-block;
  }
`;

const inputStyle = styled.input`
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  clip-path: inset(50%) !important;
  height: 1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important;

  &:focus {
    + span {
      &::before {
        box-shadow: 0 0 0 2px rgba(#333, 0.4) !important;
      }
    }
  }

  &:hover {
    + span {
      &::before {
        border-color: ${colors.colorLightGray};
      }
    }
  }

  &:active {
    + span {
      &::before {
        transition-duration: 0;
      }
    }
  }

  + span {
    position: relative;
    padding: ${inputPadding};
    user-select: none;

    &:before {
      background-color: ${colors.colorWhite};
      border: ${inputBorderWidth} solid ${colors.colorShadowGray};
      box-sizing: content-box;
      content: '';
      color: ${colors.colorWhite};
      margin-right: calc(${inputHeight} * 0.25);
      top: 51%;
      left: 0;
      width: ${inputHeight};
      height: ${inputHeight};
      display: inline-block;
      vertical-align: text-top;
    }

    &:after {
      box-sizing: content-box;
      content: '';
      background-color: ${colors.colorWhite};
      position: absolute;
      top: 56%;
      left: calc(${inputPadding} + ${inputBorderWidth} + ${inputScale}/2);
      width: calc(${inputHeight} - ${inputScale});
      height: calc(${inputHeight} - ${inputScale});
      margin-top: calc((${inputHeight} - ${inputScale})/-2);
      transform: scale(0);
      transform-origin: 51%;
      transition: transform 200ms ease-out;
    }
  }

  + span:last-child:before {
    margin-right: 0px;
  }
`;

const Radio = inputStyle.extend`
  + span {

    &::before,
    &::after {
      border-radius: 50%;
    }
  }

  &:checked {

    &:active,
    &:focus {

      + span {

        &::before {
          animation: none;
          filter: none;
          transition: none;
        }
      }
    }

    + span {

      &:before {
        animation: none;
        background-color: ${colors.colorSecondary};
        border-color: transparent;
      }

      &:after {
        transform: scale(1);
      }
    }
  }
`;

const Checkbox = inputStyle.extend`
  + span {
    &:after {
      background-color: transparent;
      top: 51%;
      left: calc(1px + ${inputHeight}/5);
      width: calc(${inputHeight}/2);
      height: calc(${inputHeight}/5);
      margin-top: calc(${inputHeight} / -2 / 2 * 0.8);
      border-style: solid;
      border-color: ${colors.colorWhite};
      border-width: 0 0 2px 2px;
      border-radius: 0;
      border-image: none;
      transform: rotate(-45deg) scale(0);
      transition: none;
    }
  }

  &:checked + span {

    &:before {
      animation: none;
      background-color: ${colors.colorSecondary};
      border-color: transparent;
    }

    &:after {
      content: '';
      transform: rotate(-45deg) scale(1);
      transition: transform 200ms ease-out;
    }
  }
`;

export {
  Input,
  SelectWrapper,
  Select,
  Textarea,
  Radio,
  Checkbox,
  FormLabel,
  Label,
  Formgroup
};
