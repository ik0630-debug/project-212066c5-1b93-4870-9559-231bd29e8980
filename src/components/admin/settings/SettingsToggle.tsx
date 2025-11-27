import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
}

export const SettingsToggle = ({ 
  label, 
  description, 
  checked, 
  onCheckedChange,
  id 
}: SettingsToggleProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};
