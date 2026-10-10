import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Plus,
  Filter,
  CheckCircle2,
  FileQuestion,
  Building2,
  Calendar,
  MapPin,
  Upload,
} from 'lucide-react';
import { EvidenceItem, EvidenceClassification } from '../types';
import { BulkUploadEvidenceModal } from './BulkUploadEvidenceModal';

interface EvidenceLibraryViewProps {
  evidenceList: EvidenceItem[];
  onAddEvidence: (item: EvidenceItem) => void;
  onBulkAddEvidence?: (items: EvidenceItem[]) => void;
}

export const EvidenceLibraryView: React.FC<EvidenceLibraryViewProps> = ({
  evidenceList,
  onAddEvidence,
  onBulkAddEvidence,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [selectedGeo, setSelectedGeo] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkSuccessNotice, setBulkSuccessNotice] = useState<string | null>(null);

  // New Evidence Form State
  const [newClaim, setNewClaim] = useState('');
  const [newMetric, setNewMetric] = useState('');
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newGeography, setNewGeography] = useState('Visakhapatnam');
  const [newClassification, setNewClassification] =
    useState<EvidenceClassification>('requires_verification');
  const [newLimitations, setNewLimitations] = useState('');
  const [newRelevance, setNewRelevance] = useState('');

  // Filtering
  const filteredEvidence = evidenceList.filter((item) => {
    const matchesSearch =
      item.claim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.geography.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.limitations.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClassification =
      selectedClassification === 'all' || item.classification === selectedClassification;

    const matchesGeo =
      selectedGeo === 'all' || item.geography.toLowerCase().includes(selectedGeo.toLowerCase());

    return matchesSearch && matchesClassification && matchesGeo;
  });

  const getClassificationMeta = (classification: EvidenceClassification) => {
    switch (classification) {
      case 'verified_fact':
        return {
          label: 'Verified Fact',
          color: 'text-emerald-700',
          border: 'border-emerald-200',
          bg: 'bg-emerald-50',
          desc: 'Primary government filing, corporate statutory announcement, or confirmed registry.',
        };
      case 'third_party_estimate':
        return {
          label: 'Third-Party Estimate',
          color: 'text-sky-700',
          border: 'border-sky-200',
          bg: 'bg-sky-50',
          desc: 'Published industry survey by recognized research firm (NASSCOM, Aon, Mercer).',
        };
      case 'company_announcement':
        return {
          label: 'Company Announcement',
          color: 'text-indigo-700',
          border: 'border-indigo-200',
          bg: 'bg-indigo-50',
          desc: 'Press release or campus inauguration statement from operating GCC/IT firm.',
        };
      case 'model_inference':
        return {
          label: 'Model Inference',
          color: 'text-amber-700',
          border: 'border-amber-200',
          bg: 'bg-amber-50',
          desc: 'Analytical extrapolation from public LinkedIn profiles or sample portal distributions.',
        };
      case 'requires_verification':
        return {
          label: 'Requires Verification',
          color: 'text-rose-700',
          border: 'border-rose-200',
          bg: 'bg-rose-50',
          desc: 'Official data unavailable. Requires local recruiter sprint or talent audit before trusting.',
        };
    }
  };

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaim.trim() || !newSourceName.trim()) return;

    const newItem: EvidenceItem = {
      id: `ev-${Date.now()}`,
      claim: newClaim.trim(),
      metricValue: newMetric.trim() || undefined,
      sourceName: newSourceName.trim(),
      sourceUrl: newSourceUrl.trim()
        ? (/^https?:\/\//i.test(newSourceUrl.trim())
            ? newSourceUrl.trim()
            : `https://${newSourceUrl.trim()}`)
        : undefined,
      publicationDate: 'October 2024',
      dateChecked: 'October 2024',
      geography: newGeography,
      jobCategories: ['Tech Expansion', 'Workforce Planning'],
      classification: newClassification,
      confidenceScore:
        newClassification === 'verified_fact'
          ? 'High'
          : newClassification === 'third_party_estimate'
          ? 'Moderate'
          : 'Low',
      limitations: newLimitations.trim() || 'Requires empirical verification with local recruiting partners.',
      relevanceToScenario: newRelevance.trim() || 'User added scenario note.',
    };

    onAddEvidence(newItem);
    setIsModalOpen(false);
    // Reset form
    setNewClaim('');
    setNewMetric('');
    setNewSourceName('');
    setNewSourceUrl('');
    setNewLimitations('');
    setNewRelevance('');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Audit Trail & Epistemic Integrity</span>
              <span aria-hidden="true">·</span>
              <span>Anti-Hallucination Evidence Base</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Evidence & Uncertainty Library
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Every data point in the model is graded by evidentiary strength. Missing information is explicitly identified as &quot;Requires Verification&quot; rather than masked with synthetic assumptions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Bulk Upload (JSON)</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Research Note</span>
            </button>
          </div>
        </div>

        {/* Epistemic Rule Banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Zero-Fabrication Policy:</strong> Sources cite verified NASSCOM/Zinnov benchmarks, Aon compensation studies, and official government press filings. Where local Visakhapatnam data is incomplete, the model explicitly notes the limitation.
          </span>
        </div>

        {/* Bulk Success Notice */}
        {bulkSuccessNotice && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{bulkSuccessNotice}</span>
            </div>
            <button
              onClick={() => setBulkSuccessNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search claims, sources, limitations, or geographies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Classification Filter */}
          <select
            value={selectedClassification}
            onChange={(e) => setSelectedClassification(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700"
          >
            <option value="all">All Classifications</option>
            <option value="verified_fact">Verified Fact</option>
            <option value="third_party_estimate">Third-Party Estimate</option>
            <option value="company_announcement">Company Announcement</option>
            <option value="model_inference">Model Inference</option>
            <option value="requires_verification">Requires Verification</option>
          </select>

          {/* Geography Filter */}
          <select
            value={selectedGeo}
            onChange={(e) => setSelectedGeo(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700"
          >
            <option value="all">All Locations</option>
            <option value="visakhapatnam">Visakhapatnam</option>
            <option value="pan-india">Pan-India</option>
          </select>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvidence.map((item) => {
          const meta = getClassificationMeta(item.classification);
          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Card Header: Metadata and Classification */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.geography}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Checked {item.dateChecked}</span>
                  </div>
                  <span
                    className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border ${meta.bg} ${meta.border} ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                </div>

                {item.metricValue && (
                  <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-900 border border-slate-200 tabular-nums">
                    {item.metricValue}
                  </span>
                )}
              </div>

              {/* Primary Claim */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.claim}
                </h3>
              </div>

              {/* Source & Citation */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span className="line-clamp-1">{item.sourceName}</span>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-900 ml-2 shrink-0 flex items-center gap-1 text-[11px]"
                    >
                      <span>Citation</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>Published: {item.publicationDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>Categories: {item.jobCategories.join(', ')}</span>
                </div>
              </div>

              {/* Limitations & Missing Information (Anti-Slop / Anti-Hallucination) */}
              <div className="text-xs space-y-1 pt-1 border-t border-slate-100">
                <div className="font-semibold text-slate-700 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Limitations & Missing Info:</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {item.limitations}
                </p>
              </div>

              {/* Scenario Relevance */}
              <div className="text-[11px] text-slate-500 pt-1">
                <strong className="text-slate-700">Relevance: </strong>
                {item.relevanceToScenario}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
          <FileQuestion className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">No evidence items match your filters</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or reset your classification filters.
          </p>
        </div>
      )}

      {/* Modal: Add Research Note */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Research Finding or Audit Note</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvidence} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Claim or Metric Statement *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newClaim}
                  onChange={(e) => setNewClaim(e.target.value)}
                  placeholder="e.g., Local Visakhapatnam IT services firms enforce strict 90-day notice periods."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Metric Value (Optional)
                  </label>
                  <input
                    type="text"
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    placeholder="e.g., 90 Days / 28% drop"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Classification *
                  </label>
                  <select
                    value={newClassification}
                    onChange={(e) =>
                      setNewClassification(e.target.value as EvidenceClassification)
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  >
                    <option value="verified_fact">Verified Fact</option>
                    <option value="third_party_estimate">Third-Party Estimate</option>
                    <option value="company_announcement">Company Announcement</option>
                    <option value="model_inference">Model Inference</option>
                    <option value="requires_verification">Requires Verification</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Source Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    placeholder="e.g., Regional Recruitment Agency Interview"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Source URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Limitations & Missing Information *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newLimitations}
                  onChange={(e) => setNewLimitations(e.target.value)}
                  placeholder="Identify sample size limits, unverified variables, or local constraints."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Save Finding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      <BulkUploadEvidenceModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        existingEvidence={evidenceList}
        onBulkAdd={(items, dupes) => {
          if (onBulkAddEvidence) {
            onBulkAddEvidence(items);
          } else {
            // Fallback: add items individually
            items.forEach((it) => onAddEvidence(it));
          }
          if (dupes && dupes > 0) {
            setBulkSuccessNotice(
              `Successfully imported ${items.length} evidence records (${dupes} duplicate matches assigned unique IDs).`
            );
          } else {
            setBulkSuccessNotice(`Successfully imported ${items.length} evidence records.`);
          }
        }}
      />
    </div>
  );
};
