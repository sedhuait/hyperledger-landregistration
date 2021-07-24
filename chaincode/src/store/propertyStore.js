const Property = require('../models/property');

class PropertyStore {
  constructor(ctx) {
    this.ctx = ctx;
    this.name = 'org.property-registration.regnet.store.property';
  }

  async getProperty(propKey) {
    const propCompositeKey = this.ctx.stub.createCompositeKey(this.name, propKey.split(':'));
    const propBuffer = await this.ctx.stub.getState(propCompositeKey);
    return Property.fromBuffer(propBuffer);
  }

  async addProperty(propObject) {
    const propCompositeKey = this.ctx.stub.createCompositeKey(this.name, propObject.getKeyArray());
    const propBuffer = propObject.toBuffer();
    await this.ctx.stub.putState(propCompositeKey, propBuffer);
  }

  async updateProperty(propObject) {
    const propCompositeKey = this.ctx.stub.createCompositeKey(this.name, propObject.getKeyArray());
    const propBuffer = propObject.toBuffer();
    await this.ctx.stub.putState(propCompositeKey, propBuffer);
  }
}

module.exports = PropertyStore;
