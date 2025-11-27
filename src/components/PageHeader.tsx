interface PageHeaderProps {
  title: string;
  description?: string;
  backgroundColor?: string;
}

export const PageHeader = ({ title, description, backgroundColor }: PageHeaderProps) => {
  return (
    <header 
      className={`sticky top-0 z-40 text-primary-foreground py-4 px-6 text-center ${!backgroundColor ? 'bg-gradient-primary' : ''}`}
      style={{ backgroundColor: backgroundColor ? `hsl(${backgroundColor})` : undefined }}
    >
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      {description && (
        <p className="text-primary-foreground/90 text-sm whitespace-pre-line">
          {description}
        </p>
      )}
    </header>
  );
};
