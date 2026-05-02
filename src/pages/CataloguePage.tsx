import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ArticleCard from "../components/ArticleCard";
import { api } from "../services/api";
import { CATEGORIES, CONDITIONS, type Article } from "../types/article";

type ArticleFilters = {
  search: string;
  category: string;
  condition: string;
  priceMin: string;
  priceMax: string;
  sort: SortOption;
};

type SortOption = "date_desc" | "price_asc" | "price_desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date_desc", label: "Plus récent" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

const FILTER_FIELD_CLASS =
  "h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

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

  if (filters.priceMin) {
    params.set("priceMin", filters.priceMin);
  }

  if (filters.priceMax) {
    params.set("priceMax", filters.priceMax);
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  const queryString = params.toString();

  return queryString ? `/api/articles?${queryString}` : "/api/articles";
}

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState<SortOption>("date_desc");

  const filters: ArticleFilters = {
    search: search.trim(),
    category,
    condition,
    priceMin,
    priceMax,
    sort,
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

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
        <label className="min-w-0 space-y-1 text-sm font-medium text-gray-700 sm:col-span-2 lg:col-span-2">
          <span>Recherche</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un article"
            className={FILTER_FIELD_CLASS}
          />
        </label>

        <label className="min-w-0 space-y-1 text-sm font-medium text-gray-700 lg:col-span-2">
          <span>Catégorie</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={FILTER_FIELD_CLASS}
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((availableCategory) => (
              <option key={availableCategory.id} value={availableCategory.id}>
                {availableCategory.label}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0 space-y-1 text-sm font-medium text-gray-700 lg:col-span-2">
          <span>État</span>
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className={FILTER_FIELD_CLASS}
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

        <label className="min-w-0 space-y-1 text-sm font-medium text-gray-700 lg:col-span-2">
          <span>Prix min</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={priceMin}
            onChange={(event) => {
              const value = event.target.value;
              setPriceMin(value === "" ? "" : String(Math.max(0, Number(value))));
            }}
            placeholder="0"
            className={FILTER_FIELD_CLASS}
          />
        </label>

        <label className="min-w-0 space-y-1 text-sm font-medium text-gray-700 lg:col-span-2">
          <span>Prix max</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={priceMax}
            onChange={(event) => {
              const value = event.target.value;
              setPriceMax(value === "" ? "" : String(Math.max(0, Number(value))));
            }}
            placeholder="100"
            className={FILTER_FIELD_CLASS}
          />
        </label>

        <label className="min-w-0 space-y-1 text-sm font-medium text-gray-700 lg:col-span-2">
          <span>Tri</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className={FILTER_FIELD_CLASS}
          >
            {SORT_OPTIONS.map((sortOption) => (
              <option key={sortOption.value} value={sortOption.value}>
                {sortOption.label}
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

          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
