export type CustomerTier = 'VIP' | 'Gold' | 'Standard' | 'High-Risk';

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  category: 'electronics' | 'apparel' | 'digital' | 'home' | 'beauty';
  condition: 'unopened' | 'opened_like_new' | 'damaged' | 'missing_parts';
  tagsAttached: boolean;
  isDigital: boolean;
  serialNumber?: string;
  image?: string;
}

export interface Order {
  orderId: string;
  customerId: string;
  purchaseDate: string; // YYYY-MM-DD
  deliveryDate: string; // YYYY-MM-DD
  status: 'delivered' | 'shipped' | 'processing' | 'refunded' | 'cancelled';
  totalAmount: number;
  returnWindowDays: number; // usually 30 days
  items: OrderItem[];
  paymentMethod: string;
  shippingAddress: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: CustomerTier;
  memberSince: string;
  totalOrders: number;
  lifetimeSpend: number;
  returnRate: number; // percentage e.g. 0.05 = 5%
  fraudRiskScore: number; // 0 to 100 (high is risky)
  status: 'active' | 'under_review' | 'flagged';
  notes: string;
  activeOrders: Order[];
  pastRefundsCount: number;
}

export interface ToolCall {
  id: string;
  toolName: string;
  input: Record<string, any>;
  output: Record<string, any>;
  timestamp: string;
  durationMs: number;
}

export interface ReasoningStep {
  stepNumber: number;
  thought: string;
  action?: string;
  toolCall?: ToolCall;
  decision?: 'APPROVED' | 'DENIED' | 'ESCALATED';
  timestamp: string;
  status: 'thinking' | 'calling_tool' | 'evaluating' | 'completed';
}

export type RefundStatus = 'APPROVED' | 'DENIED' | 'ESCALATED';

export interface RefundDecision {
  status: RefundStatus;
  orderId: string;
  customerId: string;
  refundAmount: number;
  violationReasons: string[];
  appliedPolicyRules: string[];
  overrideApplied?: boolean;
  overrideJustification?: string;
  customerNotificationMessage: string;
  agentSignature: string;
  processedAt: string;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  category: 'Approved' | 'Denied' | 'VIP Edge Case' | 'Fraud Edge Case';
  badgeColor: string;
  customerId: string;
  orderId: string;
  description: string;
  promptText: string;
  expectedOutcome: RefundStatus;
  keyRule: string;
}
