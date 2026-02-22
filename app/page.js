"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Using Next.js Image component is better, but traditional img tag is requested for simplicity in previous context.
// We will use standard img tags for compatibility unless specified otherwise.

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("authenticated");
    if (!auth) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) return null; // Or a simple loader
  if (!isAuthenticated) return null;

  const MENU_ITEMS = [
    {
      title: "Update Progres & Material",
      desc: "Input & monitor",
      icon: "📦",
      href: "/inventory",
      colorClass: "icon-blue"
    },
    {
      title: "Laporan MOS",
      desc: "Monitoring order",
      icon: "📊",
      href: "/mos",
      colorClass: "icon-purple"
    },
    {
      title: "Data WiFi",
      desc: "database wifi",
      icon: "📡",
      href: "/wifi",
      colorClass: "icon-green"
    },
    {
      title: "Upload BAST",
      desc: "Berita Acara Serah Terima",
      icon: "📝",
      href: "/bast",
      colorClass: "icon-blue"
    }
  ];

  return (
    <div className="container">
      <header className="header">
        <div className="logo-container">
          <img src="/baraya_logo.png" className="logo-img" alt="Logo" />
        </div>
        <h1 className="title">SPPG Dashboard</h1>
        <p className="subtitle">Telkom Akses Bandung Raya</p>
      </header>

      <div className="grid">
        {MENU_ITEMS.map((item, index) => (
          <Link href={item.href} key={index} className="card">
            <div className={`card-icon ${item.colorClass}`}>
              {item.icon}
            </div>
            <div className="card-content">
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.desc}</p>
            </div>
            <div className="card-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <footer className="footer">
        <p>© 2026 SPPG Automation System</p>
      </footer>
    </div>
  );
}
