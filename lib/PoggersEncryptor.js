class PoggersEncryptor {
  /**
   * Creates an instance of PoggersEncryptor
   * @param {{ charList: string, joinString: string }} options The encryption options
   */
  constructor(options = { charList: undefined, joinString: undefined }) {
    this.options = options;
  }

  /**
   * Encrypts the given data
   * @param {string} data Data to encrypt
   * @returns {string} The encrypted data
   */
  encrypt(data) {
    if (this.options.charList) {
      return data.split('').map(char => {
        const index = this.options.charList.indexOf(char);
        if (index === -1) throw new Error(`Poggers character not supported: ${char}`);
        const newChar = 'POGGERS'.repeat(index + 1);
        return newChar;
      }).join(this.options.joinString || 'x');
    } else {
      return data.split('').map(char => {
        return 'POGGERS'.repeat(char.charCodeAt(0));
      }).join(this.options.joinString || 'x');
    }
  }

  /**
   * Decrypts the given data
   * @param {string} data Data to decrypt
   * @returns {string} Decrypted data
   */
  decrypt(data) {
    const parts = data.toString().trim().split(this.options.joinString || 'x');
    const regex = /^(POGGERS)+$/;
    if (this.options.charList) {
      return parts.map(part => {
        if (!regex.test(part)) throw new Error('Invalid encrypted data');
        const count = part.match(/POGGERS/g).length;
        const char = this.options.charList[count - 1];
        if (!char) throw new Error('Character not found in charList');
        return char;
      }).join('');
    } else {
      return parts.map(part => {
        if (!regex.test(part)) throw new Error('Invalid encrypted data');
        const count = part.match(/POGGERS/g).length;
        return String.fromCharCode(count);
      }).join('');
    }
  }
}

module.exports = PoggersEncryptor;
