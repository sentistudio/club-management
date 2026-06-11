/**
 * Registrierung (Registration) Page - Simplified Flow
 * 
 * NEW FLOW for User Registration:
 * 1. Club/Team selection (which club to join)
 * 2. Authentication (meinDFB or email)
 * 3. Who are you onboarding? (Self / Child / Family)
 * 4. Based on that, show relevant questions
 * 
 * ADMIN: Creates registration forms with custom questions
 * USER: Goes through the simplified wizard
 */

import { useState, useMemo } from "react";
import { 
  Plus, Search, Eye, Edit2, Trash2, Copy,
  ChevronRight, ChevronLeft, X, Check,
  Users, User, Home, Building2, Shield, Mail
} from "lucide-react";
import { Card, Button, Badge } from "../components/ui";
import { usePeople } from "../contexts/PeopleContext";
import type { 
  RegistrationForm, 
  FormQuestion, 
  IntentTarget,
  QuestionType,
  QuestionScope,
  CreateRegistrationFormData,
  ApprovalPolicy,
  PaymentPolicy
} from "../types/people";

// ==========================================
// REGISTRATION PAGE
// ==========================================
export function Registration() {
  const { forms, addForm, updateForm, deleteForm, teams } = usePeople();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Registrierung</h1>
          <p className="text-slate-500 mt-1">
            Anmeldeformulare für neue Mitglieder erstellen und verwalten
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowFormBuilder(true)}>
          Neues Formular
        </Button>
      </div>

      {/* Search */}
      <Card className="!p-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Formulare durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </Card>

      {/* Forms List */}
      <div className="grid gap-4">
        {filteredForms.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">Keine Formulare vorhanden</p>
            <p className="text-sm text-slate-500 mt-1">
              Erstelle ein neues Anmeldeformular
            </p>
            <Button 
              className="mt-4" 
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowFormBuilder(true)}
            >
              Formular erstellen
            </Button>
          </Card>
        ) : (
          filteredForms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-800">{form.name}</h3>
                    <Badge variant={form.isPublished ? "success" : "default"}>
                      {form.isPublished ? "Veröffentlicht" : "Entwurf"}
                    </Badge>
                  </div>
                  {form.description && (
                    <p className="text-sm text-slate-600 mb-3">{form.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {form.teamId && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Team: {getTeamName(form.teamId)}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded">
                      {form.questions.length} Fragen
                    </span>
                    {form.approvalPolicy === "admin_review" && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">
                        Genehmigung erforderlich
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewForm(form)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700"
                    title="Vorschau"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {form.isPublished && (
                    <button
                      onClick={() => copyLink(form)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700"
                      title="Link kopieren"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingForm(form);
                      setShowFormBuilder(true);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700"
                    title="Bearbeiten"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(form)}
                    className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600"
                    title="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {!form.isPublished ? (
                    <Button size="sm" onClick={() => handlePublish(form)}>
                      Veröffentlichen
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleUnpublish(form)}>
                      Deaktivieren
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Form Builder Modal */}
      {showFormBuilder && (
        <FormBuilderModal
          editingForm={editingForm}
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

      {/* Registration Preview Modal */}
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
// FORM BUILDER MODAL (Admin)
// ==========================================
function FormBuilderModal({
  editingForm,
  onClose,
  onSave
}: {
  editingForm: RegistrationForm | null;
  onClose: () => void;
  onSave: (data: CreateRegistrationFormData) => void;
}) {
  const { org, teams } = usePeople();

  // Form state
  const [name, setName] = useState(editingForm?.name || "");
  const [description, setDescription] = useState(editingForm?.description || "");
  const [teamId, setTeamId] = useState(editingForm?.teamId || "");
  const [approvalPolicy, setApprovalPolicy] = useState<ApprovalPolicy>(editingForm?.approvalPolicy || "auto");
  const [paymentPolicy, setPaymentPolicy] = useState<PaymentPolicy>(editingForm?.paymentPolicy || "none");
  const [questions, setQuestions] = useState<FormQuestion[]>(editingForm?.questions || []);

  // Add question
  const addQuestion = () => {
    const newQuestion: FormQuestion = {
      id: `q_${Date.now()}`,
      type: "text",
      label: "",
      required: false,
      scope: "all"
    };
    setQuestions([...questions, newQuestion]);
  };

  // Update question
  const updateQuestion = (index: number, updates: Partial<FormQuestion>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  // Remove question
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Handle save
  const handleSave = () => {
    if (!name) return;
    
    onSave({
      name,
      description,
      orgId: org.id,
      teamId: teamId || undefined,
      allowedTargets: ["self", "child", "household"], // All targets allowed by default
      allowedRoles: ["player", "coach", "guardian_contact"], // All roles allowed
      approvalPolicy: approvalPolicy as "auto" | "admin_review",
      paymentPolicy: paymentPolicy as "none" | "optional" | "required",
      guardianRequiredUnderAge: true,
      questions
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              {editingForm ? "Formular bearbeiten" : "Neues Formular erstellen"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Grundinformationen</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name des Formulars *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="z.B. Jugend-Anmeldung 2026"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Beschreibung
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Optionale Beschreibung..."
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Team (optional)
              </label>
              <select
                value={teamId}
                onChange={e => setTeamId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Allgemeine Vereinsanmeldung</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Einstellungen</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Genehmigung
                </label>
                <select
                  value={approvalPolicy}
                  onChange={e => setApprovalPolicy(e.target.value as ApprovalPolicy)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="auto">Automatisch genehmigen</option>
                  <option value="admin_review">Admin-Prüfung erforderlich</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Zahlung
                </label>
                <select
                  value={paymentPolicy}
                  onChange={e => setPaymentPolicy(e.target.value as PaymentPolicy)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="none">Keine Zahlung</option>
                  <option value="optional">Zahlung optional</option>
                  <option value="required">Zahlung erforderlich</option>
                </select>
              </div>
            </div>
          </div>

          {/* Custom Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Zusätzliche Fragen</h3>
              <Button size="sm" variant="outline" onClick={addQuestion}>
                <Plus className="w-4 h-4 mr-1" /> Frage hinzufügen
              </Button>
            </div>
            
            {questions.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-lg">
                <p className="text-slate-500 text-sm">
                  Keine zusätzlichen Fragen. Die Standard-Felder (Name, E-Mail, etc.) werden automatisch abgefragt.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div key={q.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={q.label}
                          onChange={e => updateQuestion(index, { label: e.target.value })}
                          placeholder="Fragetext..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <div className="flex gap-3">
                          <select
                            value={q.type}
                            onChange={e => updateQuestion(index, { type: e.target.value as QuestionType })}
                            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                          >
                            <option value="text">Text</option>
                            <option value="single_choice">Einfachauswahl</option>
                            <option value="multi_choice">Mehrfachauswahl</option>
                            <option value="date">Datum</option>
                          </select>
                          <select
                            value={q.scope}
                            onChange={e => updateQuestion(index, { scope: e.target.value as QuestionScope })}
                            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                          >
                            <option value="all">Für alle</option>
                            <option value="player">Nur Spieler</option>
                            <option value="guardian">Nur Eltern</option>
                          </select>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={q.required}
                              onChange={e => updateQuestion(index, { required: e.target.checked })}
                              className="rounded"
                            />
                            Pflichtfeld
                          </label>
                        </div>
                      </div>
                      <button
                        onClick={() => removeQuestion(index)}
                        className="p-2 text-slate-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={!name}>
            {editingForm ? "Speichern" : "Formular erstellen"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// REGISTRATION PREVIEW (User Wizard)
// New simplified flow:
// 1. Club/Team info
// 2. Authentication
// 3. Who are you onboarding?
// 4. Personal info
// 5. Custom questions
// 6. Confirmation
// ==========================================
function RegistrationPreview({
  form,
  onClose
}: {
  form: RegistrationForm;
  onClose: () => void;
}) {
  const { org, teams, addPerson, addMembership, addGuardianLink } = usePeople();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form data
  const [authMethod, setAuthMethod] = useState<"dfb" | "email" | null>(null);
  const [onboardingType, setOnboardingType] = useState<IntentTarget | null>(null);
  
  // Person data (for self or guardian)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Child data (if onboarding child/family)
  const [childFirstName, setChildFirstName] = useState("");
  const [childLastName, setChildLastName] = useState("");
  const [childDob, setChildDob] = useState("");
  
  // Custom question answers
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const team = form.teamId ? teams.find(t => t.id === form.teamId) : null;

  // Handle complete
  const handleComplete = () => {
    // Create the person(s) based on onboarding type
    if (onboardingType === "self") {
      // Just create self as member
      const person = addPerson({
        firstName,
        lastName,
        email,
        phone,
        kind: "member",
        hasClaimedIdentity: true
      });
      addMembership({
        personId: person.id,
        orgId: org.id,
        teamId: form.teamId,
        role: "player",
        status: form.approvalPolicy === "auto" ? "active" : "pending"
      });
    } else if (onboardingType === "child") {
      // Create child as member
      const child = addPerson({
        firstName: childFirstName,
        lastName: childLastName,
        dateOfBirth: childDob,
        kind: "member"
      });
      addMembership({
        personId: child.id,
        orgId: org.id,
        teamId: form.teamId,
        role: "player",
        status: form.approvalPolicy === "auto" ? "active" : "pending"
      });
      
      // Create guardian as contact
      const guardian = addPerson({
        firstName,
        lastName,
        email,
        phone,
        kind: "contact",
        hasClaimedIdentity: true
      });
      
      // Create guardian link
      addGuardianLink({
        guardianPersonId: guardian.id,
        childPersonId: child.id,
        permissions: {
          manageRsvp: true,
          viewComms: true,
          payFees: true,
          editProfile: true
        }
      });
    } else if (onboardingType === "household") {
      // Similar to child but could add multiple children
      // For demo, we'll do the same as child
      const child = addPerson({
        firstName: childFirstName,
        lastName: childLastName,
        dateOfBirth: childDob,
        kind: "member"
      });
      addMembership({
        personId: child.id,
        orgId: org.id,
        teamId: form.teamId,
        role: "player",
        status: form.approvalPolicy === "auto" ? "active" : "pending"
      });
      
      const guardian = addPerson({
        firstName,
        lastName,
        email,
        phone,
        kind: "contact",
        hasClaimedIdentity: true
      });
      
      addGuardianLink({
        guardianPersonId: guardian.id,
        childPersonId: child.id,
        permissions: {
          manageRsvp: true,
          viewComms: true,
          payFees: true,
          editProfile: true
        }
      });
    }

    // Move to completion step
    setStep(totalSteps);
  };

  // Render step content
  const renderStep = () => {
    switch (step) {
      // Step 1: Club/Team info
      case 1:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Willkommen bei {org.name}!
            </h2>
            {team && (
              <p className="text-lg text-slate-600 mb-4">
                Anmeldung für: <strong>{team.name}</strong>
              </p>
            )}
            <p className="text-slate-500 max-w-md mx-auto">
              {form.description || "Wir freuen uns auf deine Anmeldung!"}
            </p>
          </div>
        );

      // Step 2: Authentication
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Anmeldung</h2>
              <p className="text-slate-500">Wie möchtest du dich anmelden?</p>
            </div>
            <div className="grid gap-4 max-w-md mx-auto">
              <button
                onClick={() => setAuthMethod("dfb")}
                className={`p-5 rounded-[10px] border-2 text-left transition-all ${
                  authMethod === "dfb" 
                    ? "border-teal-500 bg-teal-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-[10px] flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">meinDFB Login</p>
                    <p className="text-sm text-slate-500">Mit deinem DFB-Konto anmelden</p>
                  </div>
                  {authMethod === "dfb" && <Check className="w-5 h-5 text-teal-500 ml-auto" />}
                </div>
              </button>
              <button
                onClick={() => setAuthMethod("email")}
                className={`p-5 rounded-[10px] border-2 text-left transition-all ${
                  authMethod === "email" 
                    ? "border-teal-500 bg-teal-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-[10px] flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">E-Mail</p>
                    <p className="text-sm text-slate-500">Mit E-Mail-Adresse registrieren</p>
                  </div>
                  {authMethod === "email" && <Check className="w-5 h-5 text-teal-500 ml-auto" />}
                </div>
              </button>
            </div>
          </div>
        );

      // Step 3: Who are you onboarding?
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Wen möchtest du anmelden?</h2>
              <p className="text-slate-500">Wähle die passende Option</p>
            </div>
            <div className="grid gap-4 max-w-md mx-auto">
              <button
                onClick={() => setOnboardingType("self")}
                className={`p-5 rounded-[10px] border-2 text-left transition-all ${
                  onboardingType === "self" 
                    ? "border-teal-500 bg-teal-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-[10px] flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Mich selbst</p>
                    <p className="text-sm text-slate-500">Ich melde mich selbst als Mitglied an</p>
                  </div>
                  {onboardingType === "self" && <Check className="w-5 h-5 text-teal-500 ml-auto" />}
                </div>
              </button>
              <button
                onClick={() => setOnboardingType("child")}
                className={`p-5 rounded-[10px] border-2 text-left transition-all ${
                  onboardingType === "child" 
                    ? "border-teal-500 bg-teal-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-[10px] flex items-center justify-center">
                    <Users className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Mein Kind</p>
                    <p className="text-sm text-slate-500">Ich melde mein Kind als Spieler an</p>
                  </div>
                  {onboardingType === "child" && <Check className="w-5 h-5 text-teal-500 ml-auto" />}
                </div>
              </button>
              <button
                onClick={() => setOnboardingType("household")}
                className={`p-5 rounded-[10px] border-2 text-left transition-all ${
                  onboardingType === "household" 
                    ? "border-teal-500 bg-teal-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-[10px] flex items-center justify-center">
                    <Home className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Meine Familie</p>
                    <p className="text-sm text-slate-500">Mehrere Familienmitglieder anmelden</p>
                  </div>
                  {onboardingType === "household" && <Check className="w-5 h-5 text-teal-500 ml-auto" />}
                </div>
              </button>
            </div>
          </div>
        );

      // Step 4: Personal info
      case 4:
        return (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                {onboardingType === "self" ? "Deine Daten" : "Deine Kontaktdaten"}
              </h2>
              <p className="text-slate-500">
                {onboardingType === "self" 
                  ? "Bitte gib deine persönlichen Daten ein"
                  : "Als Erziehungsberechtigter"
                }
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Vorname *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nachname *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  E-Mail *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Child data (if applicable) */}
            {(onboardingType === "child" || onboardingType === "household") && (
              <>
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-slate-800 mb-4">Daten des Kindes</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Vorname *
                        </label>
                        <input
                          type="text"
                          value={childFirstName}
                          onChange={e => setChildFirstName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Nachname *
                        </label>
                        <input
                          type="text"
                          value={childLastName}
                          onChange={e => setChildLastName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Geburtsdatum *
                      </label>
                      <input
                        type="date"
                        value={childDob}
                        onChange={e => setChildDob(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      // Step 5: Custom questions
      case 5:
        const relevantQuestions = form.questions.filter(q => {
          if (q.scope === "all") return true;
          if (q.scope === "player" && onboardingType === "self") return true;
          if (q.scope === "guardian" && onboardingType !== "self") return true;
          return false;
        });

        if (relevantQuestions.length === 0) {
          // Skip to confirmation
          handleComplete();
          return null;
        }

        return (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Zusätzliche Informationen</h2>
              <p className="text-slate-500">Bitte beantworte folgende Fragen</p>
            </div>
            <div className="space-y-4">
              {relevantQuestions.map(q => (
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
                  {q.type === "date" && (
                    <input
                      type="date"
                      value={answers[q.id] || ""}
                      onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  )}
                  {(q.type === "single_choice" || q.type === "multi_choice") && q.options && (
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
                </div>
              ))}
            </div>
          </div>
        );

      // Step 6: Confirmation
      case 6:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Anmeldung erfolgreich!
            </h2>
            <p className="text-slate-600 max-w-md mx-auto mb-6">
              {form.approvalPolicy === "admin_review" 
                ? "Deine Anmeldung wird geprüft. Du erhältst eine Bestätigung per E-Mail."
                : "Willkommen im Verein! Du erhältst eine Bestätigungs-E-Mail."
              }
            </p>
            <div className="bg-slate-50 rounded-lg p-4 max-w-sm mx-auto text-left">
              <h3 className="font-medium text-slate-800 mb-2">Zusammenfassung:</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                {onboardingType === "self" && (
                  <li>• {firstName} {lastName} als Mitglied registriert</li>
                )}
                {(onboardingType === "child" || onboardingType === "household") && (
                  <>
                    <li>• {childFirstName} {childLastName} als Spieler registriert</li>
                    <li>• {firstName} {lastName} als Erziehungsberechtigter verknüpft</li>
                  </>
                )}
                {team && <li>• Team: {team.name}</li>}
              </ul>
            </div>
          </div>
        );
    }
  };

  // Can proceed check
  const canProceed = () => {
    switch (step) {
      case 2: return authMethod !== null;
      case 3: return onboardingType !== null;
      case 4:
        if (!firstName || !lastName || !email) return false;
        if ((onboardingType === "child" || onboardingType === "household") && 
            (!childFirstName || !childLastName || !childDob)) return false;
        return true;
      default: return true;
    }
  };

  // Handle next
  const handleNext = () => {
    if (step === 4) {
      // Check if we have custom questions
      const relevantQuestions = form.questions.filter(q => {
        if (q.scope === "all") return true;
        if (q.scope === "player" && onboardingType === "self") return true;
        if (q.scope === "guardian" && onboardingType !== "self") return true;
        return false;
      });
      
      if (relevantQuestions.length === 0) {
        handleComplete();
        return;
      }
    }
    
    if (step === 5) {
      handleComplete();
      return;
    }
    
    setStep(step + 1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              {step < totalSteps ? "Vorschau: Anmeldeformular" : ""}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          {/* Progress */}
          {step < totalSteps && (
            <div className="flex gap-1">
              {Array.from({ length: totalSteps - 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < step ? "bg-teal-500" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-between">
          {step > 1 && step < totalSteps ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Zurück
            </Button>
          ) : (
            <div />
          )}
          {step < totalSteps ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              {step === 4 || step === 5 ? "Anmeldung abschließen" : "Weiter"} 
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={onClose}>
              Schließen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
