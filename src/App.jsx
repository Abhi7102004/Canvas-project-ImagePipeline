import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import CanvasEditor from './components/CanvasEditor';
import ImageDisplay from './components/ImageDisplay';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [brushSize, setBrushSize] = useState(5);

  const handleImageUpload = (imageUrl) => {
    setUploadedImage(imageUrl);
    setMaskImage(null); // Reset mask when new image is uploaded
  };

  const handleMaskGenerated = (maskUrl) => {
    setMaskImage(maskUrl);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Image Inpainting Widget</h1>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <ImageUploader onImageUpload={handleImageUpload} />
          
          {uploadedImage && (
            <>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brush Size: {brushSize}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <CanvasEditor
                image={uploadedImage}
                brushSize={brushSize}
                onMaskGenerated={handleMaskGenerated}
              />
            </>
          )}

          {uploadedImage && maskImage && (
            <ImageDisplay
              originalImage={uploadedImage}
              maskImage={maskImage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
