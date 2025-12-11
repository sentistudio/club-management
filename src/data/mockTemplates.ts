// ========= MESSAGE TEMPLATES =========

export interface MessageTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  category?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
}

export const mockTemplates: MessageTemplate[] = [
  {
    id: "tpl_1",
    name: "Begrüßung",
    content: "Vielen Dank für Ihre Nachricht.\n\nWir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.\n\nMit freundlichen Grüßen,\nIhr Vereinsteam",
    category: "general",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    createdBy: "p1",
    usageCount: 45
  },
  {
    id: "tpl_2",
    name: "Dokumente angefordert",
    content: "Guten Tag,\n\nfür die Bearbeitung Ihrer Anfrage benötigen wir noch folgende Unterlagen:\n\n- [Dokument 1]\n- [Dokument 2]\n\nBitte laden Sie diese hier hoch oder bringen Sie sie in der Geschäftsstelle vorbei.\n\nMit freundlichen Grüßen,\nIhr Vereinsteam",
    category: "documents",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    createdBy: "p1",
    usageCount: 32
  },
  {
    id: "tpl_3",
    name: "Beitragsfrage beantwortet",
    content: "Guten Tag,\n\nvielen Dank für Ihre Anfrage bezüglich Ihres Beitrags.\n\n[Erklärung hier einfügen]\n\nBei weiteren Fragen stehen wir Ihnen gerne zur Verfügung.\n\nMit freundlichen Grüßen,\nIhr Vereinsteam",
    category: "fee_question",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    createdBy: "p1",
    usageCount: 28
  },
  {
    id: "tpl_4",
    name: "Ticket gelöst",
    content: "Guten Tag,\n\nIhre Anfrage wurde bearbeitet und das Ticket wurde geschlossen.\n\nSollten Sie weitere Fragen haben, können Sie jederzeit ein neues Ticket erstellen oder auf diese Nachricht antworten.\n\nMit freundlichen Grüßen,\nIhr Vereinsteam",
    category: "general",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    createdBy: "p1",
    usageCount: 56
  },
  {
    id: "tpl_5",
    name: "Weiterleitung",
    content: "Guten Tag,\n\nIhre Anfrage wurde an die zuständige Abteilung weitergeleitet. Ein Kollege wird sich in Kürze bei Ihnen melden.\n\nMit freundlichen Grüßen,\nIhr Vereinsteam",
    category: "general",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    createdBy: "p1",
    usageCount: 19
  },
  {
    id: "tpl_6",
    name: "Spielerpass Info",
    content: "Guten Tag,\n\nfür die Beantragung eines Spielerpasses benötigen wir:\n\n1. Kopie des Personalausweises (Vorder- und Rückseite)\n2. Aktuelles Passfoto (biometrisch)\n3. Unterschriebene Einverständniserklärung\n\nDie Bearbeitung dauert in der Regel 2-3 Wochen.\n\nMit freundlichen Grüßen,\nIhr Vereinsteam",
    category: "documents",
    isDefault: true,
    createdAt: "2024-01-15T00:00:00",
    updatedAt: "2024-01-15T00:00:00",
    createdBy: "p1",
    usageCount: 15
  },
  {
    id: "tpl_7",
    name: "SEPA-Mandat Änderung",
    content: "Guten Tag,\n\nfür die Änderung Ihres SEPA-Mandats benötigen wir bitte:\n\n- Neues unterschriebenes SEPA-Lastschriftmandat (Formular anbei)\n- IBAN des neuen Kontos\n\nBitte senden Sie uns die Unterlagen zu oder geben Sie sie in der Geschäftsstelle ab.\n\nMit freundlichen Grüßen,\nIhr Vereinsteam",
    category: "fee_question",
    isDefault: true,
    createdAt: "2024-01-20T00:00:00",
    updatedAt: "2024-01-20T00:00:00",
    createdBy: "p1",
    usageCount: 12
  }
];

// Helper functions
export function getTemplatesByCategory(category?: string): MessageTemplate[] {
  if (!category) return mockTemplates;
  return mockTemplates.filter(t => t.category === category || !t.category);
}

export function getDefaultTemplates(): MessageTemplate[] {
  return mockTemplates.filter(t => t.isDefault);
}

export function getMostUsedTemplates(limit: number = 5): MessageTemplate[] {
  return [...mockTemplates]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

