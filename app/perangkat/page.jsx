"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

// ── Data perangkat per SPPG ──────────────────────────────────────────────────
const SPPG_DEVICES = {
  XL4BIXT0: {
    name: "SPPG JAGABAYA",
    address: "Jl.Pasir Lanjung RT 02 RW 02 Desa.Jagabaya Kec.Cimaung Kab.Bandung",
    devices: [
      { interface: "lan", type: "BRACKET",              hostname: "BRACKET-BGN110000110",                    ip: "-",             sn: "BGN110000110" },
      { interface: "lan", type: "ROUTER",               hostname: "ROUTER-BGN070052013",                     ip: "10.24.87.96",   sn: "BGN070052013" },
      { interface: "lan", type: "SWITCH",               hostname: "SWITCH-BGN080052141",                     ip: "-",             sn: "BGN080052141" },
      { interface: "lan", type: "LAPTOP",               hostname: "LAPTOP-BGN010074639",                     ip: "10.24.87.115",  sn: "BGN010074639" },
      { interface: "lan", type: "CPU TOWER",            hostname: "DESKTOP-CPU-BGN020001307",                ip: "10.24.87.111",  sn: "BGN020001307" },
      { interface: "lan", type: "POP",                  hostname: "POP-BGN060000693",                        ip: "10.24.87.118",  sn: "BGN060000693" },
      { interface: "lan", type: "PVR DAPUR",            hostname: "PVR-DAPUR-BGN030050735",                  ip: "10.24.87.106",  sn: "BGN030050735" },
      { interface: "lan", type: "DIGITAL SIGNAGE",      hostname: "DIGITAL-SIGNAGE-BGN040060664",            ip: "10.24.87.123",  sn: "BGN040060664" },
      { interface: "lan", type: "CCTV 1 RUANG CUCI",   hostname: "CCTV-TEMPAT-PENCUCIAN-BGN060059339",      ip: "10.24.87.124",  sn: "BGN060059339" },
      { interface: "lan", type: "CCTV 2 GUDANG BASAH", hostname: "CCTV-RUANGAN-GUDANG-BASAH-BGN060059340",  ip: "10.24.87.116",  sn: "BGN060059340" },
      { interface: "lan", type: "CCTV 3 RUANG MASAK",  hostname: "CCTV-RUANGAN-MASAK-BGN060059338",         ip: "10.24.87.148",  sn: "BGN060059338" },
      { interface: "lan", type: "CCTV 4 PEMORSIAN",    hostname: "CCTV-RUANGAN-PEMORSIAN-BGN060059337",     ip: "10.24.87.107",  sn: "BGN060059337" },
      { interface: "lan", type: "CCTV 5 PERSIAPAN BM", hostname: "CCTV-RUANGAN-PERSIAPAN-BM-BGN060059341", ip: "10.24.87.110",  sn: "BGN060059341" },
      { interface: "sim", type: "PVR SEKOLAH 1",  hostname: "PVR-SEKOLAH-BGN090501809", ip: "-", sn: "BGN090501809", simNo: "0851 1546 3562", snPerangkat: "V603PB04V1002971CT" },
      { interface: "sim", type: "PVR SEKOLAH 2",  hostname: "PVR-SEKOLAH-BGN090501803", ip: "-", sn: "BGN090501803", simNo: "0851 1546 3569", snPerangkat: "V603PB04V1003719CT" },
      { interface: "sim", type: "PVR SEKOLAH 3",  hostname: "PVR-SEKOLAH-BGN090501814", ip: "-", sn: "BGN090501814", simNo: "0851 1546 3559", snPerangkat: "V603PB04V1001166CT" },
      { interface: "sim", type: "PVR SEKOLAH 4",  hostname: "PVR-SEKOLAH-BGN090501812", ip: "-", sn: "BGN090501812", simNo: "0851 1546 3561", snPerangkat: "V603PB04V1002953CT" },
      { interface: "sim", type: "PVR SEKOLAH 5",  hostname: "PVR-SEKOLAH-BGN090501801", ip: "-", sn: "BGN090501801", simNo: "0851 1546 3570", snPerangkat: "V603PB04V1002780CT" },
      { interface: "sim", type: "PVR SEKOLAH 6",  hostname: "PVR-SEKOLAH-BGN090501804", ip: "-", sn: "BGN090501804", simNo: "0851 1546 3568", snPerangkat: "V603PB04V1000157CT" },
      { interface: "sim", type: "PVR SEKOLAH 7",  hostname: "PVR-SEKOLAH-BGN090501811", ip: "-", sn: "BGN090501811", simNo: "0851 1546 3560", snPerangkat: "V603PB04V1000675CT" },
      { interface: "sim", type: "PVR SEKOLAH 8",  hostname: "PVR-SEKOLAH-BGN090501802", ip: "-", sn: "BGN090501802", simNo: "0851 1546 3571", snPerangkat: "V603PB04V1003790CT" },
      { interface: "sim", type: "PVR SEKOLAH 9",  hostname: "PVR-SEKOLAH-BGN090501808", ip: "-", sn: "BGN090501808", simNo: "0851 1546 3564", snPerangkat: "V603PB04V1000837CT" },
      { interface: "sim", type: "PVR SEKOLAH 10", hostname: "PVR-SEKOLAH-BGN090501806", ip: "-", sn: "BGN090501806", simNo: "0851 1546 3566", snPerangkat: "V603PB04V1001338CT" },
      { interface: "sim", type: "PVR SEKOLAH 11", hostname: "PVR-SEKOLAH-BGN090501810", ip: "-", sn: "BGN090501810", simNo: "0851 1546 3563", snPerangkat: "V603PB04V1000602CT" },
      { interface: "sim", type: "PVR SEKOLAH 12", hostname: "PVR-SEKOLAH-BGN090501815", ip: "-", sn: "BGN090501815", simNo: "0851 1546 3557", snPerangkat: "V603PB04V1002940CT" },
      { interface: "sim", type: "PVR SEKOLAH 13", hostname: "PVR-SEKOLAH-BGN090501807", ip: "-", sn: "BGN090501807", simNo: "0851 1546 3565", snPerangkat: "V603PB04V1000192CT" },
      { interface: "sim", type: "PVR SEKOLAH 14", hostname: "PVR-SEKOLAH-BGN090501813", ip: "-", sn: "BGN090501813", simNo: "0851 1546 3558", snPerangkat: "V603PB04V1002961CT" },
      { interface: "sim", type: "PVR SEKOLAH 15", hostname: "PVR-SEKOLAH-BGN090501805", ip: "-", sn: "BGN090501805", simNo: "0851 1546 3567", snPerangkat: "V603PB04V1002947CT" },
    ],
  },
};

// Daftar SPPG (ID → nama singkat) untuk dropdown pencarian
const SPPG_LIST = Object.entries(SPPG_DEVICES).map(([id, v]) => ({
  id,
  label: `${id} — ${v.name}`,
}));

export default function PerangkatPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(SPPG_LIST[0]?.id ?? "");
  const [filterIface, setFilterIface] = useState("ALL");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  const sppg = SPPG_DEVICES[selectedId];

  const filtered = useMemo(() => {
    if (!sppg) return [];
    return sppg.devices.filter((d) => {
      const matchIface = filterIface === "ALL" || d.interface === filterIface;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        d.hostname.toLowerCase().includes(q) ||
        d.sn.toLowerCase().includes(q) ||
        d.ip.includes(q) ||
        d.type.toLowerCase().includes(q) ||
        (d.simNo && d.simNo.includes(q)) ||
        (d.snPerangkat && d.snPerangkat.toLowerCase().includes(q));
      return matchIface && matchSearch;
    });
  }, [sppg, search, filterIface]);

  const handleCopy = () => {
    if (!sppg) return;
    const lines = [
      `${selectedId} — ${sppg.name}`,
      sppg.address,
      "",
      "Interface\tTipe Perangkat\tHostname\tIP Address\tSerial Number\tNo SIM\tSN Perangkat",
      ...filtered.map((d) =>
        [d.interface, d.type, d.hostname, d.ip, d.sn, d.simNo ?? "-", d.snPerangkat ?? "-"].join("\t")
      ),
    ].join("\n");
    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <button onClick={() => router.back()} style={styles.backBtn}>
          ← Kembali
        </button>
        <div>
          <h1 style={styles.title}>Data Perangkat SPPG</h1>
          <p style={styles.subtitle}>Inventaris perangkat jaringan & PVR per lokasi</p>
        </div>
      </div>

      {/* ── Selector & Filters ── */}
      <div style={styles.controlBar}>
        {/* Pilih SPPG */}
        <div style={styles.controlGroup}>
          <label style={styles.label}>Pilih SPPG</label>
          <select
            value={selectedId}
            onChange={(e) => { setSelectedId(e.target.value); setSearch(""); setFilterIface("ALL"); }}
            style={styles.select}
          >
            {SPPG_LIST.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Filter interface */}
        <div style={styles.controlGroup}>
          <label style={styles.label}>Interface</label>
          <div style={styles.filterRow}>
            {["ALL", "lan", "sim"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterIface(f)}
                style={{ ...styles.filterBtn, ...(filterIface === f ? styles.filterBtnActive : {}) }}
              >
                {f === "ALL" ? "Semua" : f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ ...styles.controlGroup, flex: 1 }}>
          <label style={styles.label}>Cari</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hostname, SN, IP, No SIM…"
            style={styles.searchInput}
          />
        </div>

        {/* Copy */}
        <button onClick={handleCopy} style={styles.copyBtn}>
          {copied ? "✓ Disalin!" : "Salin Tabel"}
        </button>
      </div>

      {/* ── SPPG Info Banner ── */}
      {sppg && (
        <div style={styles.infoBanner}>
          <span style={styles.sppgId}>{selectedId}</span>
          <div>
            <div style={styles.sppgName}>{sppg.name}</div>
            <div style={styles.sppgAddr}>{sppg.address}</div>
          </div>
          <span style={styles.countBadge}>{filtered.length} perangkat</span>
        </div>
      )}

      {/* ── Table ── */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={{ ...styles.th, width: 70 }}>Interface</th>
              <th style={styles.th}>Tipe Perangkat</th>
              <th style={styles.th}>Hostname</th>
              <th style={{ ...styles.th, width: 130 }}>IP Address</th>
              <th style={styles.th}>Serial Number</th>
              <th style={styles.th}>No SIM</th>
              <th style={styles.th}>SN Perangkat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={styles.emptyCell}>Tidak ada perangkat ditemukan.</td>
              </tr>
            ) : (
              filtered.map((d, i) => (
                <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>
                    <span style={d.interface === "lan" ? styles.badgeLan : styles.badgeSim}>
                      {d.interface}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 600, color: "#1d1d1f" }}>{d.type}</td>
                  <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 13, color: "#3a3a3c" }}>
                    {d.hostname}
                  </td>
                  <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 13 }}>
                    {d.ip !== "-" ? (
                      <span style={styles.ipChip}>{d.ip}</span>
                    ) : (
                      <span style={{ color: "#aeaeb2" }}>—</span>
                    )}
                  </td>
                  <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 13 }}>{d.sn}</td>
                  <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 13 }}>
                    {d.simNo ?? <span style={{ color: "#aeaeb2" }}>—</span>}
                  </td>
                  <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 12, color: "#636366" }}>
                    {d.snPerangkat ?? <span style={{ color: "#aeaeb2" }}>—</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Floating Dock ── */}
      <nav style={styles.dock}>
        {[
          { icon: "🏠", label: "Home",     href: "/" },
          { icon: "📦", label: "Material", href: "/inventory" },
          { icon: "📊", label: "MOS",      href: "/mos" },
          { icon: "📡", label: "WiFi",     href: "/wifi" },
          { icon: "🖥️", label: "Perangkat",href: "/perangkat" },
        ].map((item) => (
          <button key={item.href} onClick={() => router.push(item.href)} style={styles.dockBtn}>
            <span style={styles.dockIcon}>{item.icon}</span>
            <span style={styles.dockLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f2f2f7",
    paddingBottom: 100,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    background: "linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)",
    color: "#fff",
    padding: "20px 24px 24px",
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  backBtn: {
    background: "rgba(255,255,255,0.12)",
    border: "none",
    color: "#fff",
    borderRadius: 10,
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 14,
    flexShrink: 0,
  },
  title: { margin: 0, fontSize: 22, fontWeight: 700 },
  subtitle: { margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.6)" },

  controlBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "flex-end",
    padding: "16px 20px",
    background: "#fff",
    borderBottom: "1px solid #e5e5ea",
  },
  controlGroup: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 11, fontWeight: 600, color: "#6c6c70", textTransform: "uppercase", letterSpacing: "0.5px" },
  select: {
    height: 38,
    borderRadius: 10,
    border: "1.5px solid #d1d1d6",
    padding: "0 12px",
    fontSize: 14,
    background: "#fff",
    cursor: "pointer",
    minWidth: 260,
  },
  filterRow: { display: "flex", gap: 6 },
  filterBtn: {
    height: 38,
    borderRadius: 10,
    border: "1.5px solid #d1d1d6",
    background: "#f2f2f7",
    padding: "0 14px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 500,
  },
  filterBtnActive: {
    background: "#1c1c1e",
    color: "#fff",
    border: "1.5px solid #1c1c1e",
  },
  searchInput: {
    height: 38,
    borderRadius: 10,
    border: "1.5px solid #d1d1d6",
    padding: "0 14px",
    fontSize: 14,
    minWidth: 220,
  },
  copyBtn: {
    height: 38,
    borderRadius: 10,
    border: "none",
    background: "#007aff",
    color: "#fff",
    padding: "0 18px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "flex-end",
  },

  infoBanner: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "12px 20px",
    background: "#fff",
    borderBottom: "1px solid #e5e5ea",
  },
  sppgId: {
    background: "#1c1c1e",
    color: "#fff",
    borderRadius: 8,
    padding: "4px 10px",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "monospace",
    flexShrink: 0,
  },
  sppgName: { fontSize: 15, fontWeight: 700, color: "#1d1d1f" },
  sppgAddr: { fontSize: 12, color: "#636366", marginTop: 2 },
  countBadge: {
    marginLeft: "auto",
    background: "#f2f2f7",
    border: "1px solid #d1d1d6",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 13,
    fontWeight: 600,
    color: "#3a3a3c",
    flexShrink: 0,
  },

  tableWrapper: {
    overflowX: "auto",
    margin: "16px 16px 0",
    borderRadius: 14,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    background: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  theadRow: {
    background: "#1c1c1e",
    color: "#fff",
  },
  th: {
    padding: "12px 14px",
    textAlign: "left",
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: "0.3px",
    whiteSpace: "nowrap",
  },
  trEven: { background: "#fff" },
  trOdd:  { background: "#f9f9fb" },
  td: {
    padding: "11px 14px",
    borderBottom: "1px solid #f2f2f7",
    verticalAlign: "middle",
  },
  emptyCell: {
    textAlign: "center",
    padding: 40,
    color: "#aeaeb2",
    fontSize: 15,
  },

  badgeLan: {
    background: "#e8f4fd",
    color: "#0071e3",
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "monospace",
  },
  badgeSim: {
    background: "#fef0e6",
    color: "#c86000",
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "monospace",
  },
  ipChip: {
    background: "#edfaee",
    color: "#1a7a1a",
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 13,
    fontFamily: "monospace",
    fontWeight: 600,
  },

  dock: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(28,28,30,0.92)",
    backdropFilter: "blur(20px)",
    borderRadius: 20,
    padding: "8px 16px",
    display: "flex",
    gap: 4,
    zIndex: 100,
  },
  dockBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "6px 14px",
    borderRadius: 12,
    transition: "background 0.15s",
  },
  dockIcon: { fontSize: 20 },
  dockLabel: { fontSize: 10, marginTop: 2, color: "rgba(255,255,255,0.7)" },
};
