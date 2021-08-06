const hack = require('./hack');
const hqewCheerio = require('./hqew-cheerio');

const IS_HACK = false;

(async function main() {
  if (IS_HACK) {
    await hack();
  } else {
    await hqewCheerio();
  }
})();
