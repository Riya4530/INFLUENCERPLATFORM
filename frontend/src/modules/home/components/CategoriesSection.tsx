const categories = [
  "Food",
  "Fashion",
  "Travel",
  "Tech",
  "Fitness",
  "Lifestyle",
];

export default function CategoriesSection() {
  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold mb-4">
            Explore Categories
          </h2>

          <p className="text-gray-600 text-lg">
            Discover creators from every niche.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category}
              className="group border border-gray-200 rounded-3xl p-10 text-center hover:bg-black hover:text-white hover:-translate-y-2 transition duration-300 shadow-sm hover:shadow-2xl"
            >
              <h3 className="text-3xl font-bold mb-3">
                {category}
              </h3>

              <p className="text-sm opacity-70">
                Explore top {category.toLowerCase()} creators.
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}