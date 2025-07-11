import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Pega o svg e altera de acordo com as informações
export function generateSvg(data) {
  const filePath = path.join(__dirname, 'pol.svg');
  let svg = fs.readFileSync(filePath, 'utf8');

  svg = svg.replace('{{USERNAME}}', data.username);
  svg = svg.replace('{{TRACK}}', data.track);
  svg = svg.replace('{{TIME}}', data.time.toString());
  svg = svg.replace('{{TOKENID}}', data.tokenId);

  return svg;
}
