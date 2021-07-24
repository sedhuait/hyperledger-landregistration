class Property {
  constructor(propObj) {
    Object.assign(this, propObj);
  }

  static getClass() {
    return 'org.property-registration.regnet.models.property';
  }

  static fromBuffer(inputBuffer) {
    const propObj = JSON.parse(inputBuffer.toString());
    return new Property(propObj);
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

  static createInstance(propObj) {
    return new Property(propObj);
  }
}

module.exports = Property;
