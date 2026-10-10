import { EvidenceItem, EvidenceClassification } from '../types';

export const EVIDENCE_JSON_SCHEMA_EXAMPLE = [
  {
    "claim": "Tech attrition in Tier-2 Indian hubs averages 12-16% annually compared to 22-26% in Tier-1 metros.",
    "metricValue": "12% - 16% Attrition",
    "sourceName": "NASSCOM Tier-2 Talent Report",
    "sourceUrl": "https://nasscom.in",
    "publicationDate": "August 2024",
    "dateChecked": "October 2024",
    "geography": "Visakhapatnam",
    "jobCategories": ["Software Engineering", "Talent Operations"],
    "classification": "third_party_estimate",
    "confidenceScore": "Moderate",
    "limitations": "Survey sampled 45 GCCs and IT service providers across tier-2 cities.",
    "relevanceToScenario": "Supports workforce retention stability assumption for long-term ramp."
  }
];

export const EVIDENCE_JSON_SCHEMA_DEFINITION = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "EvidenceItemsBatch",
  "description": "JSON schema for bulk uploading evidence and uncertainty records to GCC Compass",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["claim", "sourceName", "classification", "limitations"],
    "properties": {
      "id": {
        "type": "string",
        "description": "Unique record identifier (auto-generated if omitted)"
      },
      "claim": {
        "type": "string",
        "minLength": 5,
        "description": "The exact factual claim, benchmark metric, or uncertainty statement"
      },
      "metricValue": {
        "type": "string",
        "description": "Quantified value or headline metric (e.g. '60-90 Days Notice Period')"
      },
      "sourceName": {
        "type": "string",
        "minLength": 2,
        "description": "Author, publisher, government gazette, or primary filing body"
      },
      "sourceUrl": {
        "type": "string",
        "format": "uri",
        "description": "Direct verifiable citation link (optional)"
      },
      "publicationDate": {
        "type": "string",
        "description": "Date or period when data was originally published (defaults to current month/year)"
      },
      "dateChecked": {
        "type": "string",
        "description": "Audit verification timestamp (defaults to current date)"
      },
      "geography": {
        "type": "string",
        "description": "Location focus (e.g. 'Visakhapatnam', 'Pan-India', 'India Tech Sector')"
      },
      "jobCategories": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Applicable job families or functional disciplines"
      },
      "classification": {
        "type": "string",
        "enum": [
          "verified_fact",
          "third_party_estimate",
          "company_announcement",
          "model_inference",
          "requires_verification"
        ],
        "description": "Epistemic classification grade according to GCC Compass evidentiary hierarchy"
      },
      "confidenceScore": {
        "type": "string",
        "enum": ["High", "Moderate", "Low", "Unverified"],
        "description": "Confidence level grading (defaults automatically based on classification if omitted)"
      },
      "limitations": {
        "type": "string",
        "description": "Sample boundaries, missing parameters, unverified variables, or caveats"
      },
      "relevanceToScenario": {
        "type": "string",
        "description": "Specific rationale connecting this evidence to workforce modeling or feasibility"
      }
    }
  }
};

export interface ValidationErrorItem {
  index: number;
  field: string;
  message: string;
}

export interface BulkUploadValidationResult {
  valid: boolean;
  parsedItems: EvidenceItem[];
  errors: ValidationErrorItem[];
  warnings: string[];
  duplicateCount: number;
}

const VALID_CLASSIFICATIONS: EvidenceClassification[] = [
  'verified_fact',
  'third_party_estimate',
  'company_announcement',
  'model_inference',
  'requires_verification',
];

const VALID_CONFIDENCE_SCORES = ['High', 'Moderate', 'Low', 'Unverified'] as const;

export function validateBulkEvidenceJson(
  jsonString: string,
  existingEvidence: EvidenceItem[] = []
): BulkUploadValidationResult {
  const errors: ValidationErrorItem[] = [];
  const warnings: string[] = [];
  let duplicateCount = 0;
  let parsedRaw: unknown;

  try {
    parsedRaw = JSON.parse(jsonString);
  } catch (err) {
    return {
      valid: false,
      parsedItems: [],
      errors: [
        {
          index: 0,
          field: 'JSON Syntax',
          message: err instanceof Error ? err.message : 'Invalid JSON format. Check brackets and quotes.',
        },
      ],
      warnings: [],
      duplicateCount: 0,
    };
  }

  // Handle either an array directly or an object with an "evidence" / "items" array property
  let itemsArray: unknown[] = [];
  if (Array.isArray(parsedRaw)) {
    itemsArray = parsedRaw;
  } else if (parsedRaw && typeof parsedRaw === 'object') {
    const obj = parsedRaw as Record<string, unknown>;
    if (Array.isArray(obj.evidence)) {
      itemsArray = obj.evidence;
    } else if (Array.isArray(obj.items)) {
      itemsArray = obj.items;
    } else if (Array.isArray(obj.data)) {
      itemsArray = obj.data;
    } else {
      return {
        valid: false,
        parsedItems: [],
        errors: [
          {
            index: 0,
            field: 'Root Structure',
            message: 'Top-level JSON must be an array of evidence records or contain an "evidence" array.',
          },
        ],
        warnings: [],
        duplicateCount: 0,
      };
    }
  } else {
    return {
      valid: false,
      parsedItems: [],
      errors: [
        {
          index: 0,
          field: 'Root Structure',
          message: 'Top-level JSON must be an array of evidence items.',
        },
      ],
      warnings: [],
      duplicateCount: 0,
    };
  }

  if (itemsArray.length === 0) {
    return {
      valid: false,
      parsedItems: [],
      errors: [
        {
          index: 0,
          field: 'Empty Dataset',
          message: 'The uploaded JSON contains 0 evidence records.',
        },
      ],
      warnings: [],
      duplicateCount: 0,
    };
  }

  const currentDateStr = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
  const parsedItems: EvidenceItem[] = [];

  itemsArray.forEach((raw, idx) => {
    const itemNum = idx + 1;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      errors.push({
        index: itemNum,
        field: 'Record Structure',
        message: `Item #${itemNum} must be an object with evidence fields.`,
      });
      return;
    }

    const item = raw as Record<string, unknown>;

    // 1. claim validation (required, string, minLength: 5)
    if (!item.claim || typeof item.claim !== 'string' || item.claim.trim().length < 5) {
      errors.push({
        index: itemNum,
        field: 'claim',
        message: `Item #${itemNum}: "claim" is required and must be at least 5 characters.`,
      });
    }

    // 2. sourceName validation (required, string, minLength: 2)
    if (!item.sourceName || typeof item.sourceName !== 'string' || item.sourceName.trim().length < 2) {
      errors.push({
        index: itemNum,
        field: 'sourceName',
        message: `Item #${itemNum}: "sourceName" is required (e.g. publication, survey, government report).`,
      });
    }

    // 3. classification validation (required, enum)
    const classification = item.classification as EvidenceClassification;
    if (!classification || !VALID_CLASSIFICATIONS.includes(classification)) {
      errors.push({
        index: itemNum,
        field: 'classification',
        message: `Item #${itemNum}: "classification" must be one of: ${VALID_CLASSIFICATIONS.join(', ')}.`,
      });
    }

    // 4. limitations validation (required, string)
    if (
      item.limitations === undefined ||
      item.limitations === null ||
      typeof item.limitations !== 'string' ||
      item.limitations.trim().length === 0
    ) {
      errors.push({
        index: itemNum,
        field: 'limitations',
        message: `Item #${itemNum}: "limitations" is required to preserve epistemic transparency and anti-hallucination standards.`,
      });
    }

    // 5. sourceUrl format verification (strict protocol security: only http or https allowed)
    let normalizedUrl: string | undefined = undefined;
    if (item.sourceUrl !== undefined && item.sourceUrl !== null) {
      if (typeof item.sourceUrl !== 'string') {
        errors.push({
          index: itemNum,
          field: 'sourceUrl',
          message: `Item #${itemNum}: "sourceUrl" must be a valid URL string when provided.`,
        });
      } else if (item.sourceUrl.trim().length > 0) {
        const trimmedUrl = item.sourceUrl.trim();
        // Disallow dangerous URI schemes (javascript:, data:, vbscript:)
        if (/^(javascript|data|vbscript|file):/i.test(trimmedUrl)) {
          errors.push({
            index: itemNum,
            field: 'sourceUrl',
            message: `Item #${itemNum}: Unsafe URL scheme detected. Only http:// or https:// citations are permitted.`,
          });
        } else if (/^https?:\/\//i.test(trimmedUrl)) {
          normalizedUrl = trimmedUrl;
        } else {
          // If no protocol was specified, prepend https://
          normalizedUrl = `https://${trimmedUrl}`;
          warnings.push(`Item #${itemNum}: Added 'https://' prefix to URL "${trimmedUrl}".`);
        }
      }
    }

    // 6. jobCategories array formatting
    let categories: string[] = ['Workforce Planning'];
    if (Array.isArray(item.jobCategories) && item.jobCategories.length > 0) {
      categories = item.jobCategories
        .filter((c) => typeof c === 'string' && c.trim().length > 0)
        .map((c) => (c as string).trim());
      if (categories.length === 0) {
        categories = ['Workforce Planning'];
      }
    } else if (typeof item.jobCategories === 'string' && item.jobCategories.trim().length > 0) {
      categories = item.jobCategories.split(',').map((c) => c.trim()).filter(Boolean);
    }

    // 7. confidenceScore: clearly labelled heuristic grading based on source classification
    // (Note: This is an epistemic classification heuristic, NOT an external proof of factual veracity)
    let confidence: 'High' | 'Moderate' | 'Low' | 'Unverified' = 'Moderate';
    if (
      item.confidenceScore &&
      typeof item.confidenceScore === 'string' &&
      VALID_CONFIDENCE_SCORES.includes(item.confidenceScore as any)
    ) {
      confidence = item.confidenceScore as any;
    } else if (classification === 'verified_fact') {
      confidence = 'High';
    } else if (classification === 'third_party_estimate') {
      confidence = 'Moderate';
    } else if (classification === 'requires_verification') {
      confidence = 'Unverified';
    } else {
      confidence = 'Low';
    }

    // Check for duplicate claim or ID against existing library or previous items in batch
    const trimmedClaim = typeof item.claim === 'string' ? item.claim.trim().toLowerCase() : '';
    const assignedId = typeof item.id === 'string' && item.id.trim().length > 0
      ? item.id.trim()
      : `ev-bulk-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;

    const isDuplicateOfExisting = existingEvidence.some(
      (existing) =>
        (existing.id && existing.id.toLowerCase() === assignedId.toLowerCase()) ||
        (existing.claim && existing.claim.trim().toLowerCase() === trimmedClaim)
    );

    const isDuplicateInBatch = parsedItems.some(
      (prev) =>
        (prev.id && prev.id.toLowerCase() === assignedId.toLowerCase()) ||
        (prev.claim && prev.claim.trim().toLowerCase() === trimmedClaim)
    );

    if (isDuplicateOfExisting) {
      duplicateCount++;
      warnings.push(
        `Item #${itemNum} matches an existing record in the Evidence Library (ID: "${assignedId}" or identical claim). It will be imported as a revised version with a unique ID.`
      );
    } else if (isDuplicateInBatch) {
      duplicateCount++;
      warnings.push(
        `Item #${itemNum} contains a duplicate claim or ID within this batch. A unique ID was generated to preserve data integrity.`
      );
    }

    // Build verified EvidenceItem
    const validEvidenceItem: EvidenceItem = {
      id: isDuplicateOfExisting || isDuplicateInBatch
        ? `ev-bulk-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`
        : assignedId,
      claim: typeof item.claim === 'string' ? item.claim.trim() : '',
      metricValue: typeof item.metricValue === 'string' && item.metricValue.trim().length > 0
        ? item.metricValue.trim()
        : undefined,
      sourceName: typeof item.sourceName === 'string' ? item.sourceName.trim() : '',
      sourceUrl: normalizedUrl,
      publicationDate: typeof item.publicationDate === 'string' && item.publicationDate.trim().length > 0
        ? item.publicationDate.trim()
        : currentDateStr,
      dateChecked: typeof item.dateChecked === 'string' && item.dateChecked.trim().length > 0
        ? item.dateChecked.trim()
        : currentDateStr,
      geography: typeof item.geography === 'string' && item.geography.trim().length > 0
        ? item.geography.trim()
        : 'Visakhapatnam',
      jobCategories: categories,
      classification: classification || 'requires_verification',
      confidenceScore: confidence,
      limitations: typeof item.limitations === 'string' ? item.limitations.trim() : '',
      relevanceToScenario: typeof item.relevanceToScenario === 'string' && item.relevanceToScenario.trim().length > 0
        ? item.relevanceToScenario.trim()
        : 'Imported via bulk upload to substantiate workforce planning model.',
    };

    parsedItems.push(validEvidenceItem);
  });

  return {
    valid: errors.length === 0,
    parsedItems: errors.length === 0 ? parsedItems : [],
    errors,
    warnings,
    duplicateCount,
  };
}
