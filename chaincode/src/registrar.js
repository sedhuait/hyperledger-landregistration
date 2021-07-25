/* eslint-disable class-methods-use-this */
const { Contract } = require('fabric-contract-api');

const RegnetContext = require('./common/regnetContext');
const User = require('./models/user');
const Property = require('./models/property');
const Request = require('./models/request');

class RegistrarContract extends Contract {
  constructor() {
    super('org.property-registration.regnet.registrar');
  }

  createContext() {
    return new RegnetContext();
  }

  async instantiate(ctx) {
    console.log('Regnet Registrar Smart Contract Instantiated', ctx);
  }

  async approveNewUser(ctx, name, aadharNumber) {
    const userRequestKey = Request.makeKey(['user', name, aadharNumber]);

    const existingUserRequest = await ctx.requestStore.getRequest(userRequestKey).catch((err) => { throw new Error(`User request doesn't exist for key:${userRequestKey}`); });
    if (!existingUserRequest) {
      throw new Error(`User request doesn't exist for key:${userRequestKey}`);
    }

    const existingUser = await this.viewUser(ctx, aadharNumber, name).catch((err) => console.log("User doesn't exist"));
    if (existingUser) {
      throw new Error(`User present already for name:${name} and Aadhar: ${aadharNumber}`);
    }
    const userObj = User.createInstanceFromUserRequest(existingUserRequest);
    await ctx.userStore.addUser(userObj);
    return userObj;
  }

  async approvePropertyRegistration(ctx, propertyId) {
    const propRequestKey = Request.makeKey(['property', propertyId]);

    const existingPropRequest = await ctx.requestStore.getRequest(propRequestKey).catch((err) => { throw new Error(`Propetry request doesn't exist for key:${propRequestKey}`); });
    if (!existingPropRequest) {
      throw new Error(`Property request doesn't exist for key:${propRequestKey}`);
    }

    const existingProperty = await this.viewPropery(ctx, propertyId).catch((err) => console.log("Property doesn't exist"));
    if (existingProperty) {
      throw new Error(`Property present already for id:${propertyId}`);
    }
    const propObj = Property.createInstanceFromPropertyRequest(existingPropRequest);
    await ctx.propertyStore.addProperty(propObj);
    return propObj;
  }

  async viewUser(ctx, aadharNumber, name) {
    const userKey = User.makeKey([name, aadharNumber]);
    const existingUser = await ctx.userStore.getUser(userKey).catch((err) => { throw new Error(`User doen't exist with key${userKey}`); });

    return existingUser;
  }

  async viewPropery(ctx, propertyId) {
    const propKey = Property.makeKey([propertyId]);
    const existingProp = await ctx.propertyStore.getProperty(propKey).catch((err) => { throw new Error(`Property doen't exist with key${propKey}`); });

    return existingProp;
  }
}

module.exports = RegistrarContract;
