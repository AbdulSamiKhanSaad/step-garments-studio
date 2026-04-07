import { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Transformer, Rect, Circle, Line, Ring } from "react-konva";
import Konva from "konva";
import { jsPDF } from "jspdf";
import {
  Palette, Type, Upload, RotateCw, Download, Trash2, Save, Clock,
  ChevronDown, ChevronRight, FlipHorizontal, FlipVertical, Sticker, HelpCircle, Camera,
  ImagePlus, X, Layers, Eye, EyeOff, Lock, Unlock, Copy, AlignLeft, AlignCenter,
  AlignRight, ArrowUp, ArrowDown, Undo2, Redo2, ZoomIn, ZoomOut, Grid3X3,
  Ruler, Shirt, User, Maximize2, Minimize2, Pipette, Sparkles, Settings2,
  Move, RotateCcw, Paintbrush, Square, CircleIcon, Triangle, Hexagon, PenTool
} from "lucide-react";

import mockupTshirt from "@/assets/mockup-tshirt.png";
import mockupHoodie from "@/assets/mockup-hoodie.png";
import mockupJacket from "@/assets/mockup-jacket.png";
import mockupPolo from "@/assets/mockup-polo.png";
import mockupTracksuit from "@/assets/mockup-tracksuit.png";
import mockupTanktop from "@/assets/mockup-tanktop.png";
import mockupShorts from "@/assets/mockup-shorts.png";
import mockupJoggers from "@/assets/mockup-joggers.png";
import mockupSweatshirt from "@/assets/mockup-sweatshirt.png";

import avatarMaleLight from "@/assets/avatar-male-light.png";
import avatarFemaleLight from "@/assets/avatar-female-light.png";
import avatarMaleMedium from "@/assets/avatar-male-medium.png";
import avatarFemaleMedium from "@/assets/avatar-female-medium.png";
import avatarMaleDark from "@/assets/avatar-male-dark.png";
import avatarFemaleDark from "@/assets/avatar-female-dark.png";

const GARMENTS: { id: string; label: string; src: string | null; category: string }[] = [
  { id: "none", label: "None (Blank)", src: null, category: "all" },
  { id: "tshirt", label: "T-Shirt", src: mockupTshirt, category: "tops" },
  { id: "hoodie", label: "Hoodie", src: mockupHoodie, category: "tops" },
  { id: "jacket", label: "Jacket", src: mockupJacket, category: "outerwear" },
  { id: "polo", label: "Polo", src: mockupPolo, category: "tops" },
  { id: "tracksuit", label: "Tracksuit", src: mockupTracksuit, category: "sets" },
  { id: "tanktop", label: "Tank Top", src: mockupTanktop, category: "tops" },
  { id: "shorts", label: "Shorts", src: mockupShorts, category: "bottoms" },
  { id: "joggers", label: "Joggers", src: mockupJoggers, category: "bottoms" },
  { id: "sweatshirt", label: "Sweatshirt", src: mockupSweatshirt, category: "tops" },
];

const AVATARS = [
  { id: "male-light", label: "Male - Light", src: avatarMaleLight, gender: "male" },
  { id: "female-light", label: "Female - Light", src: avatarFemaleLight, gender: "female" },
  { id: "male-medium", label: "Male - Medium", src: avatarMaleMedium, gender: "male" },
  { id: "female-medium", label: "Female - Medium", src: avatarFemaleMedium, gender: "female" },
  { id: "male-dark", label: "Male - Dark", src: avatarMaleDark, gender: "male" },
  { id: "female-dark", label: "Female - Dark", src: avatarFemaleDark, gender: "female" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

const FABRICS = [
  { id: "cotton", label: "100% Cotton", weight: "180 GSM" },
  { id: "polyester", label: "Polyester", weight: "150 GSM" },
  { id: "blend", label: "Cotton/Poly Blend", weight: "165 GSM" },
  { id: "organic", label: "Organic Cotton", weight: "200 GSM" },
  { id: "bamboo", label: "Bamboo Fiber", weight: "170 GSM" },
  { id: "fleece", label: "French Terry Fleece", weight: "280 GSM" },
  { id: "dryfit", label: "Dry-Fit Performance", weight: "135 GSM" },
  { id: "denim", label: "Denim Twill", weight: "350 GSM" },
  { id: "linen", label: "Linen Blend", weight: "160 GSM" },
  { id: "nylon", label: "Ripstop Nylon", weight: "120 GSM" },
];

const GARMENT_COLORS = [
  "#FFFFFF", "#000000", "#1a1a2e", "#16213e", "#0f3460",
  "#e94560", "#533483", "#2b2d42", "#8d99ae", "#ef233c",
  "#d90429", "#2ec4b6", "#cbf3f0", "#ff6b6b", "#ffd93d",
  "#6c5ce7", "#a29bfe", "#00b894", "#fdcb6e", "#e17055",
  "#c8553d", "#588b8b", "#f28482", "#84a59d", "#f5cac3",
  "#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51",
];

const CLIP_ART: { emoji: string; label: string }[] = [
  { emoji: "⭐", label: "Star" }, { emoji: "🔥", label: "Fire" },
  { emoji: "❤️", label: "Heart" }, { emoji: "👑", label: "Crown" },
  { emoji: "⚡", label: "Lightning" }, { emoji: "🏆", label: "Trophy" },
  { emoji: "🎯", label: "Target" }, { emoji: "💎", label: "Diamond" },
  { emoji: "🦅", label: "Eagle" }, { emoji: "🐉", label: "Dragon" },
  { emoji: "🌟", label: "Glow Star" }, { emoji: "🎨", label: "Art" },
  { emoji: "🏀", label: "Basketball" }, { emoji: "⚽", label: "Soccer" },
  { emoji: "🎵", label: "Music" }, { emoji: "🌍", label: "Globe" },
  { emoji: "🦁", label: "Lion" }, { emoji: "🐺", label: "Wolf" },
  { emoji: "🌹", label: "Rose" }, { emoji: "☀️", label: "Sun" },
  { emoji: "🌙", label: "Moon" }, { emoji: "💀", label: "Skull" },
  { emoji: "🎭", label: "Theater" }, { emoji: "✨", label: "Sparkle" },
];

const FONT_FAMILIES = [
  "Arial", "Georgia", "Courier New", "Impact", "Comic Sans MS",
  "Trebuchet MS", "Verdana", "Times New Roman", "Lucida Console",
  "Palatino", "Garamond", "Tahoma", "Brush Script MT",
];

const PATTERNS = [
  { id: "stripes-h", label: "Horizontal Stripes" },
  { id: "stripes-v", label: "Vertical Stripes" },
  { id: "polka", label: "Polka Dots" },
  { id: "checkerboard", label: "Checkerboard" },
  { id: "diagonal", label: "Diagonal Lines" },
  { id: "grid", label: "Grid" },
  { id: "zigzag", label: "Zigzag" },
  { id: "diamond", label: "Diamond" },
];

const TIPS = [
  "💡 Click any element to select it, then drag to reposition.",
  "💡 Use corner handles to resize. Hold edges to stretch.",
  "💡 Flip elements horizontally or vertically for mirrored designs.",
  "💡 Use Ctrl+Z / Ctrl+Y to undo/redo actions.",
  "💡 Use the Layers panel to manage element ordering and visibility.",
  "💡 Try adding patterns as background textures for unique designs.",
  "💡 Choose an avatar to preview how your design looks on a person.",
  "💡 Set sizing and fabric options for production-ready specs.",
  "💡 Use alignment tools to precisely position elements.",
  "💡 Adjust element opacity for creative overlay effects.",
];

interface DesignElement {
  id: string;
  type: "image" | "text" | "shape";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  image?: HTMLImageElement;
  imageSrc?: string;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  name?: string;
  shapeType?: "rect" | "circle" | "triangle" | "line";
  textDecoration?: string;
  fontStyle?: string;
  shadowColor?: string;
  shadowBlur?: number;
}

interface SavedDesign {
  id: string;
  name: string;
  garmentId: string;
  garmentColor: string;
  elements: Omit<DesignElement, "image">[];
  timestamp: number;
  thumbnail?: string;
  selectedSize?: string;
  selectedFabric?: string;
  avatarId?: string;
}

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 600;
const MAX_HISTORY = 50;

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
  const [showTips, setShowTips] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("garment");
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedFabric, setSelectedFabric] = useState("cotton");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<HTMLImageElement | null>(null);
  const [undoStack, setUndoStack] = useState<DesignElement[][]>([]);
  const [redoStack, setRedoStack] = useState<DesignElement[][]>([]);
  const [showLayers, setShowLayers] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [patternColor, setPatternColor] = useState("#000000");
  const [patternSize, setPatternSize] = useState(20);
  const [elementOpacity, setElementOpacity] = useState(100);
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [textUnderline, setTextUnderline] = useState(false);
  const [textShadow, setTextShadow] = useState(false);
  const [textStroke, setTextStroke] = useState(false);
  const [textStrokeColor, setTextStrokeColor] = useState("#FFFFFF");
  const [shapeColor, setShapeColor] = useState("#000000");
  const [shapeStrokeColor, setShapeStrokeColor] = useState("#000000");
  const [view3D, setView3D] = useState(false);
  const [garmentCategory, setGarmentCategory] = useState("all");

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Load garment image
  useEffect(() => {
    if (!garment.src) { setGarmentImage(null); return; }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = garment.src;
    img.onload = () => setGarmentImage(img);
  }, [garment]);

  // Load avatar image
  useEffect(() => {
    if (!selectedAvatar) { setAvatarImage(null); return; }
    const av = AVATARS.find(a => a.id === selectedAvatar);
    if (!av) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = av.src;
    img.onload = () => setAvatarImage(img);
  }, [selectedAvatar]);

  // Load saved designs
  useEffect(() => {
    const saved = localStorage.getItem("step-garments-designs");
    if (saved) setSavedDesigns(JSON.parse(saved));
  }, []);

  // Transformer
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    const el = elements.find(e => e.id === selectedId);
    if (el?.locked) { transformerRef.current.nodes([]); transformerRef.current.getLayer()?.batchDraw(); return; }
    const selectedNode = selectedId ? stageRef.current.findOne(`#${selectedId}`) : null;
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode as Konva.Node]);
    } else {
      transformerRef.current.nodes([]);
    }
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId, elements]);

  // Update opacity when selection changes
  useEffect(() => {
    const el = elements.find(e => e.id === selectedId);
    if (el) setElementOpacity((el.opacity ?? 1) * 100);
  }, [selectedId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") { e.preventDefault(); undo(); }
        if (e.key === "y") { e.preventDefault(); redo(); }
        if (e.key === "d" && selectedId) { e.preventDefault(); duplicateSelected(); }
      }
      if (e.key === "Delete" && selectedId) deleteSelected();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, undoStack, elements]);

  const pushHistory = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-MAX_HISTORY), elements.map(e => ({ ...e }))]);
    setRedoStack([]);
  }, [elements]);

  const undo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack(r => [...r, elements.map(e => ({ ...e }))]);
    setUndoStack(u => u.slice(0, -1));
    rebuildElements(prev);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(u => [...u, elements.map(e => ({ ...e }))]);
    setRedoStack(r => r.slice(0, -1));
    rebuildElements(next);
  };

  const rebuildElements = (els: DesignElement[]) => {
    const rebuilt = els.map(el => {
      if (el.type === "image" && el.imageSrc) {
        const img = new window.Image();
        img.src = el.imageSrc;
        return { ...el, image: img };
      }
      return { ...el };
    });
    setElements(rebuilt);
  };

  const updateElements = (newEls: DesignElement[]) => {
    pushHistory();
    setElements(newEls);
  };

  const addText = () => {
    if (!textInput.trim()) return;
    pushHistory();
    const fontStyle = `${textBold ? "bold" : ""} ${textItalic ? "italic" : ""}`.trim() || "normal";
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
      fontStyle,
      textDecoration: textUnderline ? "underline" : "",
      shadowColor: textShadow ? "rgba(0,0,0,0.5)" : undefined,
      shadowBlur: textShadow ? 4 : 0,
      stroke: textStroke ? textStrokeColor : undefined,
      strokeWidth: textStroke ? 1 : 0,
      opacity: 1,
      visible: true,
      locked: false,
      name: textInput.slice(0, 20),
    };
    setElements(prev => [...prev, newEl]);
    setTextInput("");
    setSelectedId(newEl.id);
  };

  const addClipArt = (emoji: string) => {
    pushHistory();
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
      opacity: 1,
      visible: true,
      locked: false,
      name: `Sticker`,
    };
    setElements(prev => [...prev, newEl]);
    setSelectedId(newEl.id);
  };

  const addShape = (shapeType: "rect" | "circle" | "triangle" | "line") => {
    pushHistory();
    const newEl: DesignElement = {
      id: `shape-${Date.now()}`,
      type: "shape",
      shapeType,
      x: CANVAS_WIDTH / 2 - 40,
      y: CANVAS_HEIGHT / 2 - 40,
      width: 80,
      height: 80,
      rotation: 0,
      fill: shapeColor,
      stroke: shapeStrokeColor,
      strokeWidth: 2,
      opacity: 1,
      visible: true,
      locked: false,
      name: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
    };
    setElements(prev => [...prev, newEl]);
    setSelectedId(newEl.id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    pushHistory();
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
          width: img.width, height: img.height,
          rotation: 0, image: img, imageSrc: reader.result as string,
          scaleX: scale, scaleY: scale,
          opacity: 1, visible: true, locked: false,
          name: file.name.slice(0, 20),
        };
        setElements(prev => [...prev, newEl]);
        setSelectedId(newEl.id);
      };
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    pushHistory();
    Array.from(files).forEach(file => {
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
            opacity: 1, visible: true, locked: false,
            name: file.name.slice(0, 20),
          };
          setElements(prev => [...prev, newEl]);
        };
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    updateElements(elements.filter(el => el.id !== selectedId));
    setSelectedId(null);
  };

  const rotateSelected = (deg = 45) => {
    if (!selectedId) return;
    updateElements(elements.map(el => el.id === selectedId ? { ...el, rotation: (el.rotation + deg) % 360 } : el));
  };

  const flipHorizontal = () => {
    if (!selectedId) return;
    updateElements(elements.map(el => el.id === selectedId ? { ...el, scaleX: (el.scaleX || 1) * -1 } : el));
  };

  const flipVertical = () => {
    if (!selectedId) return;
    updateElements(elements.map(el => el.id === selectedId ? { ...el, scaleY: (el.scaleY || 1) * -1 } : el));
  };

  const duplicateSelected = () => {
    if (!selectedId) return;
    const el = elements.find(e => e.id === selectedId);
    if (!el) return;
    pushHistory();
    const newEl: DesignElement = {
      ...el,
      id: `${el.type}-${Date.now()}`,
      x: el.x + 20,
      y: el.y + 20,
      name: `${el.name || ""} Copy`,
    };
    if (newEl.type === "image" && newEl.imageSrc) {
      const img = new window.Image();
      img.src = newEl.imageSrc;
      newEl.image = img;
    }
    setElements(prev => [...prev, newEl]);
    setSelectedId(newEl.id);
  };

  const moveLayer = (id: string, direction: "up" | "down") => {
    const idx = elements.findIndex(e => e.id === id);
    if (idx < 0) return;
    const newIdx = direction === "up" ? idx + 1 : idx - 1;
    if (newIdx < 0 || newIdx >= elements.length) return;
    pushHistory();
    const arr = [...elements];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setElements(arr);
  };

  const toggleVisibility = (id: string) => {
    updateElements(elements.map(el => el.id === id ? { ...el, visible: !(el.visible ?? true) } : el));
  };

  const toggleLock = (id: string) => {
    updateElements(elements.map(el => el.id === id ? { ...el, locked: !el.locked } : el));
  };

  const updateOpacity = (val: number) => {
    if (!selectedId) return;
    setElementOpacity(val);
    setElements(prev => prev.map(el => el.id === selectedId ? { ...el, opacity: val / 100 } : el));
  };

  const alignElement = (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    if (!selectedId) return;
    updateElements(elements.map(el => {
      if (el.id !== selectedId) return el;
      const w = (el.width || 50) * Math.abs(el.scaleX || 1);
      const h = (el.height || 50) * Math.abs(el.scaleY || 1);
      switch (alignment) {
        case "left": return { ...el, x: 20 };
        case "center": return { ...el, x: CANVAS_WIDTH / 2 - w / 2 };
        case "right": return { ...el, x: CANVAS_WIDTH - w - 20 };
        case "top": return { ...el, y: 20 };
        case "middle": return { ...el, y: CANVAS_HEIGHT / 2 - h / 2 };
        case "bottom": return { ...el, y: CANVAS_HEIGHT - h - 20 };
        default: return el;
      }
    }));
  };

  const handleDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el));
  };

  const handleTransformEnd = (id: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    setElements(prev => prev.map(el =>
      el.id === id ? { ...el, x: node.x(), y: node.y(), rotation: node.rotation(), scaleX: node.scaleX(), scaleY: node.scaleY() } : el
    ));
  };

  const saveDesign = () => {
    const name = prompt("Design name:", `Design ${savedDesigns.length + 1}`);
    if (!name) return;
    const stage = stageRef.current;
    const thumbnail = stage ? stage.toDataURL({ pixelRatio: 0.3 }) : undefined;
    const design: SavedDesign = {
      id: `design-${Date.now()}`, name,
      garmentId: garment.id, garmentColor,
      elements: elements.map(({ image, ...rest }) => rest),
      timestamp: Date.now(), thumbnail,
      selectedSize, selectedFabric,
      avatarId: selectedAvatar || undefined,
    };
    const updated = [design, ...savedDesigns];
    setSavedDesigns(updated);
    localStorage.setItem("step-garments-designs", JSON.stringify(updated));
  };

  const loadDesign = (design: SavedDesign) => {
    const g = GARMENTS.find(g => g.id === design.garmentId);
    if (g) setGarment(g);
    setGarmentColor(design.garmentColor);
    if (design.selectedSize) setSelectedSize(design.selectedSize);
    if (design.selectedFabric) setSelectedFabric(design.selectedFabric);
    if (design.avatarId) setSelectedAvatar(design.avatarId);
    rebuildElements(design.elements as DesignElement[]);
    setShowHistory(false);
    setSelectedId(null);
  };

  const deleteDesign = (id: string) => {
    const updated = savedDesigns.filter(d => d.id !== id);
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

  const clearCanvas = () => {
    if (!confirm("Clear all elements?")) return;
    pushHistory();
    setElements([]);
    setSelectedId(null);
  };

  // Pattern rendering
  const renderPattern = () => {
    if (!selectedPattern) return null;
    const shapes: React.ReactNode[] = [];
    const color = patternColor;
    const s = patternSize;
    const opacity = 0.3;

    for (let x = 0; x < CANVAS_WIDTH; x += s) {
      for (let y = 0; y < CANVAS_HEIGHT; y += s) {
        const key = `p-${x}-${y}`;
        switch (selectedPattern) {
          case "polka":
            shapes.push(<Circle key={key} x={x + s / 2} y={y + s / 2} radius={s / 6} fill={color} opacity={opacity} listening={false} />);
            break;
          case "checkerboard":
            if ((Math.floor(x / s) + Math.floor(y / s)) % 2 === 0)
              shapes.push(<Rect key={key} x={x} y={y} width={s} height={s} fill={color} opacity={opacity} listening={false} />);
            break;
          case "grid":
            shapes.push(<Line key={`gh-${x}-${y}`} points={[x, y, x + s, y]} stroke={color} strokeWidth={0.5} opacity={opacity} listening={false} />);
            shapes.push(<Line key={`gv-${x}-${y}`} points={[x, y, x, y + s]} stroke={color} strokeWidth={0.5} opacity={opacity} listening={false} />);
            break;
          case "diamond":
            if ((Math.floor(x / s) + Math.floor(y / s)) % 2 === 0)
              shapes.push(<Line key={key} points={[x + s / 2, y, x + s, y + s / 2, x + s / 2, y + s, x, y + s / 2]} closed fill={color} opacity={opacity} listening={false} />);
            break;
        }
      }
    }
    if (selectedPattern === "stripes-h") {
      for (let y = 0; y < CANVAS_HEIGHT; y += s) {
        shapes.push(<Rect key={`sh-${y}`} x={0} y={y} width={CANVAS_WIDTH} height={s / 2} fill={color} opacity={opacity} listening={false} />);
      }
    }
    if (selectedPattern === "stripes-v") {
      for (let x = 0; x < CANVAS_WIDTH; x += s) {
        shapes.push(<Rect key={`sv-${x}`} x={x} y={0} width={s / 2} height={CANVAS_HEIGHT} fill={color} opacity={opacity} listening={false} />);
      }
    }
    if (selectedPattern === "diagonal") {
      for (let i = -CANVAS_HEIGHT; i < CANVAS_WIDTH + CANVAS_HEIGHT; i += s) {
        shapes.push(<Line key={`d-${i}`} points={[i, 0, i - CANVAS_HEIGHT, CANVAS_HEIGHT]} stroke={color} strokeWidth={1} opacity={opacity} listening={false} />);
      }
    }
    if (selectedPattern === "zigzag") {
      for (let y = 0; y < CANVAS_HEIGHT; y += s) {
        const pts: number[] = [];
        for (let x = 0; x <= CANVAS_WIDTH; x += s / 2) {
          pts.push(x, y + ((pts.length / 2) % 2 === 0 ? 0 : s / 2));
        }
        shapes.push(<Line key={`z-${y}`} points={pts} stroke={color} strokeWidth={1} opacity={opacity} listening={false} />);
      }
    }
    return shapes;
  };

  const renderGrid = () => {
    if (!showGrid) return null;
    const lines: React.ReactNode[] = [];
    const step = 25;
    for (let x = 0; x < CANVAS_WIDTH; x += step) {
      lines.push(<Line key={`gx-${x}`} points={[x, 0, x, CANVAS_HEIGHT]} stroke="#ccc" strokeWidth={0.5} opacity={0.3} listening={false} />);
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += step) {
      lines.push(<Line key={`gy-${y}`} points={[0, y, CANVAS_WIDTH, y]} stroke="#ccc" strokeWidth={0.5} opacity={0.3} listening={false} />);
    }
    return lines;
  };

  const renderShape = (el: DesignElement) => {
    const common = {
      id: el.id,
      x: el.x,
      y: el.y,
      rotation: el.rotation,
      scaleX: el.scaleX || 1,
      scaleY: el.scaleY || 1,
      opacity: el.opacity ?? 1,
      draggable: !el.locked,
      onClick: () => setSelectedId(el.id),
      onTap: () => setSelectedId(el.id),
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => handleDragEnd(el.id, e),
      onTransformEnd: (e: Konva.KonvaEventObject<Event>) => handleTransformEnd(el.id, e),
    };
    switch (el.shapeType) {
      case "rect":
        return <Rect key={el.id} {...common} width={el.width || 80} height={el.height || 80} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />;
      case "circle":
        return <Circle key={el.id} {...common} radius={(el.width || 80) / 2} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />;
      case "triangle":
        const w = el.width || 80;
        const h = el.height || 80;
        return <Line key={el.id} {...common} points={[w / 2, 0, w, h, 0, h]} closed fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />;
      case "line":
        return <Line key={el.id} {...common} points={[0, 0, el.width || 100, 0]} stroke={el.stroke || el.fill} strokeWidth={el.strokeWidth || 3} />;
      default:
        return null;
    }
  };

  const filteredGarments = garmentCategory === "all" ? GARMENTS : GARMENTS.filter(g => g.category === garmentCategory);

  const tabs = [
    { id: "garment", label: "Garment", icon: Shirt },
    { id: "avatar", label: "Avatar", icon: User },
    { id: "text", label: "Text", icon: Type },
    { id: "upload", label: "Upload", icon: Upload },
    { id: "shapes", label: "Shapes", icon: Square },
    { id: "clipart", label: "Clip Art", icon: Sticker },
    { id: "patterns", label: "Patterns", icon: Grid3X3 },
    { id: "sizing", label: "Sizing", icon: Ruler },
    { id: "layers", label: "Layers", icon: Layers },
    { id: "actions", label: "Actions", icon: Settings2 },
  ];

  const selectedElement = elements.find(e => e.id === selectedId);

  return (
    <div className="space-y-4">
      {/* Tips */}
      {showTips && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 flex items-start gap-3 animate-fade-in">
          <HelpCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-foreground font-medium">{TIPS[currentTip]}</p>
            <div className="flex gap-2 mt-1">
              <button onClick={() => setCurrentTip((currentTip + 1) % TIPS.length)} className="text-xs text-accent hover:underline">Next Tip</button>
              <span className="text-[10px] text-muted-foreground">({currentTip + 1}/{TIPS.length})</span>
            </div>
          </div>
          <button onClick={() => setShowTips(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Top toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowTips(!showTips)} className="flex items-center gap-1 text-xs text-accent hover:underline">
            <HelpCircle className="w-3.5 h-3.5" /> Tips
          </button>
          <div className="h-4 w-px bg-border" />
          <button onClick={undo} disabled={undoStack.length === 0} className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 transition-colors" title="Undo (Ctrl+Z)">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={redoStack.length === 0} className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 transition-colors" title="Redo (Ctrl+Y)">
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-border" />
          <button onClick={() => setZoom(z => Math.min(z + 0.1, 2))} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(1)} className="text-xs text-muted-foreground hover:text-foreground">Reset</button>
          <div className="h-4 w-px bg-border" />
          <button onClick={() => setShowGrid(!showGrid)} className={`p-1.5 rounded-md transition-colors ${showGrid ? "bg-accent/20 text-accent" : "hover:bg-muted"}`} title="Toggle Grid">
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setView3D(!view3D)} className={`p-1.5 rounded-md transition-colors ${view3D ? "bg-accent/20 text-accent" : "hover:bg-muted"}`} title="3D View">
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {selectedElement && (
            <>
              <button onClick={() => rotateSelected(45)} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Rotate 45°"><RotateCw className="w-4 h-4" /></button>
              <button onClick={() => rotateSelected(-45)} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Rotate -45°"><RotateCcw className="w-4 h-4" /></button>
              <button onClick={flipHorizontal} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Flip H"><FlipHorizontal className="w-4 h-4" /></button>
              <button onClick={flipVertical} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Flip V"><FlipVertical className="w-4 h-4" /></button>
              <button onClick={duplicateSelected} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Duplicate"><Copy className="w-4 h-4" /></button>
              <button onClick={deleteSelected} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">Opacity</span>
                <input type="range" min={0} max={100} value={elementOpacity} onChange={e => updateOpacity(Number(e.target.value))} className="w-16 h-1 accent-accent" />
                <span className="text-[10px] text-muted-foreground w-7">{elementOpacity}%</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <button onClick={() => alignElement("left")} className="p-1 rounded hover:bg-muted" title="Align Left"><AlignLeft className="w-3.5 h-3.5" /></button>
              <button onClick={() => alignElement("center")} className="p-1 rounded hover:bg-muted" title="Align Center"><AlignCenter className="w-3.5 h-3.5" /></button>
              <button onClick={() => alignElement("right")} className="p-1 rounded hover:bg-muted" title="Align Right"><AlignRight className="w-3.5 h-3.5" /></button>
              <button onClick={() => moveLayer(selectedId!, "up")} className="p-1 rounded hover:bg-muted" title="Bring Forward"><ArrowUp className="w-3.5 h-3.5" /></button>
              <button onClick={() => moveLayer(selectedId!, "down")} className="p-1 rounded hover:bg-muted" title="Send Back"><ArrowDown className="w-3.5 h-3.5" /></button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar tabs */}
        <div className="lg:w-72 space-y-2">
          <div className="flex lg:flex-col gap-1 bg-card border border-border rounded-lg p-1.5 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${activeTab === t.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Garment Tab */}
          {activeTab === "garment" && (
            <div className="space-y-2">
              <div className="bg-card border border-border rounded-lg p-3">
                <h3 className="text-xs font-semibold text-foreground mb-2">Category</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {["all", "tops", "bottoms", "outerwear", "sets"].map(c => (
                    <button key={c} onClick={() => setGarmentCategory(c)}
                      className={`px-2 py-1 rounded text-[10px] font-medium capitalize transition-colors ${garmentCategory === c ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {c}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {filteredGarments.map(g => (
                    <button key={g.id} onClick={() => setGarment(g)}
                      className={`p-1.5 rounded-md border text-[10px] font-medium transition-all ${garment.id === g.id ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/50"}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <button onClick={() => setShowGarmentColors(!showGarmentColors)} className="flex items-center justify-between w-full text-xs font-semibold text-foreground">
                  <span className="flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Colors</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showGarmentColors ? "rotate-180" : ""}`} />
                </button>
                {showGarmentColors && (
                  <div className="grid grid-cols-6 gap-1 mt-2">
                    {GARMENT_COLORS.map(c => (
                      <button key={c} onClick={() => setGarmentColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${garmentColor === c ? "border-accent scale-110" : "border-border"}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Avatar Tab */}
          {activeTab === "avatar" && (
            <div className="bg-card border border-border rounded-lg p-3 space-y-3">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Model Avatars</h3>
              <p className="text-[10px] text-muted-foreground">Preview designs on diverse body types.</p>
              <button onClick={() => setSelectedAvatar(null)}
                className={`w-full px-2 py-1.5 rounded-md text-[10px] font-medium transition-colors ${!selectedAvatar ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                No Avatar (Garment Only)
              </button>
              <div className="space-y-1">
                <p className="text-[10px] font-medium text-muted-foreground">Male</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {AVATARS.filter(a => a.gender === "male").map(a => (
                    <button key={a.id} onClick={() => setSelectedAvatar(a.id)}
                      className={`p-1.5 rounded-md border text-[9px] font-medium transition-all ${selectedAvatar === a.id ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/50"}`}>
                      {a.label.replace("Male - ", "")}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-medium text-muted-foreground mt-2">Female</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {AVATARS.filter(a => a.gender === "female").map(a => (
                    <button key={a.id} onClick={() => setSelectedAvatar(a.id)}
                      className={`p-1.5 rounded-md border text-[9px] font-medium transition-all ${selectedAvatar === a.id ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/50"}`}>
                      {a.label.replace("Female - ", "")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Text Tab */}
          {activeTab === "text" && (
            <div className="bg-card border border-border rounded-lg p-3 space-y-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Type className="w-3.5 h-3.5" /> Add Text</h3>
              <input value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Enter text..."
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs" onKeyDown={e => e.key === "Enter" && addText()} />
              <div className="flex items-center gap-1.5">
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0" />
                <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="h-7 rounded-md border border-input bg-background px-1 text-[10px] flex-1">
                  {[12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96].map(s => <option key={s} value={s}>{s}px</option>)}
                </select>
              </div>
              <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full h-7 rounded-md border border-input bg-background px-1 text-[10px]">
                {FONT_FAMILIES.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
              </select>
              <div className="flex gap-1">
                <button onClick={() => setTextBold(!textBold)} className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${textBold ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>B</button>
                <button onClick={() => setTextItalic(!textItalic)} className={`px-2 py-1 rounded text-[10px] italic transition-colors ${textItalic ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>I</button>
                <button onClick={() => setTextUnderline(!textUnderline)} className={`px-2 py-1 rounded text-[10px] underline transition-colors ${textUnderline ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>U</button>
                <button onClick={() => setTextShadow(!textShadow)} className={`px-2 py-1 rounded text-[10px] transition-colors ${textShadow ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>Shadow</button>
                <button onClick={() => setTextStroke(!textStroke)} className={`px-2 py-1 rounded text-[10px] transition-colors ${textStroke ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>Outline</button>
              </div>
              {textStroke && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Outline:</span>
                  <input type="color" value={textStrokeColor} onChange={e => setTextStrokeColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0" />
                </div>
              )}
              <button onClick={addText} disabled={!textInput.trim()} className="w-full py-1.5 bg-accent text-accent-foreground rounded-md text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                Add Text
              </button>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="bg-card border border-border rounded-lg p-3 space-y-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Upload Images</h3>
              <label className="block w-full py-2 bg-accent text-accent-foreground rounded-md text-xs font-medium text-center cursor-pointer hover:opacity-90 transition-opacity">
                <span className="flex items-center justify-center gap-1.5"><Upload className="w-3 h-3" /> Upload Logo / Design</span>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              <label className="block w-full py-2 border border-border text-foreground rounded-md text-xs font-medium text-center cursor-pointer hover:bg-muted transition-colors">
                <span className="flex items-center justify-center gap-1.5"><Camera className="w-3 h-3" /> Take Photo (Mobile)</span>
                <input ref={photoInputRef} type="file" className="hidden" accept="image/*" capture="environment" onChange={handleImageUpload} />
              </label>
              <label className="flex items-center gap-2 text-[10px] text-muted-foreground border border-dashed border-border rounded-lg p-3 cursor-pointer hover:border-accent/50 transition-colors text-center justify-center">
                <ImagePlus className="w-3.5 h-3.5" />
                <span>Add multiple images</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleMultiImageUpload} />
              </label>
            </div>
          )}

          {/* Shapes Tab */}
          {activeTab === "shapes" && (
            <div className="bg-card border border-border rounded-lg p-3 space-y-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Square className="w-3.5 h-3.5" /> Add Shapes</h3>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] text-muted-foreground">Fill:</span>
                <input type="color" value={shapeColor} onChange={e => setShapeColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0" />
                <span className="text-[10px] text-muted-foreground ml-2">Stroke:</span>
                <input type="color" value={shapeStrokeColor} onChange={e => setShapeStrokeColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0" />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={() => addShape("rect")} className="flex items-center justify-center gap-1.5 p-2 rounded-md border border-border hover:border-accent/50 hover:bg-accent/5 text-[10px] font-medium transition-all">
                  <Square className="w-4 h-4" /> Rectangle
                </button>
                <button onClick={() => addShape("circle")} className="flex items-center justify-center gap-1.5 p-2 rounded-md border border-border hover:border-accent/50 hover:bg-accent/5 text-[10px] font-medium transition-all">
                  <CircleIcon className="w-4 h-4" /> Circle
                </button>
                <button onClick={() => addShape("triangle")} className="flex items-center justify-center gap-1.5 p-2 rounded-md border border-border hover:border-accent/50 hover:bg-accent/5 text-[10px] font-medium transition-all">
                  <Triangle className="w-4 h-4" /> Triangle
                </button>
                <button onClick={() => addShape("line")} className="flex items-center justify-center gap-1.5 p-2 rounded-md border border-border hover:border-accent/50 hover:bg-accent/5 text-[10px] font-medium transition-all">
                  <PenTool className="w-4 h-4" /> Line
                </button>
              </div>
            </div>
          )}

          {/* Clip Art Tab */}
          {activeTab === "clipart" && (
            <div className="bg-card border border-border rounded-lg p-3">
              <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5"><Sticker className="w-3.5 h-3.5" /> Stickers & Clip Art</h3>
              <div className="grid grid-cols-4 gap-1.5">
                {CLIP_ART.map(c => (
                  <button key={c.label} onClick={() => addClipArt(c.emoji)}
                    className="flex flex-col items-center gap-0.5 p-1.5 rounded-md border border-border hover:border-accent/50 hover:bg-accent/5 transition-all" title={c.label}>
                    <span className="text-xl">{c.emoji}</span>
                    <span className="text-[8px] text-muted-foreground">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Patterns Tab */}
          {activeTab === "patterns" && (
            <div className="bg-card border border-border rounded-lg p-3 space-y-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Paintbrush className="w-3.5 h-3.5" /> Design Patterns</h3>
              <button onClick={() => setSelectedPattern(null)}
                className={`w-full px-2 py-1.5 rounded-md text-[10px] font-medium transition-colors ${!selectedPattern ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                No Pattern
              </button>
              <div className="grid grid-cols-2 gap-1.5">
                {PATTERNS.map(p => (
                  <button key={p.id} onClick={() => setSelectedPattern(p.id)}
                    className={`p-1.5 rounded-md border text-[10px] font-medium transition-all ${selectedPattern === p.id ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/50"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
              {selectedPattern && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Color:</span>
                    <input type="color" value={patternColor} onChange={e => setPatternColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Size:</span>
                    <input type="range" min={10} max={60} value={patternSize} onChange={e => setPatternSize(Number(e.target.value))} className="flex-1 h-1 accent-accent" />
                    <span className="text-[10px] text-muted-foreground w-5">{patternSize}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sizing Tab */}
          {activeTab === "sizing" && (
            <div className="bg-card border border-border rounded-lg p-3 space-y-3">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5" /> Size & Fabric</h3>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Size</p>
                <div className="flex flex-wrap gap-1">
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${selectedSize === s ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Fabric</p>
                <div className="space-y-1">
                  {FABRICS.map(f => (
                    <button key={f.id} onClick={() => setSelectedFabric(f.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[10px] transition-colors ${selectedFabric === f.id ? "bg-accent/10 border border-accent text-accent" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      <span className="font-medium">{f.label}</span>
                      <span className="text-[9px]">{f.weight}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layers Tab */}
          {activeTab === "layers" && (
            <div className="bg-card border border-border rounded-lg p-3 space-y-2">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Layers</h3>
              {elements.length === 0 && <p className="text-[10px] text-muted-foreground">No elements yet.</p>}
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {[...elements].reverse().map((el, i) => (
                  <div key={el.id} onClick={() => !el.locked && setSelectedId(el.id)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] cursor-pointer transition-colors ${selectedId === el.id ? "bg-accent/10 border border-accent" : "bg-muted hover:bg-muted/80"}`}>
                    <span className="truncate flex-1 font-medium">{el.name || el.type}</span>
                    <button onClick={e => { e.stopPropagation(); toggleVisibility(el.id); }} className="p-0.5 hover:bg-background rounded" title="Toggle visibility">
                      {(el.visible ?? true) ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
                    </button>
                    <button onClick={e => { e.stopPropagation(); toggleLock(el.id); }} className="p-0.5 hover:bg-background rounded" title="Toggle lock">
                      {el.locked ? <Lock className="w-3 h-3 text-destructive" /> : <Unlock className="w-3 h-3" />}
                    </button>
                    <button onClick={e => { e.stopPropagation(); moveLayer(el.id, "up"); }} className="p-0.5 hover:bg-background rounded"><ArrowUp className="w-3 h-3" /></button>
                    <button onClick={e => { e.stopPropagation(); moveLayer(el.id, "down"); }} className="p-0.5 hover:bg-background rounded"><ArrowDown className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === "actions" && (
            <div className="bg-card border border-border rounded-lg p-3 space-y-2">
              <h3 className="text-xs font-semibold text-foreground mb-1">Save & Export</h3>
              <button onClick={saveDesign} className="w-full flex items-center justify-center gap-1 py-1.5 bg-accent text-accent-foreground rounded-md text-xs font-medium hover:opacity-90 transition-opacity">
                <Save className="w-3 h-3" /> Save Design
              </button>
              <div className="flex gap-1.5">
                <button onClick={exportPNG} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-muted text-foreground rounded-md text-[10px] hover:bg-muted/80 transition-colors">
                  <Download className="w-3 h-3" /> PNG
                </button>
                <button onClick={exportPDF} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-muted text-foreground rounded-md text-[10px] hover:bg-muted/80 transition-colors">
                  <Download className="w-3 h-3" /> PDF
                </button>
              </div>
              <button onClick={clearCanvas} className="w-full flex items-center justify-center gap-1 py-1.5 bg-destructive/10 text-destructive rounded-md text-[10px] hover:bg-destructive/20 transition-colors">
                <Trash2 className="w-3 h-3" /> Clear Canvas
              </button>
              <button onClick={() => setShowHistory(!showHistory)} className="w-full flex items-center justify-center gap-1 py-1.5 border border-border text-foreground rounded-md text-[10px] hover:bg-muted transition-colors">
                <Clock className="w-3 h-3" /> {showHistory ? "Hide" : "Show"} History ({savedDesigns.length})
              </button>
              <div className="border-t border-border pt-2 mt-2">
                <p className="text-[10px] text-muted-foreground mb-1">Current Specs</p>
                <div className="space-y-0.5 text-[10px]">
                  <p><span className="font-medium">Garment:</span> {garment.label}</p>
                  <p><span className="font-medium">Size:</span> {selectedSize}</p>
                  <p><span className="font-medium">Fabric:</span> {FABRICS.find(f => f.id === selectedFabric)?.label}</p>
                  <p><span className="font-medium">Elements:</span> {elements.length}</p>
                  {selectedAvatar && <p><span className="font-medium">Avatar:</span> {AVATARS.find(a => a.id === selectedAvatar)?.label}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 flex flex-col items-center">
          <div className={`bg-card border border-border rounded-lg p-3 inline-block transition-transform duration-500 ${view3D ? "perspective-distant" : ""}`}
            style={view3D ? { perspective: "1200px" } : {}}>
            <p className="text-[10px] text-muted-foreground mb-1.5 text-center">
              Click to select • Drag to move • Handles to resize • Ctrl+Z undo
            </p>
            <div
              style={{
                backgroundColor: "#f0f0f0",
                borderRadius: 8,
                overflow: "hidden",
                transform: view3D ? `rotateY(15deg) rotateX(5deg)` : `scale(${zoom})`,
                transformOrigin: "center center",
                transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: view3D ? "20px 20px 60px rgba(0,0,0,0.3)" : "none",
              }}
            >
              <Stage
                ref={stageRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onMouseDown={e => {
                  if (e.target === e.target.getStage() || e.target.name() === "garment-bg" || e.target.name() === "garment-img" || e.target.name() === "avatar-img") {
                    setSelectedId(null);
                  }
                }}
              >
                <Layer>
                  <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill={garmentColor} name="garment-bg" />
                  {renderPattern()}
                  {avatarImage && (
                    <KonvaImage
                      image={avatarImage}
                      x={(CANVAS_WIDTH - avatarImage.width * (CANVAS_HEIGHT / avatarImage.height)) / 2}
                      y={0}
                      width={avatarImage.width * (CANVAS_HEIGHT / avatarImage.height)}
                      height={CANVAS_HEIGHT}
                      opacity={0.3}
                      name="avatar-img"
                      listening={true}
                    />
                  )}
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
                  {renderGrid()}
                  {elements.map(el => {
                    if (!(el.visible ?? true)) return null;
                    if (el.type === "shape") return renderShape(el);
                    if (el.type === "text") {
                      return (
                        <KonvaText
                          key={el.id} id={el.id}
                          x={el.x} y={el.y}
                          text={el.text} fontSize={el.fontSize} fontFamily={el.fontFamily}
                          fill={el.fill} rotation={el.rotation}
                          fontStyle={el.fontStyle || "normal"}
                          textDecoration={el.textDecoration || ""}
                          shadowColor={el.shadowColor} shadowBlur={el.shadowBlur || 0}
                          stroke={el.stroke} strokeWidth={el.strokeWidth || 0}
                          opacity={el.opacity ?? 1}
                          draggable={!el.locked}
                          scaleX={el.scaleX || 1} scaleY={el.scaleY || 1}
                          onClick={() => setSelectedId(el.id)}
                          onTap={() => setSelectedId(el.id)}
                          onDragEnd={e => handleDragEnd(el.id, e)}
                          onTransformEnd={e => handleTransformEnd(el.id, e)}
                        />
                      );
                    }
                    if (el.image) {
                      return (
                        <KonvaImage
                          key={el.id} id={el.id}
                          image={el.image}
                          x={el.x} y={el.y}
                          width={el.width} height={el.height}
                          rotation={el.rotation}
                          scaleX={el.scaleX || 1} scaleY={el.scaleY || 1}
                          opacity={el.opacity ?? 1}
                          draggable={!el.locked}
                          onClick={() => setSelectedId(el.id)}
                          onTap={() => setSelectedId(el.id)}
                          onDragEnd={e => handleDragEnd(el.id, e)}
                          onTransformEnd={e => handleTransformEnd(el.id, e)}
                        />
                      );
                    }
                    return null;
                  })}
                  <Transformer ref={transformerRef} boundBoxFunc={(oldBox, newBox) => (newBox.width < 10 || newBox.height < 10 ? oldBox : newBox)} />
                </Layer>
              </Stage>
            </div>
          </div>
          {/* 3D indicator */}
          {view3D && (
            <p className="text-[10px] text-accent mt-2 animate-pulse flex items-center gap-1"><Sparkles className="w-3 h-3" /> 3D Preview Mode Active</p>
          )}
        </div>
      </div>

      {/* Design History */}
      {showHistory && (
        <div className="bg-card border border-border rounded-lg p-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-foreground mb-3">Design History</h3>
          {savedDesigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved designs yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {savedDesigns.map(d => (
                <div key={d.id} className="bg-muted rounded-lg p-2 text-center">
                  {d.thumbnail ? (
                    <img src={d.thumbnail} alt={d.name} className="w-full h-24 object-contain rounded mb-1.5 bg-background" />
                  ) : (
                    <div className="w-full h-24 bg-background rounded mb-1.5 flex items-center justify-center text-[10px] text-muted-foreground">No preview</div>
                  )}
                  <p className="text-[10px] font-medium text-foreground truncate">{d.name}</p>
                  <p className="text-[9px] text-muted-foreground">{new Date(d.timestamp).toLocaleDateString()}</p>
                  {d.selectedSize && <p className="text-[9px] text-muted-foreground">Size: {d.selectedSize}</p>}
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => loadDesign(d)} className="flex-1 text-[9px] bg-accent text-accent-foreground rounded py-0.5 hover:opacity-90 transition-opacity">Load</button>
                    <button onClick={() => deleteDesign(d.id)} className="flex-1 text-[9px] bg-destructive/10 text-destructive rounded py-0.5 hover:bg-destructive/20 transition-colors">Del</button>
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
