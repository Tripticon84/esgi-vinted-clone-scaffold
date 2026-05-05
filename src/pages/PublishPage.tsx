import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { CATEGORIES, CONDITIONS, type Article } from "../types/article";

type FormData = {
  title: string;
  description: string;
  price: string;
  category: string;
  size: string;
  condition: string;
  imageUrl: string;
};

const FIELD_CLASS =
  "h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

const LABEL_CLASS = "space-y-1 text-sm font-medium text-gray-700";

const INITIAL_FORM: FormData = {
  title: "",
  description: "",
  price: "",
  category: "",
  size: "",
  condition: "",
  imageUrl: "",
};

export default function PublishPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const { mutate, isPending, error } = useMutation<Article, Error, FormData>({
    mutationFn: (data) =>
      api.post<Article>("/api/articles", {
        ...data,
        price: Number(data.price),
      }),
    onSuccess: (article) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate(`/articles/${article.id}`);
    },
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(form);
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Publier une annonce</h1>
        <p className="mt-1 text-sm text-gray-500">
          Renseignez les informations de votre article pour le mettre en vente.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 rounded-lg border border-gray-200 bg-white p-6 sm:grid-cols-2"
      >
        <label className={`${LABEL_CLASS} sm:col-span-2`}>
          <span>Titre</span>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ex : Veste en jean bleue"
            maxLength={100}
            required
            className={FIELD_CLASS}
          />
        </label>

        <label className={`${LABEL_CLASS} sm:col-span-2`}>
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Décrivez votre article (matière, marque, défauts éventuels…)"
            rows={4}
            maxLength={1000}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 resize-none"
          />
        </label>

        <label className={LABEL_CLASS}>
          <span>Prix (€)</span>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
            className={FIELD_CLASS}
          />
        </label>

        <label className={LABEL_CLASS}>
          <span>Taille</span>
          <input
            type="text"
            name="size"
            value={form.size}
            onChange={handleChange}
            placeholder="Ex : S, M, L, 38, 42…"
            required
            className={FIELD_CLASS}
          />
        </label>

        <label className={LABEL_CLASS}>
          <span>Catégorie</span>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className={FIELD_CLASS}
          >
            <option value="">Choisir une catégorie</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </label>

        <label className={LABEL_CLASS}>
          <span>État</span>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            required
            className={FIELD_CLASS}
          >
            <option value="">Choisir un état</option>
            {CONDITIONS.map((cond) => (
              <option key={cond.value} value={cond.value}>
                {cond.label}
              </option>
            ))}
          </select>
        </label>

        <label className={`${LABEL_CLASS} sm:col-span-2`}>
          <span>Image (URL ou texte)</span>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Ex : https://… ou une description"
            required
            className={FIELD_CLASS}
          />
        </label>

        {error && (
          <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error.message}
          </div>
        )}

        <div className="sm:col-span-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-11 px-5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="h-11 px-6 rounded-lg bg-teal-600 text-sm font-semibold text-white hover:bg-teal-700 transition disabled:opacity-60"
          >
            {isPending ? "Publication…" : "Publier l'annonce"}
          </button>
        </div>
      </form>
    </section>
  );
}
