import { MOCK_CUSTOMERS } from '../data/crmData';
import { REFUND_POLICY_RULES } from '../data/refundPolicy';
import { Customer, Order, RefundDecision, ToolCall } from './types';

export const agentTools = {
  fetch_customer_profile: (customerId: string): { customer?: Customer; error?: string } => {
    const customer = MOCK_CUSTOMERS.find(c => c.id.toLowerCase() === customerId.toLowerCase() || c.name.toLowerCase().includes(customerId.toLowerCase()));
    if (!customer) {
      return { error: `Customer '${customerId}' not found in CRM database.` };
    }
    return { customer };
  },

  get_order_details: (orderId: string): { order?: Order; customer?: Customer; error?: string } => {
    for (const customer of MOCK_CUSTOMERS) {
      const order = customer.activeOrders.find(o => o.orderId.toLowerCase() === orderId.toLowerCase());
      if (order) {
        return { order, customer };
      }
    }
    return { error: `Order ID '${orderId}' was not found in the order registry.` };
  },

  verify_policy_compliance: (orderId: string, targetItemId?: string): {
    eligible: boolean;
    daysSinceDelivery: number;
    violations: string[];
    applicableRules: string[];
    graceOverrideAvailable: boolean;
    graceOverrideReason?: string;
  } => {
    let order: Order | undefined;
    let customer: Customer | undefined;

    for (const c of MOCK_CUSTOMERS) {
      const o = c.activeOrders.find(item => item.orderId.toLowerCase() === orderId.toLowerCase());
      if (o) {
        order = o;
        customer = c;
        break;
      }
    }

    if (!order || !customer) {
      return {
        eligible: false,
        daysSinceDelivery: 0,
        violations: [`Order ${orderId} not found.`],
        applicableRules: [],
        graceOverrideAvailable: false
      };
    }

    // Calculate days since delivery based on current date (Aug 13, 2026)
    const currentDate = new Date('2026-08-13').getTime();
    const deliveryDate = new Date(order.deliveryDate).getTime();
    const diffTime = Math.abs(currentDate - deliveryDate);
    const daysSinceDelivery = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const violations: string[] = [];
    const applicableRules: string[] = [];
    let graceOverrideAvailable = false;
    let graceOverrideReason: string | undefined;

    // Rule 101: 30-day window
    if (daysSinceDelivery <= 30) {
      applicableRules.push('RULE-101: Standard 30-Day Return Window Satisfied');
    } else {
      violations.push(`Return requested ${daysSinceDelivery} days after delivery (exceeds 30-day limit by ${daysSinceDelivery - 30} days).`);

      // Check Tier Grace Period (Rule 401 & 402)
      if (customer.tier === 'VIP' && daysSinceDelivery <= 35 && customer.fraudRiskScore < 15) {
        graceOverrideAvailable = true;
        graceOverrideReason = `RULE-401 (VIP Grace Privilege): VIP tier member with $${customer.lifetimeSpend.toLocaleString()} spend & low risk score (${customer.fraudRiskScore}) granted 5-day grace window extension.`;
        applicableRules.push('RULE-401: VIP Tier 5-Day Grace Override Active');
      } else if (customer.tier === 'Gold' && daysSinceDelivery <= 33 && customer.fraudRiskScore < 20) {
        graceOverrideAvailable = true;
        graceOverrideReason = `RULE-402 (Gold Grace Privilege): Gold tier member granted 3-day grace window extension (requested day ${daysSinceDelivery}).`;
        applicableRules.push('RULE-402: Gold Tier 3-Day Grace Override Active');
      }
    }

    // Check items
    const itemToCheck = targetItemId
      ? order.items.find(i => i.itemId.toLowerCase() === targetItemId.toLowerCase())
      : order.items[0];

    if (itemToCheck) {
      // Digital item check
      if (itemToCheck.isDigital) {
        violations.push(`RULE-202 Violation: Item '${itemToCheck.name}' is a digital product / license key and is strictly non-refundable.`);
      }

      // Packaging / Damage check
      if (itemToCheck.condition === 'damaged' && !itemToCheck.tagsAttached) {
        violations.push(`RULE-201 Violation: Item '${itemToCheck.name}' was returned damaged with tags removed.`);
      }

      // Hygiene check
      if (itemToCheck.category === 'beauty' && itemToCheck.condition !== 'unopened') {
        violations.push(`RULE-203 Violation: Cosmetics item '${itemToCheck.name}' has been opened (Sanitary Exclusion).`);
      }
    }

    const eligible = (violations.length === 0) || graceOverrideAvailable;

    return {
      eligible,
      daysSinceDelivery,
      violations,
      applicableRules,
      graceOverrideAvailable,
      graceOverrideReason
    };
  },

  check_fraud_risk: (customerId: string): {
    customerId: string;
    riskScore: number;
    returnRatePercentage: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    requiresHumanEscalation: boolean;
    riskFlags: string[];
  } => {
    const customer = MOCK_CUSTOMERS.find(c => c.id.toLowerCase() === customerId.toLowerCase());
    if (!customer) {
      return {
        customerId,
        riskScore: 0,
        returnRatePercentage: '0%',
        riskLevel: 'LOW',
        requiresHumanEscalation: false,
        riskFlags: ['Customer record not found']
      };
    }

    const riskFlags: string[] = [];
    if (customer.fraudRiskScore >= 75) riskFlags.push(`High Fraud Risk Score (${customer.fraudRiskScore}/100)`);
    if (customer.returnRate >= 0.70) riskFlags.push(`Abnormal Return Rate (${(customer.returnRate * 100).toFixed(0)}% of all orders returned)`);
    if (customer.pastRefundsCount >= 8) riskFlags.push(`Excessive refund count history (${customer.pastRefundsCount} lifetime refunds)`);

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (customer.fraudRiskScore >= 80) riskLevel = 'CRITICAL';
    else if (customer.fraudRiskScore >= 50) riskLevel = 'HIGH';
    else if (customer.fraudRiskScore >= 25) riskLevel = 'MEDIUM';

    const requiresHumanEscalation = customer.fraudRiskScore >= 85 && customer.returnRate >= 0.75;

    return {
      customerId: customer.id,
      riskScore: customer.fraudRiskScore,
      returnRatePercentage: `${(customer.returnRate * 100).toFixed(1)}%`,
      riskLevel,
      requiresHumanEscalation,
      riskFlags
    };
  },

  process_refund: (orderId: string, amount: number, justification: string, overrideApplied: boolean = false): RefundDecision => {
    let order: Order | undefined;
    let customer: Customer | undefined;

    for (const c of MOCK_CUSTOMERS) {
      const o = c.activeOrders.find(item => item.orderId.toLowerCase() === orderId.toLowerCase());
      if (o) {
        order = o;
        customer = c;
        break;
      }
    }

    const timestamp = new Date().toISOString();

    return {
      status: 'APPROVED',
      orderId: orderId.toUpperCase(),
      customerId: customer ? customer.id : 'UNKNOWN',
      refundAmount: amount,
      violationReasons: [],
      appliedPolicyRules: overrideApplied
        ? ['RULE-101: Standard Refund', 'RULE-401: VIP Discretionary Grace Period Override']
        : ['RULE-101: Standard Return Eligibility Met', 'RULE-102: Original Condition Verified'],
      overrideApplied,
      overrideJustification: overrideApplied ? justification : undefined,
      customerNotificationMessage: `Great news! Your refund request for order ${orderId.toUpperCase()} ($${amount.toFixed(2)}) has been APPROVED. The credit will appear on your ${order?.paymentMethod || 'original payment method'} within 3-5 business days.`,
      agentSignature: 'AuraSupport-Agent-v4.2 [Validated via Policy Engine]',
      processedAt: timestamp
    };
  },

  deny_refund: (orderId: string, violationReasons: string[]): RefundDecision => {
    let customerId = 'UNKNOWN';
    for (const c of MOCK_CUSTOMERS) {
      if (c.activeOrders.some(o => o.orderId.toLowerCase() === orderId.toLowerCase())) {
        customerId = c.id;
        break;
      }
    }

    const timestamp = new Date().toISOString();

    return {
      status: 'DENIED',
      orderId: orderId.toUpperCase(),
      customerId,
      refundAmount: 0,
      violationReasons,
      appliedPolicyRules: ['RULE-201: Policy Non-Compliance Exclusion', 'RULE-301: Fraud & Risk Policy Guardrails'],
      customerNotificationMessage: `Regrettably, your refund request for order ${orderId.toUpperCase()} cannot be approved at this time.\n\nReason(s):\n${violationReasons.map(r => `• ${r}`).join('\n')}\n\nIf you believe this is an error, you may request an agent appeal by providing additional proof of purchase/receipt.`,
      agentSignature: 'AuraSupport-Agent-v4.2 [Strict Compliance Denial]',
      processedAt: timestamp
    };
  },

  escalate_to_human: (orderId: string, escalationReason: string): RefundDecision => {
    let customerId = 'UNKNOWN';
    for (const c of MOCK_CUSTOMERS) {
      if (c.activeOrders.some(o => o.orderId.toLowerCase() === orderId.toLowerCase())) {
        customerId = c.id;
        break;
      }
    }

    const timestamp = new Date().toISOString();

    return {
      status: 'ESCALATED',
      orderId: orderId.toUpperCase(),
      customerId,
      refundAmount: 0,
      violationReasons: [escalationReason],
      appliedPolicyRules: ['RULE-302: Fraud Security Escalation Required'],
      customerNotificationMessage: `Your refund request for order ${orderId.toUpperCase()} has been forwarded to our Senior Security & Fraud Specialist team for manual verification. Case Ticket #ESC-${Math.floor(100000 + Math.random() * 900000)} has been created. A specialist will review carrier weight logs and contact you within 24 hours.`,
      agentSignature: 'AuraSupport-Agent-v4.2 [Escalated to Human Investigation]',
      processedAt: timestamp
    };
  }
};
