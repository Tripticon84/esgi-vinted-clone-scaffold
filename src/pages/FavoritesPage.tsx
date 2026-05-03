import { useFavoritesQuery } from "../hooks/useFavorites";
import { Link } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";

export default function FavoritesPage() {
  const { data: favorites, isError, isLoading, error } = useFavoritesQuery();

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (isError) {
    return <p>Erreur : {error.message}</p>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Mes Favoris</h1>

      {favorites && favorites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Pas encore de favoris ajoutés.</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-700"
          >
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {favorites?.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </>
  );
}
