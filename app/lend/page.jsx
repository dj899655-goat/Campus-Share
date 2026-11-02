"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  PlusCircle, 
  Package, 
  Inbox, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Coins, 
  ShieldCheck, 
  Calendar, 
  User, 
  Mail, 
  GraduationCap,
  ArrowRight,
  Info
} from "lucide-react";

export default function LendPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests"); // "requests" | "new" | "items"

  // Data
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [condition, setCondition] = useState("Good");
  const [pricePerDay, setPricePerDay] = useState("");
  const [deposit, setDeposit] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  // Action status message
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        loadLenderData();
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadLenderData = async () => {
    setLoadingData(true);
    try {
      const [reqRes, itemsRes] = await Promise.all([
        fetch("/api/requests"),
        fetch("/api/items?mine=1"),
      ]);

      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setIncomingRequests(reqData.incoming || []);
        // If there are pending requests, default to requests tab
        const hasPending = (reqData.incoming || []).some((r) => r.status === "pending");
        if (hasPending) {
          setActiveTab("requests");
        }
      }

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setMyItems(itemsData.items || []);
      }
    } catch (err) {
      console.error("Error loading lender data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!title.trim()) {
      setFormError("Item title is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          condition,
          pricePerDay: Number(pricePerDay) || 0,
          deposit: Number(deposit) || 0,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to list item.");
      }

      setFormSuccess("Item successfully listed on CampusShare!");
      setTitle("");
      setPricePerDay("");
      setDeposit("");
      setDescription("");

      // Refresh items list
      loadLenderData();
      setTimeout(() => {
        setActiveTab("items");
        setFormSuccess("");
      }, 1500);
    } catch (err) {
      setFormError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setActionMsg("");
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update request.");
        return;
      }

      setActionMsg(`Request ${action}d successfully!`);
      loadLenderData();
      setTimeout(() => setActionMsg(""), 3000);
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Loading Lender Dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md">
          <GraduationCap className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">College Verification Required</h2>
          <p className="text-sm text-slate-600 mb-6">
            You must verify your college email to list items and manage borrow requests.
          </p>
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all"
          >
            <span>Verify with College Email</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const pendingCount = incomingRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <PlusCircle className="w-4 h-4" />
            <span>Lender Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Manage Listings & Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as <strong className="text-slate-700">{user.name}</strong> ({user.email})
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === "requests"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Borrow Requests</span>
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("new")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === "new"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>List Item</span>
          </button>

          <button
            onClick={() => setActiveTab("items")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === "items"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Items ({myItems.length})</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* TAB 1: Incoming Borrow Requests */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-indigo-600" />
              <span>Incoming Borrow Requests</span>
              <span className="text-xs font-normal text-slate-500">
                ({incomingRequests.length} total)
              </span>
            </h2>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No borrow requests yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                When other students request to borrow your listed items, they will appear right here for your approval.
              </p>
              <button
                onClick={() => setActiveTab("new")}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow hover:bg-indigo-700 transition-colors"
              >
                + List a New Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {incomingRequests.map((req) => {
                const isPending = req.status === "pending";
                const isApproved = req.status === "approved";
                const isDeclined = req.status === "declined";

                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl border p-5 transition-all shadow-sm ${
                      isPending
                        ? "border-amber-200 ring-2 ring-amber-500/10"
                        : isApproved
                        ? "border-emerald-200"
                        : "border-slate-200 opacity-75"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Request details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                              isPending
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : isApproved
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {req.status}
                          </span>
                          <span className="text-xs text-slate-400">
                            Requested on {new Date(req.requestDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">
                            Item: {req.itemTitle}
                          </h3>
                        </div>

                        {/* Borrower student info */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Borrower: {req.borrowerName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{req.borrowerEmail}</span>
                          </div>
                          {req.borrowerDob && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>DOB: {req.borrowerDob}</span>
                            </div>
                          )}
                        </div>

                        {isApproved && (
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <strong>Ready for On-Campus Exchange!</strong>
                              <p className="mt-0.5 text-emerald-800">
                                Contact {req.borrowerName} at <code className="bg-emerald-100/80 px-1 py-0.5 rounded text-[11px] font-mono">{req.borrowerEmail}</code> to agree on a campus meeting spot (Library, Hostels, or Department Lounge).
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      {isPending && (
                        <div className="flex sm:flex-col items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleRequestAction(req.id, "approve")}
                            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleRequestAction(req.id, "decline")}
                            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 font-bold text-xs rounded-xl transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: List a New Item */}
      {activeTab === "new" && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900">List an Item for Lending</h2>
            <p className="text-xs text-slate-500 mt-1">
              Help a batchmate in need and earn rental income safely on campus.
            </p>
          </div>

          {formSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateItem} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Casio FX-991EX Scientific Calculator"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="Electronics">Electronics (Calculators, Chargers, Kits)</option>
                  <option value="Book">Book (Textbooks, Reference, Guides)</option>
                  <option value="Lab equipment">Lab equipment (Coat, Goggles, Kits)</option>
                  <option value="Sports">Sports (Rackets, Balls, Gear)</option>
                  <option value="Stationery">Stationery & Drafting Tools</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New (Barely Used)</option>
                  <option value="Good">Good (Working fine)</option>
                  <option value="Fair">Fair (Noticeable wear)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Price Per Day (₹) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    placeholder="25"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  e.g. ₹20 - ₹50 per day is common on campus
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Refundable Security Deposit (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    placeholder="200"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Refunded to borrower when item returned safely
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description & Campus Handover Location
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention key details, e.g. 'Casio FX-991EX ClassWiz, fully working with battery. Can meet near Central Library or Hostel 3 ground floor.'"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              {submitting ? (
                <span>Publishing Listing...</span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Item to Campus Marketplace</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: My Listed Items */}
      {activeTab === "items" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <span>Your Listed Items</span>
              <span className="text-xs font-normal text-slate-500">
                ({myItems.length} listed)
              </span>
            </h2>

            <button
              onClick={() => setActiveTab("new")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add New</span>
            </button>
          </div>

          {myItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">You haven't listed any items yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                List your calculator, textbook, sports racket, or lab equipment to earn extra cash and help college peers.
              </p>
              <button
                onClick={() => setActiveTab("new")}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow hover:bg-indigo-700 transition-colors"
              >
                + List Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {item.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          item.status === "available"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "requested"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {item.description || "No specific notes provided."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-slate-900 text-sm">₹{item.pricePerDay}</span>
                      <span className="text-slate-500"> / day</span>
                      <div className="text-[10px] text-slate-400">Deposit: ₹{item.deposit}</div>
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      {item.condition}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

