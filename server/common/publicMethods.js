const fs = require('fs');
const path = require('path');
function testFile() {
  let dir = path.join(__dirname, '../result_file');
  if (fs.existsSync(dir)) {
    console.log('Directory exists!');
  } else {
    fs.mkdir(dir,(err) => {
      console.log(err);
    })
  }
}
module.exports = testFile;