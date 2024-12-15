const ImageDisplay = ({ originalImage, maskImage }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Original Image</h3>
          <img
            src={originalImage}
            alt="Original"
            className="w-full rounded-lg border-2 border-gray-300"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Mask Image</h3>
          <img
            src={maskImage}
            alt="Mask"
            className="w-full rounded-lg border-2 border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;