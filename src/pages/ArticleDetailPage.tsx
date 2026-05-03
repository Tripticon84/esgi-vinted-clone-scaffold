import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { getConditionClass, getConditionLabel } from "../lib/condition";
import { getCategoryLabel } from "../lib/category";
import { useFavoritesQuery } from "../hooks/useFavorites";
import FavoriteButton from "../components/FavoriteButton";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { data: favorites } = useFavoritesQuery();

  if (!id) {
    return <h1>Article non trouvé</h1>;
  }

  const {
    data: article,
    isError,
    isLoading,
    error,
  } = useQuery<Article, Error>({
    queryKey: ["articles", id],
    queryFn: () => api.get<Article>(`/api/articles/${id}`),
  });

  const isFavorite = !!favorites?.find((fav) => fav.id === id);

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (isError) {
    return <p>Erreur : {error.message}</p>;
  }

  if (!article) {
    return <h1>Article non trouvé</h1>;
  }

  return (
    <>
      <Link
        className="mb-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-700"
        to="/"
      >
        Retour au catalogue
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-4">Détail d'un article</h1>
      <h2 className="text-2xl font-semi-bold mt-4 flex items-center justify-between">
        {article.title}
        <FavoriteButton articleId={article.id} isFavorite={isFavorite} />
      </h2>
      <div className="mx-auto mt-4 mb-4">
        <img
          className="w-full h-132 object-cover rounded-lg "
          src={article.imageUrl}
          alt={article.title}
        />
        <h3 className="text-xl text-gray-600 mt-2 ms-4">
          Vendu par : {article.userName}
          <br />
          Mise en vente le :{" "}
          {new Date(article.createdAt).toLocaleDateString("fr-FR")}
        </h3>

        <div className="mt-4">
          <div className="text-right">
            <h3 className="text-2xl font-bold text-teal-100 rounded-lg p-2 bg-green-400 inline-block">
              {article.price.toFixed(2)} €
            </h3>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold mt-4">Description</h3>
          <p className="ms-4">{article.description}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold mt-4">Condition</h3>
          <p className={`ms-4 ${getConditionClass(article.condition)}`}>
            {getConditionLabel(article.condition)}
          </p>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold mt-4">Taille</h3>
          <p className="ms-4">{article.size}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold mt-4">Catégorie</h3>
          <p className="ms-4">{getCategoryLabel(article.category)}</p>
        </div>
      </div>
    </>
  );
}
