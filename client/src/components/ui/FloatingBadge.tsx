import React from "react";

interface FloatingBadgeProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  dotColor?: string;
  className?: string;
}

const FloatingBadge = ({
  icon,
  title,
  subtitle,
  dotColor,
  className,
}: FloatingBadgeProps) => {
  return (
    <div
      className={`bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/50 ${className || ""}`}
    >
      {icon && (
        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          {icon}
        </div>
      )}
      {dotColor && <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>}
      <div>
        <p className="text-sm font-bold text-gray-800">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
};

export default FloatingBadge;
