import { Customer, ScenarioPreset } from '../agent/types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-1001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tier: 'VIP',
    memberSince: '2021-03-15',
    totalOrders: 48,
    lifetimeSpend: 14500.00,
    returnRate: 0.02,
    fraudRiskScore: 5,
    status: 'active',
    notes: 'Top tier VIP client. High loyalty, minimal returns, priority customer care enabled.',
    pastRefundsCount: 1,
    activeOrders: [
      {
        orderId: 'ORD-8821',
        customerId: 'CUST-1001',
        purchaseDate: '2026-07-28',
        deliveryDate: '2026-08-01',
        status: 'delivered',
        totalAmount: 299.99,
        returnWindowDays: 30,
        paymentMethod: 'Visa ending in 4242',
        shippingAddress: '742 Evergreen Terrace, Springfield, OR',
        items: [
          {
            itemId: 'ITEM-8821-A',
            name: 'UltraNoise ANC Headphones Pro',
            price: 299.99,
            category: 'electronics',
            condition: 'unopened',
            tagsAttached: true,
            isDigital: false,
            serialNumber: 'SN-ANC-99401',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1002',
    name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tier: 'High-Risk',
    memberSince: '2025-11-10',
    totalOrders: 12,
    lifetimeSpend: 420.00,
    returnRate: 0.82,
    fraudRiskScore: 88,
    status: 'flagged',
    notes: 'Automated Fraud Alert: 10 returns out of 12 orders. History of returning worn items with removed tags.',
    pastRefundsCount: 10,
    activeOrders: [
      {
        orderId: 'ORD-9104',
        customerId: 'CUST-1002',
        purchaseDate: '2026-08-02',
        deliveryDate: '2026-08-08',
        status: 'delivered',
        totalAmount: 650.00,
        returnWindowDays: 30,
        paymentMethod: 'Mastercard ending in 8812',
        shippingAddress: '104 Hudson Yards, New York, NY',
        items: [
          {
            itemId: 'ITEM-9104-A',
            name: 'Designer Italian Leather Biker Jacket',
            price: 650.00,
            category: 'apparel',
            condition: 'damaged',
            tagsAttached: false,
            isDigital: false,
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1003',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tier: 'Standard',
    memberSince: '2024-06-20',
    totalOrders: 9,
    lifetimeSpend: 1200.00,
    returnRate: 0.10,
    fraudRiskScore: 15,
    status: 'active',
    notes: 'Regular software and digital goods buyer. No prior flags.',
    pastRefundsCount: 1,
    activeOrders: [
      {
        orderId: 'ORD-7740',
        customerId: 'CUST-1003',
        purchaseDate: '2026-08-10',
        deliveryDate: '2026-08-10',
        status: 'delivered',
        totalAmount: 199.00,
        returnWindowDays: 30,
        paymentMethod: 'PayPal (elena.rostova@example.com)',
        shippingAddress: 'Digital Download Delivery',
        items: [
          {
            itemId: 'ITEM-7740-A',
            name: 'Pro Studio Audio DAW License Key (Digital)',
            price: 199.00,
            category: 'digital',
            condition: 'unopened',
            tagsAttached: true,
            isDigital: true,
            serialNumber: 'KEY-DAW-2026-88192-X',
            image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1004',
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tier: 'VIP',
    memberSince: '2020-01-10',
    totalOrders: 62,
    lifetimeSpend: 28000.00,
    returnRate: 0.04,
    fraudRiskScore: 8,
    status: 'active',
    notes: 'Longstanding VIP buyer. Requesting return 32 days post-delivery (2 days outside 30-day window). VIP policy flex applicable.',
    pastRefundsCount: 2,
    activeOrders: [
      {
        orderId: 'ORD-6402',
        customerId: 'CUST-1004',
        purchaseDate: '2026-07-02',
        deliveryDate: '2026-07-12', // Delivered 32 days before Aug 13
        status: 'delivered',
        totalAmount: 450.00,
        returnWindowDays: 30,
        paymentMethod: 'Amex ending in 1004',
        shippingAddress: '42 Wallaby Way, San Francisco, CA',
        items: [
          {
            itemId: 'ITEM-6402-A',
            name: 'Ergonomic Mesh Executive Chair',
            price: 450.00,
            category: 'home',
            condition: 'opened_like_new',
            tagsAttached: true,
            isDigital: false,
            image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1005',
    name: 'Aisha Sharma',
    email: 'aisha.s@example.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    tier: 'Gold',
    memberSince: '2023-09-01',
    totalOrders: 24,
    lifetimeSpend: 6100.00,
    returnRate: 0.12,
    fraudRiskScore: 12,
    status: 'active',
    notes: 'Gold member. Reported item screen cracked on arrival with courier photo proof attached.',
    pastRefundsCount: 3,
    activeOrders: [
      {
        orderId: 'ORD-5190',
        customerId: 'CUST-1005',
        purchaseDate: '2026-07-22',
        deliveryDate: '2026-07-26',
        status: 'delivered',
        totalAmount: 349.99,
        returnWindowDays: 30,
        paymentMethod: 'Visa ending in 9012',
        shippingAddress: '15 Ocean Drive, Miami, FL',
        items: [
          {
            itemId: 'ITEM-5190-A',
            name: 'Titanium OLED Smart Watch Series 7',
            price: 349.99,
            category: 'electronics',
            condition: 'damaged',
            tagsAttached: true,
            isDigital: false,
            serialNumber: 'SN-SW-77102',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1006',
    name: 'Liam O\'Connor',
    email: 'liam.oc@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    tier: 'Standard',
    memberSince: '2024-02-14',
    totalOrders: 5,
    lifetimeSpend: 650.00,
    returnRate: 0.15,
    fraudRiskScore: 35,
    status: 'active',
    notes: 'Order delivered 48 days ago. Exceeds max 30-day window by 18 days.',
    pastRefundsCount: 1,
    activeOrders: [
      {
        orderId: 'ORD-4412',
        customerId: 'CUST-1006',
        purchaseDate: '2026-06-15',
        deliveryDate: '2026-06-26', // Delivered 48 days ago
        status: 'delivered',
        totalAmount: 149.00,
        returnWindowDays: 30,
        paymentMethod: 'Apple Pay',
        shippingAddress: '88 Beacon St, Boston, MA',
        items: [
          {
            itemId: 'ITEM-4412-A',
            name: 'RGB Wireless Mechanical Keyboard',
            price: 149.00,
            category: 'electronics',
            condition: 'opened_like_new',
            tagsAttached: false,
            isDigital: false,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1007',
    name: 'Zoe Chen',
    email: 'zoe.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    tier: 'Gold',
    memberSince: '2022-11-30',
    totalOrders: 31,
    lifetimeSpend: 8900.00,
    returnRate: 0.08,
    fraudRiskScore: 10,
    status: 'active',
    notes: 'Frequent fashion buyer. Returns delivered items promptly with tags intact.',
    pastRefundsCount: 2,
    activeOrders: [
      {
        orderId: 'ORD-3390',
        customerId: 'CUST-1007',
        purchaseDate: '2026-07-28',
        deliveryDate: '2026-07-31',
        status: 'delivered',
        totalAmount: 420.00,
        returnWindowDays: 30,
        paymentMethod: 'Visa ending in 3311',
        shippingAddress: '55 Pine St, Seattle, WA',
        items: [
          {
            itemId: 'ITEM-3390-A',
            name: '100% Cashmere Winter Trench Coat',
            price: 420.00,
            category: 'apparel',
            condition: 'unopened',
            tagsAttached: true,
            isDigital: false,
            image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1008',
    name: 'Devon Miller',
    email: 'devon.m@example.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    tier: 'High-Risk',
    memberSince: '2026-01-05',
    totalOrders: 4,
    lifetimeSpend: 180.00,
    returnRate: 0.75,
    fraudRiskScore: 92,
    status: 'under_review',
    notes: 'CRITICAL FRAUD WARN: Claiming empty package box despite FedEx signature verification and weight check at dispatch (1.4kg).',
    pastRefundsCount: 3,
    activeOrders: [
      {
        orderId: 'ORD-2101',
        customerId: 'CUST-1008',
        purchaseDate: '2026-08-04',
        deliveryDate: '2026-08-08',
        status: 'delivered',
        totalAmount: 189.00,
        returnWindowDays: 30,
        paymentMethod: 'Debit ending in 9901',
        shippingAddress: '99 Elm Street, Chicago, IL',
        items: [
          {
            itemId: 'ITEM-2101-A',
            name: 'Studio Master Wireless Earbuds',
            price: 189.00,
            category: 'electronics',
            condition: 'missing_parts',
            tagsAttached: false,
            isDigital: false,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1009',
    name: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tier: 'Standard',
    memberSince: '2023-05-18',
    totalOrders: 14,
    lifetimeSpend: 2400.00,
    returnRate: 0.09,
    fraudRiskScore: 18,
    status: 'active',
    notes: 'Purchased 4K Monitor, unopened in factory sealed box, 25 days post delivery.',
    pastRefundsCount: 1,
    activeOrders: [
      {
        orderId: 'ORD-1892',
        customerId: 'CUST-1009',
        purchaseDate: '2026-07-15',
        deliveryDate: '2026-07-19',
        status: 'delivered',
        totalAmount: 599.00,
        returnWindowDays: 30,
        paymentMethod: 'Visa ending in 6620',
        shippingAddress: '120 Peachtree St, Atlanta, GA',
        items: [
          {
            itemId: 'ITEM-1892-A',
            name: '27-inch 4K IPS 144Hz Gaming Monitor',
            price: 599.00,
            category: 'electronics',
            condition: 'unopened',
            tagsAttached: true,
            isDigital: false,
            serialNumber: 'SN-MON-4K-99012',
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1010',
    name: 'James Wilson',
    email: 'james.w@example.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    tier: 'Standard',
    memberSince: '2024-09-12',
    totalOrders: 8,
    lifetimeSpend: 980.00,
    returnRate: 0.22,
    fraudRiskScore: 45,
    status: 'active',
    notes: 'Attempting to return used espresso machine with coffee bean residue and missing original packaging.',
    pastRefundsCount: 2,
    activeOrders: [
      {
        orderId: 'ORD-1755',
        customerId: 'CUST-1010',
        purchaseDate: '2026-08-01',
        deliveryDate: '2026-08-05',
        status: 'delivered',
        totalAmount: 280.00,
        returnWindowDays: 30,
        paymentMethod: 'Mastercard ending in 4102',
        shippingAddress: '304 Oak Ave, Austin, TX',
        items: [
          {
            itemId: 'ITEM-1755-A',
            name: 'Italian Barista Pump Espresso Machine',
            price: 280.00,
            category: 'home',
            condition: 'damaged',
            tagsAttached: false,
            isDigital: false,
            image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1011',
    name: 'Amara Okafor',
    email: 'amara.o@example.com',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    tier: 'VIP',
    memberSince: '2021-08-08',
    totalOrders: 52,
    lifetimeSpend: 19200.00,
    returnRate: 0.03,
    fraudRiskScore: 4,
    status: 'active',
    notes: 'VIP customer. Unopened luxury tote bag within 20 days of delivery.',
    pastRefundsCount: 1,
    activeOrders: [
      {
        orderId: 'ORD-1620',
        customerId: 'CUST-1011',
        purchaseDate: '2026-07-20',
        deliveryDate: '2026-07-24',
        status: 'delivered',
        totalAmount: 750.00,
        returnWindowDays: 30,
        paymentMethod: 'Amex Platinum ending in 0091',
        shippingAddress: '88 Park Ave, New York, NY',
        items: [
          {
            itemId: 'ITEM-1620-A',
            name: 'Handcrafted Italian Calfskin Tote Bag',
            price: 750.00,
            category: 'apparel',
            condition: 'unopened',
            tagsAttached: true,
            isDigital: false,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1012',
    name: 'Lucas Dubois',
    email: 'lucas.d@example.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    tier: 'Gold',
    memberSince: '2023-01-20',
    totalOrders: 20,
    lifetimeSpend: 4800.00,
    returnRate: 0.14,
    fraudRiskScore: 20,
    status: 'active',
    notes: 'Returned unopened smart hub within 15 days.',
    pastRefundsCount: 3,
    activeOrders: [
      {
        orderId: 'ORD-1511',
        customerId: 'CUST-1012',
        purchaseDate: '2026-07-26',
        deliveryDate: '2026-07-29',
        status: 'delivered',
        totalAmount: 220.00,
        returnWindowDays: 30,
        paymentMethod: 'Visa ending in 7701',
        shippingAddress: '404 Sunset Blvd, Los Angeles, CA',
        items: [
          {
            itemId: 'ITEM-1511-A',
            name: 'Smart Home Automation Controller',
            price: 220.00,
            category: 'electronics',
            condition: 'unopened',
            tagsAttached: true,
            isDigital: false,
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1013',
    name: 'Maya Patel',
    email: 'maya.p@example.com',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    tier: 'High-Risk',
    memberSince: '2025-10-01',
    totalOrders: 6,
    lifetimeSpend: 310.00,
    returnRate: 0.68,
    fraudRiskScore: 81,
    status: 'flagged',
    notes: 'Opened and partially used beauty cosmetics bundle. Non-returnable hygiene item.',
    pastRefundsCount: 4,
    activeOrders: [
      {
        orderId: 'ORD-1402',
        customerId: 'CUST-1013',
        purchaseDate: '2026-08-02',
        deliveryDate: '2026-08-06',
        status: 'delivered',
        totalAmount: 160.00,
        returnWindowDays: 30,
        paymentMethod: 'Mastercard ending in 1109',
        shippingAddress: '55 Lake Drive, Denver, CO',
        items: [
          {
            itemId: 'ITEM-1402-A',
            name: 'Radiance Botanical Skincare Set',
            price: 160.00,
            category: 'beauty',
            condition: 'opened_like_new',
            tagsAttached: false,
            isDigital: false,
            image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1014',
    name: 'Benjamin Taylor',
    email: 'ben.taylor@example.com',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aefd?w=150&auto=format&fit=crop&q=80',
    tier: 'Standard',
    memberSince: '2024-04-10',
    totalOrders: 11,
    lifetimeSpend: 1550.00,
    returnRate: 0.06,
    fraudRiskScore: 14,
    status: 'active',
    notes: 'Returned portable speaker on Day 29 of 30 day window. Condition unopened.',
    pastRefundsCount: 1,
    activeOrders: [
      {
        orderId: 'ORD-1310',
        customerId: 'CUST-1014',
        purchaseDate: '2026-07-12',
        deliveryDate: '2026-07-15', // 29 days post delivery on Aug 13
        status: 'delivered',
        totalAmount: 89.00,
        returnWindowDays: 30,
        paymentMethod: 'PayPal',
        shippingAddress: '77 Main St, Dallas, TX',
        items: [
          {
            itemId: 'ITEM-1310-A',
            name: 'Waterproof Bluetooth Outdoor Speaker',
            price: 89.00,
            category: 'electronics',
            condition: 'unopened',
            tagsAttached: true,
            isDigital: false,
            image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  {
    id: 'CUST-1015',
    name: 'Chloe Dupont',
    email: 'chloe.d@example.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    tier: 'Gold',
    memberSince: '2023-03-25',
    totalOrders: 27,
    lifetimeSpend: 5400.00,
    returnRate: 0.07,
    fraudRiskScore: 11,
    status: 'active',
    notes: 'Gold customer requesting return 31 days after delivery (1 day over standard 30-day window). Gold policy grace period applies.',
    pastRefundsCount: 2,
    activeOrders: [
      {
        orderId: 'ORD-1205',
        customerId: 'CUST-1015',
        purchaseDate: '2026-07-08',
        deliveryDate: '2026-07-13', // 31 days ago
        status: 'delivered',
        totalAmount: 699.00,
        returnWindowDays: 30,
        paymentMethod: 'Visa ending in 5500',
        shippingAddress: '100 Broadway, Seattle, WA',
        items: [
          {
            itemId: 'ITEM-1205-A',
            name: 'Professional Pen Display Graphic Tablet 16',
            price: 699.00,
            category: 'electronics',
            condition: 'opened_like_new',
            tagsAttached: true,
            isDigital: false,
            image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  }
];

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'preset-approve-standard',
    title: 'Standard Approved Refund',
    category: 'Approved',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    customerId: 'CUST-1001',
    orderId: 'ORD-8821',
    description: 'Sarah Jenkins (VIP) requests return for unopened UltraNoise Headphones delivered 12 days ago.',
    promptText: 'Hi, I bought the UltraNoise ANC Headphones (Order #ORD-8821). Box is unopened and delivered 12 days ago. Can I get a full refund?',
    expectedOutcome: 'APPROVED',
    keyRule: 'Rule 1.1: 30-day return window met & unopened original packaging.'
  },
  {
    id: 'preset-deny-digital',
    title: 'Digital License Denial',
    category: 'Denied',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    customerId: 'CUST-1003',
    orderId: 'ORD-7740',
    description: 'Elena Rostova requests refund for activated Pro Studio Audio DAW license key (Digital product).',
    promptText: 'I would like to return my Pro Studio DAW license key for order ORD-7740 because I decided to use another software.',
    expectedOutcome: 'DENIED',
    keyRule: 'Rule 3.2: Digital goods and license keys are non-refundable once activated/delivered.'
  },
  {
    id: 'preset-vip-edgecase',
    title: 'VIP Window Overriding Edge Case',
    category: 'VIP Edge Case',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    customerId: 'CUST-1004',
    orderId: 'ORD-6402',
    description: 'David Kim (VIP, $28k spend) requests return 32 days post-delivery (2 days beyond standard 30-day limit).',
    promptText: 'Hello, I bought an Ergonomic Chair on Order ORD-6402. It was delivered 32 days ago. I missed the 30 day mark by 2 days, can you help?',
    expectedOutcome: 'APPROVED',
    keyRule: 'Rule 4.1: VIP Customer Grace Period (5-day exception for LTV > $10,000 & Risk < 15).'
  },
  {
    id: 'preset-fraud-denial',
    title: 'High-Risk Fraud Denial',
    category: 'Fraud Edge Case',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    customerId: 'CUST-1002',
    orderId: 'ORD-9104',
    description: 'Marcus Vance (82% return rate, risk score 88) wants refund for damaged leather jacket with tags removed.',
    promptText: 'I want a refund for the Leather Jacket on order ORD-9104. Tags are removed and it has a slight tear.',
    expectedOutcome: 'DENIED',
    keyRule: 'Rule 2.4 & Rule 5.1: Tags missing + damaged item + Fraud Risk Score > 75.'
  }
];
