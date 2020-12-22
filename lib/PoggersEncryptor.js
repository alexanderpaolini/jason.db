class PoggersEncryptor {
  /**
   * Creates an instance of PoggersEncryptor
   * @param {{ charList: string, joinString: string, string: string }} options The encryption options
   */
  constructor(options = { charList: ' {}()[]1234567890abcdefghijklmnñopqrstuvwxyz<>|°¬.,_-:;"\'¡!¿?#$%&+/\\*`´~^=@\n\ráéíóúÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ', joinString: 'x', string: 'POGGERS' }) {
    // Make options usable from everywhere
    this.options = options;
  }

  /**
   * Encrypts the given data
   * @param {string} data Data to encrypt
   * @returns {string} The encrypted data
   */
  encrypt(data) {
    // Check if they want to use a custom char list
    if (this.options.charList) {

      // Split the data into an array of strings with length of 1
      return data.split('').map(char => {

        // Get the char's given value from its position in the string
        const index = this.options.charList.indexOf(char);

        // If it doesn't include that char, error
        if (index === -1) throw new Error(`Poggers character not supported: ${char}`);

        // Repeat POGGERS the char's given value + 1
        return this.options.string.repeat(index + 1);
      }).join(this.options.joinString || 'x');
    } else {
      
      // Split the data into an array of strings with length of 1
      return data.split('').map(char => {
        
        // Repeat POGGERS the amount of times that the char code of the letter is
        return this.options.string.repeat(char.charCodeAt(0));
      }).join(this.options.joinString || 'x');
    }
  }

  /**
   * Decrypts the given data
   * @param {string} data Data to decrypt
   * @returns {string} Decrypted data
   */
  decrypt(data) {
    // Define the constants
    const parts = data.toString().trim().split(this.options.joinString || 'x');
    const regex = /^(POGGERS)+$/;

    // Check if using charList or char codes
    if (this.options.charList) {

      // Run code for every part and then join it
      return parts.map(part => {

        // Check to make sure it only includes POGGERS
        if (!regex.test(part)) throw new Error('Invalid encrypted data');

        // Get the char that corresponds to the length
        const count = part.match(/POGGERS/g).length;
        const char = this.options.charList[count - 1];

        // Check if the char doesn't exist and throw, otherwise return the char
        if (!char) throw new Error('Character not found in charList');
        return char;
      }).join('');
    } else {

      // Run code for each part and then join it
      return parts.map(part => {

        // Check to make sure it only includes POGGERS
        if (!regex.test(part)) throw new Error('Invalid encrypted data');

        // Get the char that corresponds to the length and return it
        const count = part.match(/POGGERS/g).length;
        return String.fromCharCode(count);
      }).join('');
    }
  }
}

module.exports = PoggersEncryptor;
