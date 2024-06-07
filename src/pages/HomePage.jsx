import { Search } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import { getRandomColor } from "../lib/utils";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = async (searchQuery) => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const res = await fetch(
        `https://api.edamam.com/api/recipes/v2/?app_id=bbe72de1&app_key=9783aad1206ead26be87532d02d1e3e8&q=${searchQuery}&type=public`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await res.json();
      setRecipes(data.hits);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes("momos");
  }, []);

  const handleSearchRecipe = (e) => {
    e.preventDefault();
    const query = e.target[0].value.trim();
    if (query) {
      fetchRecipes(query);
    }
  };

  return (
    <div className="bg-[#faf9fb] p-10 flex-1">
      <div className="max-w-screen-lg mx-auto">
        <form onSubmit={handleSearchRecipe}>
          <label className="input shadow-md flex items-center gap-2">
            <Search size={"24"} />
            <input
              type="text"
              className="text-sm md:text-md grow"
              placeholder="What do you want to cook today?"
            />
          </label>
        </form>

        <h1 className="font-bold text-3xl md:text-5xl mt-4">
          Recommended Recipes
        </h1>
        <p className="text-slate-500 font-semibold ml-1 my-2 text-sm tracking-tight">
          Popular choices
        </p>

        {error && <div className="text-red-500">Error: {error}</div>}

        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            recipes.length > 0 &&
            recipes.map(({ recipe }, index) => (
              <RecipeCard key={index} recipe={recipe} {...getRandomColor()} />
            ))}

          {loading &&
            [...Array(9)].map((_, index) => (
              <div key={index} className="flex flex-col gap-4 w-full">
                <div className="skeleton h-32 w-full"></div>
                <div className="flex justify-between">
                  <div className="skeleton h-4 w-28"></div>
                  <div className="skeleton h-4 w-24"></div>
                </div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            ))}

          {!loading && recipes.length === 0 && !error && (
            <p className="text-center text-slate-500 col-span-full">
              No recipes found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
