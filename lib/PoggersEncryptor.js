class PoggersEncryptor {
	/**
	 * Creates an instance of PoggersEncryptor
	 * @param {{
	 * 	charList: string;
	 * }} options The encryption options
	 */
	constructor(options = {}) {
		const {
			charList = ' {}()[]<>|°¬.,_-:;"\'¡!¿?#$%&+/\\*`´~^=@\n\ráéíóúÁÉÍÓÚ1234567890ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz',
		} = options;

		this.charList = charList;
	}

	/**
	 * Encrypts the given data
	 * @param {string} data Data to encrypt
	 * @returns {string} The encrypted data
	 */
	encrypt(data) {
		const newChars = data.split('').map(char => {
			const index = this.charList.indexOf(char);
			if (index === -1)
				throw new Error(`Poggers character not supported: ${char}`);

			const newChar = 'POGGERS'.repeat(index + 1);
			return newChar;
		});

		return newChars.join('x');
	}

	/**
	 * Decrypts the given data
	 * @param {string} data Data to decrypt
	 * @returns {string} Decrypted data
	 */
	decrypt(data) {
		const parts = data.toString().trim().split('x');
		const regex = /^(POGGERS)+$/;

		const newChars = parts.map(part => {
			// Validate string
			if (!regex.test(part)) throw new Error('Invalid encrypted data');

			// Get poggers count
			const count = part.match(/POGGERS/g).length;
			const char = this.charList[count - 1];

			if (!char) throw new Error('Character not found in charList');
			return char;
		});

		return newChars.join('');
	}
}

module.exports = PoggersEncryptor;
