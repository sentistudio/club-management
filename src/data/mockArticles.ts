export type ArticleCategory = "tactics" | "fitness" | "team-news" | "general" | "nutrition";
export type ArticleStatus = "draft" | "published";

export interface Article {
  id: string;
  teamId?: string;  // undefined = club-level article
  seasonId?: string;
  title: string;
  body: string; // HTML content
  category: ArticleCategory;
  coverImageUrl?: string;
  publishedAt?: string;
  authorId: string;
  status: ArticleStatus;
  readTimeMinutes: number;
}

export const mockArticles: Article[] = [
  // ==========================================
  // 1. HERREN
  // ==========================================
  {
    id: "art_h1_01",
    teamId: "team1",
    seasonId: "s2024_team1",
    title: "Saisonziele 2024/25 — Klassenerhalt als Priorität",
    body: `<p>Mit dem Start der neuen Saison 2024/25 haben wir als Mannschaft gemeinsam unsere Ziele definiert. Unser klares Ziel ist der Klassenerhalt in der Kreisliga A.</p>
<p>Wir werden defensiv kompakter stehen als in der vergangenen Saison. Thomas hat dafür ein neues 4-4-2-System eingeführt, das uns mehr Stabilität gibt. Im ersten Monat haben wir bereits sehen können, dass diese Umstellung funktioniert.</p>
<p><strong>Wichtige Termine für den Herbst:</strong></p>
<ul>
  <li>11. Mai: Heimspiel vs. FC Schwarz-Weiß (Abstiegsduell!)</li>
  <li>25. Mai: Auswärtsspiel bei BV Remscheid</li>
  <li>7. Juni: letzter Spieltag</li>
</ul>
<p>Zählt aufeinander und bleibt fokussiert. Es sind noch 4 Punkte zu holen — das ist machbar.</p>`,
    category: "team-news",
    coverImageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
    publishedAt: "2025-04-20T10:00:00Z",
    authorId: "thomas_mueller",
    status: "published",
    readTimeMinutes: 3
  },
  {
    id: "art_h1_02",
    teamId: "team1",
    seasonId: "s2024_team1",
    title: "Taktik-Analyse: Wie wir das 4-2-3-1 brechen",
    body: `<p>Viele unserer Gegner spielen aktuell im 4-2-3-1 System. In diesem Artikel erkläre ich, wie wir als Team dagegen vorgehen.</p>
<h3>Das Doppel-Sechs unterbrechen</h3>
<p>Das Herzstück des 4-2-3-1 ist das defensive Mittelfeld-Duo. Wir umgehen es durch schnelle vertikale Pässe auf die Zehner-Position oder über die Außenbahn.</p>
<h3>Außenverteidiger herausziehen</h3>
<p>Wenn der Zehner des Gegners tief in den Raum fällt, entsteht Platz auf der Außenbahn. Unsere Außenstürmer sollen diese Tiefenläufe ansagen.</p>
<h3>Umschaltmomente nutzen</h3>
<p>Nach Ballgewinn sofort in die Tiefe: 4-2-3-1 Teams stehen oft sehr hoch und haben Lücken hinter der Abwehr.</p>
<p>Wir werden diese Prinzipien im Training am Dienstag durchgehen.</p>`,
    category: "tactics",
    coverImageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop",
    publishedAt: "2025-04-15T09:00:00Z",
    authorId: "thomas_mueller",
    status: "published",
    readTimeMinutes: 5
  },
  {
    id: "art_h1_03",
    teamId: "team1",
    seasonId: "s2024_team1",
    title: "Ernährungstipps vor dem Spieltag",
    body: `<p>Was ihr am Tag vor dem Spiel esst, beeinflusst eure Leistung erheblich. Hier sind unsere Empfehlungen:</p>
<h3>Abend vor dem Spiel</h3>
<p>Kohlenhydratreiche Mahlzeit: Pasta, Reis oder Kartoffeln. Wenig Fett, kein Alkohol. Früh ins Bett.</p>
<h3>Spieltag-Frühstück</h3>
<p>2-3 Stunden vor dem Spiel: Haferflocken mit Banane, Toast mit Honig, Orangensaft. Kein schweres Essen.</p>
<h3>Kurz vor dem Anpfiff</h3>
<p>Kleiner Snack 30-45 Minuten vorher: Banane, Energieriegel (kein Schokolade). Ausreichend Wasser trinken.</p>
<h3>Nach dem Spiel</h3>
<p>Regeneration: Innerhalb von 30 Minuten Kohlenhydrate + Protein. Smoothie, Joghurt, Protein-Shake.</p>`,
    category: "nutrition",
    coverImageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop",
    publishedAt: "2025-03-10T10:00:00Z",
    authorId: "thomas_mueller",
    status: "published",
    readTimeMinutes: 4
  },
  {
    id: "art_h1_04",
    teamId: "team1",
    seasonId: "s2024_team1",
    title: "Wintervorbereitung: Trainingslager-Rückblick",
    body: `<p>Drei Tage Trainingslager in Köln — und es hat sich gelohnt. Hier ist unser Rückblick.</p>
<p>Wir haben in dieser Zeit 2 Testspiele absolviert und taktisch intensiv gearbeitet. Die Fitness der Mannschaft ist auf einem guten Level. Besonders gefreut hat uns die Leistung der jüngeren Spieler — Simon und Lukas haben sich sehr gut eingebracht.</p>
<p>Das neue Pressing-System hat beim zweiten Testspiel bereits sehr gut funktioniert. Wir haben den Ball in der eigenen Hälfte schnell zurückerobert und daraus 2 Treffer erzielt.</p>`,
    category: "team-news",
    coverImageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=400&fit=crop",
    publishedAt: "2025-01-20T11:00:00Z",
    authorId: "thomas_mueller",
    status: "published",
    readTimeMinutes: 3
  },

  // ==========================================
  // TEAM_U12
  // ==========================================
  {
    id: "art_u12_01",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    title: "Neues in der U12: Die Saison 2024/25 hat begonnen!",
    body: `<p>Hallo Kicker! Die neue Saison ist gestartet und wir freuen uns auf tolle Spiele mit euch.</p>
<p>Wir trainieren weiterhin <strong>Mittwoch und Freitag von 17:00 bis 18:30 Uhr</strong> auf Sportplatz 2. Bitte bringt immer eure Schienbeinschoner mit!</p>
<p>In dieser Saison werden wir an 12 Punktspielen teilnehmen. Unser erstes Heimspiel ist am 17. Mai gegen den FC Bonn U12 — macht alle mit, um eure Mannschaft anzufeuern!</p>
<p>Eine Bitte an die Eltern: Meldet Abwesenheiten bitte immer mindestens 24 Stunden vorher beim Trainer Marco ab.</p>`,
    category: "team-news",
    coverImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=400&fit=crop",
    publishedAt: "2024-08-25T10:00:00Z",
    authorId: "coach_marco",
    status: "published",
    readTimeMinutes: 2
  },
  {
    id: "art_u12_02",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    title: "Spielbericht: Heimsieg gegen SV Bochum U12 (3:1)",
    body: `<p>Was für ein tolles Heimspiel! Die U12 hat den SV Bochum mit 3:1 besiegt — herzlichen Glückwunsch!</p>
<p>Noah traf doppelt und zeigte eine sehr reife Leistung. Max spielte im Mittelfeld überragend und bereitete alle 3 Tore vor. Auch der Torwart Luca hielt in der zweiten Halbzeit einen wichtigen Schuss.</p>
<p>Besonders stolz bin ich auf unser Defensivverhalten. Wir haben sehr kompakt gestanden und die Räume gut zugemacht.</p>
<p>Torschützen: Noah (2x), Sophie (1x)</p>
<p>Weiter so! Nächstes Spiel: 03. Mai bei TV Lich.</p>`,
    category: "team-news",
    coverImageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop",
    publishedAt: "2025-04-13T18:00:00Z",
    authorId: "coach_marco",
    status: "published",
    readTimeMinutes: 2
  },
  {
    id: "art_u12_03",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    title: "Tipp des Monats: Richtig Bälle spielen",
    body: `<p>Diesen Monat widmen wir uns einem wichtigen technischen Grundelement: der sauberen Ballmitnahme.</p>
<h3>Warum ist das wichtig?</h3>
<p>Die erste Berührung entscheidet alles. Wer den Ball gut mitnimmt, hat mehr Zeit für den nächsten Spielzug und setzt sich weniger Druck aus.</p>
<h3>3 Regeln für eine gute erste Berührung:</h3>
<ol>
  <li><strong>Früh zum Ball bewegen</strong> — Lauft dem Ball entgegen, wartet nicht!</li>
  <li><strong>Fuß weich machen</strong> — Den Fuß beim Kontakt leicht zurückziehen, um den Ball zu dämpfen.</li>
  <li><strong>In Spielrichtung mitnehmen</strong> — Nehmt den Ball direkt in die Richtung mit, wo ihr hinwollt.</li>
</ol>
<p>Übt das zu Hause mit einer Wand — 10 Minuten am Tag machen einen riesigen Unterschied!</p>`,
    category: "tactics",
    publishedAt: "2025-03-01T10:00:00Z",
    authorId: "coach_marco",
    status: "published",
    readTimeMinutes: 3
  },
  {
    id: "art_u12_04",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    title: "Elterninformation: Turnier am 14. Juni",
    body: `<p>Liebe Eltern, wir nehmen dieses Jahr am Pfingstturnier des FC Lünen teil. Hier alle Infos:</p>
<ul>
  <li><strong>Datum:</strong> 14. Juni 2025</li>
  <li><strong>Ort:</strong> Sportanlage FC Lünen, Lünen</li>
  <li><strong>Abfahrt:</strong> 08:00 Uhr am Vereinsheim</li>
  <li><strong>Rückkehr:</strong> ca. 17:00 Uhr</li>
  <li><strong>Kosten:</strong> 10 Euro (inkl. Verpflegung)</li>
</ul>
<p>Bitte bis zum 31. Mai anmelden. Eltern, die mitfahren und helfen möchten, sind herzlich willkommen!</p>`,
    category: "general",
    publishedAt: "2025-04-28T10:00:00Z",
    authorId: "coach_marco",
    status: "published",
    readTimeMinutes: 2
  },

  // ==========================================
  // CLUB-LEVEL (no teamId)
  // ==========================================
  {
    id: "art_club_01",
    title: "Trainingsleitfaden 2024/25",
    body: `<p>Der Vereinsvorstand hat gemeinsam mit allen Trainern einen einheitlichen Trainingsleitfaden für die Saison 2024/25 erarbeitet. Dieser gilt als Orientierung für alle Mannschaften des Vereins.</p>
<h3>Grundsätze</h3>
<ul>
<li>Jede Trainingseinheit beginnt mit einem strukturierten Aufwärmprogramm (min. 15 Minuten)</li>
<li>Taktische Einheiten werden mit Videomaterial vorbereitet</li>
<li>Spieler im Alter von unter 14 Jahren erhalten mindestens 60 % Spielzeit pro Spiel</li>
</ul>
<h3>Belastungssteuerung</h3>
<p>Für alle Altersgruppen gilt: Die Trainingsbelastung wird nach dem RPE-Modell (Rate of Perceived Exertion) dokumentiert. Trainer tragen die Werte wöchentlich in das System ein.</p>
<p>Bei Verletzungen oder Beschwerden ist der Vereinsarzt Dr. Fischer (verfügbar Di + Do 17–19 Uhr) zu konsultieren.</p>`,
    category: "tactics",
    publishedAt: "2024-09-01T08:00:00Z",
    authorId: "thomas_mueller",
    status: "published",
    readTimeMinutes: 4
  },
  {
    id: "art_club_02",
    title: "Verhaltenskodex — Gemeinsam für den Verein",
    body: `<p>Als Mitglied des SFB verpflichten sich alle Spielerinnen, Spieler, Trainer und Betreuer zu einem fairen und respektvollen Umgang miteinander und mit dem Gegner.</p>
<h3>Unsere Werte</h3>
<ul>
<li><strong>Respekt:</strong> Gegenüber Schiedsrichtern, Gegnern und dem eigenen Team</li>
<li><strong>Verlässlichkeit:</strong> Pünktlichkeit beim Training und bei Spielen, rechtzeitige Abmeldung bei Verhinderung</li>
<li><strong>Fairness:</strong> Kein Foulspiel mit Verletzungsabsicht, keine verbalen Angriffe</li>
<li><strong>Teamgeist:</strong> Der Verein steht über dem Einzelnen</li>
</ul>
<h3>Konsequenzen</h3>
<p>Verstöße gegen den Verhaltenskodex werden durch den Vereinsvorstand geprüft und können zu einer Spielsperre oder einem Vereinsausschluss führen.</p>`,
    category: "general",
    publishedAt: "2024-08-15T08:00:00Z",
    authorId: "thomas_mueller",
    status: "published",
    readTimeMinutes: 3
  },

  // Next season draft articles — team1
  {
    id: "art_h1_next01",
    teamId: "team1",
    seasonId: "s2025_team1",
    title: "Kaderplanung 2025/26 — erster Überblick",
    body: `<p>Die Planungen für die Saison 2025/26 laufen bereits auf Hochtouren. Hier ein erster Überblick über den Stand.</p>
<h3>Neuzugänge</h3>
<p>Mit Marc Dietrich (bisher FC Meiderich) haben wir einen schnellen Mittelstürmer verpflichtet, der uns im Angriff mehr Tiefe gibt. Marc bringt Kreisliga-Erfahrung mit und passt gut in unser System.</p>
<h3>Saisonziel</h3>
<p>Unser Ziel für 2025/26: Mittelfeldplatz konsolidieren und die Jugendarbeit stärker mit der Ersten verzahnen. Konkret planen wir, zwei U19-Spieler fest in den Kader zu integrieren.</p>
<p><em>Dieser Artikel ist noch ein Entwurf — wird vor Saisonbeginn veröffentlicht.</em></p>`,
    category: "team-news" as const,
    authorId: "thomas_mueller",
    status: "draft" as const,
    readTimeMinutes: 3
  },
  // Next season draft articles — team_u12
  {
    id: "art_u12_next01",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    title: "Vorschau Saison 2025/26 — was erwartet euch?",
    body: `<p>Die Saison 2024/25 neigt sich dem Ende — und wir schauen schon gespannt auf 2025/26!</p>
<h3>Neue Gesichter</h3>
<p>Emma und Tim werden ab Sommer Teil der U12. Wir freuen uns auf die beiden!</p>
<h3>Neue Trainingszeiten</h3>
<p>Ab September trainieren wir <strong>Dienstag und Donnerstag von 17:00 bis 18:30 Uhr</strong>. Der Freitag-Slot entfällt.</p>
<h3>Unser Saisonziel</h3>
<p>Platz 3 oder besser in der Kreisliga. Und vor allem: Spaß haben und weiter verbessern!</p>`,
    category: "team-news" as const,
    authorId: "coach_marco",
    status: "draft" as const,
    readTimeMinutes: 2
  }
];

export function getArticlesByTeam(teamId: string, seasonId = "s2024", publishedOnly = false): Article[] {
  return mockArticles.filter(
    a => a.teamId === teamId && a.seasonId === seasonId && (!publishedOnly || a.status === "published")
  );
}

export function getClubArticles(publishedOnly = false): Article[] {
  return mockArticles.filter(a => !a.teamId && (!publishedOnly || a.status === "published"));
}

export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategory, string> = {
  tactics: "Taktik",
  fitness: "Fitness",
  "team-news": "Neuigkeiten",
  general: "Allgemein",
  nutrition: "Ernährung"
};
