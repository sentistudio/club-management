import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, Plus, Clock, BookOpen, EyeOff } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { useTeamVisibility } from "../../contexts/TeamVisibilityContext";
import { useRole } from "../../contexts";
import { getArticlesByTeam, ARTICLE_CATEGORY_LABELS, type ArticleCategory } from "../../data/mockArticles";

type CategoryFilter = "all" | ArticleCategory;

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  tactics: "bg-purple-100 text-purple-700",
  fitness: "bg-red-100 text-red-600",
  "team-news": "bg-blue-100 text-blue-700",
  general: "bg-neutral-100 text-neutral-600",
  nutrition: "bg-emerald-100 text-emerald-700"
};

export function TeamKnowledge() {
  const { teamId } = useParams<{ teamId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";
  const { settings: vis } = useTeamVisibility();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");

  const articles = getArticlesByTeam(teamId!, currentSeason.id, !isCoachOrAdmin);

  const filtered = articles.filter(a => {
    const matchesSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === "all" || a.category === catFilter;
    return matchesSearch && matchesCat;
  });

  const publishedCount = articles.filter(a => a.status === "published").length;
  const draftCount = articles.filter(a => a.status === "draft").length;

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Wissen</h2>
          <p className="text-sm text-neutral-500">
            {publishedCount} Artikel{isCoachOrAdmin && draftCount > 0 ? ` · ${draftCount} Entwürfe` : ""}
          </p>
        </div>
        {isCoachOrAdmin && (
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Artikel erstellen
          </Button>
        )}
      </div>

      {/* Visibility disclaimer */}
      {isCoachOrAdmin && !vis.wissenVisible && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-[10px] text-sm text-amber-800">
          <EyeOff className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>Dieser Bereich ist für Spieler <strong>nicht sichtbar</strong>. <Link to="../settings" className="underline font-medium hover:text-amber-900">In Einstellungen aktivieren →</Link></span>
        </div>
      )}

      {/* Search + category filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Artikel suchen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setCatFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              catFilter === "all"
                ? "bg-teal-600 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-teal-300"
            }`}
          >
            Alle
          </button>
          {Object.entries(ARTICLE_CATEGORY_LABELS).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setCatFilter(k as CategoryFilter)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                catFilter === k
                  ? "bg-teal-600 text-white"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:border-teal-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Article grid */}
      {filtered.length === 0 ? (
        <Card padding="md">
          <div className="text-center py-8">
            <BookOpen className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">Keine Artikel gefunden</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(article => (
            <Link key={article.id} to={`/teams/${teamId}/knowledge/${article.id}`}>
              <Card padding="none" hover className="flex flex-col h-full overflow-hidden">
                {article.coverImageUrl && (
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category]}`}>
                      {ARTICLE_CATEGORY_LABELS[article.category]}
                    </span>
                    {article.status === "draft" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Entwurf</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug flex-1">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTimeMinutes} min
                    </span>
                    {article.publishedAt && (
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
