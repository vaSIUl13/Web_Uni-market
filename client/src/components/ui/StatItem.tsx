import React from "react";

interface StatItemProps {
  icon: React.ReactNode;
  text: string;
}

const StatItem = ({ icon, text }: StatItemProps) => {
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
      <span className="text-[#3b63f6]">{icon}</span>
      {text}
    </div>
  );
};

export default StatItem;
