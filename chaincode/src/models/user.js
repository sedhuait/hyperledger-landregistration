class User {
  constructor(usrObj) {
    Object.assign(this, usrObj);
  }

  static getClass() {
    return 'org.property-registration.regnet.models.user';
  }

  static fromBuffer(inputBuffer) {
    const usrObj = JSON.parse(inputBuffer.toString());
    return new User(usrObj);
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

  static createInstance(usrObj) {
    return new User(usrObj);
  }

  static createInstanceFromUserRequest({
    aadharNumber, name, emailId, phoneNumber, createdAt,
  }) {
    const userObj = {
      aadharNumber,
      name,
      emailId,
      phoneNumber,
      createdAt,
      upgradCoins: 0,
      approvedAt: new Date(),
      key: User.makeKey([name, aadharNumber]),
    };
    return User.createInstance(userObj);
  }
}

module.exports = User;
