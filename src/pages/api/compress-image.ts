import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    const { base64Image } = req.body;

    if (!base64Image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageBuffer = Buffer.from(base64Image.split(',')[1], 'base64');

    const compressedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 800 }) 
      .webp({ quality: 80 })  
      .toBuffer();

    const compressedBase64 = `data:image/webp;base64,${compressedImageBuffer.toString('base64')}`;

    res.status(200).json({ compressedBase64 });
  } catch (error) {
    console.error('Error processing the image:', error);
    res.status(500).json({ message: 'Error processing image' });
  }
}
