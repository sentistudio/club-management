import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { useRole } from "../../contexts";
import { getArticlesByTeam, ARTICLE_CATEGORY_LABELS, type ArticleCategory } from "../../data/mockArticles";
import { getPersonDisplay } from "../../data/personHelpers";

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  tactics: "bg-purple-100 text-purple-700",
  fitness: "bg-red-100 text-red-600",
  "team-news": "bg-blue-100 text-blue-700",
  general: "bg-neutral-100 text-neutral-600",
  nutrition: "bg-emerald-100 text-emerald-700"
};

export function ArticleDetail() {
  const { teamId, articleId } = useParams<{ teamId: string; articleId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";

  const articles = getArticlesByTeam(teamId!, currentSeason.id, false);
  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="p-6">
        <p className="text-neutral-400">Artikel nicht gefunden.</p>
        <Link to={`/teams/${teamId}/knowledge`} className="text-teal-600 text-sm mt-2 inline-block">
          ← Zurück zu Wissen
        </Link>
      </div>
    );
  }

  const author = getPersonDisplay(article.authorId);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to={`/teams/${teamId}/knowledge`}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zu Wissen
        </Link>
        {isCoachOrAdmin && (
          <Button variant="secondary" size="sm">Bearbeiten</Button>
        )}
      </div>

      {/* Cover image */}
      {article.coverImageUrl && (
        <div className="rounded-xl overflow-hidden aspect-[16/6]">
          <img src={article.coverImageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <Card padding="md">
        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category]}`}>
            {ARTICLE_CATEGORY_LABELS[article.category]}
          </span>
          {article.status === "draft" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Entwurf</span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 leading-snug mb-4">{article.title}</h1>

        <div className="flex items-center gap-4 text-xs text-neutral-400 pb-5 border-b border-neutral-100 mb-5">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {author.fullName}
          </div>
          {article.publishedAt && (
            <span>
              {new Date(article.publishedAt).toLocaleDateString("de-DE", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {article.readTimeMinutes} Min. Lesezeit
          </div>
        </div>

        {/* Article body (HTML) */}
        <div
          className="prose prose-sm max-w-none text-neutral-700 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-neutral-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-neutral-900"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      </Card>
    </div>
  );
}
