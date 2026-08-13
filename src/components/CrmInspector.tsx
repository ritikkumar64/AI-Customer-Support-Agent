import React, { useState } from 'react';
import { MOCK_CUSTOMERS } from '../data/crmData';
import { Customer, CustomerTier } from '../agent/types';
import { Database, Search, Filter, ShieldAlert, Award, Package, ArrowUpRight } from 'lucide-react';

export const CrmInspector: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'ALL' || c.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">CRM Customer Database Inspector (15 Profiles)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Authoritative customer profiles, risk metrics, return frequencies, and lifetime order histories.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, ID, or email..."
              className="bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Tier Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['ALL', 'VIP', 'Gold', 'Standard', 'High-Risk'].map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedTier === tier
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Grid (15 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map(customer => {
          const activeOrder = customer.activeOrders[0];
          return (
            <div
              key={customer.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-700"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white">{customer.name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{customer.id}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg ${
                    customer.tier === 'VIP' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    customer.tier === 'Gold' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                    customer.tier === 'High-Risk' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {customer.tier}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Lifetime Value</div>
                    <div className="font-bold text-emerald-400 mt-0.5">${customer.lifetimeSpend.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Return Rate</div>
                    <div className={`font-bold mt-0.5 ${customer.returnRate > 0.5 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {(customer.returnRate * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Risk Score</div>
                    <div className={`font-bold mt-0.5 ${customer.fraudRiskScore >= 75 ? 'text-rose-400' : 'text-indigo-400'}`}>
                      {customer.fraudRiskScore}/100
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <p className="mt-3 text-[11px] text-slate-400 italic line-clamp-2">
                  "{customer.notes}"
                </p>
              </div>

              {/* Active Order Footer */}
              {activeOrder && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                    <Package className="w-3.5 h-3.5 text-indigo-400" />
                    <span>#{activeOrder.orderId}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Delivered: <strong className="text-slate-200">{activeOrder.deliveryDate}</strong>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
