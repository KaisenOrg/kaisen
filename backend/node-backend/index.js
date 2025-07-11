import express from 'express';
import bodyParser from 'body-parser';
import {generateSvg} from'./generateSvg.js';
import {uploadToPinata} from'./uploadToPinata.js';

const app = express();
app.use(bodyParser.json());

app.post('/mint', async (req, res) => {
  try {
    const data = req.body;

    const svg = generateSvg(data);
    const cid = await uploadToPinata(svg);

    res.status(200).send(cid);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading to IPFS');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
