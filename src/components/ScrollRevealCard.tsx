import { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ScrollRevealCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  delay?: number;
  icon?: ReactNode;
  variant?: 'default' | 'elegant';
}

const ScrollRevealCard = ({ title, description, children, delay = 0, icon, variant = 'default' }: ScrollRevealCardProps) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  const baseStyles = variant === 'elegant'
    ? 'bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20 shadow-xl shadow-primary/5'
    : 'bg-card border-2 border-border shadow-lg shadow-black/10';

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        transitionDuration: '500ms',
        transitionDelay: `${delay}ms` 
      }}
    >
      <Card className={`${baseStyles} hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1 text-muted-foreground">{description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        {children && <CardContent>{children}</CardContent>}
      </Card>
    </div>
  );
};

export default ScrollRevealCard;
