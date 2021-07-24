/* eslint-disable class-methods-use-this */
const { Contract } = require('fabric-contract-api');

const RegnetContext = require('./common/regnetContext');
const User = require('./models/user');
const Property = require('./models/property');
const Request = require('./models/request');

class UserContract extends Contract {
  constructor() {
    super('org.property-registration.regnet.user');
  }

  createContext() {
    return new RegnetContext();
  }

  async instantiate(ctx) {
    console.log('Regnet User Smart Contract Instantiated', ctx);
  }

  async requestNewUser(ctx, aadharNumber, name, emailId, phoneNumber) {

  }

  async rechargeAccount(ctx, aadharNumber, name, bankTransactionId) {

  }

  async viewUser(ctx, aadharNumber, name) {

  }

  async propertyRegistrationRequest(ctx, propertyId, owner, price, status) {

  }

  async viewPropery(ctx, propertyId) {

  }

  async updateProperty(ctx, propertyId, name, aadharNumber, status) { }

  async purchaseProperty(ctx, propertyId, buyerName, buyerAadharNumber) {

  }
}

module.exports = UserContract;
