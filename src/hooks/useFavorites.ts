import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";

export function useFavoritesQuery() {
  return useQuery<Article[], Error>({
    queryKey: ["favorites"],
    queryFn: () => api.get<Article[]>("/api/favorites"),
  });
}

export function useCheckIsFavorite(articleId: string) {
  const { data: favorites } = useFavoritesQuery();
  if (!favorites) {
    return false;
  }
  return favorites.find((article) => article.id === articleId) !== undefined;
}
