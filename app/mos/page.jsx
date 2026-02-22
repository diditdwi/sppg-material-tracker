"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
const getDisplayArea = (item) => {
    const area = (item.areaConfirmed || '').toLowerCase();
    const hsa = (item.hsa || '').toUpperCase();
    if (hsa.includes('BJA') || hsa.includes('MJY') || area.includes('soreang')) {
        return 'SOREANG';
    }
    if (area.includes('bandung')) {
        return 'BANDUNG';
    }
    return area.includes('soreang') ? 'SOREANG' : 'BANDUNG';
};

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxatlMa3xiQUwr_f7pCU2Z85Zd-oqd_aSYyTY9_FNEIoo5st23d4ytCam49rRyqlzGu/exec';
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpsBh5iWffHeuniaAYLlfDVM5MaT8z2W88vxHp7knd3tz-6d3ZfLgyHmr0Ij6JD3wBwdVsxrUbhNBN/pub?gid=70199566&single=true&output=csv";

export default function MOSPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [mosData, setMosData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Report State
    const [showReport, setShowReport] = useState(false);
    const [reportText, setReportText] = useState('');
    const [loadingReport, setLoadingReport] = useState(false);

    // Filter State
    const [filterCategory, setFilterCategory] = useState("ALL"); // "ALL", "BANDUNG", "SOREANG"

    // Authentication check
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    // Fetch data for Dashboard from GAS (Consistent with Report logic)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gunakan endpoint yang sama dengan report agar konsisten
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'getReportData' })
                });

                const json = await response.json();
                
                if (json.status === 'success') {
                    // json.mosData sekarang sudah difilter di backend (Bandung + P2/P3 + MOS=True)
                    // dan sudah mengandung properti 'priority'.
                    setMosData(json.mosData);
                    setLoading(false);
                } else {
                    console.error('Error fetching data from GAS:', json.message);
                    setError(`Gagal memuat data: ${json.message}`);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching MOS data:', err);
                setError(`Gagal menghubungkan ke server: ${err.message}`);
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const handleGenerateReport = async () => {
        setLoadingReport(true);
        setShowReport(true);
        setReportText('Sedang mengambil data laporan...');

        try {
            // Fetch Report Data from GAS V5
            const res = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'getReportData' })
            });

            const json = await res.json();
            
            if (json.status === 'success') {
                const { mosData: serverMosData, wiringData, installData } = json;
                
                // 1. Format MOS Data
                // Filter MOS data (server side sudah filter status=TRUE, tapi kita pastikan jika perlu)
                // Format Request: "- [ID] [Nama]" (User request text: "cukup menampilkan id sppg, nama sppg dan HSA")
                // Screenshot user shows: "ID SPPG, NAMA SPPG, STO" in wiring?
                // Request says: "Done Wiring ... cukup tampilkan ID, Nama, STO"
                // Request says: "Status MOS ... cukup tampilkan ID, Nama, HSA"
                
                let report = `Laporan SPPG Bandung Raya\n\nMOS : ${serverMosData.length}\n`;
                serverMosData.forEach(item => {
                    // Item: { id, name, sto, hsa }
                    // Format: "- [ID] [NAMA] [HSA]"
                    let line = `- ${item.id} ${item.name}`;
                    if (item.hsa) line += ` (${item.hsa})`; // Tambah HSA jika ada
                    report += `${line}\n`;
                });

                // 2. Format Wiring Data
                // Format Request: "- [ID] [NAMA] [STO] [STATUS] + HSA"
                // Contoh user: "- OAS1GTBV HSA RJW SPPG BABAKAN..."
                report += `\nDone Wiring: ${wiringData.length}\n`;
                wiringData.forEach(item => {
                    // Item: { id, name, sto, status, hsa }
                    let line = `- ${item.id}`;
                    
                    // Tambahkan Label HSA jika ada
                    if (item.hsa) {
                        // Cek apakah data sudah mengandung kata "HSA" agar tidak double
                        const hsaValue = item.hsa.toString().trim();
                        if (hsaValue.toUpperCase().startsWith('HSA')) {
                            line += `   ${hsaValue}`;
                        } else {
                            line += `   HSA ${hsaValue}`;
                        }
                    }
                    
                    line += ` ${item.name}`;
                    
                    // STO opsional jika ingin ditampilkan
                    // if (item.sto) line += ` (${item.sto})`;
                    
                    line += ` ${item.status}`;
                    report += `${line}\n`;
                });

                // 3. Format Install Data
                if (installData && installData.length > 0) {
                    report += `\nInstall berdasarkan SPPG: ${installData.length}\n`;
                    installData.forEach(item => {
                        let line = `- ${item.id} ${item.name}`;
                        if (item.hsa) line += ` (${item.hsa})`;
                        line += ` - ${item.konfirmArea}`;
                        if (item.keterangan && item.keterangan.trim() !== '') {
                            line += ` - ${item.keterangan}`;
                        }
                        report += `${line}\n`;
                    });
                }

                setReportText(report);
            } else {
                setReportText(`Gagal mengambil data: ${json.message || 'Unknown error'}`);
            }

        } catch (e) {
            console.error("Report Error", e);
            setReportText(`Gagal mengambil data report: ${e.message}\n\nPastikan Script Google V13 sudah dideploy!`);
        } finally {
            setLoadingReport(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(reportText);
        alert("Laporan disalin ke clipboard!");
    };

    if (isLoading || loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="container">
            <header className="header">
                 <div onClick={() => router.push('/')} style={{ cursor: 'pointer', marginBottom: '20px', display: 'inline-flex', background: 'white', padding: '12px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1d1d1f' }}>
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </div>
                <div className="logo-container">
                    <img src="/baraya_logo.png" className="logo-img" alt="Logo" />
                </div>
                <h1 className="title">MOS Dashboard</h1>
                <p className="subtitle">SPPG Bandung Raya - Tahap 1</p>
                
                <button 
                    onClick={handleGenerateReport}
                    style={{ 
                        marginTop: '20px', 
                        width: '100%', 
                        padding: '12px', 
                        background: '#0071e3', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        fontSize: '16px', 
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    LAPORAN
                </button>
            </header>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '30px' }}>
                <div onClick={() => setFilterCategory("ALL")} className="card" style={{ flexDirection: 'column', alignItems: 'center', padding: '20px 10px', gap: '8px', cursor: 'pointer', border: filterCategory === "ALL" ? '2px solid #0071e3' : '2px solid transparent' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#0071e3' }}>{mosData.length}</div>
                    <div style={{ fontSize: '12px', color: '#86868b', textAlign: 'center' }}>Siap MOS</div>
                </div>
                <div onClick={() => setFilterCategory("BANDUNG")} className="card" style={{ flexDirection: 'column', alignItems: 'center', padding: '20px 10px', gap: '8px', cursor: 'pointer', border: filterCategory === "BANDUNG" ? '2px solid #34c759' : '2px solid transparent' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#34c759' }}>{mosData.filter(d => getDisplayArea(d) === 'BANDUNG').length}</div>
                    <div style={{ fontSize: '12px', color: '#86868b', textAlign: 'center' }}>Bandung</div>
                </div>
                <div onClick={() => setFilterCategory("SOREANG")} className="card" style={{ flexDirection: 'column', alignItems: 'center', padding: '20px 10px', gap: '8px', cursor: 'pointer', border: filterCategory === "SOREANG" ? '2px solid #ff9500' : '2px solid transparent' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff9500' }}>{mosData.filter(d => getDisplayArea(d) === 'SOREANG').length}</div>
                    <div style={{ fontSize: '12px', color: '#86868b', textAlign: 'center' }}>Soreang</div>
                </div>
            </div>

            <div style={{ paddingBottom: '100px' }}>
                {error ? (
                    <p style={{ textAlign: 'center', color: '#ff3b30' }}>{error}</p>
                ) : mosData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#86868b' }}>
                        <div style={{ fontSize: '42px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
                        <p style={{ fontWeight: 600 }}>Belum Ada Data</p>
                        <p style={{ fontSize: '13px' }}>Belum ada SPPG dengan Status MOS Tahap 1 = TRUE</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {mosData.filter(item => {
                            if (filterCategory === "ALL") return true;
                            if (filterCategory === "BANDUNG") return getDisplayArea(item) === 'BANDUNG';
                            if (filterCategory === "SOREANG") return getDisplayArea(item) === 'SOREANG';
                            return true;
                        }).map((item, index) => (
                            <div key={item.id || index} className="card" style={{ display: 'block', padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#86868b', background: '#f5f5f7', padding: '4px 8px', borderRadius: '6px' }}>{item.id}</span>
                                    <span style={{ 
                                        fontSize: '12px', fontWeight: 700, 
                                        color: getDisplayArea(item) === 'BANDUNG' ? '#34c759' : '#ff9500',
                                        background: getDisplayArea(item) === 'BANDUNG' ? '#dcfce7' : '#ffedd5',
                                        padding: '4px 8px', borderRadius: '99px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {getDisplayArea(item)}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px', lineHeight: 1.4 }}>{item.name}</h3>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#86868b', marginBottom: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Area</div>
                                        <div style={{ color: '#1d1d1f' }}>{item.areaConfirmed || '-'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>HSA</div>
                                        <div style={{ color: '#1d1d1f' }}>{item.hsa || '-'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#0071e3', background: '#e8f2ff', padding: '8px 12px', borderRadius: '8px' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                                    Siap MOS Tahap 1
                                    {item.timestampMos && <span style={{ marginLeft: 'auto', color: '#0071e3', opacity: 0.7 }}>{item.timestampMos}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Report Modal */}
            {showReport && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => setShowReport(false)}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                             <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Preview Laporan</h3>
                             <button onClick={() => setShowReport(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                        </div>
                        
                        <div style={{ flex: 1, overflowY: 'auto', background: '#f5f5f7', padding: '12px', borderRadius: '12px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', color: '#1d1d1f', marginBottom: '16px' }}>
                            {loadingReport ? 'Sedang memuat data dari server...' : reportText}
                        </div>

                        <button 
                            onClick={copyToClipboard}
                            disabled={loadingReport}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                background: '#34c759', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '12px', 
                                fontSize: '16px', 
                                fontWeight: 600,
                                cursor: 'pointer',
                                opacity: loadingReport ? 0.7 : 1
                            }}
                        >
                            {loadingReport ? 'Tunggu Sebentar...' : 'Salin Text'}
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Dock Navigation */}
            <div className="dock-container">
                <button className="dock-icon" onClick={() => router.push('/')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Home</span>
                </button>
                <button className="dock-icon" onClick={() => router.push('/inventory')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span>Material</span>
                </button>
                <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.1)', alignSelf: 'center' }}></div>
                <button className="dock-icon active">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>MOS</span>
                </button>
                <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.1)', alignSelf: 'center' }}></div>
                <button className="dock-icon" onClick={() => router.push('/wifi')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                    <span>WiFi</span>
                </button>
                <button className="dock-icon" onClick={() => router.push('/bast')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    <span>BAST</span>
                </button>
            </div>
        </div>
    );
}
