export interface PolicyRule {
  id: string;
  category: 'General' | 'Exclusions' | 'Fraud & Risk' | 'Tiered Exceptions';
  title: string;
  condition: string;
  enforcement: 'STRICT_DENY' | 'STANDARD_APPROVE' | 'DISCRETIONARY_OVERRIDE' | 'FLAG_HUMAN';
  description: string;
}

export const REFUND_POLICY_RULES: PolicyRule[] = [
  {
    id: 'RULE-101',
    category: 'General',
    title: 'Standard Return Window (30 Days)',
    condition: 'daysSinceDelivery <= 30',
    enforcement: 'STANDARD_APPROVE',
    description: 'Physical merchandise is eligible for a full refund within 30 days of confirmed carrier delivery date.'
  },
  {
    id: 'RULE-102',
    category: 'General',
    title: 'Packaging & Condition Requirement',
    condition: 'condition === "unopened" || condition === "opened_like_new"',
    enforcement: 'STANDARD_APPROVE',
    description: 'Item must retain original box, manuals, accessories, and factory seal/tags where applicable.'
  },
  {
    id: 'RULE-201',
    category: 'Exclusions',
    title: 'Damaged / Missing Tags Violation',
    condition: 'condition === "damaged" && tagsAttached === false',
    enforcement: 'STRICT_DENY',
    description: 'Items returned damaged, washed, worn, or missing price/brand tags are automatically denied refund.'
  },
  {
    id: 'RULE-202',
    category: 'Exclusions',
    title: 'Digital Goods & Software License Key Exclusion',
    condition: 'isDigital === true',
    enforcement: 'STRICT_DENY',
    description: 'Digital downloads, software product keys, and virtual vouchers are strictly non-refundable once delivered or accessed.'
  },
  {
    id: 'RULE-203',
    category: 'Exclusions',
    title: 'Hygiene & Consumables Exclusion',
    condition: 'category === "beauty" && condition !== "unopened"',
    enforcement: 'STRICT_DENY',
    description: 'Opened skincare, cosmetics, or consumable goods cannot be returned due to sanitary health regulations.'
  },
  {
    id: 'RULE-301',
    category: 'Fraud & Risk',
    title: 'High Fraud Risk Threshold',
    condition: 'fraudRiskScore >= 75 || returnRate > 0.70',
    enforcement: 'STRICT_DENY',
    description: 'Accounts flagged with fraud risk scores >= 75 or return rates > 70% are subject to strict policy enforcement and deny discretionary flexes.'
  },
  {
    id: 'RULE-302',
    category: 'Fraud & Risk',
    title: 'Empty Box / Missing Package Escalation',
    condition: 'condition === "missing_parts" && fraudRiskScore > 80',
    enforcement: 'FLAG_HUMAN',
    description: 'Claims of missing contents or empty package boxes for high-risk accounts must be escalated to the Human Fraud Investigation Team.'
  },
  {
    id: 'RULE-401',
    category: 'Tiered Exceptions',
    title: 'VIP Member Grace Extension (+5 Days)',
    condition: 'customerTier === "VIP" && daysSinceDelivery <= 35 && fraudRiskScore < 15',
    enforcement: 'DISCRETIONARY_OVERRIDE',
    description: 'VIP tier customers with high lifetime spend ($10k+) and low risk score (<15) are granted a 5-day grace period override for late returns.'
  },
  {
    id: 'RULE-402',
    category: 'Tiered Exceptions',
    title: 'Gold Member Grace Extension (+3 Days)',
    condition: 'customerTier === "Gold" && daysSinceDelivery <= 33 && fraudRiskScore < 20',
    enforcement: 'DISCRETIONARY_OVERRIDE',
    description: 'Gold tier members receive a 3-day grace period override for returns between 31-33 days post-delivery.'
  }
];

export const REFUND_POLICY_MARKDOWN = `# E-Commerce Refund Policy & Operational Guidelines (v4.2)

## 1. General Eligibility Criteria
1.1 **Standard Return Window**: Customers may initiate a return within **30 calendar days** from the date of package delivery.
1.2 **Item Condition**: Returned items must be unopened or in "opened like-new" condition with all original packaging, tags, cables, and documentation included.

## 2. Strict Exclusions & Non-Refundable Items
2.1 **Digital Products**: All digital downloads, software license keys, audio production packages, and downloadable media are **100% Non-Refundable** once generated or accessed.
2.2 **Hygiene & Beauty Products**: Opened skincare, makeup, or personal care items cannot be accepted for refund under global health guidelines.
2.3 **Damaged / Altered Apparel**: Any garment with removed tags, signs of wash/wear, or post-purchase damage will be rejected without credit.

## 3. Fraud Prevention & Risk Controls
3.1 **High-Risk Account Flagging**: Customer profiles exhibiting a return rate greater than 70% or an automated Fraud Risk Score $\ge 75$ are disqualified from discretionary policy flexes.
3.2 **Discrepancy Investigation**: Serial number mismatches or claims of "empty box delivery" despite carrier weight confirmation are automatically escalated to Human Fraud Audit (FLAG_HUMAN).

## 4. Tiered VIP Exception Matrix
4.1 **VIP Tier Privilege**: VIP Accounts ($\ge \$10,000$ lifetime value, $< 5\%$ return rate) are eligible for a **5-Day Return Window Grace Period** (up to 35 days post delivery) and automated supervisor override approval.
4.2 **Gold Tier Privilege**: Gold Accounts ($\ge \$4,000$ lifetime value) are eligible for a **3-Day Return Window Grace Period** (up to 33 days post delivery).
`;
