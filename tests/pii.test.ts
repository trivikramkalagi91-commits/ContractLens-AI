import { describe, it, expect } from "vitest";
import { maskPII, isPIIFree } from "@/lib/pii";

describe("Client-Side PII Masking Engine", () => {
  it("should mask email addresses with [EMAIL]", () => {
    const text = "Contact john.doe@example.com or support@acme.org for details.";
    const result = maskPII(text);
    expect(result.maskedText).toContain("[EMAIL]");
    expect(result.maskedText).not.toContain("john.doe@example.com");
    expect(result.maskedText).not.toContain("support@acme.org");
    expect(result.detectedTypes.emails).toBe(2);
  });

  it("should mask phone numbers with [PHONE]", () => {
    const text = "Call +1 555-123-4567 or 800-555-0199 for assistance.";
    const result = maskPII(text);
    expect(result.maskedText).toContain("[PHONE]");
    expect(result.maskedText).not.toContain("555-123-4567");
    expect(result.detectedTypes.phones).toBe(2);
  });

  it("should mask monetary amounts with [AMOUNT]", () => {
    const text = "Monthly rent is $2,500.00 or £1,800 or €2,000 per month.";
    const result = maskPII(text);
    expect(result.maskedText).toContain("[AMOUNT]");
    expect(result.maskedText).not.toContain("$2,500.00");
    expect(result.maskedText).not.toContain("£1,800");
    expect(result.detectedTypes.amounts).toBe(3);
  });

  it("should mask contract party names with [PARTY_A], [PARTY_B]", () => {
    const text = "This agreement is between John Doe and Acme Corp.";
    const result = maskPII(text);
    expect(result.maskedText).toContain("[PARTY_A]");
    expect(result.detectedTypes.parties).toBeGreaterThan(0);
  });

  it("should mask physical street addresses with [ADDRESS]", () => {
    const text = "The premises located at 123 Main Street, Suite 400.";
    const result = maskPII(text);
    expect(result.maskedText).toContain("[ADDRESS]");
    expect(result.maskedText).not.toContain("123 Main Street");
    expect(result.detectedTypes.addresses).toBe(1);
  });

  it("should handle empty strings cleanly", () => {
    const result = maskPII("");
    expect(result.maskedText).toBe("");
    expect(result.replacementsCount).toBe(0);
  });

  it("should return correct replacement counts", () => {
    const text = "Contact alice@test.com for $5,000 invoice.";
    const result = maskPII(text);
    expect(result.replacementsCount).toBe(2);
  });

  it("should verify isPIIFree helper function", () => {
    expect(isPIIFree("Standard generic legal clause without PII.")).toBe(true);
    expect(isPIIFree("Send payment to test@sample.com.")).toBe(false);
  });

  it("should preserve standard legal terminology", () => {
    const text = "Section 4.1 Indemnification and Limitation of Liability.";
    const result = maskPII(text);
    expect(result.maskedText).toContain("Indemnification");
    expect(result.maskedText).toContain("Limitation of Liability");
    expect(result.replacementsCount).toBe(0);
  });

  it("should handle complex contract text with multiple PII elements", () => {
    const text = `Lease between Landlord: Alice Smith and Tenant: Bob Jones for 500 Oak Avenue. Monthly rent $1,200 payable to billing@property.com or call 212-555-0199.`;
    const result = maskPII(text);
    expect(result.replacementsCount).toBeGreaterThanOrEqual(4);
    expect(result.maskedText).toContain("[EMAIL]");
    expect(result.maskedText).toContain("[AMOUNT]");
    expect(result.maskedText).toContain("[PHONE]");
  });
});
