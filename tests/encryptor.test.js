const PoggersEncryptor = require('../lib/PoggersEncryptor');

const randomStr = () => Math.random().toString(16).substr(2);

it('should encryptor work correctly', () => {
  const e = new PoggersEncryptor();
  const str = randomStr();

  const encrypted = e.encrypt(str);
  expect(e.decrypt(encrypted)).toBe(str);
});

it('should encryptor only output poggers', () => {
  const e = new PoggersEncryptor();
  const str = randomStr();

  const encrypted = e.encrypt(str);
  const validFormat = encrypted
    .split('x')
    .every(part => /^(POGGERS)+$/.test(part));

  expect(validFormat).toBeTruthy();
  expect(encrypted.match(/x/g).length).toBe(str.length - 1);
});
