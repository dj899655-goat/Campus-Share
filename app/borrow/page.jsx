"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  BookOpen, 
  Cpu, 
  FlaskConical, 
  Dumbbell, 
  Tag, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  User, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  GraduationCap,
  ArrowRight
} from "lucide-react";

export default function BorrowPage() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Interaction feedback
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");
  const [requestingItemId, setRequestingItemId] = useState(null);

  const categories = [
    { label: "All Items", value: "all" },
    { label: "Electronics", value: "electronics" },
    { label: "Books & Notes", value: "book" },
    { label: "Lab Equipment", value: "lab equipment" },
    { label: "Sports", value: "sports" },
    { label: "Other", value: "other" },
  ];

  const categoryIcons = {
    "electronics": Cpu,
    "book": BookOpen,
    "lab equipment": FlaskConical,
    "sports": Dumbbell,
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch user, items, and requests in parallel
      const [authRes, itemsRes, reqRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/items"),
        fetch("/api/requests"),
      ]);

      let currentUser = null;
      if (authRes.ok) {
        const authData = await authRes.json();
        currentUser = authData.user;
        setUser(currentUser);
      }

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setItems(itemsData.items || []);
      }

      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setOutgoingRequests(reqData.outgoing || []);
      }
    } catch (err) {
      console.error("Error loading borrow feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBorrow = async (itemId, itemTitle) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setActionError("");
    setActionSuccess("");
    setRequestingItemId(itemId);

    try {
      const res = await fetch(`/api/items/${itemId}/request`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setActionSuccess(`Request for "${itemTitle}" sent to the owner!`);
      // Reload requests & items to sync statuses
      loadData();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      setActionError(err.message || "Failed to submit borrow request.");
      setTimeout(() => setActionError(""), 4000);
    } finally {
      setRequestingItemId(null);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (item.category || "").toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.ownerName && item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-600 mb-1">
            <Search className="w-4 h-4" />
            <span>Borrower Feed</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Browse College Items for Rent
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rent calculators, lab equipment, books, and gadgets directly from fellow students.
          </p>
        </div>

        {user && (
          <div className="text-xs text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <User className="w-4 h-4 text-violet-600" />
            <span>Browsing as: <strong>{user.name}</strong></span>
          </div>
        )}
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Outgoing Requests Section (if logged in and has requests) */}
      {user && outgoingRequests.length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>My Borrow Requests (Outgoing)</span>
            <span className="text-xs font-normal text-slate-500">
              ({outgoingRequests.length} active)
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outgoingRequests.map((req) => {
              const isPending = req.status === "pending";
              const isApproved = req.status === "approved";
              const isDeclined = req.status === "declined";

              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isApproved
                      ? "bg-emerald-50/50 border-emerald-200 ring-2 ring-emerald-500/10"
                      : isPending
                      ? "bg-amber-50/40 border-amber-200"
                      : "bg-slate-50 border-slate-200 opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-900 text-sm">{req.itemTitle}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isApproved
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : isPending
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Owner: {req.lenderName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.lenderEmail}</span>
                    </div>
                  </div>

                  {isApproved && (
                    <div className="mt-3 p-2.5 bg-emerald-100/60 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>Request Approved! Next Steps:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Meet {req.lenderName} on campus to inspect the item, hand over the security deposit, and start using it. Return before the agreed period ends!
                      </p>
                    </div>
                  )}

                  {isPending && (
                    <div className="text-[11px] text-amber-800 flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3" />
                      <span>Waiting for the owner to review your request.</span>
                    </div>
                  )}

                  {isDeclined && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-2">
                      <XCircle className="w-3 h-3 text-slate-400" />
                      <span>The owner declined this request or the item was lent to someone else.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Search and Category Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items by title, category, or description (e.g. calculator, lab coat, mechanics)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading available campus items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No items found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            We couldn't find any items matching your filters. Try clearing your search query or check back soon.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl shadow hover:bg-violet-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const catKey = (item.category || "").toLowerCase();
            const Icon = categoryIcons[catKey] || BookOpen;

            // Check relation to current user
            const isMyItem = user && item.ownerId === user.id;
            const hasRequested =
              user &&
              outgoingRequests.some(
                (r) => r.itemId === item.id && r.status === "pending"
              );
            const isBorrowed = item.status === "borrowed";
            const isRequestedBySomeone = item.status === "requested";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                      <Icon className="w-3.5 h-3.5" />
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                      {item.condition}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {item.description || "No additional description provided."}
                  </p>

                  {/* Owner Info */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-xs text-slate-600 space-y-0.5">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <User className="w-3.5 h-3.5 text-violet-600" />
                      <span>Owner: {item.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{item.ownerEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-violet-700">₹{item.pricePerDay}</span>
                    <span className="text-xs text-slate-500"> / day</span>
                    <div className="text-[11px] text-slate-400">Deposit: ₹{item.deposit}</div>
                  </div>

                  {isMyItem ? (
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg border border-slate-200">
                      Your Listing
                    </span>
                  ) : isBorrowed ? (
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg border border-slate-200">
                      Borrowed
                    </span>
                  ) : hasRequested ? (
                    <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Requested</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRequestBorrow(item.id, item.title)}
                      disabled={requestingItemId === item.id}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      {requestingItemId === item.id ? "Sending..." : "Request to Borrow"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

