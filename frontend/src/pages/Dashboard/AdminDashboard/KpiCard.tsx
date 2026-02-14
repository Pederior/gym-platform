import React from "react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  color = "bg-gray-500",
}) => {
  return (
    <div
      className="
        bg-card border border-border
        rounded-2xl p-6
        shadow-soft dark:shadow-darkSoft
        transition-all duration-300
        hover:scale-[1.02]
      "
    >
      <div className="flex items-center gap-3">
        
        {/* Icon Box */}
        <div
          className={`
            ${color}
            p-3 rounded-xl text-white
            shadow-sm
          `}
        >
          {icon}
        </div>

        {/* Text */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="text-2xl font-bold text-foreground mt-1">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;