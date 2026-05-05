import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../services/api";

type DeleteButtonProps = {
  articleId: string;
};

export default function DeleteButton({ articleId }: DeleteButtonProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteArticle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      return;
    }

    setIsLoading(true);
    try {
      await api.delete(`/api/articles/${articleId}`);
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDeleteArticle}
      disabled={isLoading}
      className={`p-2 rounded-md transition-colors bg-red-500 text-white hover:bg-red-600 ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? "Suppression..." : "Supprimer"}
    </button>
  );
}
