interface HeroImageProps {
  imageUrl: string;
  alt?: string;
  overlayOpacity?: string;
  enabled?: boolean;
}

export const HeroImage = ({ 
  imageUrl, 
  alt = "Hero image", 
  overlayOpacity = "0",
  enabled = true 
}: HeroImageProps) => {
  if (!enabled || !imageUrl) return null;

  return (
    <div className="relative w-full -mt-4">
      <div 
        className="absolute inset-0 bg-gradient-hero z-10 pointer-events-none" 
        style={{ opacity: parseInt(overlayOpacity || "0") / 100 }}
      />
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-auto object-contain"
      />
    </div>
  );
};
