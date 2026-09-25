export interface SampleContract {
  id: string;
  name: string;
  type: string;
  description: string;
  text: string;
}

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: "predatory-freelance-msa",
    name: "Predatory Freelance MSA",
    type: "Freelance Agreement",
    description: "Contains uncapped liability, 120-day payment terms, permanent non-compete, and client IP ownership of prior work.",
    text: `MASTER SERVICES AGREEMENT (MSA)

This Master Services Agreement ("Agreement") is entered into between Acme Digital Corp ("Client") and [PARTY_A] ("Contractor").

1. PAYMENT TERMS & INVOICING
1.1 Client shall pay Contractor for Services rendered within 120 (one hundred and twenty) days following receipt of an approved invoice.
1.2 Client reserves the absolute right to withhold payment indefinitely if Client reasonably deems the deliverables unsatisfactory or incomplete at its sole discretion.
1.3 Contractor agrees that no late payment fees, interest, or penalties shall accrue on overdue amounts.

2. INTELLECTUAL PROPERTY & WORK FOR HIRE
2.1 All inventions, designs, code, domain names, trade secrets, and original work created by Contractor before, during, or after the term of this Agreement shall automatically become the sole and exclusive property of Client worldwide in perpetuity.
2.2 Contractor hereby assigns to Client all right, title, and interest in Contractor's background technology and proprietary tools used in connection with the Services.

3. INDEMNIFICATION & UNCAPPED LIABILITY
3.1 Contractor shall fully indemnify, defend, and hold harmless Client, its officers, directors, employees, and affiliates from and against any losses, liabilities, damages, claims, or legal expenses (including full attorney fees) arising from any performance under this Agreement.
3.2 Contractor's liability under this Agreement shall be UNCAPPED and unlimited. Client's maximum total liability to Contractor shall under no circumstances exceed $10.00.

4. NON-COMPETE & RESTRICTIVE COVENANTS
4.1 For a period of five (5) years following termination of this Agreement for any reason, Contractor shall not directly or indirectly provide services to, engage with, or work for any entity operating within the same industry as Client anywhere in the world.

5. TERMINATION
5.1 Client may terminate this Agreement immediately at any time without cause or prior notice.
5.2 Contractor may only terminate this Agreement upon providing 180 days written notice to Client, during which Contractor must continue work without additional compensation.

6. GOVERNING LAW & VENUE
6.1 This Agreement shall be governed by the laws of the State of Delaware, without regard to conflict of law principles. Any legal action must be brought exclusively in Delaware courts.`,
  },
  {
    id: "harsh-residential-lease",
    name: "Harsh Residential Lease",
    type: "Real Estate Lease",
    description: "Includes automatic 20% annual rent increases, landlord right of entry without notice, and total forfeiture of security deposit.",
    text: `RESIDENTIAL LEASE AGREEMENT

This Lease Agreement ("Lease") is entered into by [PARTY_A] ("Landlord") and [PARTY_B] ("Tenant") for the premises located at [ADDRESS].

1. RENT & AUTOMATIC INCREASES
1.1 Tenant agrees to pay monthly rent of [AMOUNT] on or before the 1st of each calendar month.
1.2 Rent shall automatically increase by 20% on each annual renewal of this Lease without prior notice or tenant consent.
1.3 Rent payments submitted after 11:59 PM on the 1st day of the month shall incur a mandatory late penalty fee of $250.00 plus $25 per calendar day.

2. SECURITY DEPOSIT & FORFEITURE
2.1 Tenant shall deposit with Landlord the sum of [AMOUNT] as a security deposit.
2.2 Tenant agrees that Landlord shall retain 100% of the Security Deposit upon lease expiration as a mandatory non-refundable turnover fee, regardless of property condition.

3. LANDLORD RIGHT OF ENTRY
3.1 Landlord and Landlord's agents, contractors, and inspectors reserve the right to enter the Premises at any hour of the day or night without prior notice to Tenant for inspections, repairs, or showings.
3.2 Tenant shall not alter locks or add secondary locks under penalty of immediate eviction and forfeiture of all personal property inside the premises.

4. MAINTENANCE & REPAIRS
4.1 Tenant shall be solely responsible for all maintenance, repairs, HVAC replacements, plumbing issues, and structural repairs exceeding $50.00.
4.2 Tenant waives all rights under implied warranty of habitability.

5. PETS & GUESTS
5.1 No overnight guests are permitted for more than one consecutive night. Any unauthorized guest will incur a penalty of $100 per night.
5.2 Pets are strictly prohibited. Violation results in an immediate $1,000 fine and lease termination.`,
  },
  {
    id: "standard-saas-tos",
    name: "Standard SaaS Terms of Service",
    type: "Software Agreement",
    description: "Standard commercial terms with 30-day cancellation, 99.9% uptime SLA, and limited liability capped at 12 months fees.",
    text: `TERMS OF SERVICE AGREEMENT

Welcome to CloudPulse ("Service"). This Terms of Service Agreement ("Terms") governs your use of the CloudPulse platform provided by CloudPulse Inc ("Company").

1. SUBSCRIPTION & BILLING
1.1 CloudPulse provides software-as-a-service on a monthly or annual subscription basis.
1.2 Subscriptions automatically renew at the end of each billing period unless canceled at least thirty (30) days prior to the renewal date.
1.3 Fees paid are non-refundable except as explicitly provided in Section 4 (SLA Guarantee).

2. DATA PRIVACY & SECURITY
2.1 Company agrees to implement industry-standard administrative, physical, and technical safeguards to protect Customer Data.
2.2 Customer retains all rights, title, and ownership of Customer Data uploaded to the Service. Company shall not use Customer Data for any purpose other than providing the Service.

3. LIMITATION OF LIABILITY
3.1 EXCEPT FOR INTENTIONAL MISCONDUCT OR BREACH OF CONFIDENTIALITY, NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
3.2 THE TOTAL AGGREGATE LIABILITY OF EITHER PARTY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

4. SERVICE LEVEL AGREEMENT (SLA)
4.1 Company guarantees 99.9% monthly uptime for the Core Service.
4.2 If uptime falls below 99.9% in any calendar month, Customer shall be entitled to a 15% service credit applied to the next billing invoice upon written request within 30 days.

5. TERMINATION FOR CONVENIENCE
5.1 Either party may terminate this Agreement for any reason upon thirty (30) days advance written notice to the other party.
5.2 Upon termination, Customer may export all Customer Data within 30 days before permanent deletion.`,
  },
];
