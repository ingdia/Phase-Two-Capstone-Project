import { TrendingUp } from "lucide-react";

const TrendingStories: React.FC = () => {
  const items: string[] = [
    "Top 10 Writing Tips for Beginners",
    "Digital Publishing Trends 2025",
    "How to Build Your Personal Brand",
    "The Future of AI in Writing",
  ];

  return (
    <div className="bg-gradient-to-br from-pink-900 to-black p-6 rounded-2xl shadow-lg text-white">
      <h4 className="font-bold mb-4 text-lg flex items-center gap-2">
        <TrendingUp className="w-5 h-5" /> Trending Now
      </h4>

      <ul className="flex flex-col gap-3 text-sm">
        {items.map((item, i) => (
          <li
            key={i}
            className="cursor-pointer hover:translate-x-1 transition flex items-start gap-2"
          >
            <span className="font-bold text-white/60">{`0${i + 1}`}</span>
            <span className="hover:underline">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingStories;
