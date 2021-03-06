import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from 'modules/common/styles';

const AvatarStyled = styled.span`
  display: block;
  max-width: 80px;
  border-radius: 40px;
  float: left;
  padding: 0;
  text-align: center;
  background: ${props =>
    (props.isUser && colors.colorCoreGreen) ||
    (props.messenger && colors.colorPrimary) ||
    (props.twitter && colors.colorCoreYellow) ||
    (props.facebook && colors.colorSecondary) ||
    colors.colorCoreRed};

  a {
    color: ${colors.colorWhite};
    display: block;
    transition: all ease 0.3s;

    &:hover {
      color: ${colors.colorWhite};
      opacity: 0.8;
    }
  }
`;

const DefaultAvatar = styled.div`
  background: url('/images/userDefaultIcon.png') center no-repeat;
  background-size: cover;
`;

class Avatar extends Component {
  generateStyle(size = 40) {
    return {
      width: size,
      height: size,
      lineHeight: `${size}px`,
      borderRadius: `${size}px`,
      fontSize: `${size / 3}px`
    };
  }

  renderImage(src, alt) {
    const { size } = this.props;
    return <img src={src} alt={alt} style={this.generateStyle(size)} />;
  }

  generateTypes() {
    const { customer } = this.props;

    if (customer) {
      return {
        isUser: customer.isUser,
        messenger: customer.messengerData && true,
        twitter: customer.twitterData && true,
        facebook: customer.facebookData && true
      };
    }

    return {
      isUser: true
    };
  }

  renderInitials(fullName) {
    const { size } = this.props;
    const initials = fullName ? (
      fullName
        .split(' ')
        .slice(0, 2)
        .map(s => s.charAt(0))
        .join('.')
        .toUpperCase()
    ) : (
      <DefaultAvatar style={this.generateStyle(size)} />
    );

    return <div style={this.generateStyle(size)}>{initials}</div>;
  }

  renderName(customer) {
    if (customer.firstName && customer.lastName) {
      return `${customer.firstName} ${customer.lastName}`;
    }
    return customer.firstName || customer.lastName || null;
  }

  render() {
    const { user, customer } = this.props;
    let avatar;
    let fullName;

    if (user) {
      const { details } = user;
      avatar = details && details.avatar;
      fullName = details && details.fullName;
    } else if (customer) {
      avatar = customer.avatar;
      fullName = this.renderName(customer);
    }

    const Element = customer ? Link : 'div';

    return (
      <AvatarStyled {...this.generateTypes()}>
        <Element to={customer && `/customers/details/${customer._id}`}>
          {avatar
            ? this.renderImage(avatar, fullName)
            : this.renderInitials(fullName)}
        </Element>
      </AvatarStyled>
    );
  }
}

Avatar.propTypes = {
  user: PropTypes.object,
  customer: PropTypes.object,
  size: PropTypes.number
};

export default Avatar;
