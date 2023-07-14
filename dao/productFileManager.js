const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, 'productos.json');

function readProductsFile() {
  try {
    const fileData = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error reading products file: ${error}`);
    return [];
  }
}

function writeProductsFile(data) {
  try {
    const fileData = JSON.stringify(data, null, 2);
    fs.writeFileSync(productsFilePath, fileData, 'utf-8');
  } catch (error) {
    console.error(`Error writing products file: ${error}`);
  }
}

module.exports = {
  readProductsFile,
  writeProductsFile
};
