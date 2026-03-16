import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Transformer, Rect } from "react-konva";
import Konva from "konva";
import { jsPDF } from "jspdf";
import {
  Palette, Type, Upload, RotateCw, Download, Trash2, Save, Clock,
  ChevronDown, FlipHorizontal, FlipVertical, Sticker, HelpCircle, Camera,
  ImagePlus, X
} from "lucide-react";

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

const CLIP_ART: { emoji: string; label: string }[] = [
  { emoji: "⭐", label: "Star" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "👑", label: "Crown" },
  { emoji: "⚡", label: "Lightning" },
  { emoji: "🏆", label: "Trophy" },
  { emoji: "🎯", label: "Target" },
  { emoji: "💎", label: "Diamond" },
  { emoji: "🦅", label: "Eagle" },
  { emoji: "🐉", label: "Dragon" },
  { emoji: "🌟", label: "Glow Star" },
  { emoji: "🎨", label: "Art" },
];

const FONT_FAMILIES = ["Arial", "Georgia", "Courier New", "Impact", "Comic Sans MS", "Trebuchet MS", "Verdana", "Times New Roman"];

const TIPS = [
  "💡 Click any element to select it, then drag to reposition.",
  "💡 Use corner handles to resize. Hold edges to stretch.",
  "💡 Flip elements horizontally or vertically for mirrored designs.",
  "💡 Upload your own product photos from mobile or desktop.",
  "💡 Try adding clip art emojis as fun design accents.",
  "💡 Export your final design as PNG for print or PDF for sharing.",
  "💡 Save designs to browser history — they persist between sessions.",
  "💡 Change garment color to preview your design on different fabric colors.",
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
  const [fontFamily, setFontFamily] = useState("Arial");
  const [showGarmentColors, setShowGarmentColors] = useState(false);
  const [showClipArt, setShowClipArt] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [activeTab, setActiveTab] = useState<"garment" | "text" | "upload" | "clipart" | "actions">("garment");
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = garment.src;
    img.onload = () => setGarmentImage(img);
  }, [garment]);

  useEffect(() => {
    const saved = localStorage.getItem("step-garments-designs");
    if (saved) setSavedDesigns(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    const selectedNode = selectedId ? stageRef.current.findOne(`#${selectedId}`) : null;
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
      fontFamily,
      fill: textColor,
    };
    setElements((prev) => [...prev, newEl]);
    setTextInput("");
    setSelectedId(newEl.id);
  };

  const addClipArt = (emoji: string) => {
    const newEl: DesignElement = {
      id: `text-${Date.now()}`,
      type: "text",
      x: CANVAS_WIDTH / 2 - 30,
      y: CANVAS_HEIGHT / 2 - 30,
      rotation: 0,
      text: emoji,
      fontSize: 64,
      fontFamily: "Arial",
      fill: "#000000",
    };
    setElements((prev) => [...prev, newEl]);
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

  const flipHorizontal = () => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, scaleX: (el.scaleX || 1) * -1 } : el))
    );
  };

  const flipVertical = () => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, scaleY: (el.scaleY || 1) * -1 } : el))
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
          ? { ...el, x: node.x(), y: node.y(), rotation: node.rotation(), scaleX: node.scaleX(), scaleY: node.scaleY() }
          : el
      )
    );
  };

  const saveDesign = () => {
    const name = prompt("Design name:", `Design ${savedDesigns.length + 1}`);
    if (!name) return;
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

  const tabs = [
    { id: "garment" as const, label: "Garment", icon: Palette },
    { id: "text" as const, label: "Text", icon: Type },
    { id: "upload" as const, label: "Upload", icon: Upload },
    { id: "clipart" as const, label: "Clip Art", icon: Sticker },
    { id: "actions" as const, label: "Actions", icon: Save },
  ];

  return (
    <div className="space-y-4">
      {/* Tips Banner */}
      {showTips && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
          <HelpCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-foreground font-medium">{TIPS[currentTip]}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setCurrentTip((currentTip + 1) % TIPS.length)} className="text-xs text-accent hover:underline">Next Tip</button>
              <span className="text-xs text-muted-foreground">({currentTip + 1}/{TIPS.length})</span>
            </div>
          </div>
          <button onClick={() => setShowTips(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={() => setShowTips(!showTips)} className="flex items-center gap-2 text-xs text-accent hover:underline">
          <HelpCircle className="w-4 h-4" /> {showTips ? "Hide Tips" : "Design Tips & Tutorial"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Toolbar */}
        <div className="lg:w-72 space-y-3">
          {/* Tab Navigation */}
          <div className="flex lg:flex-col gap-1 bg-card border border-border rounded-lg p-2 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === t.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "garment" && (
            <div className="space-y-3">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Garment Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {GARMENTS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGarment(g)}
                      className={`p-2 rounded-md border text-xs font-medium transition-all ${
                        garment.id === g.id ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/50"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

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
            </div>
          )}

          {activeTab === "text" && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Type className="w-4 h-4" /> Add Text</h3>
              <input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                onKeyDown={(e) => e.key === "Enter" && addText()}
              />
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="h-9 rounded-md border border-input bg-background px-2 text-xs flex-1">
                  {[12, 16, 20, 24, 32, 40, 48, 64, 80].map((s) => (
                    <option key={s} value={s}>{s}px</option>
                  ))}
                </select>
              </div>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full h-9 rounded-md border border-input bg-background px-2 text-xs">
                {FONT_FAMILIES.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                ))}
              </select>
              <button onClick={addText} disabled={!textInput.trim()} className="btn-primary text-xs py-1.5 w-full disabled:opacity-50">
                Add Text
              </button>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Images</h3>
              <p className="text-xs text-muted-foreground">Upload logos, designs, or product photos from your device.</p>
              <label className="btn-primary text-xs py-2 w-full cursor-pointer text-center block">
                <span className="flex items-center justify-center gap-2"><Upload className="w-3 h-3" /> Upload Logo / Design</span>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              <label className="btn-outline text-xs py-2 w-full cursor-pointer text-center block">
                <span className="flex items-center justify-center gap-2"><Camera className="w-3 h-3" /> Take Photo (Mobile)</span>
                <input ref={photoInputRef} type="file" className="hidden" accept="image/*" capture="environment" onChange={handleImageUpload} />
              </label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground border border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-accent/50 transition-colors text-center justify-center">
                <ImagePlus className="w-4 h-4" />
                <span>Add additional design elements</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                  const files = e.target.files;
                  if (!files) return;
                  Array.from(files).forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const img = new window.Image();
                      img.src = reader.result as string;
                      img.onload = () => {
                        const scale = Math.min(120 / img.width, 120 / img.height);
                        const newEl: DesignElement = {
                          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                          type: "image",
                          x: CANVAS_WIDTH / 2 - (img.width * scale) / 2 + Math.random() * 40 - 20,
                          y: CANVAS_HEIGHT / 2 - (img.height * scale) / 2 + Math.random() * 40 - 20,
                          width: img.width, height: img.height,
                          rotation: 0, image: img, imageSrc: reader.result as string,
                          scaleX: scale, scaleY: scale,
                        };
                        setElements((prev) => [...prev, newEl]);
                      };
                    };
                    reader.readAsDataURL(file);
                  });
                  e.target.value = "";
                }} />
              </label>
            </div>
          )}

          {activeTab === "clipart" && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Sticker className="w-4 h-4" /> Stickers & Clip Art</h3>
              <p className="text-xs text-muted-foreground mb-3">Click to add to your design.</p>
              <div className="grid grid-cols-4 gap-2">
                {CLIP_ART.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => addClipArt(c.emoji)}
                    className="flex flex-col items-center gap-1 p-2 rounded-md border border-border hover:border-accent/50 hover:bg-accent/5 transition-all"
                    title={c.label}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="text-[9px] text-muted-foreground">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "actions" && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground mb-3">Element Actions</h3>
              {selectedId && (
                <>
                  <div className="flex gap-2">
                    <button onClick={rotateSelected} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-muted text-foreground rounded-md text-xs hover:bg-muted/80 transition-colors">
                      <RotateCw className="w-3 h-3" /> Rotate
                    </button>
                    <button onClick={deleteSelected} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-md text-xs hover:bg-destructive/20 transition-colors">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={flipHorizontal} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-muted text-foreground rounded-md text-xs hover:bg-muted/80 transition-colors">
                      <FlipHorizontal className="w-3 h-3" /> Flip H
                    </button>
                    <button onClick={flipVertical} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-muted text-foreground rounded-md text-xs hover:bg-muted/80 transition-colors">
                      <FlipVertical className="w-3 h-3" /> Flip V
                    </button>
                  </div>
                </>
              )}
              {!selectedId && <p className="text-xs text-muted-foreground">Select an element on the canvas to see actions.</p>}

              <hr className="border-border my-2" />
              <h3 className="text-sm font-semibold text-foreground">Save & Export</h3>
              <button onClick={saveDesign} className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-accent text-accent-foreground rounded-md text-xs font-medium hover:opacity-90 transition-opacity">
                <Save className="w-3 h-3" /> Save Design
              </button>
              <div className="flex gap-2">
                <button onClick={exportPNG} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-muted text-foreground rounded-md text-xs hover:bg-muted/80 transition-colors">
                  <Download className="w-3 h-3" /> PNG
                </button>
                <button onClick={exportPDF} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-muted text-foreground rounded-md text-xs hover:bg-muted/80 transition-colors">
                  <Download className="w-3 h-3" /> PDF
                </button>
              </div>
              <button onClick={() => setShowHistory(!showHistory)} className="w-full flex items-center justify-center gap-1 px-3 py-1.5 border border-border text-foreground rounded-md text-xs hover:bg-muted transition-colors">
                <Clock className="w-3 h-3" /> {showHistory ? "Hide" : "Show"} History ({savedDesigns.length})
              </button>
            </div>
          )}
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
                  <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill={garmentColor} name="garment-bg" />
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
                    <button onClick={() => loadDesign(d)} className="flex-1 text-[10px] bg-accent text-accent-foreground rounded py-0.5 hover:opacity-90 transition-opacity">Load</button>
                    <button onClick={() => deleteDesign(d.id)} className="flex-1 text-[10px] bg-destructive/10 text-destructive rounded py-0.5 hover:bg-destructive/20 transition-colors">Delete</button>
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
