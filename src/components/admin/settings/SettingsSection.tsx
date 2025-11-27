import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export const SettingsSection = ({ title, description, children, action }: SettingsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
