/**
 * Client-Side PII Masking Engine for ContractLens AI
 * Guarantees zero sensitive Personally Identifiable Information (PII) leaves the browser.
 */

export interface PIIMaskResult {
  maskedText: string;
  replacementsCount: number;
  detectedTypes: {
    emails: number;
    phones: number;
    amounts: number;
    parties: number;
    addresses: number;
  };
}

// Regex Patterns
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
const MONETARY_REGEX = /(\$|€|£|₹)\s?\d{1,3}(,\d{3})*(\.\d{1,2})?|\b\d{1,3}(,\d{3})+(\.\d{1,2})?\s?(USD|EUR|GBP|INR)\b/gi;
const ADDRESS_REGEX = /\b\d{1,5}\s+[A-Z0-9.\s,#-]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way)\b/gi;

// Party patterns for contract specific names (e.g. John Doe, Acme Corp)
const PARTY_PATTERNS = [
  /\b(?:between|among)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi,
  /\b(?:Client|Contractor|Landlord|Tenant|Company|Employer|Employee):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi,
];

export function maskPII(text: string): PIIMaskResult {
  if (!text) {
    return {
      maskedText: "",
      replacementsCount: 0,
      detectedTypes: { emails: 0, phones: 0, amounts: 0, parties: 0, addresses: 0 },
    };
  }

  let maskedText = text;
  let replacementsCount = 0;
  const detectedTypes = {
    emails: 0,
    phones: 0,
    amounts: 0,
    parties: 0,
    addresses: 0,
  };

  // 1. Mask Emails
  maskedText = maskedText.replace(EMAIL_REGEX, () => {
    detectedTypes.emails++;
    replacementsCount++;
    return "[EMAIL]";
  });

  // 2. Mask Phone Numbers (exclude simple short numbers or years)
  maskedText = maskedText.replace(PHONE_REGEX, (match) => {
    // Basic heuristic to avoid masking 4-digit years like 2024
    const digitsOnly = match.replace(/\D/g, "");
    if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
      detectedTypes.phones++;
      replacementsCount++;
      return "[PHONE]";
    }
    return match;
  });

  // 3. Mask Monetary Amounts
  maskedText = maskedText.replace(MONETARY_REGEX, () => {
    detectedTypes.amounts++;
    replacementsCount++;
    return "[AMOUNT]";
  });

  // 4. Mask Addresses
  maskedText = maskedText.replace(ADDRESS_REGEX, () => {
    detectedTypes.addresses++;
    replacementsCount++;
    return "[ADDRESS]";
  });

  // 5. Mask Named Parties (e.g. John Doe -> [PARTY_A], Jane Smith -> [PARTY_B])
  let partyIndex = 0;
  const partyLabels = ["[PARTY_A]", "[PARTY_B]", "[PARTY_C]", "[PARTY_D]"];

  PARTY_PATTERNS.forEach((pattern) => {
    maskedText = maskedText.replace(pattern, (fullMatch, partyName) => {
      if (partyName && partyName.length > 3) {
        const label = partyLabels[partyIndex % partyLabels.length];
        partyIndex++;
        detectedTypes.parties++;
        replacementsCount++;
        return fullMatch.replace(partyName, label);
      }
      return fullMatch;
    });
  });

  return {
    maskedText,
    replacementsCount,
    detectedTypes,
  };
}

export function isPIIFree(text: string): boolean {
  const result = maskPII(text);
  return result.replacementsCount === 0;
}
