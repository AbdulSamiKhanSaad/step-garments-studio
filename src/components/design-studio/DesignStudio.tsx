import { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Transformer, Rect } from "react-konva";
import Konva from "konva";
import { jsPDF } from "jspdf";
import { Palette, Type, Upload, RotateCw, Download, Trash2, Save, Clock, ChevronDown } from "lucide-react";

import mockupTshirt from "@/assets/mockup-tshirt.png";
import mockupHoodie from "@/assets/mockup-hoodie.png";
import mockupJacket from "@/assets/mockup-jacket.png";
import mockupPolo from "@/assets/mockup-polo.png";

const GARMENTS = [
  { id: "tshirt", label: "T-Shirt", src: mockupTshirt },
  { id: "hoodie", label: "Hoodie", src: mockupHoodie },
  { id: "jacket", label: "Jacket", src: mockupJacket },
  { id: "polo", label: "Polo", src: mockupPolo },
];

const GARMENT_COLORS = [
  "#FFFFFF", "#000000", "#1a1a2e", "#16213e", "#0f3460",
  "#e94560", "#533483", "#2b2d42", "#8d99ae", "#ef233c",
  "#d90429", "#2ec4b6", "#cbf3f0", "#ff6b6b", "#ffd93d",
  "#6c5ce7", "#a29bfe", "#00b894", "#fdcb6e", "#e17055",
];

interface DesignElement {
  id: string;
  type: "image" | "text";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  image?: HTMLImageElement;
  imageSrc?: string;
  scaleX?: number;
  scaleY?: number;
}

interface SavedDesign {
  id: string;
  name: string;
  garmentId: string;
  garmentColor: string;
  elements: Omit<DesignElement, "image">[];
  timestamp: number;
  thumbnail?: string;
}

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 600;

const DesignStudio = () => {
  const [garment, setGarment] = useState(GARMENTS[0]);
  const [garmentColor, setGarmentColor] = useState("#FFFFFF");
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [garmentImage, setGarmentImage] = useState<HTMLImageElement | null>(null);
  const [textInput, setTextInput] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showGarmentColors, setShowGarmentColors] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load garment image
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = garment.src;
    img.onload = () => setGarmentImage(img);
  }, [garment]);

  // Load saved designs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("step-garments-designs");
    if (saved) setSavedDesigns(JSON.parse(saved));
  }, []);

  // Update transformer
  useEffect(() => {
    if (!transformerRef.current) return;
    const stage = stageRef.current;
    if (!stage) return;
    const selectedNode = selectedId ? stage.findOne(`#${selectedId}`) : null;
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode as Konva.Node]);
    } else {
      transformerRef.current.nodes([]);
    }
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId, elements]);

  const addText = () => {
    if (!textInput.trim()) return;
    const newEl: DesignElement = {
      id: `text-${Date.now()}`,
      type: "text",
      x: CANVAS_WIDTH / 2 - 50,
      y: CANVAS_HEIGHT / 2,
      rotation: 0,
      text: textInput,
      fontSize,
      fontFamily: "Arial",
      fill: textColor,
    };
    setElements((prev) => [...prev, newEl]);
    setTextInput("");
    setSelectedId(newEl.id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.src = reader.result as string;
      img.onload = () => {
        const scale = Math.min(150 / img.width, 150 / img.height);
        const newEl: DesignElement = {
          id: `img-${Date.now()}`,
          type: "image",
          x: CANVAS_WIDTH / 2 - (img.width * scale) / 2,
          y: CANVAS_HEIGHT / 2 - (img.height * scale) / 2,
          width: img.width,
          height: img.height,
          rotation: 0,
          image: img,
          imageSrc: reader.result as string,
          scaleX: scale,
          scaleY: scale,
        };
        setElements((prev) => [...prev, newEl]);
        setSelectedId(newEl.id);
      };
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const rotateSelected = () => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, rotation: (el.rotation + 45) % 360 } : el))
    );
  };

  const handleDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el))
    );
  };

  const handleTransformEnd = (id: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              scaleX: node.scaleX(),
              scaleY: node.scaleY(),
            }
          : el
      )
    );
  };

  const saveDesign = () => {
    const name = prompt("Design name:", `Design ${savedDesigns.length + 1}`);
    if (!name) return;
    // Generate thumbnail
    const stage = stageRef.current;
    const thumbnail = stage ? stage.toDataURL({ pixelRatio: 0.3 }) : undefined;
    const design: SavedDesign = {
      id: `design-${Date.now()}`,
      name,
      garmentId: garment.id,
      garmentColor,
      elements: elements.map(({ image, ...rest }) => rest),
      timestamp: Date.now(),
      thumbnail,
    };
    const updated = [design, ...savedDesigns];
    setSavedDesigns(updated);
    localStorage.setItem("step-garments-designs", JSON.stringify(updated));
  };

  const loadDesign = (design: SavedDesign) => {
    const g = GARMENTS.find((g) => g.id === design.garmentId);
    if (g) setGarment(g);
    setGarmentColor(design.garmentColor);
    // Rebuild elements with image objects
    const rebuilt = design.elements.map((el) => {
      if (el.type === "image" && el.imageSrc) {
        const img = new window.Image();
        img.src = el.imageSrc;
        return { ...el, image: img } as DesignElement;
      }
      return el as DesignElement;
    });
    setElements(rebuilt);
    setShowHistory(false);
    setSelectedId(null);
  };

  const deleteDesign = (id: string) => {
    const updated = savedDesigns.filter((d) => d.id !== id);
    setSavedDesigns(updated);
    localStorage.setItem("step-garments-designs", JSON.stringify(updated));
  };

  const exportPNG = () => {
    const stage = stageRef.current;
    if (!stage) return;
    setSelectedId(null);
    setTimeout(() => {
      const dataURL = stage.toDataURL({ pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `design-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    }, 100);
  };

  const exportPDF = () => {
    const stage = stageRef.current;
    if (!stage) return;
    setSelectedId(null);
    setTimeout(() => {
      const dataURL = stage.toDataURL({ pixelRatio: 2 });
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [CANVAS_WIDTH, CANVAS_HEIGHT] });
      pdf.addImage(dataURL, "PNG", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      pdf.save(`design-${Date.now()}.pdf`);
    }, 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Toolbar */}
        <div className="lg:w-72 space-y-4">
          {/* Garment Selector */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Garment Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {GARMENTS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGarment(g)}
                  className={`p-2 rounded-md border text-xs font-medium transition-all ${
                    garment.id === g.id
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent/50"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Garment Color */}
          <div className="bg-card border border-border rounded-lg p-4">
            <button onClick={() => setShowGarmentColors(!showGarmentColors)} className="flex items-center justify-between w-full text-sm font-semibold text-foreground">
              <span className="flex items-center gap-2"><Palette className="w-4 h-4" /> Garment Color</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showGarmentColors ? "rotate-180" : ""}`} />
            </button>
            {showGarmentColors && (
              <div className="grid grid-cols-5 gap-1.5 mt-3">
                {GARMENT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setGarmentColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${garmentColor === c ? "border-accent scale-110" : "border-border"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add Text */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Type className="w-4 h-4" /> Add Text</h3>
            <input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text..."
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm mb-2"
              onKeyDown={(e) => e.key === "Enter" && addText()}
            />
            <div className="flex items-center gap-2 mb-2">
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
              <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="h-9 rounded-md border border-input bg-background px-2 text-xs flex-1">
                {[12, 16, 20, 24, 32, 40, 48, 64].map((s) => (
                  <option key={s} value={s}>{s}px</option>
                ))}
              </select>
            </div>
            <button onClick={addText} disabled={!textInput.trim()} className="btn-primary text-xs py-1.5 w-full disabled:opacity-50">
              Add Text
            </button>
          </div>

          {/* Upload Logo */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Logo</h3>
            <label className="btn-outline text-xs py-1.5 w-full cursor-pointer text-center block">
              Choose Image
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Actions */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground mb-3">Actions</h3>
            {selectedId && (
              <div className="flex gap-2">
                <button onClick={rotateSelected} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-muted text-foreground rounded-md text-xs hover:bg-muted/80">
                  <RotateCw className="w-3 h-3" /> Rotate
                </button>
                <button onClick={deleteSelected} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-md text-xs hover:bg-destructive/20">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            )}
            <button onClick={saveDesign} className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-accent text-accent-foreground rounded-md text-xs font-medium hover:opacity-90">
              <Save className="w-3 h-3" /> Save Design
            </button>
            <div className="flex gap-2">
              <button onClick={exportPNG} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-muted text-foreground rounded-md text-xs hover:bg-muted/80">
                <Download className="w-3 h-3" /> PNG
              </button>
              <button onClick={exportPDF} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-muted text-foreground rounded-md text-xs hover:bg-muted/80">
                <Download className="w-3 h-3" /> PDF
              </button>
            </div>
            <button onClick={() => setShowHistory(!showHistory)} className="w-full flex items-center justify-center gap-1 px-3 py-1.5 border border-border text-foreground rounded-md text-xs hover:bg-muted">
              <Clock className="w-3 h-3" /> {showHistory ? "Hide" : "Show"} History ({savedDesigns.length})
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex flex-col items-center">
          <div className="bg-card border border-border rounded-lg p-4 inline-block">
            <p className="text-xs text-muted-foreground mb-2 text-center">Click elements to select • Drag to move • Handles to resize</p>
            <div style={{ backgroundColor: "#f0f0f0", borderRadius: 8, overflow: "hidden" }}>
              <Stage
                ref={stageRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onMouseDown={(e) => {
                  if (e.target === e.target.getStage() || e.target.name() === "garment-bg" || e.target.name() === "garment-img") {
                    setSelectedId(null);
                  }
                }}
              >
                <Layer>
                  {/* Background */}
                  <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill={garmentColor} name="garment-bg" />
                  {/* Garment mockup */}
                  {garmentImage && (
                    <KonvaImage
                      image={garmentImage}
                      x={(CANVAS_WIDTH - garmentImage.width * (CANVAS_HEIGHT / garmentImage.height)) / 2}
                      y={0}
                      width={garmentImage.width * (CANVAS_HEIGHT / garmentImage.height)}
                      height={CANVAS_HEIGHT}
                      name="garment-img"
                      listening={true}
                    />
                  )}
                  {/* Design elements */}
                  {elements.map((el) =>
                    el.type === "text" ? (
                      <KonvaText
                        key={el.id}
                        id={el.id}
                        x={el.x}
                        y={el.y}
                        text={el.text}
                        fontSize={el.fontSize}
                        fontFamily={el.fontFamily}
                        fill={el.fill}
                        rotation={el.rotation}
                        draggable
                        scaleX={el.scaleX || 1}
                        scaleY={el.scaleY || 1}
                        onClick={() => setSelectedId(el.id)}
                        onTap={() => setSelectedId(el.id)}
                        onDragEnd={(e) => handleDragEnd(el.id, e)}
                        onTransformEnd={(e) => handleTransformEnd(el.id, e)}
                      />
                    ) : el.image ? (
                      <KonvaImage
                        key={el.id}
                        id={el.id}
                        image={el.image}
                        x={el.x}
                        y={el.y}
                        width={el.width}
                        height={el.height}
                        rotation={el.rotation}
                        scaleX={el.scaleX || 1}
                        scaleY={el.scaleY || 1}
                        draggable
                        onClick={() => setSelectedId(el.id)}
                        onTap={() => setSelectedId(el.id)}
                        onDragEnd={(e) => handleDragEnd(el.id, e)}
                        onTransformEnd={(e) => handleTransformEnd(el.id, e)}
                      />
                    ) : null
                  )}
                  <Transformer ref={transformerRef} boundBoxFunc={(oldBox, newBox) => (newBox.width < 10 || newBox.height < 10 ? oldBox : newBox)} />
                </Layer>
              </Stage>
            </div>
          </div>
        </div>
      </div>

      {/* Design History */}
      {showHistory && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Design History</h3>
          {savedDesigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved designs yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {savedDesigns.map((d) => (
                <div key={d.id} className="bg-muted rounded-lg p-2 text-center group relative">
                  {d.thumbnail ? (
                    <img src={d.thumbnail} alt={d.name} className="w-full h-24 object-contain rounded mb-2 bg-background" />
                  ) : (
                    <div className="w-full h-24 bg-background rounded mb-2 flex items-center justify-center text-xs text-muted-foreground">No preview</div>
                  )}
                  <p className="text-xs font-medium text-foreground truncate">{d.name}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(d.timestamp).toLocaleDateString()}</p>
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => loadDesign(d)} className="flex-1 text-[10px] bg-accent text-accent-foreground rounded py-0.5 hover:opacity-90">Load</button>
                    <button onClick={() => deleteDesign(d.id)} className="flex-1 text-[10px] bg-destructive/10 text-destructive rounded py-0.5 hover:bg-destructive/20">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesignStudio;
