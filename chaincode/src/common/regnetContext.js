const { Context } = require('fabric-contract-api');
const UserStore = require('../store/userStore');
const PropertyStore = require('../store/propertyStore');
const RequestStore = require('../store/requestStore');

class RegnetContext extends Context {
  constructor() {
    super();
    this.userStore = new UserStore(this);
    this.propertyStore = new PropertyStore(this);
    this.requestStore = new RequestStore(this);
  }
}

module.exports = RegnetContext;
