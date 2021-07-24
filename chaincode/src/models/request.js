class Request {
  constructor(reqObj) {
    Object.assign(this, reqObj);
  }

  static getClass() {
    return 'org.reqerty-registration.regnet.models.request';
  }

  static fromBuffer(inputBuffer) {
    const reqObj = JSON.parse(inputBuffer.toString());
    return new Request(reqObj);
  }

  toBuffer() {
    return Buffer.from(JSON.stringify(this));
  }

  static makeKey(keyParts) {
    return keyParts.map((part) => JSON.stringify(part)).join(':');
  }

  getKeyArray() {
    return this.key.split(':');
  }

  static createInstance(reqObj) {
    return new Request(reqObj);
  }
}

module.exports = Request;
