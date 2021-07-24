const Request = require('../models/request');

class RequestStore {
  constructor(ctx) {
    this.ctx = ctx;
    this.name = 'org.property-registration.regnet.store.request';
  }

  async getRequest(reqKey) {
    const reqCompositeKey = this.ctx.stub.createCompositeKey(this.name, reqKey.split(':'));
    const reqBuffer = await this.ctx.stub.getState(reqCompositeKey);
    return Request.fromBuffer(reqBuffer);
  }

  async addRequest(reqObject) {
    const reqCompositeKey = this.ctx.stub.createCompositeKey(this.name, reqObject.getKeyArray());
    const reqBuffer = reqObject.toBuffer();
    await this.ctx.stub.putState(reqCompositeKey, reqBuffer);
  }

  async updateRequest(reqObject) {
    const reqCompositeKey = this.ctx.stub.createCompositeKey(this.name, reqObject.getKeyArray());
    const reqBuffer = reqObject.toBuffer();
    await this.ctx.stub.putState(reqCompositeKey, reqBuffer);
  }
}

module.exports = RequestStore;