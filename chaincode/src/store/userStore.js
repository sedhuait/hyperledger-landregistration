const User = require('../models/user');

class UserStore {
  constructor(ctx) {
    this.ctx = ctx;
    this.name = 'org.property-registration.regnet.store.user';
  }

  async getUser(usrKey) {
    const usrCompositeKey = this.ctx.stub.createCompositeKey(this.name, usrKey.split(':'));
    const usrBuffer = await this.ctx.stub.getState(usrCompositeKey);
    return User.fromBuffer(usrBuffer);
  }

  async addUser(usrObject) {
    const usrCompositeKey = this.ctx.stub.createCompositeKey(this.name, usrObject.getKeyArray());
    const usrBuffer = usrObject.toBuffer();
    await this.ctx.stub.putState(usrCompositeKey, usrBuffer);
  }

  async updateUser(usrObject) {
    const usrCompositeKey = this.ctx.stub.createCompositeKey(this.name, usrObject.getKeyArray());
    const usrBuffer = usrObject.toBuffer();
    await this.ctx.stub.putState(usrCompositeKey, usrBuffer);
  }
}

module.exports = UserStore;
