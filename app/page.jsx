import Link from "next/link";
import { getItems } from "@/lib/db";
import { 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Cpu, 
  FlaskConical, 
  Dumbbell, 
  Repeat,
  MapPin
} from "lucide-react";

export const revalidate = 0; // Fresh items on load

export default function HomePage() {
  const items = getItems({ status: "available" }).slice(0, 3);

  const categoryIcons = {
    "electronics": Cpu,
    "book": BookOpen,
    "lab equipment": FlaskConical,
    "sports": Dumbbell,
  };

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-semibold tracking-wide">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Campus-Exclusive Marketplace</span>
            <span className="text-indigo-300">•</span>
            <span className="text-emerald-700 font-bold">100% Student Verified</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Borrow what you need. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
              Lend what you don't.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Scientific calculators for exams, textbooks for assignments, or lab coats for practicals. 
            Connect directly with verified students on your campus for affordable peer-to-peer item sharing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5"
            >
              <span>Get started — instant Gmail OTP</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/borrow"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm hover:border-slate-400 transition-all"
            >
              <span>Browse Campus Items</span>
            </Link>
          </div>

          {/* Quick trust highlights */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-200 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant Gmail OTP</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-200 shadow-sm">
              <Coins className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Pocket-Friendly Rates</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>On-Campus Handover</span>
            </div>
          </div>
        </div>
      </section>

      {/* Systematic Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-800/60 px-3 py-1 rounded-full border border-indigo-700">
              Systematic Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 text-white">
              How CampusShare Works
            </h2>
            <p className="text-sm sm:text-base text-indigo-200 mt-2">
              Simple 4-step process designed specifically for college campuses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-lg text-white mb-1.5">Verify College Email</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Enter your student details and verify via 6-digit OTP. Only enrolled college students are permitted.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-violet-500 text-white flex items-center justify-center font-black text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-lg text-white mb-1.5">Choose Role</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Select <strong>Lend</strong> to monetize items you don't use every day, or <strong>Borrow</strong> to find essentials.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center font-black text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-lg text-white mb-1.5">Request & Approve</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Borrowers send requests in one click. Item owners review details and approve or decline incoming requests.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm mb-3">
                4
              </div>
              <h3 className="font-bold text-lg text-white mb-1.5">Campus Exchange</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Meet at the campus library, cafeteria, or hostel gate. Inspect item, exchange deposit, and return when done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available Right Now on Campus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Recent Campus Listings
            </h2>
          </div>
          <Link
            href="/borrow"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View all items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => {
            const catKey = (item.category || "").toLowerCase();
            const Icon = categoryIcons[catKey] || BookOpen;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <Icon className="w-3.5 h-3.5" />
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                      {item.condition}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-indigo-700">₹{item.pricePerDay}</span>
                    <span className="text-xs text-slate-500"> / day</span>
                    <div className="text-[11px] text-slate-400">Deposit: ₹{item.deposit}</div>
                  </div>

                  <Link
                    href={`/borrow`}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    Request
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why CampusShare vs Buying */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-3xl p-6 sm:p-10 border border-slate-200">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why buy when you only need it for a day?
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              A scientific calculator costs ₹1,800+ new. You only need it for exam week.
              A semester textbook costs ₹800. You need it for 2 weeks of assignments.
              Rent it on CampusShare for ₹20/day, save money, and return it safely.
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
              >
                Join Your College Network
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

