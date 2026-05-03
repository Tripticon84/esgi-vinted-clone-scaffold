import { CATEGORIES } from "../types/article";

export const getCategoryLabel = (categoryId: string): string => {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  return category ? category.label : "";
};
