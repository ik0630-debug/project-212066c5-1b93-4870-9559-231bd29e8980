import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorPickerProps {
  value: string; // HSL format: "280 100% 70%"
  onChange: (value: string) => void;
  label?: string;
}

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
};

const presetColors = [
  "280 100% 70%", // Purple
  "221 83% 53%", // Blue
  "142 76% 36%", // Green
  "0 84% 60%", // Red
  "38 92% 50%", // Orange
  "47 96% 53%", // Yellow
  "280 100% 50%", // Dark Purple
  "221 83% 33%", // Dark Blue
  "0 0% 0%", // Black
  "0 0% 100%", // White
  "0 0% 50%", // Gray
  "340 82% 52%", // Pink
];

export const ColorPicker = ({ value, onChange, label }: ColorPickerProps) => {
  const parseHsl = (hslString: string): { h: number; s: number; l: number } => {
    const parts = hslString.trim().split(/\s+/);
    return {
      h: parseInt(parts[0]) || 0,
      s: parseInt(parts[1]) || 0,
      l: parseInt(parts[2]) || 0,
    };
  };

  const hsl = parseHsl(value);
  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  const [localRgb, setLocalRgb] = useState({ r: rgb.r, g: rgb.g, b: rgb.b });

  useEffect(() => {
    setLocalRgb(rgb);
  }, [value]);

  const handleHexChange = (hexValue: string) => {
    const rgb = hexToRgb(hexValue);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    onChange(`${hsl.h} ${hsl.s}% ${hsl.l}%`);
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', val: string) => {
    const numVal = Math.max(0, Math.min(255, parseInt(val) || 0));
    const newRgb = { ...localRgb, [channel]: numVal };
    setLocalRgb(newRgb);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    onChange(`${hsl.h} ${hsl.s}% ${hsl.l}%`);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: `hsl(${value})` }}
            />
            <span className="flex-1 text-left">HSL: {value}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <Tabs defaultValue="palette" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="palette">팔레트</TabsTrigger>
              <TabsTrigger value="picker">색상판</TabsTrigger>
              <TabsTrigger value="rgb">RGB</TabsTrigger>
            </TabsList>
            
            <TabsContent value="palette" className="space-y-4">
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className="w-full aspect-square rounded border-2 hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: `hsl(${color})`,
                      borderColor: value === color ? "hsl(var(--primary))" : "transparent",
                    }}
                    onClick={() => onChange(color)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="picker" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color-input">색상 선택</Label>
                <Input
                  id="color-input"
                  type="color"
                  value={hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="w-full h-20 cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <Label>HEX</Label>
                <Input
                  value={hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="rgb" className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="r">R</Label>
                  <Input
                    id="r"
                    type="number"
                    min="0"
                    max="255"
                    value={localRgb.r}
                    onChange={(e) => handleRgbChange('r', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="g">G</Label>
                  <Input
                    id="g"
                    type="number"
                    min="0"
                    max="255"
                    value={localRgb.g}
                    onChange={(e) => handleRgbChange('g', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b">B</Label>
                  <Input
                    id="b"
                    type="number"
                    min="0"
                    max="255"
                    value={localRgb.b}
                    onChange={(e) => handleRgbChange('b', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>미리보기</Label>
                <div
                  className="w-full h-12 rounded border"
                  style={{ backgroundColor: `rgb(${localRgb.r}, ${localRgb.g}, ${localRgb.b})` }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};
