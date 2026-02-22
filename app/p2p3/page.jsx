"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';


const SPPG_LIST = [
    { id: '4KKERUJF', name: 'SPPG MEKARSARI, PAGELARAN #002' },
    { id: 'GHFBVHMX', name: 'SPPG BUNIWANGI, PAGELARAN' },
    { id: 'IMBCOECS', name: 'SPPG PARAKANTUGU, CIJATI #002' },
    { id: 'OJODRKJD', name: 'SPPG GANDASARI, KADUPANDAK #001' },
    { id: 'QKDQMOZJ', name: 'SPPG CISALAK, CIDAUN #002' },
    { id: 'TFEMIBDX', name: 'SPPG BOJONGKASO, AGRABINTA #003' },
    { id: 'UE1863ZD', name: 'SPPG KERTASARI, SINDANGBARANG #001' },
    { id: 'ZWCELHUA', name: 'SPPG PARAKANTUGU, CIJATI #001' },
    { id: 'CD0DWLRE', name: 'SPPG CIBEUREUM, KERTASARI #001' },
    { id: 'FNZVLWTK', name: 'SPPG CITAMAN, NAGREG #002' },
    { id: '041BO44R', name: 'SPPG PAMULIHAN, PAMULIHAN #001' },
    { id: '63FNBCSB', name: 'SPPG GUNUNG MANIK, TANJUNGSARI #001' },
    { id: '6XAODDWO', name: 'SPPG CIPAMEKAR, CONGGEANG' },
    { id: 'CMKCXRTU', name: 'SPPG JATIMEKAR, SITURAJA #001' },
    { id: 'EOEYIQMG', name: 'SPPG CIKAHURIPAN, CIMANGGUNG #002' },
    { id: 'GUQJOUBJ', name: 'SPPG SUKASARI, SUKASARI #003' },
    { id: 'H0MXG5VW', name: 'SPPG MARGAMUKTI, SUMEDANG UTARA #001' },
    { id: 'HAER7EHT', name: 'SPPG SUKAJAYA, SUMEDANG SELATAN #001' },
    { id: 'IVHWGER2', name: 'SPPG KEBONKALAPA, CISARUA #002' },
    { id: 'JSYMCKDC', name: 'SPPG PASIGARAN, TANJUNGSARI #001' },
    { id: 'JVYEGJQW', name: 'SPPG CIKERUH, JATINANGOR #004' },
    { id: 'KDD1T5CU', name: 'SPPG MANDALAHERANG, CIMALAKA' },
    { id: 'KGU5FXKX', name: 'SPPG PASEH KIDUL, PASEH #001' },
    { id: 'L08LIJBX', name: 'SPPG CIPTASARI, PAMULIHAN #002' },
    { id: 'L6AWVMMS', name: 'SPPG CIPANAS, TANJUNGKERTA #001' },
    { id: 'L7R5VUHP', name: 'SPPG CIMALAKA, CIMALAKA #002' },
    { id: 'M0K6JVMX', name: 'SPPG CIMUJA, CIMALAKA #003' },
    { id: 'NFXLDUQX', name: 'SPPG HEGARMANAH, JATINANGOR #007' },
    { id: 'NUL66RYO', name: 'SPPG GUDANG, TANJUNGSARI #002' },
    { id: 'SKF6SHOA', name: 'SPPG SINDANGGALIH, CIMANGGUNG #001' },
    { id: 'VEJCEXO3', name: 'SPPG CINANJUNG, TANJUNGSARI #003' },
    { id: 'WX7AKUPM', name: 'SPPG SAYANG, JATINANGOR #001' },
    { id: 'ZIDW5XJV', name: 'SPPG NYALINDUNG, CIMALAKA #001' },
    { id: 'ZYATPGVU', name: 'SPPG KOTA KULON , SUMEDANG SELATAN #005' },
    { id: 'JMQECX10', name: 'SPPG CIROYOM, CIPEUNDEUY #002' },
    { id: '8EIPOYSH', name: 'SPPG CIBEUREUM, KERTASARI #003' },
    { id: '8UDN0AK8', name: 'SPPG NAGRAK, PACET #004' },
    { id: 'AIZW0K6T', name: 'SPPG CILAMPENI, KATAPANG #003' },
    { id: 'BI0ZZT18', name: 'SPPG ANTAPANI KIDUL, ANTAPANI #002' },
    { id: 'C2DXAO4K', name: 'SPPG PANENJOAN, CICALENGKA #004' },
    { id: 'FTN2GQPA', name: 'SPPG PANYOCOKAN, CIWIDEY #001' },
    { id: 'OXLXLGG3', name: 'SPPG BANYUSARI, KATAPANG #001' },
    { id: 'XL4BIXT0', name: 'SPPG JAGABAYA, CIMAUNG #003' },
    { id: 'Z7ZCFLOW', name: 'SPPG SADU, SOREANG #001' },
    { id: '0SGL5NCE', name: 'SPPG CIHARASHAS, CIPEUNDEUY #001' },
    { id: '20VFRBIL', name: 'SPPG CITAPEN, CIHAMPELAS #002' },
    { id: '2AXBERIV', name: 'SPPG PUTERAN, CIKALONGWETAN #003' },
    { id: 'AJ9ODVFZ', name: 'SPPG CIHAMPELAS, CIHAMPELAS #002' },
    { id: 'G4QSBHHM', name: 'SPPG JAMBUDIPA, CISARUA #002' },
    { id: 'GMDIFXH1', name: 'SPPG CINENGAH, RONGGA #002' },
    { id: 'TVJKS7GX', name: 'SPPG BUDIHARJA, CILILIN' },
    { id: 'V0ZNBOAJ', name: 'SPPG CIPEUNDEUY, CIPEUNDEUY #002' },
    { id: 'YQ7KTGX5', name: 'SPPG SIRNAJAYA, GUNUNGHALU #005' },
    { id: 'APNIT5JR', name: 'SPPG SIRNAGALIH, SINDANGBARANG #001' },
    { id: 'CC5SYHQU', name: 'SPPG SUKAJADI, CAMPAKA #003' },
    { id: 'FKJ1FXRP', name: 'SPPG SUKANAGALIH, PACET #003' },
    { id: 'UGDDUUHI', name: 'SPPG CIBADAK, SUKARESMI #001' },
    { id: 'EEVUVD11', name: 'SPPG GANEAS, GANEAS #001' },
    { id: 'EEWPSKAL', name: 'SPPG TARIKOLOT, JATINUNGGAL #003' },
    { id: 'OHES6MDW', name: 'SPPG CIJATI, SITURAJA #004' },
    { id: 'TYVPH9WF', name: 'SPPG TOLENGAS, TOMO' },
    { id: 'WVBZF10M', name: 'SPPG KOTA KALER , SUMEDANG UTARA #004' },
    { id: 'UPX1QJ0R', name: 'SPPG CIMEKAR, CILEUNYI #012' },
    { id: 'KUJUHWP7', name: 'SPPG SUKAJADI, CAMPAKA #005' },
    { id: '3PHMYTGK', name: 'SPPG LEMBAHSARI, CIKALONGKULON' },
    { id: 'TUEKPVJS', name: 'SPPG MEKARJAYA, CIKALONGKULON #002' },
    { id: 'EI4QI8IY', name: 'SPPG PALASARI, CIPANAS #003' },
    { id: 'FTUFDHVT', name: 'SPPG PALASARI, CIPANAS #006' },
    { id: 'VAPGMOHC', name: 'SPPG PADAULUN, MAJALAYA #001' },
    { id: 'OKED1M2I', name: 'SPPG TENJOLAYA, CICALENGKA #004' },
    { id: 'MWVMQCCW', name: 'SPPG CILEUNYI KULON, CILEUNYI #004' },
    { id: 'QWD4WZCD', name: 'SPPG CIBEUREUM, KERTASARI #002' },
    { id: '0VBU0TIN', name: 'SPPG TANJUNGSARI, TANJUNGSARI #001' },
    { id: '1SKCJXMV', name: 'SPPG CIGENDEL, PAMULIHAN #001' },
    { id: '2RTSDLVC', name: 'SPPG JATISARI, TANJUNGSARI' },
    { id: 'AMPYRLXW', name: 'SPPG TANJUNGSARI, TANJUNGSARI #003' },
    { id: 'AYVSGOPN', name: 'SPPG KOTA KULON , SUMEDANG SELATAN #006' },
    { id: 'C4RGIIVS', name: 'SPPG KOTA KULON , SUMEDANG SELATAN #004' },
    { id: 'WRENAJKQ', name: 'SPPG REGOL WETAN , SUMEDANG SELATAN #002' },
    { id: '0DIWMHSR', name: 'SPPG BALEENDAH, BALEENDAH #004' },
    { id: 'F0QM3R4Z', name: 'SPPG MARGAHAYU TENGAH, MARGAHAYU #002' },
    { id: 'FGU9DGPK', name: 'SPPG CIMEKAR, CILEUNYI #005' },
    { id: 'PW2MMKIH', name: 'SPPG TEGALLUAR, BOJONGSOANG #003' },
    { id: 'TASFYMK9', name: 'SPPG MANGGAHANG, BALEENDAH #006' },
    { id: 'XLL7NNVI', name: 'SPPG BALEENDAH, BALEENDAH #002' },
    { id: '84NR2GMP', name: 'SPPG SARIWANGI, PARONGPONG #003' },
    { id: 'BYTA4PDP', name: 'SPPG CIHANJUANG, PARONGPONG #006' },
    { id: 'XFZ8EUZA', name: 'SPPG CIBURUY, PADALARANG #006' },
    { id: 'C2L2Z1KJ', name: 'SPPG RANCAGOONG, CILAKU #005' },
    { id: 'DAFPPEWF', name: 'SPPG SUKASARI, CILAKU #001' },
    { id: 'OEGWG45L', name: 'SPPG HEGARMANAH, KARANGTENGAH #005' },
    { id: 'SYQIVA8T', name: 'SPPG SINDANGLAKA, KARANGTENGAH #002' },
    { id: 'T9RDWCOX', name: 'SPPG CIKAROYA, WARUNGKONDANG #002' },
    { id: 'VRKZNDMU', name: 'SPPG SAYANG, CIANJUR #002' },
    { id: 'WSFAOCOR', name: 'SPPG CIRANJANG, CIRANJANG #001' },
    { id: 'KSCSP3S1', name: 'SPPG CIBADUYUT, BOJONGLOA KIDUL #001' },
    { id: 'OAS1GTBV', name: 'SPPG BABAKAN, BABAKAN CIPARAY #003' },
    { id: 'Q4O2IBYA', name: 'SPPG PASIR ENDAH, UJUNGBERUNG #001' },
    { id: '3KRF6DCY', name: 'SPPG CIBEUREUM, CIMAHI SELATAN #004' },
    { id: 'BX2W9CT0', name: 'SPPG PADASUKA, CIMAHI TENGAH #002' },
    { id: 'VYN0OBL1', name: 'SPPG CITEUREUP, CIMAHI UTARA #005' },
    { id: 'ZEZ3TM0G', name: 'SPPG PALABUAN, UJUNGJAYA' },
    { id: 'ZTQ8DKK8', name: 'SPPG NAGARAWANGI, RANCAKALONG #002' },
    { id: 'DLQ1XX22', name: 'SPPG SUKASARI, CILAKU #002' },
    { id: 'PC6X27S5', name: 'SPPG SIRNAGALIH, CILAKU #008' },
    { id: 'VYNFSIGN', name: 'SPPG BALEENDAH, BALEENDAH #017' },
    { id: 'EBVANYKY', name: 'SPPG CIAPUS, BANJARAN #002' },
    { id: 'ILA5S5Q2', name: 'SPPG CANGKUANG WETAN, DAYEUHKOLOT #002' },
    { id: 'PFH9QN5J', name: 'SPPG BOJONG, MAJALAYA' }
];

const MATERIAL_PRESETS = [
    "Kabel UTP", "Kabel Power", "Konektor RJ45", "Cable Clip Paku",
    "Adhesive Cable Clip", "Duct Tray", "Double Tape",
    "Stop Kontak 1 lobang", "Stop Kontak 2 lobang", "Stop Kontak 4 lobang"
];

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyX8HaCSI5e03IdE4I5lLaAM3PFQMfY8xeh9_O2DkSvstBTJ5Nv0aG7xkUhxWT3199v/exec';

const StepHeader = ({ number, title, subTitle }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ 
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', 
            color: 'white', 
            width: '32px', height: '32px', 
            borderRadius: '10px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: '800',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
        }}>{number}</div>
        <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: 700 }}>{title}</h3>
            {subTitle && <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{subTitle}</p>}
        </div>
    </div>
);

export default function P2P3Tracker() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [selectedSppg, setSelectedSppg] = useState('');
    const [sppgFilter, setSppgFilter] = useState('');
    const [materials, setMaterials] = useState([]);
    const [currentMaterial, setCurrentMaterial] = useState({ name: MATERIAL_PRESETS[0], quantity: '', unit: 'meter' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) return <div className="loading-screen"><p>Loading...</p></div>;
    if (!isAuthenticated) return null;

    const filteredSppg = SPPG_LIST.filter(s =>
        s.id.toLowerCase().includes(sppgFilter.toLowerCase()) ||
        s.name.toLowerCase().includes(sppgFilter.toLowerCase())
    );

    const availableMaterials = MATERIAL_PRESETS.filter(
        m => !materials.find(added => added.name === m)
    );

    const handleMaterialChange = (name) => {
        if (!name) return;
        const isMeter = name === 'Kabel UTP' || name === 'Kabel Power';
        setCurrentMaterial({
            name: name,
            quantity: '',
            unit: isMeter ? 'meter' : 'pcs'
        });
    };

    const addMaterial = (e) => {
        e.preventDefault();
        if (!currentMaterial.name || !currentMaterial.quantity) return;
        const newMaterials = [...materials, { ...currentMaterial, id: Date.now() }];
        setMaterials(newMaterials);
        
        // Auto select next material
        const nextAvailable = MATERIAL_PRESETS.filter(m => !newMaterials.find(added => added.name === m))[0];
        if (nextAvailable) {
            handleMaterialChange(nextAvailable);
        } else {
            setCurrentMaterial(prev => ({ ...prev, name: '' }));
        }
    };

    const handleSave = async () => {
        if (!selectedSppg) return alert("Pilih SPPG!");
        if (materials.length === 0) return alert("Belum ada data!");

        setIsSaving(true);
        const sppgData = SPPG_LIST.find(s => s.id === selectedSppg);

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    sppgId: sppgData.id,
                    sppgName: sppgData.name,
                    data: materials,
                    sheetName: 'Kebutuhan Material P2 & P3'
                })
            });
            alert("Data P2 & P3 Berhasil Disimpan!");
            setMaterials([]);
            setSelectedSppg('');
            setSppgFilter('');
            handleMaterialChange(MATERIAL_PRESETS[0]);
        } catch (e) { alert("Gagal Simpan!"); } finally { setIsSaving(false); }
    };

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
                <h1 className="title">Progress P2 & P3</h1>
                <p className="subtitle">Update Pekerjaan Lapangan</p>
            </header>

            <div className="card" style={{ display: 'block', marginBottom: '20px' }}>
                <h3 className="label" style={{ marginBottom: '16px' }}>1. Pilih Lokasi SPPG</h3>
                
                <input
                    className="input-field"
                    style={{ marginBottom: '12px' }}
                    placeholder="🔍 Ketik ID atau Nama SPPG..."
                    value={sppgFilter}
                    onChange={e => setSppgFilter(e.target.value)}
                />

                {sppgFilter.trim() === '' ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#86868b' }}>
                        <div style={{ fontSize: '42px', marginBottom: '10px', opacity: 0.5 }}>📍</div>
                        <p style={{ fontWeight: 600 }}>Cari Lokasi</p>
                        <p style={{ fontSize: '13px' }}>Ketik nama lokasi di atas</p>
                    </div>
                ) : (
                    <div style={{ position: 'relative' }}>
                        <select
                            className="select-field"
                            value={selectedSppg}
                            onChange={e => setSelectedSppg(e.target.value)}
                            style={{ backgroundColor: selectedSppg ? '#f2f2f7' : '' }}
                        >
                            <option value="">-- {filteredSppg.length} Lokasi ditemukan --</option>
                            {filteredSppg.map(s => <option key={s.id} value={s.id}>{s.id} - {s.name}</option>)}
                        </select>
                        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#86868b' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                    </div>
                )}
            </div>

            <div className={`card ${!selectedSppg ? 'disabled-card' : ''}`} style={{ display: 'block', opacity: selectedSppg ? 1 : 0.6, pointerEvents: selectedSppg ? 'auto' : 'none' }}>
                <h3 className="label" style={{ marginBottom: '16px' }}>2. Detail Material</h3>
                <form onSubmit={addMaterial}>
                    <div style={{ marginBottom: '16px', position: 'relative' }}>
                        <label className="label">Jenis Material</label>
                        {availableMaterials.length > 0 ? (
                            <div style={{ position: 'relative' }}>
                                <select
                                    className="select-field"
                                    value={currentMaterial.name}
                                    onChange={e => handleMaterialChange(e.target.value)}
                                    required
                                >
                                    {availableMaterials.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#86868b' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '16px', background: '#dcfce7', color: '#166534', borderRadius: '12px', fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>
                                ✅ Semua item sudah dipilih
                            </div>
                        )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="label">Jumlah</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="0"
                                value={currentMaterial.quantity}
                                onChange={e => setCurrentMaterial({ ...currentMaterial, quantity: e.target.value })}
                                required
                                style={{ textAlign: 'center', fontWeight: 'bold' }}
                            />
                        </div>
                        <div style={{ width: '100px' }}>
                            <label className="label">Satuan</label>
                            <div className="input-field" style={{ textAlign: 'center', color: '#86868b', backgroundColor: '#f5f5f7' }}>
                                {currentMaterial.unit}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={!currentMaterial.quantity || availableMaterials.length === 0}
                    >
                        + Tambah ke List
                    </button>
                </form>
            </div>

            <div style={{ marginTop: '30px', paddingBottom: '120px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '0 8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Daftar P2 & P3</h3>
                    <span style={{ fontSize: '13px', color: '#86868b', background: '#e5e5ea', padding: '4px 8px', borderRadius: '8px' }}>{materials.length} item</span>
                </div>

                {materials.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#86868b' }}>
                        <div style={{ fontSize: '42px', marginBottom: '10px', opacity: 0.5 }}>📋</div>
                        <p>Belum ada material yang ditambahkan</p>
                    </div>
                ) : (
                    <div className="list-container">
                        {materials.map(m => (
                            <div key={m.id} className="list-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📦</div>
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: '15px', color: '#1d1d1f' }}>{m.name}</div>
                                        <div style={{ fontSize: '13px', color: '#86868b' }}>{m.quantity} {m.unit}</div>
                                    </div>
                                </div>
                                <button className="btn-delete" onClick={() => setMaterials(materials.filter(x => x.id !== m.id))}>✕</button>
                            </div>
                        ))}
                    </div>
                )}
                
                {materials.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                        <button 
                            className="btn-primary" 
                            onClick={handleSave} 
                            disabled={isSaving}
                            style={{ background: isSaving ? '#86868b' : '#34c759' }}
                        >
                            {isSaving ? '⏳ Menyimpan...' : '✨ Simpan'}
                        </button>
                    </div>
                )}
            </div>

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
                <button className="dock-icon" onClick={() => router.push('/mos')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>MOS</span>
                </button>
                <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.1)', alignSelf: 'center' }}></div>
                <button className="dock-icon active">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span>P2P3</span>
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
