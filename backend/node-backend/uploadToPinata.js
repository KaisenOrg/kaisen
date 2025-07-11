import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Faz upload do arquivo SVG para o Pinata (IPFS)
 * @param {string} svgString - Conteúdo SVG a ser enviado
 * @returns {Promise<{
 *   ipfsHash: string,
 *   gateways: {
 *     ipfs: string,
 *     ipfsio: string,
 *     cloudflare: string,
 *     dweb: string
 *   }
 * }>}
 */

export async function uploadToPinata(svgString) {
  const data = new FormData();
  data.append('file', Buffer.from(svgString), {
    filename: 'pol.svg',
    contentType: 'image/svg+xml'
  });

  const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
    maxBodyLength: Infinity,
    headers: {
      ...data.getHeaders(),
      'pinata_api_key': process.env.PINATA_KEY,
      'pinata_secret_api_key': process.env.PINATA_SECRET,
    }
  });

  return {
    ipfsHash: res.data.IpfsHash,
    gateways: {
      ipfs: `ipfs://${res.data.IpfsHash}`,
      ipfsio: `https://ipfs.io/ipfs/${res.data.IpfsHash}`,
      cloudflare: `https://cloudflare-ipfs.com/ipfs/${res.data.IpfsHash}`,
      dweb: `https://dweb.link/ipfs/${res.data.IpfsHash}`
    }
  }

}
