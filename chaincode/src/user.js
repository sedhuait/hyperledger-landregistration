/* eslint-disable class-methods-use-this */
const { Contract } = require('fabric-contract-api');

const RegnetContext = require('./common/regnetContext');
const User = require('./models/user');
const Property = require('./models/property');
const Request = require('./models/request');

const TXN_VALUE_MAP = { upg100: 100, upg500: 500, upg1000: 1000 };
const PROPETY_STATUS = ['registered', 'onSale'];

const USER_MSP_ID = 'usersMSP';
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
    this.isValidUser(ctx);
    const userRequestKey = Request.makeKey(['user', name, aadharNumber]);

    const existingUserRequest = await ctx.requestStore.getRequest(userRequestKey).catch((err) => console.log('Provided userRequestId is unique!'));
    if (existingUserRequest) {
      throw new Error(`UserRequest Present Already:${JSON.stringify(existingUserRequest)}`);
    }

    const userKey = User.makeKey([name, aadharNumber]);
    const existingUser = await ctx.userStore.getUser(userKey).catch((err) => console.log('Provided user is unique!'));

    if (existingUser) {
      throw new Error(`User Present Already:${JSON.stringify(existingUser)}`);
    }

    const userInput = {
      aadharNumber, name, emailId, phoneNumber, createdAt: new Date(), key: userRequestKey,
    };

    const reqObj = Request.createInstance(userInput);
    await ctx.requestStore.addRequest(reqObj);
    return reqObj;
  }

  async rechargeAccount(ctx, aadharNumber, name, bankTransactionId) {
    this.isValidUser(ctx);
    if (!Object.keys(TXN_VALUE_MAP).includes(bankTransactionId)) {
      throw new Error(`Invalid TransactionId: ${bankTransactionId}`);
    }
    const userKey = User.makeKey([name, aadharNumber]);
    const existingUser = await ctx.userStore.getUser(userKey).catch((err) => { throw new Error(`User doen't exist with key${userKey}`); });

    if (existingUser) {
      existingUser.upgradCoins += TXN_VALUE_MAP[bankTransactionId];
      await ctx.userStore.updateUser(existingUser);
    }
  }

  async viewUser(ctx, aadharNumber, name) {
    this.isValidUser(ctx);
    const userKey = User.makeKey([name, aadharNumber]);
    const existingUser = await ctx.userStore.getUser(userKey).catch((err) => { throw new Error(`User doen't exist with key${userKey}`); });

    return existingUser;
  }

  async propertyRegistrationRequest(ctx, propertyId, aadharNumber, name, price, status) {
    this.isValidUser(ctx);
    if (!PROPETY_STATUS.includes(status)) {
      throw new Error(`Invalid property status${status}`);
    }

    if (!(Number(price) > 0)) {
      throw new Error(`Invalid property price${price}`);
    }

    const existingUser = await this.viewUser(ctx, aadharNumber, name).catch((err) => { throw new Error(`User doen't exist with Aadhar:${aadharNumber} and Name:${name}`); });

    if (!existingUser) {
      throw new Error(`User doen't exist with Aadhar:${aadharNumber} and Name:${name}`);
    }

    const existingProp = await this.viewPropery(ctx, propertyId).catch((err) => console.log(`Property doesn't exist with id:${propertyId}`));

    if (existingProp) {
      throw new Error(`Property Exist already for id${propertyId}`);
    }

    const propRequestKey = Request.makeKey(['property', propertyId]);
    const existingPropertyRequest = await ctx.requestStore.getRequest(propRequestKey).catch((err) => console.log('Provided property request is unique!'));
    if (existingPropertyRequest) {
      throw new Error(`Property Request Present Already:${JSON.stringify(existingPropertyRequest)}`);
    }

    const propertyInput = {
      createdAt: new Date(),
      price,
      status,
      propertyId,
      owner: existingUser.key,
      key: propRequestKey,
    };

    const reqObj = Property.createInstance(propertyInput);
    await ctx.requestStore.addRequest(reqObj);
    return reqObj;
  }

  async viewPropery(ctx, propertyId) {
    this.isValidUser(ctx);
    const propKey = Property.makeKey([propertyId]);
    const existingProp = await ctx.propertyStore.getProperty(propKey).catch((err) => { throw new Error(`Property doen't exist with key${propKey}`); });

    return existingProp;
  }

  async updateProperty(ctx, propertyId, name, aadharNumber, status) {
    this.isValidUser(ctx);
    const existingUser = await this.viewUser(ctx, aadharNumber, name).catch((err) => { throw new Error(`User doen't exist with Aadhar:${aadharNumber} and Name:${name}`); });

    if (!existingUser) {
      throw new Error(`User doen't exist with Aadhar:${aadharNumber} and Name:${name}`);
    }

    const existingProp = await this.viewPropery(ctx, propertyId).catch((err) => console.log(`Property doesn't exist with id:${propertyId}`));

    if (!existingProp) {
      throw new Error(`Property doesn't for id:${propertyId}`);
    }

    if (existingProp.owner !== existingUser.key) {
      throw new Error(`Incorrect Owner for Property id:${propertyId}`);
    }

    existingProp.status = status;

    await ctx.propertyStore.updateProperty(existingProp);
  }

  async purchaseProperty(ctx, propertyId, buyerName, buyerAadharNumber) {
    this.isValidUser(ctx);
    const buyer = await this.viewUser(ctx, buyerAadharNumber, buyerName).catch((err) => { throw new Error(`User doen't exist with Aadhar:${buyerAadharNumber} and Name:${buyerName}`); });

    if (!buyer) {
      throw new Error(`Buyer doen't exist with Aadhar:${buyerAadharNumber} and Name:${buyerName}`);
    }

    const existingProp = await this.viewPropery(ctx, propertyId).catch((err) => console.log(`Property doesn't exist with id:${propertyId}`));

    if (!existingProp) {
      throw new Error(`Property doesn't for id:${propertyId}`);
    }

    if (existingProp.status !== 'onSale') {
      throw new Error(`Property:${propertyId} is not on sale.`);
    }

    if (buyer.upgradCoins < existingProp.price) {
      throw new Error(`Insufficient balance for user. You need additional ${existingProp.price - buyer.upgradCoins} upgradCoins`);
    }

    buyer.upgradCoins -= existingProp.price;
    await ctx.userStore.updateUser(buyer);

    existingProp.status = 'registered';
    existingProp.owner = buyer.key;

    await ctx.propertyStore.updateProperty(existingProp);
  }

  isValidUser(ctx) {
    if (ctx.clientIdentity.getMSPID() !== USER_MSP_ID) {
      throw new Error('Access Denied. Incorrect MSP');
    }
  }
}

module.exports = UserContract;
