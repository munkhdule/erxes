import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-plus';
import { ControlLabel } from 'modules/common/components';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { integrationOptions, selectOptions } from '../utils';
import { KIND_CHOICES as INTEGRATIONS_TYPES } from 'modules/settings/integrations/constants';
import { FlexRow, FlexItem, InsightFilter, InsightTitle } from '../styles';
import { router } from 'modules/common/utils';

const propTypes = {
  brands: PropTypes.array.isRequired,
  queryParams: PropTypes.object,
  history: PropTypes.object
};

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.queryParams,
      // check condition for showing placeholder
      startDate: props.queryParams.startDate
        ? moment(props.queryParams.startDate)
        : '',
      endDate: props.queryParams.endDate
        ? moment(props.queryParams.endDate)
        : ''
    };
  }

  onTypeChange(value) {
    const integrationType = value ? value.value : '';
    this.setState({ integrationType });
    router.setParams(this.props.history, { integrationType });
  }

  onBrandChange(value) {
    const brandId = value ? value.value : '';
    this.setState({ brandId });
    router.setParams(this.props.history, { brandId });
  }

  onDateInputChange(type, date) {
    this.setState({ [type]: date });
    const formatDate = date ? moment(date).format('YYYY-MM-DD') : null;
    router.setParams(this.props.history, { [type]: formatDate });
  }

  renderIntegrations() {
    const integrations = INTEGRATIONS_TYPES.ALL_LIST;

    return (
      <FlexItem>
        <ControlLabel>Integrations</ControlLabel>
        <Select
          placeholder="Choose integrations"
          value={this.state.integrationType}
          onChange={value => this.onTypeChange(value)}
          optionRenderer={option => (
            <div className="simple-option">
              <span>{option.label}</span>
            </div>
          )}
          options={integrationOptions(integrations)}
        />
      </FlexItem>
    );
  }

  renderBrands() {
    const { brands } = this.props;
    return (
      <FlexItem>
        <ControlLabel>Brands</ControlLabel>

        <Select
          placeholder="Choose brands"
          value={this.state.brandId}
          onChange={value => this.onBrandChange(value)}
          optionRenderer={option => (
            <div className="simple-option">
              <span>{option.label}</span>
            </div>
          )}
          options={selectOptions(brands)}
        />
      </FlexItem>
    );
  }

  render() {
    return (
      <InsightFilter>
        <InsightTitle>Filter</InsightTitle>
        <FlexRow>
          {this.renderIntegrations()}
          {this.renderBrands()}
          <FlexItem>
            <ControlLabel>Start date</ControlLabel>
            <DatePicker
              selected={this.state.startDate}
              className="form-control"
              placeholderText="Click to select a date"
              onChange={this.onDateInputChange.bind(this, 'startDate')}
            />
          </FlexItem>
          <FlexItem>
            <ControlLabel>End date</ControlLabel>
            <DatePicker
              selected={this.state.endDate}
              className="form-control"
              placeholderText="Click to select a date"
              onChange={this.onDateInputChange.bind(this, 'endDate')}
            />
          </FlexItem>
        </FlexRow>
      </InsightFilter>
    );
  }
}

Filter.propTypes = propTypes;

export default Filter;
