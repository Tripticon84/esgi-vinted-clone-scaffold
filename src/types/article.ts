export type Article = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  size: string;
  condition: string;
  imageUrl: string;
  userName: string;
  userId: string;
  createdAt: string;
};

export type ArticleFormData = Omit<
  Article,
  "id" | "userId" | "userName" | "createdAt"
>;

export type Category = {
  id: string;
  label: string;
};

export type Condition = {
  value: string;
  label: string;
  class: string;
};

export const CATEGORIES: Category[] = [
  { id: "tops", label: "Hauts" },
  { id: "bottoms", label: "Bas" },
  { id: "shoes", label: "Chaussures" },
  { id: "coats", label: "Manteaux" },
  { id: "accessories", label: "Accessoires" },
  { id: "sportswear", label: "Sportswear" },
];

export const CONDITIONS: Condition[] = [
  {
    value: "neuf_avec_etiquette",
    label: "Neuf avec étiquette",
    class: "text-green-500",
  },
  {
    value: "neuf_sans_etiquette",
    label: "Neuf sans étiquette",
    class: "text-blue-500",
  },
  {
    value: "tres_bon_etat",
    label: "Très bon état",
    class: "text-yellow-500",
  },
  {
    value: "bon_etat",
    label: "Bon état",
    class: "text-orange-500",
  },
  {
    value: "satisfaisant",
    label: "Satisfaisant",
    class: "text-red-500",
  },
];
