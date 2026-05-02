import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ArticleCard from "../components/ArticleCard";
import { api } from "../services/api";
import { CATEGORIES, CONDITIONS, type Article } from "../types/article";

type ArticleFilters = {
  search: string;
  category: string;
  condition: string;
};

function buildArticlesPath(filters: ArticleFilters) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.condition) {
    params.set("condition", filters.condition);
  }

  const queryString = params.toString();

  return queryString ? `/api/articles?${queryString}` : "/api/articles";
}

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  const filters: ArticleFilters = {
    search: search.trim(),
    category,
    condition,
  };

  const {
    data: articles,
    isError,
    isLoading,
    error,
  } = useQuery<Article[], Error>({
    queryKey: ["articles", filters],
    queryFn: () => api.get<Article[]>(buildArticlesPath(filters)),
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Catalogue</h1>
        <p className="mt-1 text-sm text-gray-500">
          Trouvez les articles disponibles dans le catalogue.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="space-y-1 text-sm font-medium text-gray-700">
          <span>Recherche</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un article"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-gray-700">
          <span>Catégorie</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((availableCategory) => (
              <option key={availableCategory.id} value={availableCategory.id}>
                {availableCategory.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm font-medium text-gray-700">
          <span>État</span>
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          >
            <option value="">Tous les états</option>
            {CONDITIONS.map((availableCondition) => (
              <option
                key={availableCondition.value}
                value={availableCondition.value}
              >
                {availableCondition.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading ? (
        <p className="text-gray-600">Chargement des articles...</p>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{error.message}</p>
        </div>
      ) : null}

      {!isLoading && !isError && articles?.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">
          Aucun article ne correspond à ces filtres.
        </p>
      ) : null}

      {!isLoading && !isError && articles && articles.length > 0 ? (
        <>
          <p className="text-sm text-gray-500">
            {articles.length} article{articles.length > 1 ? "s" : ""} trouvé
            {articles.length > 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
