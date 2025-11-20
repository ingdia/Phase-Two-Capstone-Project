import { Category } from "@/types/glob";

interface CategoriesProps {
  categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <section>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore Topics</h3>

      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`${cat.color} px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-sm`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;
