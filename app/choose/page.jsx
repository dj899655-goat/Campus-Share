"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  PlusCircle, 
  Search, 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert,
  Coins
} from "lucide-react";

export default function ChooseRolePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 2 of 4: Select Your Path</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {user?.name ? `Welcome, ${user.name}!` : "Choose Your Goal"}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          What would you like to do on CampusShare today? You can switch roles or do both anytime!
        </p>
      </div>

      {/* Two Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Lend */}
        <Link
          href="/lend"
          className="group relative bg-white rounded-3xl border-2 border-slate-200 hover:border-indigo-600 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
        >
          <div>
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              <PlusCircle className="w-8 h-8" />
            </div>

            <div className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
              For Item Owners
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
              I want to Lend
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Have things sitting in your hostel room or bag? List your scientific calculator, textbooks, 
              or lab gear for your batchmates to borrow.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Set your own daily rental rate & refundable deposit</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You approve or decline every incoming request</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Meet safely right on campus for handover</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-bold text-sm">
            <span>Go to Lender Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Borrow */}
        <Link
          href="/borrow"
          className="group relative bg-white rounded-3xl border-2 border-slate-200 hover:border-violet-600 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
        >
          <div>
            <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
              <Search className="w-8 h-8" />
            </div>

            <div className="inline-block text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md mb-2">
              For Students in Need
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-violet-600 transition-colors">
              I want to Borrow
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Need a lab coat for chemistry practicals tomorrow or a reference book for your assignment? 
              Borrow from students on campus at a fraction of the cost.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Browse available items across college departments</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-click borrow requests sent directly to the owner</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Track request status (Pending, Approved, Declined)</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-violet-600 font-bold text-sm">
            <span>Browse Campus Feed</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      <div className="mt-12 text-center text-xs text-slate-400">
        Tip: You can seamlessly switch between Lend and Borrow from the top navigation bar at any time.
      </div>
    </div>
  );
}

