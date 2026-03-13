import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = ["All", "T-Shirts", "Hoodies", "Tracksuits", "Jackets", "Sportswear", "Streetwear", "Denim", "Polo Shirts", "Corporate Uniforms", "Kids Wear"];
const fabricTypes = ["All Fabrics", "Cotton", "Polyester", "Fleece", "Denim", "Nylon", "Organic", "Performance"];
const moqRanges = ["Any MOQ", "100+", "150+", "200+", "300+"];

interface ProductFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  fabric: string;
  onFabricChange: (val: string) => void;
  moq: string;
  onMoqChange: (val: string) => void;
}

const ProductFilters = ({
  search, onSearchChange,
  category, onCategoryChange,
  fabric, onFabricChange,
  moq, onMoqChange,
}: ProductFiltersProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasFilters = category !== "All" || fabric !== "All Fabrics" || moq !== "Any MOQ" || search.trim() !== "";

  const clearAll = () => {
    onSearchChange("");
    onCategoryChange("All");
    onFabricChange("All Fabrics");
    onMoqChange("Any MOQ");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-sm">
      {/* Search + toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, fabrics, styles..."
            className="pl-10"
          />
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors text-sm font-medium ${
            filtersOpen ? "bg-accent text-accent-foreground border-accent" : "bg-background border-border text-foreground hover:bg-muted"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        {hasFilters && (
          <button onClick={clearAll} className="flex items-center gap-1 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors">
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Filter dropdowns */}
      {filtersOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Category</label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Fabric Type</label>
            <select
              value={fabric}
              onChange={(e) => onFabricChange(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {fabricTypes.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Min. Order Qty</label>
            <select
              value={moq}
              onChange={(e) => onMoqChange(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {moqRanges.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
