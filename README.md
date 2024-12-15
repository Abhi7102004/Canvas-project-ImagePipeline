# Image Inpainting Widget

## Project Overview

This is a React-based image inpainting widget that allows users to:
- Upload images
- Draw masks over parts of the image using Fabric.js
- Export and view the original image and mask side by side

## Live Demo

🌐 **Live Site**: [Canvas Project Image Pipeline](https://canvas-project-image-pipeline.vercel.app/)

## Features

- Image Upload (JPEG/PNG support)
- Interactive mask drawing using Fabric.js canvas
- Smooth and precise brush controls
- Adjustable brush size with real-time preview
- Export original and mask images
- Clear canvas functionality
- Responsive design for various screen sizes

## Technologies Used

- **Frontend**: React
- **Canvas Library**: [Fabric.js](http://fabricjs.com/)
- **UI Components**: shadcn/ui
- **Deployment**: Vercel
- **Build Tool**: Vite

## Local Setup

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/Abhi7102004/Canvas-project-ImagePipeline.git
   ```

2. Navigate to the project directory
   ```bash
   cd Canvas-project-ImagePipeline
   ```

3. Install dependencies
   ```bash
   npm install
   npm install fabric @types/fabric
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser

## Key Features and Implementation

### Advanced Canvas Drawing
- Utilizes Fabric.js for precise and smooth mask creation
- Custom brush settings with adjustable size and color
- Real-time canvas updates with efficient rendering

### Mask Creation
- High-precision mask drawing capabilities
- Non-destructive editing with separate mask layer
- Easy mask modification and clearing

## Challenges and Solutions

### Canvas Performance
- **Challenge**: Maintaining smooth drawing performance with large images
- **Solution**: Implemented efficient canvas rendering using Fabric.js optimizations

### Image Processing
- **Challenge**: Handling various image sizes and formats
- **Solution**: Added automatic image scaling and format normalization

## Contact

**Abhishek Yadav**
- **Email**: abhishekyadav7102004@gmail.com
- **LinkedIn**: [Abhishek Yadav](https://www.linkedin.com/in/abhishek-yadav-341245258/)
- **GitHub**: [Abhi7102004](https://github.com/Abhi7102004)

Project Link: [https://github.com/Abhi7102004/Canvas-project-ImagePipeline](https://github.com/Abhi7102004/Canvas-project-ImagePipeline)
