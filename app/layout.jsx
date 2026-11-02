import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "CampusShare — P2P College Lending & Borrowing Network",
  description: "Borrow what you need. Lend what you don't. Verified exclusively for college students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased">
        <NavBar />
        <main className="flex-1 pb-16">{children}</main>
        
        {/* Simple professional footer */}
        <footer className="border-t border-slate-200 bg-white/80 py-8 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">CampusShare</span>
              <span>— Peer-to-Peer College Item Sharing Platform</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span>College Email Verified</span>
              <span>•</span>
              <span>Zero Rental Commissions</span>
              <span>•</span>
              <span>Safe On-Campus Exchanges</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

