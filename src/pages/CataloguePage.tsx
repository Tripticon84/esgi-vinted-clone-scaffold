import { useQuery } from "@tanstack/react-query";
import ArticleCard from "../components/ArticleCard";
import { api } from "../services/api";
import type { Article } from "../types/article";

export default function CataloguePage() {
  const {
    data: articles,
    isError,
    isLoading,
    error,
  } = useQuery<Article[], Error>({
    queryKey: ["articles"],
    queryFn: () => api.get<Article[]>("/api/articles"),
  });

  if (isLoading) {
    return <p className="text-gray-600">Chargement des articles...</p>;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <h1 className="text-xl font-semibold">Catalogue</h1>
        <p className="mt-2">{error.message}</p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Catalogue</h1>
        <p className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">
          Aucun article disponible pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Catalogue</h1>
        <p className="mt-1 text-sm text-gray-500">
          {articles.length} article{articles.length > 1 ? "s" : ""} disponible
          {articles.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
