import React, { useState, useRef } from 'react';
import {
  Upload,
  FileCode,
  CheckCircle2,
  AlertCircle,
  X,
  Copy,
  Check,
  FileText,
  HelpCircle,
  Download,
} from 'lucide-react';
import { EvidenceItem } from '../types';
import {
  validateBulkEvidenceJson,
  EVIDENCE_JSON_SCHEMA_EXAMPLE,
  EVIDENCE_JSON_SCHEMA_DEFINITION,
  ValidationErrorItem,
} from '../utils/evidenceSchema';

interface BulkUploadEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkAdd: (items: EvidenceItem[], duplicateCount?: number) => void;
  existingEvidence?: EvidenceItem[];
}

export const BulkUploadEvidenceModal: React.FC<BulkUploadEvidenceModalProps> = ({
  isOpen,
  onClose,
  onBulkAdd,
  existingEvidence = [],
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'schema' | 'preview'>('editor');
  const [validationErrors, setValidationErrors] = useState<ValidationErrorItem[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [parsedPreview, setParsedPreview] = useState<EvidenceItem[]>([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleValidateAndPreview = () => {
    if (!jsonInput.trim()) {
      setValidationErrors([
        { index: 0, field: 'Empty Input', message: 'Please enter JSON text or upload a .json file.' },
      ]);
      setValidationWarnings([]);
      setParsedPreview([]);
      setDuplicateCount(0);
      return;
    }

    const res = validateBulkEvidenceJson(jsonInput, existingEvidence);
    setValidationErrors(res.errors);
    setValidationWarnings(res.warnings);
    setParsedPreview(res.parsedItems);
    setDuplicateCount(res.duplicateCount);

    if (res.valid) {
      setActiveTab('preview');
    }
  };

  const handleApplyUpload = () => {
    const res = validateBulkEvidenceJson(jsonInput, existingEvidence);
    if (!res.valid || res.parsedItems.length === 0) {
      setValidationErrors(res.errors);
      setActiveTab('editor');
      return;
    }

    onBulkAdd(res.parsedItems, res.duplicateCount);
    onClose();
    // Reset state
    setJsonInput('');
    setValidationErrors([]);
    setValidationWarnings([]);
    setParsedPreview([]);
    setDuplicateCount(0);
    setActiveTab('editor');
  };

  const handleLoadSample = () => {
    const sample = JSON.stringify(EVIDENCE_JSON_SCHEMA_EXAMPLE, null, 2);
    setJsonInput(sample);
    const res = validateBulkEvidenceJson(sample, existingEvidence);
    setValidationErrors(res.errors);
    setValidationWarnings(res.warnings);
    setParsedPreview(res.parsedItems);
    setDuplicateCount(res.duplicateCount);
    setActiveTab('editor');
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setValidationErrors([
        { index: 0, field: 'File Type', message: 'Please upload a valid .json file.' },
      ]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonInput(text);
      const res = validateBulkEvidenceJson(text, existingEvidence);
      setValidationErrors(res.errors);
      setValidationWarnings(res.warnings);
      setParsedPreview(res.parsedItems);
      setDuplicateCount(res.duplicateCount);
      if (res.valid) {
        setActiveTab('preview');
      } else {
        setActiveTab('editor');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSchema = () => {
    const blob = new Blob([JSON.stringify(EVIDENCE_JSON_SCHEMA_DEFINITION, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gcc-compass-evidence-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto font-mono">
      <div className="bg-[#FFFDF5] border-4 border-black shadow-[10px_10px_0px_0px_#000] max-w-3xl w-full my-8 flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b-3 border-black bg-[#FFE500]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-black text-[#FFE500] border border-black inline-flex">
                <Upload className="w-4 h-4 stroke-[2.5]" />
              </span>
              <h2 className="text-base font-black uppercase text-black font-display">
                Bulk Upload Evidence Records
              </h2>
            </div>
            <p className="text-xs text-black font-sans font-medium max-w-xl">
              Add multiple evidence, salary benchmark, and talent pool findings using strict JSON schema validation to guarantee audit compliance.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 bg-white hover:bg-[#FF5A36] hover:text-white text-black border-2 border-black font-black text-sm flex items-center justify-center shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex items-center justify-between px-6 pt-3 border-b-2 border-black bg-white">
          <div className="flex items-center gap-4 text-xs font-black uppercase">
            <button
              onClick={() => setActiveTab('editor')}
              className={`pb-2.5 transition-colors border-b-4 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'editor'
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>JSON Input</span>
              {validationErrors.length > 0 && (
                <span className="bg-[#FF5A36] text-white text-[10px] font-black px-1.5 py-0.2 border border-black">
                  {validationErrors.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('schema')}
              className={`pb-2.5 transition-colors border-b-4 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'schema'
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Schema & Specs</span>
            </button>

            <button
              onClick={() => {
                if (parsedPreview.length > 0) setActiveTab('preview');
                else handleValidateAndPreview();
              }}
              className={`pb-2.5 transition-colors border-b-4 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'preview'
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                Validation Preview {parsedPreview.length > 0 ? `(${parsedPreview.length})` : ''}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleLoadSample}
              className="text-[11px] font-black uppercase text-black bg-[#FAF7EE] hover:bg-[#FFE500] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer"
            >
              Load Sample Template
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'editor' && (
            <div className="space-y-4">
              {/* Drag & drop upload area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-3 border-dashed border-black p-5 text-center transition-colors cursor-pointer ${
                  dragActive ? 'bg-[#FFF9D2]' : 'bg-white hover:bg-[#FAF7EE]'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex flex-col items-center gap-1 text-xs">
                  <Upload className="w-6 h-6 stroke-[2.5] text-black mb-1" />
                  <span className="font-black uppercase text-black">
                    Click to browse or drop a .json file here
                  </span>
                  <span className="text-[11px] text-neutral-600 font-bold">
                    Accepts JSON array matching GCC Compass Evidence Schema
                  </span>
                </div>
              </div>

              {/* JSON Editor Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Raw JSON Input</span>
                  </label>
                  <span className="text-[11px] text-neutral-600 font-mono font-bold">
                    {jsonInput.length > 0 ? `${jsonInput.split('\n').length} lines` : 'Empty'}
                  </span>
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value);
                    if (validationErrors.length > 0) setValidationErrors([]);
                  }}
                  rows={10}
                  placeholder={`[\n  {\n    "claim": "Visakhapatnam offers 28-35% lower commercial operating cost compared to Bangalore or Hyderabad.",\n    "metricValue": "28% - 35% Cost Arbitrage",\n    "sourceName": "CBRE India Office Market Report 2024",\n    "classification": "third_party_estimate",\n    "limitations": "Prime IT SEZ spaces only; secondary real estate varies."\n  }\n]`}
                  className="w-full font-mono text-xs p-3 bg-black text-[#00F0A8] border-3 border-black focus:outline-none focus:border-[#FFE500] leading-relaxed shadow-[4px_4px_0px_0px_#000]"
                />
              </div>

              {/* Validation Feedback */}
              {validationErrors.length > 0 && (
                <div className="p-3.5 bg-[#FF5A36] text-white border-3 border-black shadow-[3px_3px_0px_0px_#000] space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-xs uppercase">
                    <AlertCircle className="w-4 h-4 stroke-[2.5] shrink-0" />
                    <span>Validation Failed ({validationErrors.length} issues found)</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-white text-[11px] font-mono">
                    {validationErrors.slice(0, 5).map((err, i) => (
                      <li key={i}>
                        <strong className="font-black">[{err.field}]</strong> {err.message}
                      </li>
                    ))}
                    {validationErrors.length > 5 && (
                      <li className="font-bold">
                        ...and {validationErrors.length - 5} more issues.
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {validationWarnings.length > 0 && (
                <div className="p-3 bg-[#FFE500] text-black border-2 border-black text-[11px] space-y-1 font-mono shadow-[2px_2px_0px_0px_#000]">
                  <div className="font-black uppercase flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                    <span>Normalization Notices:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {validationWarnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-black p-4 space-y-2 shadow-[3px_3px_0px_0px_#000]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 stroke-[2.5]" />
                    <span>Required JSON Schema Specification</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadSchema}
                      className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-black bg-[#FAF7EE] hover:bg-[#FFE500] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                    >
                      <Download className="w-3 h-3 stroke-[2.5]" />
                      Download Schema
                    </button>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(EVIDENCE_JSON_SCHEMA_DEFINITION, null, 2),
                          setCopiedSchema
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-black bg-[#FAF7EE] hover:bg-[#FFE500] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                    >
                      {copiedSchema ? <Check className="w-3 h-3 stroke-[3] text-black" /> : <Copy className="w-3 h-3 stroke-[2.5]" />}
                      {copiedSchema ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-800 font-sans">
                  Each item in the JSON array must satisfy the GCC Compass Epistemic Integrity Specification. Synthetic data or records lacking explicit limitations are flagged during validation.
                </p>
              </div>

              {/* Table of schema fields */}
              <div className="border-3 border-black overflow-hidden text-xs bg-white shadow-[3px_3px_0px_0px_#000]">
                <table className="w-full text-left">
                  <thead className="bg-[#FFE500] border-b-2 border-black text-black font-black uppercase text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 border-r-2 border-black">Field</th>
                      <th className="py-2.5 px-3 border-r-2 border-black">Type</th>
                      <th className="py-2.5 px-3 border-r-2 border-black">Requirement</th>
                      <th className="py-2.5 px-3">Description & Allowed Values</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black text-[11px]">
                    <tr>
                      <td className="py-2 px-3 font-mono font-black text-black border-r-2 border-black">claim</td>
                      <td className="py-2 px-3 text-neutral-700 border-r-2 border-black">string</td>
                      <td className="py-2 px-3 bg-[#FF5A36] text-white font-black uppercase border-r-2 border-black">Required</td>
                      <td className="py-2 px-3 text-neutral-800 font-sans">
                        The factual finding or benchmark statement (min 5 chars).
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono font-black text-black border-r-2 border-black">sourceName</td>
                      <td className="py-2 px-3 text-neutral-700 border-r-2 border-black">string</td>
                      <td className="py-2 px-3 bg-[#FF5A36] text-white font-black uppercase border-r-2 border-black">Required</td>
                      <td className="py-2 px-3 text-neutral-800 font-sans">
                        Original author, research firm, or statutory filing body.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono font-black text-black border-r-2 border-black">classification</td>
                      <td className="py-2 px-3 text-neutral-700 border-r-2 border-black">enum</td>
                      <td className="py-2 px-3 bg-[#FF5A36] text-white font-black uppercase border-r-2 border-black">Required</td>
                      <td className="py-2 px-3 text-neutral-800 font-mono text-[10px]">
                        verified_fact | third_party_estimate | company_announcement | model_inference | requires_verification
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono font-black text-black border-r-2 border-black">limitations</td>
                      <td className="py-2 px-3 text-neutral-700 border-r-2 border-black">string</td>
                      <td className="py-2 px-3 bg-[#FF5A36] text-white font-black uppercase border-r-2 border-black">Required</td>
                      <td className="py-2 px-3 text-neutral-800 font-sans">
                        Methodological boundaries, sample constraints, or unverified nuances.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-black border-r-2 border-black">metricValue</td>
                      <td className="py-2 px-3 text-neutral-700 border-r-2 border-black">string</td>
                      <td className="py-2 px-3 text-neutral-600 border-r-2 border-black font-bold uppercase">Optional</td>
                      <td className="py-2 px-3 text-neutral-800 font-sans">
                        Headline metric (e.g. &apos;90 Days Notice Period&apos;, &apos;1,000 Seating&apos;).
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-black border-r-2 border-black">sourceUrl</td>
                      <td className="py-2 px-3 text-neutral-700 border-r-2 border-black">uri string</td>
                      <td className="py-2 px-3 text-neutral-600 border-r-2 border-black font-bold uppercase">Optional</td>
                      <td className="py-2 px-3 text-neutral-800 font-sans">
                        Direct verifiable citation link.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-black border-r-2 border-black">geography</td>
                      <td className="py-2 px-3 text-neutral-700 border-r-2 border-black">string</td>
                      <td className="py-2 px-3 text-neutral-600 border-r-2 border-black font-bold uppercase">Optional</td>
                      <td className="py-2 px-3 text-neutral-800 font-sans">
                        Defaults to &apos;Visakhapatnam&apos; if not specified.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-black border-r-2 border-black">confidenceScore</td>
                      <td className="py-2 px-3 text-neutral-700 border-r-2 border-black">enum</td>
                      <td className="py-2 px-3 text-neutral-600 border-r-2 border-black font-bold uppercase">Optional</td>
                      <td className="py-2 px-3 text-neutral-800 font-mono text-[10px]">
                        High | Moderate | Low | Unverified (auto-assigned if omitted)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Sample JSON Block */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black uppercase text-black">Sample Batch Array</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(EVIDENCE_JSON_SCHEMA_EXAMPLE, null, 2),
                        setCopiedExample
                      )
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-black bg-[#FFE500] border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                  >
                    {copiedExample ? <Check className="w-3 h-3 stroke-[3] text-black" /> : <Copy className="w-3 h-3 stroke-[2.5]" />}
                    {copiedExample ? 'Copied Example' : 'Copy Example'}
                  </button>
                </div>
                <pre className="bg-black text-[#00F0A8] p-3 text-[11px] font-mono overflow-x-auto leading-relaxed border-3 border-black shadow-[3px_3px_0px_0px_#000]">
                  {JSON.stringify(EVIDENCE_JSON_SCHEMA_EXAMPLE, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-[#00F0A8] border-3 border-black shadow-[3px_3px_0px_0px_#000]">
                <div className="flex items-center gap-2 text-black text-xs">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5] shrink-0" />
                  <span className="font-black uppercase">
                    Schema Validation Passed: {parsedPreview.length} records ready for import
                  </span>
                </div>
                <span className="text-[11px] font-black uppercase text-black bg-white border border-black px-2 py-0.5">
                  Valid Structure
                </span>
              </div>

              {duplicateCount > 0 && (
                <div className="p-3 bg-[#FFE500] border-2 border-black text-black text-xs flex items-center justify-between shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 stroke-[2.5] shrink-0" />
                    <span>
                      <strong>{duplicateCount} duplicate records detected.</strong> Unique IDs assigned automatically to avoid overwriting existing data.
                    </span>
                  </div>
                </div>
              )}

              {/* Epistemic disclaimer */}
              <div className="p-2.5 bg-white border-2 border-black text-[11px] text-neutral-800 flex items-start gap-1.5 font-sans font-medium">
                <HelpCircle className="w-3.5 h-3.5 stroke-[2.5] text-black shrink-0 mt-0.5" />
                <span>
                  <strong>Epistemic Notice:</strong> Schema validation confirms JSON structure, field completeness, and classification types. It does not certify factual truth or prevent inaccurate benchmarks.
                </span>
              </div>

              {/* Preview List */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {parsedPreview.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white border-2 border-black text-xs space-y-2 shadow-[2px_2px_0px_0px_#000]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-black text-neutral-600 uppercase">
                          Record #{idx + 1} · {item.geography}
                        </span>
                        <h4 className="font-black uppercase text-black text-xs">{item.claim}</h4>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFE500] text-black border border-black shrink-0">
                        {item.classification.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-800 bg-[#FAF7EE] p-2 border border-black">
                      <div>
                        <strong className="text-black font-black uppercase">Source:</strong> {item.sourceName}
                      </div>
                      {item.metricValue && (
                        <div>
                          <strong className="text-black font-black uppercase">Metric:</strong> {item.metricValue}
                        </div>
                      )}
                      <div className="col-span-2">
                        <strong className="text-black font-black uppercase">Limitations:</strong> {item.limitations}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between p-4 px-6 border-t-3 border-black bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-black uppercase text-black bg-[#FAF7EE] hover:bg-neutral-200 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {activeTab !== 'preview' ? (
              <button
                onClick={handleValidateAndPreview}
                className="px-4 py-2 text-xs font-black uppercase text-black bg-white border-2 border-black hover:bg-[#FAF7EE] shadow-[2px_2px_0px_0px_#000] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                Validate JSON
              </button>
            ) : null}

            <button
              onClick={handleApplyUpload}
              disabled={parsedPreview.length === 0}
              className={`px-5 py-2 text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer ${
                parsedPreview.length > 0
                  ? 'bg-[#00F0A8] hover:bg-[#00d694] text-black'
                  : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Import {parsedPreview.length} Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
