import { Category } from "@/types/glob";

interface CategoriesProps {
  categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <section>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Explore Topics</h3>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`${cat.color} px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all hover:scale-105 shadow-sm`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;
