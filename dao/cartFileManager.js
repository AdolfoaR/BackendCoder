const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, 'carrito.json');

function readCartsFile() {
  try {
    const fileData = fs.readFileSync(cartsFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error reading carts file: ${error}`);
    return [];
  }
}

function writeCartsFile(data) {
  try {
    const fileData = JSON.stringify(data, null, 2);
    fs.writeFileSync(cartsFilePath, fileData, 'utf-8');
  } catch (error) {
    console.error(`Error writing carts file: ${error}`);
  }
}

module.exports = {
  readCartsFile,
  writeCartsFile
};
