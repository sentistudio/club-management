/**
 * Registrierung (Registration Forms) Page
 * 
 * DEMO STEPS:
 * 1. View list of registration forms
 * 2. Click "Registrierungsformular erstellen" to create new form
 * 3. Follow wizard: Context → Target → Roles → Policies → Questions → Publish
 * 4. Click "Preview" to see the user registration wizard
 * 5. Complete preview to create test person/membership/guardian link
 */

import { useState, useMemo } from "react";
import { 
  Plus, Search, Eye, Edit2, Trash2, Copy,
  ChevronRight, ChevronLeft, X, Check, Globe, Lock,
  Users, User, UserPlus, FileText
} from "lucide-react";
import { Card, Button, Badge } from "../components/ui";
import { usePeople } from "../contexts/PeopleContext";
import { getRoleLabel } from "../data/mockPeople";
import type { 
  RegistrationForm, 
  FormQuestion, 
  IntentTarget, 
  MembershipRole,
  ApprovalPolicy,
  PaymentPolicy,
  QuestionType,
  QuestionScope,
  CreateRegistrationFormData
} from "../types/people";

// ==========================================
// REGISTRATION PAGE
// ==========================================
export function Registration() {
  const { forms, addForm, updateForm, deleteForm, teams, departments } = usePeople();

  const [searchTerm, setSearchTerm] = useState("");
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [editingForm, setEditingForm] = useState<RegistrationForm | null>(null);
  const [previewForm, setPreviewForm] = useState<RegistrationForm | null>(null);

  // Filter forms
  const filteredForms = useMemo(() => {
    if (!searchTerm) return forms;
    const term = searchTerm.toLowerCase();
    return forms.filter(f => 
      f.name.toLowerCase().includes(term) ||
      f.description?.toLowerCase().includes(term)
    );
  }, [forms, searchTerm]);

  const handlePublish = (form: RegistrationForm) => {
    updateForm(form.id, { 
      isPublished: true,
      publicUrl: `/join/public/${form.id}`
    });
  };

  const handleUnpublish = (form: RegistrationForm) => {
    updateForm(form.id, { isPublished: false });
  };

  const handleDelete = (form: RegistrationForm) => {
    if (confirm(`Möchten Sie "${form.name}" wirklich löschen?`)) {
      deleteForm(form.id);
    }
  };

  const copyLink = (form: RegistrationForm) => {
    if (form.publicUrl) {
      navigator.clipboard.writeText(window.location.origin + form.publicUrl);
      alert("Link kopiert!");
    }
  };

  const getTeamName = (teamId?: string) => {
    if (!teamId) return null;
    const team = teams.find(t => t.id === teamId);
    return team?.name;
  };

  const getDepartmentName = (deptId?: string) => {
    if (!deptId) return null;
    const dept = departments.find(d => d.id === deptId);
    return dept?.name;
  };

  const getTargetLabel = (target: IntentTarget) => {
    switch (target) {
      case "self": return "Für mich selbst";
      case "child": return "Für mein Kind";
      case "household": return "Für meine Familie";
      default: return target;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Registrierung</h1>
          <p className="text-slate-500 mt-1">
            {forms.length} Registrierungsformulare
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowFormBuilder(true)}>
          Registrierungsformular erstellen
        </Button>
      </div>

      {/* Search */}
      <Card className="!p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Formulare durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </Card>

      {/* Forms Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredForms.map(form => (
          <Card key={form.id} hover className="relative">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <Badge variant={form.isPublished ? "success" : "default"}>
                {form.isPublished ? (
                  <><Globe className="w-3 h-3 mr-1" /> Öffentlich</>
                ) : (
                  <><Lock className="w-3 h-3 mr-1" /> Entwurf</>
                )}
              </Badge>
            </div>

            {/* Content */}
            <div className="pr-20">
              <h3 className="font-semibold text-slate-800">{form.name}</h3>
              {form.description && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{form.description}</p>
              )}
            </div>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap gap-2">
              {form.teamId && (
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                  {getTeamName(form.teamId)}
                </span>
              )}
              {form.departmentId && !form.teamId && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {getDepartmentName(form.departmentId)}
                </span>
              )}
              {form.allowedTargets.map(t => (
                <span key={t} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                  {getTargetLabel(t)}
                </span>
              ))}
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                {form.allowedRoles.map(r => getRoleLabel(r)).join(", ")}
              </span>
            </div>

            {/* Policies */}
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <span>
                {form.approvalPolicy === "auto" ? "Automatische Genehmigung" : "Admin-Prüfung"}
              </span>
              <span>•</span>
              <span>{form.questions.length} Fragen</span>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setPreviewForm(form)}
              >
                <Eye className="w-4 h-4 mr-1" /> Preview
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setEditingForm(form);
                  setShowFormBuilder(true);
                }}
              >
                <Edit2 className="w-4 h-4 mr-1" /> Bearbeiten
              </Button>
              {form.isPublished ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => copyLink(form)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleUnpublish(form)}>
                    <Lock className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => handlePublish(form)}>
                  <Globe className="w-4 h-4 mr-1" /> Veröffentlichen
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(form)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        {filteredForms.length === 0 && (
          <Card className="col-span-full text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600">Keine Formulare</h3>
            <p className="text-slate-500 mt-1">
              Erstellen Sie Ihr erstes Registrierungsformular
            </p>
            <Button className="mt-4" onClick={() => setShowFormBuilder(true)}>
              <Plus className="w-4 h-4 mr-2" /> Formular erstellen
            </Button>
          </Card>
        )}
      </div>

      {/* Form Builder Modal */}
      {showFormBuilder && (
        <FormBuilderWizard
          initialData={editingForm || undefined}
          onClose={() => {
            setShowFormBuilder(false);
            setEditingForm(null);
          }}
          onSave={(data) => {
            if (editingForm) {
              updateForm(editingForm.id, data);
            } else {
              addForm(data);
            }
            setShowFormBuilder(false);
            setEditingForm(null);
          }}
        />
      )}

      {/* Preview Modal */}
      {previewForm && (
        <RegistrationPreview
          form={previewForm}
          onClose={() => setPreviewForm(null)}
        />
      )}
    </div>
  );
}

// ==========================================
// FORM BUILDER WIZARD
// ==========================================
function FormBuilderWizard({
  initialData,
  onClose,
  onSave
}: {
  initialData?: RegistrationForm;
  onClose: () => void;
  onSave: (data: CreateRegistrationFormData) => void;
}) {
  const { teams, departments, org } = usePeople();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form state
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [selectedDepartment, setSelectedDepartment] = useState(initialData?.departmentId || "");
  const [selectedTeam, setSelectedTeam] = useState(initialData?.teamId || "");
  const [allowedTargets, setAllowedTargets] = useState<IntentTarget[]>(initialData?.allowedTargets || ["self"]);
  const [allowedRoles, setAllowedRoles] = useState<MembershipRole[]>(initialData?.allowedRoles || ["player"]);
  const [approvalPolicy, setApprovalPolicy] = useState<ApprovalPolicy>(initialData?.approvalPolicy || "admin_review");
  const [paymentPolicy, setPaymentPolicy] = useState<PaymentPolicy>(initialData?.paymentPolicy || "none");
  const [guardianRequired, setGuardianRequired] = useState(initialData?.guardianRequiredUnderAge ?? true);
  const [questions, setQuestions] = useState<FormQuestion[]>(initialData?.questions || []);

  const filteredTeams = selectedDepartment 
    ? teams.filter(t => t.departmentId === selectedDepartment)
    : teams;

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      id: `q_${Date.now()}`,
      type: "text",
      label: "",
      required: false,
      scope: "both"
    }]);
  };

  const handleUpdateQuestion = (index: number, data: Partial<FormQuestion>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...data };
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      name,
      description: description || undefined,
      orgId: org.id,
      departmentId: selectedDepartment || undefined,
      teamId: selectedTeam || undefined,
      allowedTargets,
      allowedRoles,
      approvalPolicy,
      paymentPolicy,
      guardianRequiredUnderAge: guardianRequired,
      questions
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.length > 0;
      case 2: return allowedTargets.length > 0;
      case 3: return allowedRoles.length > 0;
      case 4: return true;
      case 5: return questions.every(q => q.label.length > 0);
      case 6: return true;
      default: return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {initialData ? "Formular bearbeiten" : "Registrierungsformular erstellen"}
              </h2>
              <p className="text-slate-500 mt-1">Schritt {step} von {totalSteps}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          {/* Progress */}
          <div className="mt-4 flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i}
                className={`flex-1 h-1 rounded-full ${
                  i < step ? "bg-teal-500" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Grundinformationen</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name des Formulars *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="z.B. U12 Junioren Anmeldung"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Kurze Beschreibung des Formulars..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Abteilung
                </label>
                <select
                  value={selectedDepartment}
                  onChange={e => {
                    setSelectedDepartment(e.target.value);
                    setSelectedTeam("");
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Alle Abteilungen</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Team
                </label>
                <select
                  value={selectedTeam}
                  onChange={e => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Kein spezifisches Team</option>
                  {filteredTeams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Target */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Für wen ist diese Registrierung?</h3>
              <p className="text-sm text-slate-500">Wählen Sie alle zutreffenden Optionen aus. Nutzer können dann bei der Registrierung auswählen.</p>
              <div className="grid gap-3">
                {[
                  { value: "self", icon: User, label: "Für mich selbst", desc: "Der Nutzer meldet sich selbst an" },
                  { value: "child", icon: Users, label: "Für mein Kind", desc: "Ein Elternteil meldet sein Kind an" },
                  { value: "household", icon: UserPlus, label: "Für meine Familie", desc: "Mehrere Familienmitglieder anmelden" }
                ].map(({ value, icon: Icon, label, desc }) => {
                  const isSelected = allowedTargets.includes(value as IntentTarget);
                  return (
                    <label
                      key={value}
                      className={`p-4 border-2 rounded-xl flex items-center gap-4 cursor-pointer transition-all ${
                        isSelected
                          ? "border-teal-500 bg-teal-50" 
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={e => {
                          if (e.target.checked) {
                            setAllowedTargets([...allowedTargets, value as IntentTarget]);
                          } else {
                            setAllowedTargets(allowedTargets.filter(t => t !== value));
                          }
                        }}
                        className="sr-only"
                      />
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{label}</p>
                        <p className="text-sm text-slate-500">{desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? "bg-teal-500 border-teal-500" : "border-slate-300"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Roles */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Welche Rollen können sich registrieren?</h3>
              <div className="grid gap-3">
                {[
                  { value: "player", label: "Spieler", desc: "Aktives Mitglied im Team" },
                  { value: "coach", label: "Trainer", desc: "Trainiert ein oder mehrere Teams" },
                  { value: "guardian_contact", label: "Erziehungsberechtigter", desc: "Elternteil eines Spielers" },
                  { value: "volunteer", label: "Helfer", desc: "Unterstützt bei Veranstaltungen" }
                ].map(({ value, label, desc }) => (
                  <label
                    key={value}
                    className={`p-4 border-2 rounded-xl flex items-center gap-4 cursor-pointer transition-all ${
                      allowedRoles.includes(value as MembershipRole) 
                        ? "border-teal-500 bg-teal-50" 
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={allowedRoles.includes(value as MembershipRole)}
                      onChange={e => {
                        if (e.target.checked) {
                          setAllowedRoles([...allowedRoles, value as MembershipRole]);
                        } else {
                          setAllowedRoles(allowedRoles.filter(r => r !== value));
                        }
                      }}
                      className="w-5 h-5 text-teal-500 rounded focus:ring-teal-500"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{label}</p>
                      <p className="text-sm text-slate-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Policies */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">Einstellungen</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Genehmigung
                </label>
                <div className="grid gap-3">
                  <label className={`p-4 border-2 rounded-xl flex items-center gap-4 cursor-pointer ${
                    approvalPolicy === "auto" ? "border-teal-500 bg-teal-50" : "border-slate-200"
                  }`}>
                    <input
                      type="radio"
                      name="approval"
                      checked={approvalPolicy === "auto"}
                      onChange={() => setApprovalPolicy("auto")}
                      className="w-5 h-5 text-teal-500"
                    />
                    <div>
                      <p className="font-medium text-slate-800">Automatisch genehmigen</p>
                      <p className="text-sm text-slate-500">Mitglieder werden sofort aktiv</p>
                    </div>
                  </label>
                  <label className={`p-4 border-2 rounded-xl flex items-center gap-4 cursor-pointer ${
                    approvalPolicy === "admin_review" ? "border-teal-500 bg-teal-50" : "border-slate-200"
                  }`}>
                    <input
                      type="radio"
                      name="approval"
                      checked={approvalPolicy === "admin_review"}
                      onChange={() => setApprovalPolicy("admin_review")}
                      className="w-5 h-5 text-teal-500"
                    />
                    <div>
                      <p className="font-medium text-slate-800">Admin-Prüfung erforderlich</p>
                      <p className="text-sm text-slate-500">Registrierungen müssen freigegeben werden</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Zahlung
                </label>
                <select
                  value={paymentPolicy}
                  onChange={e => setPaymentPolicy(e.target.value as PaymentPolicy)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="none">Keine Zahlung erforderlich</option>
                  <option value="optional">Zahlung optional</option>
                  <option value="required">Zahlung erforderlich</option>
                </select>
              </div>

              {allowedTargets.includes("child") && (
                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <input
                    type="checkbox"
                    checked={guardianRequired}
                    onChange={e => setGuardianRequired(e.target.checked)}
                    className="w-5 h-5 text-teal-500 rounded focus:ring-teal-500"
                  />
                  <div>
                    <p className="font-medium text-slate-800">Erziehungsberechtigter erforderlich für Minderjährige</p>
                    <p className="text-sm text-slate-500">Bei Registrierung unter 18 Jahren</p>
                  </div>
                </label>
              )}
            </div>
          )}

          {/* Step 5: Questions */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Zusätzliche Fragen</h3>
                <Button variant="outline" size="sm" onClick={handleAddQuestion}>
                  <Plus className="w-4 h-4 mr-1" /> Frage hinzufügen
                </Button>
              </div>
              
              {questions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p>Keine zusätzlichen Fragen</p>
                  <p className="text-sm">Fügen Sie benutzerdefinierte Fragen hinzu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, i) => (
                    <div key={q.id} className="p-4 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Frage {i + 1}</span>
                        <button
                          onClick={() => handleRemoveQuestion(i)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={q.label}
                        onChange={e => handleUpdateQuestion(i, { label: e.target.value })}
                        placeholder="Fragetext"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={q.type}
                          onChange={e => handleUpdateQuestion(i, { type: e.target.value as QuestionType })}
                          className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        >
                          <option value="text">Text</option>
                          <option value="single_choice">Auswahl</option>
                          <option value="multi_choice">Mehrfachauswahl</option>
                          <option value="date">Datum</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                        <select
                          value={q.scope}
                          onChange={e => handleUpdateQuestion(i, { scope: e.target.value as QuestionScope })}
                          className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        >
                          <option value="both">Alle</option>
                          <option value="player">Nur Spieler</option>
                          <option value="guardian">Nur Guardian</option>
                        </select>
                        <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={e => handleUpdateQuestion(i, { required: e.target.checked })}
                            className="w-4 h-4 text-teal-500 rounded"
                          />
                          <span className="text-sm">Pflichtfeld</span>
                        </label>
                      </div>
                      {(q.type === "single_choice" || q.type === "multi_choice") && (
                        <input
                          type="text"
                          value={q.options?.join(", ") || ""}
                          onChange={e => handleUpdateQuestion(i, { 
                            options: e.target.value.split(",").map(o => o.trim()).filter(Boolean)
                          })}
                          placeholder="Optionen (kommagetrennt)"
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">Zusammenfassung</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <label className="text-xs text-slate-500">Name</label>
                  <p className="font-medium text-slate-800">{name}</p>
                </div>
                
                {description && (
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="text-xs text-slate-500">Beschreibung</label>
                    <p className="text-slate-800">{description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="text-xs text-slate-500">Zielgruppe(n)</label>
                    <p className="font-medium text-slate-800">
                      {allowedTargets.map(t => 
                        t === "self" ? "Selbstregistrierung" : 
                        t === "child" ? "Kind anmelden" : "Familie"
                      ).join(", ")}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="text-xs text-slate-500">Rollen</label>
                    <p className="font-medium text-slate-800">
                      {allowedRoles.map(r => getRoleLabel(r)).join(", ")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="text-xs text-slate-500">Genehmigung</label>
                    <p className="font-medium text-slate-800">
                      {approvalPolicy === "auto" ? "Automatisch" : "Admin-Prüfung"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="text-xs text-slate-500">Fragen</label>
                    <p className="font-medium text-slate-800">{questions.length} Fragen</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {step > 1 ? "Zurück" : "Abbrechen"}
          </Button>
          
          {step < totalSteps ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Weiter
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <Check className="w-4 h-4 mr-1" />
              {initialData ? "Speichern" : "Erstellen"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// REGISTRATION PREVIEW (USER WIZARD)
// ==========================================
function RegistrationPreview({
  form,
  onClose
}: {
  form: RegistrationForm;
  onClose: () => void;
}) {
  const { completeRegistration, createIntent, teams, org } = usePeople();
  const [step, setStep] = useState(0);
  
  // Target selection (if multiple allowed)
  const [selectedTarget, setSelectedTarget] = useState<IntentTarget>(
    form.allowedTargets.length === 1 ? form.allowedTargets[0] : "self"
  );
  const needsTargetSelection = form.allowedTargets.length > 1;
  
  // Calculate total steps based on selected target and whether target selection is needed
  const baseSteps = selectedTarget === "child" ? 6 : 5; // welcome, auth, profile, [child], questions, confirm
  const totalSteps = needsTargetSelection ? baseSteps + 1 : baseSteps;
  
  // Form data
  const [authMethod, setAuthMethod] = useState<"dfb" | "email">("email");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [childFirstName, setChildFirstName] = useState("");
  const [childLastName, setChildLastName] = useState("");
  const [childDateOfBirth, setChildDateOfBirth] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  const getTeamName = () => {
    if (!form.teamId) return org.name;
    const team = teams.find(t => t.id === form.teamId);
    return team?.name || org.name;
  };

  const getTargetLabel = (target: IntentTarget) => {
    switch (target) {
      case "self": return "Für mich selbst";
      case "child": return "Für mein Kind";
      case "household": return "Für meine Familie";
      default: return target;
    }
  };

  const handleComplete = () => {
    // Create intent
    const intent = createIntent({
      type: "public_registration",
      orgId: form.orgId,
      departmentId: form.departmentId,
      teamId: form.teamId,
      formId: form.id,
      target: selectedTarget,
      requestedRole: form.allowedRoles[0],
      approvalPolicy: form.approvalPolicy,
      paymentPolicy: form.paymentPolicy
    });

    // Complete registration
    if (selectedTarget === "child") {
      completeRegistration(
        intent.id,
        {
          firstName: childFirstName,
          lastName: childLastName,
          dateOfBirth: childDateOfBirth,
          kind: "member"
        },
        {
          firstName,
          lastName,
          email,
          dateOfBirth,
          kind: "contact"
        }
      );
    } else {
      completeRegistration(
        intent.id,
        {
          firstName,
          lastName,
          email,
          dateOfBirth,
          kind: "member"
        }
      );
    }

    setCompleted(true);
  };

  // Calculate actual step for content rendering (accounting for target selection step)
  const contentStep = needsTargetSelection ? step - 1 : step;
  
  // Check if we're on the final step
  const isFinalStep = selectedTarget === "child" 
    ? step === (needsTargetSelection ? 6 : 5)
    : step === (needsTargetSelection ? 5 : 4);

  if (completed) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-2xl w-full max-w-md text-center p-8"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Registrierung erfolgreich!</h2>
          <p className="text-slate-600 mb-6">
            {form.approvalPolicy === "admin_review" 
              ? "Ihre Registrierung wurde eingereicht und wird von einem Administrator geprüft."
              : "Sie wurden erfolgreich registriert."
            }
          </p>
          <Badge variant={form.approvalPolicy === "admin_review" ? "warning" : "success"} className="mb-6">
            {form.approvalPolicy === "admin_review" ? "Ausstehende Genehmigung" : "Aktiv"}
          </Badge>
          <Button onClick={onClose} className="w-full">
            Schließen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-teal-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Preview: {form.name}</p>
              <h2 className="text-xl font-bold">{getTeamName()}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-teal-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Progress */}
          <div className="mt-4 flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i}
                className={`flex-1 h-1 rounded-full ${
                  i <= step ? "bg-white" : "bg-teal-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Willkommen bei {org.name}
              </h3>
              <p className="text-slate-600 mb-4">
                Registrieren Sie sich oder Ihr Kind als Mitglied
              </p>
              <div className="text-left p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-2">Sie registrieren sich für:</p>
                <p className="font-medium text-slate-800">{form.name}</p>
                {form.teamId && (
                  <p className="text-sm text-teal-600">{getTeamName()}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Target Selection (only if multiple targets allowed) */}
          {needsTargetSelection && step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Wen möchten Sie anmelden?</h3>
              <div className="grid gap-3">
                {form.allowedTargets.map(target => (
                  <button
                    key={target}
                    onClick={() => setSelectedTarget(target)}
                    className={`p-4 border-2 rounded-xl text-left flex items-center gap-4 transition-all ${
                      selectedTarget === target 
                        ? "border-teal-500 bg-teal-50" 
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedTarget === target ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {target === "self" && <User className="w-6 h-6" />}
                      {target === "child" && <Users className="w-6 h-6" />}
                      {target === "household" && <UserPlus className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{getTargetLabel(target)}</p>
                      <p className="text-sm text-slate-500">
                        {target === "self" && "Sie melden sich selbst an"}
                        {target === "child" && "Sie melden Ihr Kind an"}
                        {target === "household" && "Sie melden mehrere Familienmitglieder an"}
                      </p>
                    </div>
                    {selectedTarget === target && (
                      <Check className="w-5 h-5 text-teal-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Auth Method */}
          {contentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Anmeldung</h3>
              <div className="grid gap-3">
                <button
                  onClick={() => setAuthMethod("dfb")}
                  className={`p-4 border-2 rounded-xl text-left flex items-center gap-4 ${
                    authMethod === "dfb" ? "border-teal-500 bg-teal-50" : "border-slate-200"
                  }`}
                >
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                    DFB
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Mit meinDFB anmelden</p>
                    <p className="text-sm text-slate-500">Schnelle Anmeldung mit DFB-Konto</p>
                  </div>
                </button>
                <button
                  onClick={() => setAuthMethod("email")}
                  className={`p-4 border-2 rounded-xl text-left flex items-center gap-4 ${
                    authMethod === "email" ? "border-teal-500 bg-teal-50" : "border-slate-200"
                  }`}
                >
                  <div className="w-12 h-12 bg-slate-500 rounded-lg flex items-center justify-center text-white">
                    @
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Mit E-Mail registrieren</p>
                    <p className="text-sm text-slate-500">Neues Konto erstellen</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Guardian/Self Profile */}
          {contentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {selectedTarget === "child" ? "Ihre Daten (Erziehungsberechtigter)" : "Ihre Daten"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vorname</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nachname</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Geburtsdatum</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {/* Child Data (if target=child) */}
          {contentStep === 3 && selectedTarget === "child" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Daten des Kindes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vorname</label>
                  <input
                    type="text"
                    value={childFirstName}
                    onChange={e => setChildFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nachname</label>
                  <input
                    type="text"
                    value={childLastName}
                    onChange={e => setChildLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Geburtsdatum</label>
                <input
                  type="date"
                  value={childDateOfBirth}
                  onChange={e => setChildDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {/* Custom Questions */}
          {((contentStep === 4 && selectedTarget === "child") || (contentStep === 3 && selectedTarget !== "child")) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Zusätzliche Informationen</h3>
              {form.questions.length === 0 ? (
                <p className="text-slate-500 text-center py-4">Keine zusätzlichen Fragen</p>
              ) : (
                form.questions.map(q => (
                  <div key={q.id}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {q.label} {q.required && "*"}
                    </label>
                    {q.type === "text" && (
                      <input
                        type="text"
                        value={answers[q.id] || ""}
                        onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    )}
                    {q.type === "checkbox" && (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={answers[q.id] === "true"}
                          onChange={e => setAnswers({ ...answers, [q.id]: e.target.checked ? "true" : "false" })}
                          className="w-4 h-4 text-teal-500 rounded"
                        />
                        <span className="text-sm text-slate-600">Ja</span>
                      </label>
                    )}
                    {q.type === "single_choice" && q.options && (
                      <select
                        value={answers[q.id] || ""}
                        onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Bitte wählen...</option>
                        {q.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                    {q.type === "date" && (
                      <input
                        type="date"
                        value={answers[q.id] || ""}
                        onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Final Step: Confirmation */}
          {isFinalStep && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Bestätigung</h3>
              <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                {selectedTarget === "child" && (
                  <>
                    <div>
                      <label className="text-xs text-slate-500">Kind</label>
                      <p className="font-medium text-slate-800">{childFirstName} {childLastName}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Erziehungsberechtigter</label>
                      <p className="font-medium text-slate-800">{firstName} {lastName}</p>
                    </div>
                  </>
                )}
                {selectedTarget !== "child" && (
                  <div>
                    <label className="text-xs text-slate-500">Name</label>
                    <p className="font-medium text-slate-800">{firstName} {lastName}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-slate-500">E-Mail</label>
                  <p className="text-slate-800">{email}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Rolle</label>
                  <p className="text-slate-800">{form.allowedRoles.map(r => getRoleLabel(r)).join(", ")}</p>
                </div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-sm text-amber-800">
                  {form.approvalPolicy === "admin_review" 
                    ? "⚠️ Ihre Registrierung muss von einem Administrator geprüft werden."
                    : "✓ Ihre Registrierung wird sofort aktiviert."
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => step > 0 ? setStep(step - 1) : onClose()}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {step > 0 ? "Zurück" : "Abbrechen"}
          </Button>
          
          {isFinalStep ? (
            <Button onClick={handleComplete}>
              <Check className="w-4 h-4 mr-1" />
              Registrierung abschließen
            </Button>
          ) : (
            <Button onClick={() => setStep(step + 1)}>
              Weiter
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
