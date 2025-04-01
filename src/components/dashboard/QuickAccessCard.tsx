
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuickAccessCardProps = {
  title: string;
  icon: ReactNode;
  to: string;
  description?: string;
  className?: string;
}

export const QuickAccessCard = ({
  title,
  icon,
  to,
  description,
  className,
}: QuickAccessCardProps) => {
  return (
    <Link to={to}>
      <Card className={cn("quick-access-card", className)}>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 p-3 bg-primary/10 text-primary rounded-full">
            {icon}
          </div>
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
