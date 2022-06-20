const fs = require('fs');
const path = require('path');

const generateSpectatorFile = ({ gameId, observerKey }) => {
  const templateFile = path.resolve('riot', 'spectate.bat.template');
  const outputFolder = path.resolve('tmp', 'spectator');
  const outputFile = path.resolve(outputFolder, `${gameId}.bat`);

  const template = fs.readFileSync(templateFile, 'utf-8');
  const parsedData = template.split('${gameId}').join(gameId).split('${observerKey}').join(observerKey);
  fs.mkdirSync(outputFolder, { recursive: true });
  fs.writeFileSync(outputFile, parsedData);
  return outputFile;
}

module.exports = {
  generateSpectatorFile
}