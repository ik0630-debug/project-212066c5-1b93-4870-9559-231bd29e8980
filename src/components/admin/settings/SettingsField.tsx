import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface SettingsFieldProps {
  label: string;
  htmlFor?: string;
  description?: string;
  children: ReactNode;
}

export const SettingsField = ({ label, htmlFor, description, children }: SettingsFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
