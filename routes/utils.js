const fs = require('fs');

function readJSONFile(filePath) {
  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error ${filePath}: ${error}`);
    return [];
  }
}

function writeJSONFile(filePath, data) {
  try {
    const fileData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, fileData, 'utf-8');
  } catch (error) {
    console.error(`Error ${filePath}: ${error}`);
  }
}

function generateId() {
  return Date.now().toString();
}

module.exports = {
  readJSONFile,
  writeJSONFile,
  generateId
};
