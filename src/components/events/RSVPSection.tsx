// RSVP Section Component
// ==========================================
// Configure RSVP requirements for events

import { Check, Clock, Users } from "lucide-react";

interface RSVPSectionProps {
  required: boolean;
  deadline: string;
  maxParticipants: string;
  onRequiredChange: (required: boolean) => void;
  onDeadlineChange: (deadline: string) => void;
  onMaxParticipantsChange: (max: string) => void;
  eventDate?: string;
}

export function RSVPSection({
  required,
  deadline,
  maxParticipants,
  onRequiredChange,
  onDeadlineChange,
  onMaxParticipantsChange,
  eventDate
}: RSVPSectionProps) {
  return (
    <div className="space-y-4">
      {/* RSVP Required Toggle */}
      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Check className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="font-medium text-slate-800">Anmeldung erforderlich</p>
            <p className="text-xs text-slate-500">Teilnehmer müssen zu- oder absagen</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={required}
            onChange={(e) => onRequiredChange(e.target.checked)}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#004941] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004941]"></div>
        </label>
      </div>

      {required && (
        <div className="space-y-4 pl-4 border-l-2 border-[#C8F2E0]">
          {/* Deadline */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Clock className="w-4 h-4" />
              Anmeldefrist
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => onDeadlineChange(e.target.value)}
              max={eventDate ? `${eventDate}T23:59` : undefined}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941]"
            />
            <p className="text-xs text-slate-500 mt-1">
              Nach dieser Frist sind keine Anmeldungen mehr möglich
            </p>
          </div>

          {/* Max Participants */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Users className="w-4 h-4" />
              Maximale Teilnehmerzahl
            </label>
            <input
              type="number"
              value={maxParticipants}
              onChange={(e) => onMaxParticipantsChange(e.target.value)}
              placeholder="Unbegrenzt"
              min="1"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941]"
            />
            <p className="text-xs text-slate-500 mt-1">
              Leer lassen für unbegrenzte Teilnehmer. Bei Überschreitung wird Warteliste aktiviert.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
