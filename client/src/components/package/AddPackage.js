import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { removeDataForEdit } from '../../actions/profileActions';
import { addPackage } from '../../actions/packageActions';
import { getRiders } from '../../actions/riderActions';
import { getVendors } from '../../actions/vendorActions';

import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import Spinner from '../common/Spinner';
import isEmpty from '../../validation/is-empty';

class AddPackage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendor: '',
      customername: '',
      customerphone: '',
      address: '',
      arrivaldate: '',
      rider: '',
      deliverdate: '',
      cod: '',
      dc: '',
      status: 'pending',
      errors: {},
      hashValue: 'Add Package',
      loading: false
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.props.getVendors();
    this.props.getRiders();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: false })

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }

    const { editData } = this.props.profile;

    if (Object.entries(editData).length === 0 && editData.constructor === Object) {
      this.setState({
        hashValue: 'Add Package'
      })
    } else {
      this.setState({
        vendor: editData.vendor,
        customername: editData.customername,
        customerphone: editData.customerphone.toString(),
        address: editData.address,
        arrivaldate: editData.arrivaldate,
        rider: editData.rider,
        deliverdate: editData.deliverdate,
        cod: isEmpty(editData.cod) ? editData.cod : editData.cod.toString(),
        dc: isEmpty(editData.dc) ? editData.dc : editData.dc.toString(),
        status: editData.status,
        hashValue: 'Edit Package'
      })
    }
  }

  componentWillUnmount() {
    this.props.removeDataForEdit();
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({ loading: true })

    let packageData;

    const { editData } = this.props.profile;

    if (Object.entries(editData).length > 0 && editData.constructor === Object) {

      packageData = {
        vendor: this.state.vendor,
        customername: this.state.customername,
        customerphone: this.state.customerphone,
        address: this.state.address,
        arrivaldate: this.state.arrivaldate,
        rider: this.state.rider,
        deliverdate: this.state.deliverdate,
        cod: this.state.cod,
        dc: this.state.dc,
        status: this.state.status,
        _id: editData._id
      };

    } else {
      packageData = {
        vendor: this.state.vendor,
        customername: this.state.customername,
        customerphone: this.state.customerphone,
        address: this.state.address,
        arrivaldate: this.state.arrivaldate,
        rider: this.state.rider,
        deliverdate: this.state.deliverdate,
        cod: this.state.cod,
        dc: this.state.dc,
        status: this.state.status
      };
    }

    console.log(packageData)

    // Call an action
    this.props.addPackage(packageData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  getDropdownList(arr) {
    var list = [{ label: "* Choose...", value: '' }]

    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        list = [...list, { label: arr[i].name, value: arr[i]._id }];
      }
    }
    return list;
  }

  render() {
    const { errors } = this.props;
    const { vendors, riders, loading } = this.props.profile;

    let vendorSelection = this.getDropdownList(vendors);
    let riderSelection = this.getDropdownList(riders);
    let allVendors, allRiders;

    if (vendors === {} || loading) {
      allVendors = <Spinner />
    } else {
      allVendors = (
        <SelectListGroup
          name="vendor"
          options={vendorSelection}
          value={this.state.vendor}
          onChange={this.onChange}
          error={errors.vendor}
          info="Select a vendor from whom this package is recieved"
        />
      );
    }

    if (riders === {} || loading) {
      allRiders = <Spinner />
    } else {
      allRiders = (
        <SelectListGroup
          name="rider"
          options={riderSelection}
          value={this.state.rider}
          onChange={this.onChange}
          error={errors.rider}
          info="Select a rider who delivered this package"
        />
      );
    }

    let button;
    if (this.state.loading) {
      button = <button type="button" className="btn btn-secondary btn-block mt-4 disabled">Loading...</button>
    } else {
      button = <button type="submit" value="Submit" className="btn btn-dark btn-block mt-4">Submit</button>
    }

    return (
      <div>
        <div className="create-profile">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">{this.state.hashValue}</h1>
                <p className="lead text-center">
                  Let's get some information to add new package to our database
                </p>
                <small className="d-block pb-3">* = required fields</small>
                <form onSubmit={this.onSubmit}>
                  {allVendors}
                  <TextFieldGroup
                    placeholder="* Customer Name"
                    name="customername"
                    value={this.state.customername}
                    onChange={this.onChange}
                    error={errors.customername}
                    info="Name of the customer"
                  />
                  <TextFieldGroup
                    placeholder="* Customer Phone"
                    name="customerphone"
                    type="number"
                    value={this.state.customerphone}
                    onChange={this.onChange}
                    error={errors.customerphone}
                    info="Phone number of the customer"
                  />
                  <TextFieldGroup
                    placeholder="* Address"
                    name="address"
                    value={this.state.address}
                    onChange={this.onChange}
                    error={errors.address}
                    info="Where to deliver this package?"
                  />
                  <TextFieldGroup
                    placeholder="Arrival Date"
                    name="arrivaldate"
                    type="date"
                    value={this.state.arrivaldate}
                    onChange={this.onChange}
                    error={errors.arrivaldate}
                    info="Date at which vendor gives you the package"
                  />
                  {allRiders}
                  <TextFieldGroup
                    placeholder="Deliver Date"
                    name="deliverdate"
                    type="date"
                    value={this.state.deliverdate}
                    onChange={this.onChange}
                    error={errors.deliverdate}
                    info="Date at which this package is delivered to the customer"
                  />
                  <TextFieldGroup
                    placeholder="Cash On Delivery"
                    name="cod"
                    type="number"
                    value={this.state.cod}
                    onChange={this.onChange}
                    error={errors.cod}
                    info="An amount that coustomer gives on delivery"
                  />
                  <TextFieldGroup
                    placeholder="Delivery Charges"
                    name="dc"
                    type="number"
                    value={this.state.dc}
                    onChange={this.onChange}
                    error={errors.dc}
                    info="Delivery charges on this package"
                  />
                  <SelectListGroup
                    name="status"
                    options={[{ label: "Pending", value: "pending" }, { label: "Delivered", value: "delivered" }, { label: "Returned", value: "returned" }]}
                    value={this.state.status}
                    onChange={this.onChange}
                    error={errors.status}
                    info="Progress of this Package"
                  />
                  {button}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors
})

AddPackage.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addPackage: PropTypes.func.isRequired,
  getRiders: PropTypes.func.isRequired,
  getVendors: PropTypes.func.isRequired,
  removeDataForEdit: PropTypes.func.isRequired
}

export default connect(mapStateToProps, {
  addPackage,
  getRiders,
  getVendors,
  removeDataForEdit
})(withRouter(AddPackage));