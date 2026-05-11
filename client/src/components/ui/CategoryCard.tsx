interface CategoryCardProps {
  title: string;
  description: string;
  count: string;
  iconEmoji: string;
  themeColor: "blue" | "purple" | "cyan" | "green";
}

const CategoryCard = ({
  title,
  description,
  count,
  iconEmoji,
  themeColor,
}: CategoryCardProps) => {
  const themes = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    cyan: {
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      border: "border-cyan-200",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
    },
  };

  const currentTheme = themes[themeColor];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${currentTheme.bg}`}
      >
        {iconEmoji}
      </div>

      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="mt-auto">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full bg-current`}></span>
          {count}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
