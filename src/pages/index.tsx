import { useState } from 'react';

const Home = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setOriginalImage(base64Image); 

      await compressImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = async (base64Image: string) => {
    try {
      const response = await fetch('/api/compress-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image }),
      });

      const data = await response.json();
      setCompressedImage(data.compressedBase64);
    } catch (error) {
      console.error('Error compressing the image:', error);
    } 
  };
  console.log("originalImage",originalImage)
  console.log("compressedImage",compressedImage)


  return (
    <div style={{ padding: '20px' }}>
      <h1>Base64 Image Compression</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />

      {originalImage && (
        <div>
          <h3>Original Image</h3>
          <img src={originalImage} alt="Original" style={{ maxWidth: '400px' }} />
        </div>
      )}


      {compressedImage && (
        <div>
          <h3>Compressed Image</h3>
          <img src={compressedImage} alt="Compressed" style={{ maxWidth: '400px' }} />
        </div>
      )}
    </div>
  );
};

export default Home;
