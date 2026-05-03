import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../services/api";

type FavoriteButtonProps = {
  articleId: string;
  isFavorite: boolean;
};

const Colors = {
  favorite: "bg-red-500 text-white hover:bg-red-600",
  notFavorite: "bg-gray-200 text-gray-700 hover:bg-gray-300",
};

export default function FavoriteButton({
  articleId,
  isFavorite,
}: FavoriteButtonProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    try {
      if (isFavorite) {
        await api.delete(`/api/favorites/${articleId}`);
      } else {
        await api.post(`/api/favorites/${articleId}`, {});
      }
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } catch (error) {
      console.error("Erreur lors de la modification du favori :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-md transition-colors ${
        isFavorite ? Colors.favorite : Colors.notFavorite
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      Favoris {isFavorite ? " ♥ " : " ♡ "}
    </button>
  );
}
