import { useQuery } from "@tanstack/react-query";
import { getUserId } from "../lib/userId";
import { api } from "../services/api";
import type { Article } from "../types/article";
import ArticleCard from "../components/ArticleCard";
import DeleteButton from "../components/DeleteButton";
import { Link } from "react-router-dom";

export default function MyArticlesPage() {
  const id = getUserId();

  if (!id) {
    return <h1>Erreur utilisateur</h1>;
  }

  const {
    data: articles,
    isError,
    isLoading,
    error,
  } = useQuery<Article[], Error>({
    queryKey: ["articles", id],
    queryFn: () => api.get<Article[]>(`/api/users/${id}/articles`),
  });

  if (isLoading) {
    return <h1>Chargement...</h1>;
  }

  if (isError) {
    return <h1>Erreur : {error?.message}</h1>;
  }

  return (
    <div>
      <h1>Mes annonces</h1>
      {articles && articles.length > 0 ? (
        <>
          <p className="text-sm text-gray-500">
            {articles.length} article{articles.length > 1 ? "s" : ""} trouvé
            {articles.length > 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <>
                <ArticleCard key={article.id} article={article} />
                <DeleteButton articleId={article.id} />
              </>
            ))}
          </div>
        </>
      ) : (
        <>
          <p>Aucune annonce trouvée.</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-700"
          >
            Parcourir le catalogue
          </Link>
        </>
      )}
    </div>
  );
}
