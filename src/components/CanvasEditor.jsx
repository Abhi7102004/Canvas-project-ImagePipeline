import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Download, Eraser, MousePointer, Pencil } from 'lucide-react';

const CanvasEditor = ({ image, brushSize, onMaskGenerated }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [currentTool, setCurrentTool] = useState('brush');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const historyRef = useRef({
    states: [],
    currentStateIndex: -1
  });

  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: 600,
        height: 400,
        backgroundColor: 'transparent'
      });

      const canvas = fabricRef.current;
      
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = currentColor;
      canvas.freeDrawingBrush.width = brushSize;

      canvas.on('after:render', () => {
        if (historyRef.current.states.length === 0) {
          saveState();
        }
      });

      canvas.on('path:created', (e) => {
        if (currentTool === 'eraser') {
          e.path.globalCompositeOperation = 'destination-out';
        }
        saveState();
      });
      
      canvas.on('object:modified', saveState);
      canvas.on('object:removed', saveState);

      setCanvasInitialized(true);
    }

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, []);

  const saveState = () => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    const json = canvas.toJSON();
    const serialized = JSON.stringify(json);

    const history = historyRef.current;
    const currentIndex = history.currentStateIndex;

    history.states = history.states.slice(0, currentIndex + 1);
    history.states.push(serialized);
    history.currentStateIndex = history.states.length - 1;

    setCanUndo(history.currentStateIndex > 0);
    setCanRedo(false);
  };

  useEffect(() => {
    if (canvasInitialized && image && fabricRef.current) {
      fabric.Image.fromURL(image, (img) => {
        const canvas = fabricRef.current;
        canvas.backgroundImage = null;
        
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );

        img.scaleX = scale;
        img.scaleY = scale;
        img.left = (canvas.width - img.width * scale) / 2;
        img.top = (canvas.height - img.height * scale) / 2;

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          originX: 'left',
          originY: 'top'
        });

        canvas.renderAll();
        saveState();
      });
    }
  }, [image, canvasInitialized]);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.freeDrawingBrush.width = brushSize;
    }
  }, [brushSize]);

  useEffect(() => {
    if (fabricRef.current && currentTool !== 'eraser') {
      fabricRef.current.freeDrawingBrush.color = currentColor;
    }
  }, [currentColor, currentTool]);

  const handleToolChange = (tool) => {
    if (!fabricRef.current) return;
    
    setCurrentTool(tool);
    const canvas = fabricRef.current;
    
    switch (tool) {
      case 'brush':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = currentColor;
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.globalCompositeOperation = 'source-over';
        break;
      case 'eraser':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)';
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.globalCompositeOperation = 'destination-out';
        break;
      case 'select':
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
      default:
        break;
    }
  };

  const loadState = (state) => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    canvas.loadFromJSON(JSON.parse(state), () => {
      canvas.renderAll();
      if (currentTool === 'eraser') {
        const paths = canvas.getObjects().filter(obj => obj.type === 'path');
        paths.forEach(path => {
          path.globalCompositeOperation = 'source-over';
        });
      }
    });
  };

  const handleUndo = () => {
    const history = historyRef.current;
    if (history.currentStateIndex > 0) {
      history.currentStateIndex--;
      loadState(history.states[history.currentStateIndex]);
      setCanUndo(history.currentStateIndex > 0);
      setCanRedo(true);
    }
  };

  const handleRedo = () => {
    const history = historyRef.current;
    if (history.currentStateIndex < history.states.length - 1) {
      history.currentStateIndex++;
      loadState(history.states[history.currentStateIndex]);
      setCanUndo(true);
      setCanRedo(history.currentStateIndex < history.states.length - 1);
    }
  };

  const handleGenerateMask = () => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj.type === 'path') {
        ctx.globalCompositeOperation = obj.globalCompositeOperation || 'source-over';
        ctx.strokeStyle = obj.stroke || obj.color;
        ctx.lineWidth = obj.strokeWidth;
        ctx.beginPath();
        
        const path = obj.path;
        for (let i = 0; i < path.length; i++) {
          const point = path[i];
          if (point[0] === 'M') {
            ctx.moveTo(point[1], point[2]);
          } else if (point[0] === 'L') {
            ctx.lineTo(point[1], point[2]);
          } else if (point[0] === 'Q') {
            ctx.quadraticCurveTo(point[1], point[2], point[3], point[4]);
          }
        }
        ctx.stroke();
      }
    });

    onMaskGenerated(tempCanvas.toDataURL());
  };

  const handleSaveMask = () => {
    if (!fabricRef.current) return;

    const link = document.createElement('a');
    link.download = 'mask.png';
    link.href = fabricRef.current.toDataURL({
      format: 'png',
      quality: 1
    });
    link.click();
  };

  const handleClear = () => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    const backgroundImage = canvas.backgroundImage;
    canvas.clear();
    canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas));
    saveState();
  };

  return (
    <div className="mt-6">
      <div className="flex gap-4 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleToolChange('brush')}
            className={`p-2 rounded-lg ${currentTool === 'brush' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            title="Brush Tool"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => handleToolChange('eraser')}
            className={`p-2 rounded-lg ${currentTool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            title="Eraser Tool"
          >
            <Eraser size={20} />
          </button>
          <button
            onClick={() => handleToolChange('select')}
            className={`p-2 rounded-lg ${currentTool === 'select' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            title="Select Tool"
          >
            <MousePointer size={20} />
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
            title="Color Picker"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            className={`px-3 py-1 rounded-lg ${canUndo ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400'}`}
            disabled={!canUndo}
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            className={`px-3 py-1 rounded-lg ${canRedo ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400'}`}
            disabled={!canRedo}
          >
            Redo
          </button>
        </div>
      </div>

      <div className="border-2 border-gray-400 rounded-lg inline-block">
        <canvas ref={canvasRef} />
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleGenerateMask}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Generate Mask
        </button>
        <button
          onClick={handleSaveMask}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Download size={20} /> Save Mask
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Clear Drawing
        </button>
      </div>
    </div>
  );
};

export default CanvasEditor;