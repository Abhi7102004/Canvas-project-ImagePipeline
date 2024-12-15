import React from 'react';

const ImageUploader = ({ onImageUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Upload Image
      </label>
      <p className="mt-2 text-sm text-gray-500">Supported formats: JPEG, PNG</p>
    </div>
  );
};

export default ImageUploader