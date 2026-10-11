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
          color: 'text-black',
          border: 'border-black',
          bg: 'bg-[#00F0A8]',
          desc: 'Primary government filing, corporate statutory announcement, or confirmed registry.',
        };
      case 'third_party_estimate':
        return {
          label: 'Third-Party Estimate',
          color: 'text-black',
          border: 'border-black',
          bg: 'bg-[#FFE500]',
          desc: 'Published industry survey by recognized research firm (NASSCOM, Aon, Mercer).',
        };
      case 'company_announcement':
        return {
          label: 'Company Announcement',
          color: 'text-black',
          border: 'border-black',
          bg: 'bg-[#FAF7EE]',
          desc: 'Press release or campus inauguration statement from operating GCC/IT firm.',
        };
      case 'model_inference':
        return {
          label: 'Model Inference',
          color: 'text-black',
          border: 'border-black',
          bg: 'bg-[#FF9900]',
          desc: 'Analytical extrapolation from public LinkedIn profiles or sample portal distributions.',
        };
      case 'requires_verification':
        return {
          label: 'Requires Verification',
          color: 'text-white',
          border: 'border-black',
          bg: 'bg-[#FF5A36]',
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
    <div className="space-y-8 font-mono animate-fadeIn">
      {/* Top Banner in Retro NeoBrutalism */}
      <div className="bg-[#FFFDF5] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
              <span className="bg-black text-[#FFE500] px-2.5 py-0.5 font-black uppercase text-xs tracking-wider border border-black shadow-[2px_2px_0px_0px_#000]">
                MODULE 05 // EVIDENCE REPOSITORY
              </span>
              <span className="text-black font-black">//</span>
              <span className="bg-[#00F0A8] text-black px-2 py-0.5 font-black uppercase border border-black">
                ANTI-HALLUCINATION AUDIT
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black uppercase font-display">
              Evidence & Uncertainty Library
            </h1>
            <p className="text-xs text-neutral-800 mt-1 max-w-3xl font-medium font-sans">
              Every data point in the model is graded by evidentiary strength. Missing information is explicitly identified as &quot;Requires Verification&quot; rather than masked with synthetic assumptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase text-black bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Bulk Upload (JSON)</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Research Note</span>
            </button>
          </div>
        </div>

        {/* Epistemic Rule Banner */}
        <div className="mt-5 pt-4 border-t-2 border-black flex items-start gap-2.5 text-xs text-neutral-800">
          <ShieldCheck className="w-5 h-5 stroke-[2.5] text-black shrink-0 mt-0.5" />
          <span>
            <strong>Zero-Fabrication Policy:</strong> Sources cite verified NASSCOM/Zinnov benchmarks, Aon compensation studies, and official government press filings. Where local Visakhapatnam data is incomplete, the model explicitly notes the limitation.
          </span>
        </div>

        {/* Bulk Success Notice */}
        {bulkSuccessNotice && (
          <div className="mt-3 p-3 bg-[#00F0A8] border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-between text-xs text-black animate-fadeIn font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5] text-black shrink-0" />
              <span>{bulkSuccessNotice}</span>
            </div>
            <button
              onClick={() => setBulkSuccessNotice(null)}
              className="text-black hover:bg-black hover:text-white px-1.5 py-0.5 border border-black font-black text-xs transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar in Retro NeoBrutalism */}
      <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search claims, sources, limitations, or geographies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#FAF7EE] border-2 border-black text-black placeholder:text-neutral-600 focus:outline-none focus:bg-[#FFF9D2] font-mono shadow-[2px_2px_0px_0px_#000]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Classification Filter */}
          <select
            value={selectedClassification}
            onChange={(e) => setSelectedClassification(e.target.value)}
            className="text-xs font-black uppercase bg-[#FAF7EE] border-2 border-black px-3 py-2 text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none"
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
            className="text-xs font-black uppercase bg-[#FAF7EE] border-2 border-black px-3 py-2 text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none"
          >
            <option value="all">All Locations</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="pune">Pune</option>
            <option value="visakhapatnam">Visakhapatnam</option>
            <option value="coimbatore">Coimbatore</option>
            <option value="bhubaneswar">Bhubaneswar</option>
            <option value="pan-india">Pan-India</option>
          </select>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvidence.map((item) => {
          const meta = getClassificationMeta(item.classification);
          return (
            <div
              key={item.id}
              className="bg-[#FFFDF5] border-3 border-black p-5 shadow-[4px_4px_0px_0px_#000] space-y-4 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Card Header: Metadata and Classification */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-700">
                      <span className="flex items-center gap-1 font-black uppercase text-black">
                        <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
                        {item.geography}
                      </span>
                      <span>//</span>
                      <span className="font-bold">Checked {item.dateChecked}</span>
                    </div>
                    <span
                      className={`inline-block text-[11px] font-black uppercase px-2 py-0.5 border-2 border-black shadow-[1px_1px_0px_0px_#000] ${meta.bg} ${meta.color}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {item.metricValue && (
                    <span className="font-mono text-xs font-black px-2 py-1 bg-[#FFE500] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] tabular-nums">
                      {item.metricValue}
                    </span>
                  )}
                </div>

                {/* Primary Claim */}
                <div>
                  <h3 className="text-sm font-black text-black leading-snug uppercase font-display">
                    {item.claim}
                  </h3>
                </div>

                {/* Source & Citation */}
                <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-black font-black uppercase">
                    <span className="line-clamp-1">{item.sourceName}</span>
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:bg-[#FFE500] px-1.5 py-0.5 border border-black ml-2 shrink-0 flex items-center gap-1 text-[10px] font-black uppercase transition-colors"
                      >
                        <span>Citation</span>
                        <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                      </a>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-700 flex flex-wrap items-center gap-2 font-medium">
                    <span>Published: {item.publicationDate}</span>
                    <span>//</span>
                    <span>Categories: {item.jobCategories.join(', ')}</span>
                  </div>
                </div>

                {/* Limitations & Missing Information (Anti-Slop / Anti-Hallucination) */}
                <div className="text-xs space-y-1 pt-2 border-t-2 border-black">
                  <div className="font-black uppercase text-black flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 stroke-[2.5] text-black shrink-0" />
                    <span>Limitations & Missing Info:</span>
                  </div>
                  <p className="text-neutral-800 leading-relaxed text-[11px] font-sans font-medium">
                    {item.limitations}
                  </p>
                </div>
              </div>

              {/* Scenario Relevance */}
              <div className="text-[11px] text-neutral-700 pt-2 border-t border-neutral-300">
                <strong className="text-black uppercase font-black font-mono">Relevance: </strong>
                <span className="font-sans font-medium">{item.relevanceToScenario}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="bg-white border-4 border-black p-12 text-center space-y-3 shadow-[6px_6px_0px_0px_#000]">
          <FileQuestion className="w-10 h-10 text-black stroke-[2.5] mx-auto" />
          <h3 className="text-base font-black uppercase text-black font-display">No evidence items match your filters</h3>
          <p className="text-xs text-neutral-700 font-medium font-sans">
            Try adjusting your search query or reset your classification filters.
          </p>
        </div>
      )}

      {/* Modal: Add Research Note in Retro NeoBrutalism */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#FFFDF5] border-4 border-black shadow-[10px_10px_0px_0px_#000] max-w-lg w-full p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b-3 border-black pb-3">
              <h3 className="text-base font-black uppercase text-black font-display">Add Research Finding or Audit Note</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 bg-white hover:bg-[#FF5A36] hover:text-white text-black border-2 border-black font-black text-xs flex items-center justify-center shadow-[2px_2px_0px_0px_#000] transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvidence} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block font-black uppercase text-black mb-1">
                  Claim or Metric Statement *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newClaim}
                  onChange={(e) => setNewClaim(e.target.value)}
                  placeholder="e.g., Local Visakhapatnam IT services firms enforce strict 90-day notice periods."
                  className="w-full bg-white border-2 border-black p-2.5 text-xs text-black placeholder:text-neutral-500 focus:outline-none focus:bg-[#FFF9D2] shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-black mb-1">
                    Metric Value (Optional)
                  </label>
                  <input
                    type="text"
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    placeholder="e.g., 90 Days / 28% drop"
                    className="w-full bg-white border-2 border-black p-2 text-xs text-black shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-black mb-1">
                    Classification *
                  </label>
                  <select
                    value={newClassification}
                    onChange={(e) =>
                      setNewClassification(e.target.value as EvidenceClassification)
                    }
                    className="w-full bg-white border-2 border-black p-2 text-xs text-black font-bold uppercase shadow-[2px_2px_0px_0px_#000]"
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
                  <label className="block font-black uppercase text-black mb-1">
                    Source Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    placeholder="e.g., Regional Recruitment Agency Interview"
                    className="w-full bg-white border-2 border-black p-2 text-xs text-black shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-black mb-1">
                    Source URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white border-2 border-black p-2 text-xs text-black shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase text-black mb-1">
                  Limitations & Missing Information *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newLimitations}
                  onChange={(e) => setNewLimitations(e.target.value)}
                  placeholder="Identify sample size limits, unverified variables, or local constraints."
                  className="w-full bg-white border-2 border-black p-2.5 text-xs text-black placeholder:text-neutral-500 focus:outline-none focus:bg-[#FFF9D2] shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-black uppercase text-black bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black uppercase text-black bg-[#FFE500] hover:bg-[#FFD000] border-2 border-black shadow-[3px_3px_0px_0px_#000]"
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
