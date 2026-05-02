import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, CONDITIONS, type Article } from "../types/article";

type ArticleCardProps = {
  article: Article;
  actions?: ReactNode;
};

const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function getCategoryLabel(categoryId: string) {
  return CATEGORIES.find((category) => category.id === categoryId)?.label;
}

function getConditionLabel(conditionValue: string) {
  return CONDITIONS.find((condition) => condition.value === conditionValue)
    ?.label;
}

export default function ArticleCard({ article, actions }: ArticleCardProps) {
  const categoryLabel = getCategoryLabel(article.category) ?? article.category;
  const conditionLabel =
    getConditionLabel(article.condition) ?? article.condition;

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to={`/articles/${article.id}`}
        className="flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          loading="lazy"
          className="block aspect-4/3 w-full max-w-full object-cover"
        />
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0 space-y-1">
            <h2 className="line-clamp-2 text-base font-semibold text-gray-900">
              {article.title}
            </h2>
            <p className="text-lg font-bold text-teal-700">
              {euroFormatter.format(article.price)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-teal-700">
              {categoryLabel}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
              {conditionLabel}
            </span>
          </div>

          <p className="mt-auto truncate text-sm text-gray-500">
            Vendu par {article.userName}
          </p>
        </div>
      </Link>

      {actions ? (
        <div className="border-t border-gray-100 px-4 py-3">{actions}</div>
      ) : null}
    </article>
  );
}
