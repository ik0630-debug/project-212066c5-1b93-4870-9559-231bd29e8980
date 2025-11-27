import * as LucideIcons from "lucide-react";

/**
 * Get Lucide icon component by name
 * @param iconName - Name of the Lucide icon (e.g., "Clock", "MapPin")
 * @param fallback - Fallback icon to use if iconName is not found (default: Calendar)
 * @returns Lucide icon component
 */
export const getIconComponent = (iconName?: string, fallback: keyof typeof LucideIcons = "Calendar") => {
  if (!iconName) return LucideIcons[fallback];
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons[fallback];
};
