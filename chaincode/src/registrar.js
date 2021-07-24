/* eslint-disable class-methods-use-this */
const { Contract } = require('fabric-contract-api');

const RegnetContext = require('./common/regnetContext');
const User = require('./models/user');
const Property = require('./models/property');
const Request = require('./models/request');

class RegistrarContract extends Contract {
  constructor() {
    super('org.property-registration.regnet.user');
  }

  createContext() {
    return new RegnetContext();
  }

  async instantiate(ctx) {
    console.log('Regnet Registrar Smart Contract Instantiated', ctx);
  }

  async approveNewUser(ctx, name, aadharNumber) {

  }

  async approvePropertyRegistration(ctx, propertyId) {

  }

  async viewUser(ctx, aadharNumber, name) {

  }

  async viewPropery(ctx, propertyId) {

  }
}

module.exports = RegistrarContract;
