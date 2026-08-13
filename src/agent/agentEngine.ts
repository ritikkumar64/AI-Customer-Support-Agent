import { agentTools } from './tools';
import { Customer, Order, ReasoningStep, RefundDecision, ToolCall } from './types';

export interface AgentExecutionProgress {
  steps: ReasoningStep[];
  isComplete: boolean;
  finalDecision?: RefundDecision;
  currentThought?: string;
}

export async function runAgentLoop(
  userMessage: string,
  selectedCustomerId?: string,
  selectedOrderId?: string,
  onStepUpdate?: (progress: AgentExecutionProgress) => void
): Promise<{ steps: ReasoningStep[]; decision: RefundDecision }> {
  const steps: ReasoningStep[] = [];
  const startTime = Date.now();

  const updateProgress = (isComplete: boolean, finalDecision?: RefundDecision, thought?: string) => {
    if (onStepUpdate) {
      onStepUpdate({
        steps: [...steps],
        isComplete,
        finalDecision,
        currentThought: thought
      });
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Extract Order ID or Customer ID from text if not provided explicitly
  const extractedOrderMatch = userMessage.match(/ORD-\d{4}/i);
  const targetOrderId = selectedOrderId || (extractedOrderMatch ? extractedOrderMatch[0].toUpperCase() : undefined);
  
  const extractedCustMatch = userMessage.match(/CUST-\d{4}/i);
  const targetCustomerId = selectedCustomerId || (extractedCustMatch ? extractedCustMatch[0].toUpperCase() : undefined);

  // STEP 1: PARSE INTENT
  const step1Thought = `[Agent Loop Initialized] Analyzing customer message intent...\nExtracted parameters: Order ID=${targetOrderId || 'Searching...'}, Customer ID=${targetCustomerId || 'Searching...'}.\nFormulating tool invocation plan.`;
  steps.push({
    stepNumber: 1,
    thought: step1Thought,
    status: 'thinking',
    timestamp: new Date().toLocaleTimeString()
  });
  updateProgress(false, undefined, step1Thought);
  await delay(600);

  // STEP 2: LOOKUP ORDER DETAILS
  let orderData: { order?: Order; customer?: Customer; error?: string } | undefined;
  let toolCall1: ToolCall | undefined;

  if (targetOrderId) {
    const t1Start = Date.now();
    orderData = agentTools.get_order_details(targetOrderId);
    toolCall1 = {
      id: `call_${Math.random().toString(36).substring(2, 9)}`,
      toolName: 'get_order_details',
      input: { orderId: targetOrderId },
      output: orderData,
      timestamp: new Date().toLocaleTimeString(),
      durationMs: Date.now() - t1Start + 120
    };

    steps[0].status = 'completed';
    steps.push({
      stepNumber: 2,
      thought: orderData.order
        ? `Retrieved order ${targetOrderId}. Item: "${orderData.order.items[0]?.name}" ($${orderData.order.totalAmount.toFixed(2)}). Delivered: ${orderData.order.deliveryDate}. Now querying customer CRM risk profile.`
        : `Tool call failed to locate order ${targetOrderId}. Searching CRM registry by customer ID.`,
      action: 'get_order_details',
      toolCall: toolCall1,
      status: 'calling_tool',
      timestamp: new Date().toLocaleTimeString()
    });
    updateProgress(false, undefined, steps[1].thought);
    await delay(700);
  }

  // Determine Customer ID
  const effectiveCustomerId = targetCustomerId || orderData?.customer?.id || 'CUST-1001';

  // STEP 3: FETCH CUSTOMER CRM PROFILE
  const t2Start = Date.now();
  const crmResult = agentTools.fetch_customer_profile(effectiveCustomerId);
  const toolCall2: ToolCall = {
    id: `call_${Math.random().toString(36).substring(2, 9)}`,
    toolName: 'fetch_customer_profile',
    input: { customerId: effectiveCustomerId },
    output: crmResult,
    timestamp: new Date().toLocaleTimeString(),
    durationMs: Date.now() - t2Start + 90
  };

  const customer = crmResult.customer;
  const step3Thought = customer
    ? `Customer CRM record found: ${customer.name} (${customer.id}). Tier: [${customer.tier}]. Lifetime Spend: $${customer.lifetimeSpend.toLocaleString()}. Return Rate: ${(customer.returnRate * 100).toFixed(1)}%. Fraud Risk Score: ${customer.fraudRiskScore}/100.`
    : `Customer record not found. Falling back to baseline risk verification.`;

  steps[steps.length - 1].status = 'completed';
  steps.push({
    stepNumber: steps.length + 1,
    thought: step3Thought,
    action: 'fetch_customer_profile',
    toolCall: toolCall2,
    status: 'calling_tool',
    timestamp: new Date().toLocaleTimeString()
  });
  updateProgress(false, undefined, step3Thought);
  await delay(700);

  // STEP 4: VERIFY POLICY COMPLIANCE
  const resolvedOrderId = targetOrderId || (customer?.activeOrders[0]?.orderId) || 'ORD-8821';
  const t3Start = Date.now();
  const policyResult = agentTools.verify_policy_compliance(resolvedOrderId);
  const toolCall3: ToolCall = {
    id: `call_${Math.random().toString(36).substring(2, 9)}`,
    toolName: 'verify_policy_compliance',
    input: { orderId: resolvedOrderId },
    output: policyResult,
    timestamp: new Date().toLocaleTimeString(),
    durationMs: Date.now() - t3Start + 150
  };

  const step4Thought = `Evaluated refund policy rules for ${resolvedOrderId}:\n- Days since delivery: ${policyResult.daysSinceDelivery} days.\n- Eligible by default: ${policyResult.eligible}.\n- Violations: ${policyResult.violations.length > 0 ? policyResult.violations.join('; ') : 'None'}.\n- Grace Override Available: ${policyResult.graceOverrideAvailable ? 'YES (' + policyResult.graceOverrideReason + ')' : 'NO'}.`;

  steps[steps.length - 1].status = 'completed';
  steps.push({
    stepNumber: steps.length + 1,
    thought: step4Thought,
    action: 'verify_policy_compliance',
    toolCall: toolCall3,
    status: 'evaluating',
    timestamp: new Date().toLocaleTimeString()
  });
  updateProgress(false, undefined, step4Thought);
  await delay(800);

  // STEP 5: FRAUD RISK ASSESSMENT
  const t4Start = Date.now();
  const fraudResult = agentTools.check_fraud_risk(effectiveCustomerId);
  const toolCall4: ToolCall = {
    id: `call_${Math.random().toString(36).substring(2, 9)}`,
    toolName: 'check_fraud_risk',
    input: { customerId: effectiveCustomerId },
    output: fraudResult,
    timestamp: new Date().toLocaleTimeString(),
    durationMs: Date.now() - t4Start + 110
  };

  const step5Thought = `Assessing Fraud Risk Guardrails for ${effectiveCustomerId}:\n- Risk Level: ${fraudResult.riskLevel} (${fraudResult.riskScore}/100).\n- Flags: ${fraudResult.riskFlags.length > 0 ? fraudResult.riskFlags.join(', ') : 'None'}.\n- Requires Human Escalation: ${fraudResult.requiresHumanEscalation}.`;

  steps[steps.length - 1].status = 'completed';
  steps.push({
    stepNumber: steps.length + 1,
    thought: step5Thought,
    action: 'check_fraud_risk',
    toolCall: toolCall4,
    status: 'evaluating',
    timestamp: new Date().toLocaleTimeString()
  });
  updateProgress(false, undefined, step5Thought);
  await delay(700);

  // STEP 6: EXECUTE FINAL DECISION TOOL
  let decision: RefundDecision;
  let decisionToolName = 'process_refund';
  let decisionToolInput: Record<string, any> = {};

  const order = orderData?.order || customer?.activeOrders[0];
  const orderAmount = order ? order.totalAmount : 299.99;

  // Decision logic evaluation
  if (fraudResult.requiresHumanEscalation || (userMessage.toLowerCase().includes('empty package') && customer?.fraudRiskScore! > 80)) {
    decisionToolName = 'escalate_to_human';
    decisionToolInput = { orderId: resolvedOrderId, escalationReason: 'Potential package fraud discrepancy on high-risk account.' };
    decision = agentTools.escalate_to_human(resolvedOrderId, decisionToolInput.escalationReason);
  } else if (policyResult.violations.length > 0 && !policyResult.graceOverrideAvailable) {
    decisionToolName = 'deny_refund';
    decisionToolInput = { orderId: resolvedOrderId, violationReasons: policyResult.violations };
    decision = agentTools.deny_refund(resolvedOrderId, policyResult.violations);
  } else if (policyResult.graceOverrideAvailable) {
    decisionToolName = 'process_refund';
    decisionToolInput = {
      orderId: resolvedOrderId,
      amount: orderAmount,
      justification: policyResult.graceOverrideReason || 'VIP Grace Period Exception Approved.',
      overrideApplied: true
    };
    decision = agentTools.process_refund(resolvedOrderId, orderAmount, decisionToolInput.justification, true);
  } else {
    decisionToolName = 'process_refund';
    decisionToolInput = {
      orderId: resolvedOrderId,
      amount: orderAmount,
      justification: 'Standard 30-day return criteria met in full.',
      overrideApplied: false
    };
    decision = agentTools.process_refund(resolvedOrderId, orderAmount, decisionToolInput.justification, false);
  }

  const t5Start = Date.now();
  const toolCall5: ToolCall = {
    id: `call_${Math.random().toString(36).substring(2, 9)}`,
    toolName: decisionToolName,
    input: decisionToolInput,
    output: decision,
    timestamp: new Date().toLocaleTimeString(),
    durationMs: Date.now() - t5Start + 80
  };

  const finalThought = `DECISION RENDERED: [${decision.status}]. Executed tool "${decisionToolName}".\nGenerated Customer Message: "${decision.customerNotificationMessage.substring(0, 100)}..."`;

  steps[steps.length - 1].status = 'completed';
  steps.push({
    stepNumber: steps.length + 1,
    thought: finalThought,
    action: decisionToolName,
    toolCall: toolCall5,
    decision: decision.status,
    status: 'completed',
    timestamp: new Date().toLocaleTimeString()
  });

  updateProgress(true, decision, finalThought);

  return { steps, decision };
}
