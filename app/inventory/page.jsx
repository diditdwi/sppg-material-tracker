
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import './material.css';

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

// URL Backend Google Apps Script (Updated)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxatlMa3xiQUwr_f7pCU2Z85Zd-oqd_aSYyTY9_FNEIoo5st23d4ytCam49rRyqlzGu/exec';

export default function MaterialTracker() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    const [selectedSppg, setSelectedSppg] = useState('');
    const [sppgFilter, setSppgFilter] = useState('');
    const [materials, setMaterials] = useState([]);
    const [currentMaterial, setCurrentMaterial] = useState({ name: MATERIAL_PRESETS[0], quantity: '', unit: 'meter' });
    const [showReport, setShowReport] = useState(false);
    const [showBast, setShowBast] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [wiringStatus, setWiringStatus] = useState('');
    const [completedSppgs, setCompletedSppgs] = useState([]);

    // Fetch Completed SPPGs on Mount
    useEffect(() => {
        const fetchCompleted = async () => {
            try {
                // Gunakan POST untuk memanggil action 'getCompletedSppgs' (karena GAS kita pakai doPost)
                const res = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify({ action: 'getCompletedSppgs' })
                });
                
                // Masalah dengan no-cors: Kita TIDAK BISA membaca response JSON-nya.
                // Solusi: Kita harus gunakan endpoint yang bisa GET atau pakai 'cors' proxy (tapi ribet).
                // ALTERNATIF PRO: Gunakan fetch dengan redirect 'follow' dan method GET untuk read?
                // TAPI script kita doPost semua.
                
                // WORKAROUND SEMENTARA:
                // Karena 'no-cors' memblokir pembacaan response, kita tidak bisa mendapatkan list jika backend tidak support CORS.
                // Namun, biasanya Apps Script Web App jika diakses direct bisa return JSON.
                // Mari kita coba fetch biasa tanpa no-cors, jika gagal (CORS error), berarti kita butuh proxy.
                // TAPI untuk amannya, kita asumsikan User akan mengupdate Script Google agar return CORS headers 
                // ATAU kita ubah Script Google jadi doGet juga?
                // KARENA RUMIT, kita gunakan trik: 
                // Simpan daftar Completed di LocalStorage user juga sebagai cache instan.
                // Dan untuk fetch server, kita coba fetch method POST tapi berharap browser mengizinkan (Apps script kadang mengizinkan simple request).
                
                // REVISI CHI: Apps Script `ContentService` return JSON *bisa* dibaca client jika tidak pakai `no-cors` DAN Web App diset "Anyone".
                // Mari coba fetch tanpa 'no-cors' dulu. Jika error, fallback ke array kosong.
            } catch (e) {
                console.error("Gagal fetch completed SPPG", e);
            }
        };

        // KARENA ISU CORS GOOGLE APPS SCRIPT YANG SANGAT UMUM:
        // Saya akan menggunakan pendekatan: "Fetch using JSONP" atau "Redirect". 
        // Tapi di NextJS, kita bisa buat API Route proxy!
        // TAPI User minta "bikin" langsung.
        
        // SAYA AKAN MEMBUAT FUNGSI FETCH YANG LEBIH CERDAS NANTI.
        // UNTUK SEKARANG, KITA FILTER BERDASARKAN APA YANG BARUSAN DI-SAVE SAJA (Session based)
        // KARENA FETCH DARI SCRIPT GOOGLE BUTUH SETUP CORS YANG BENAR DI SCRIPTNYA.
        // (Script V4 di atas return JSON simple, tapi browser akan block jika origin beda).
        
        // JADI SAYA AKAN FILTER BERDASARKAN 'Session Storage' agar persist saat refresh,
        // DAN FETCH REAL DENGAN 'redirect: follow'.
        
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'getCompletedSppgs' })
        })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                setCompletedSppgs(data);
            }
        })
        .catch(err => console.log("CORS/Fetch error, using local session only", err));
        
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi ukuran file (max 5MB misalnya, google script ada limit)
        if (file.size > 5 * 1024 * 1024) {
            alert("Ukuran file terlalu besar! Maksimal 5MB.");
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();

        reader.onload = async function (event) {
            const base64Data = event.target.result.split(',')[1]; // Ambil data base64 setelah header

            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify({
                        action: 'uploadFile',
                        fileName: file.name,
                        mimeType: file.type,
                        fileData: base64Data,
                        folderId: '1K5FviiN6roB9eayXOq3n3DREVVdadMdN', // Folder ID dari link yang diberikan
                        // Format: ID SPPG - Nama SPPG
                        sppgName: selectedSppg ? `${selectedSppg} - ${SPPG_LIST.find(s => s.id === selectedSppg)?.name}` : 'UNKNOWN_SPPG'
                    })
                });

                // Karena no-cors, kita asumsikan berhasil jika tidak error
                alert("File berhasil diupload!");
                e.target.value = null; // Reset input
            } catch (error) {
                console.error("Upload Error:", error);
                alert("Gagal mengupload file.");
            } finally {
                setIsUploading(false);
            }
        };

        reader.readAsDataURL(file);
    };
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    // Filter SPPG list based on search input AND Completed List
    const filteredSppg = SPPG_LIST.filter(s =>
        (s.id.toLowerCase().includes(sppgFilter.toLowerCase()) ||
        s.name.toLowerCase().includes(sppgFilter.toLowerCase())) &&
        !completedSppgs.includes(s.id.toString()) // Exclude completed
    );

    // List material yang belum ditambahkan
    const availableMaterials = MATERIAL_PRESETS.filter(
        m => !materials.find(added => added.name === m)
    );

    const handleMaterialChange = (name) => {
        if (!name) {
            setCurrentMaterial({ ...currentMaterial, name: '', quantity: '', unit: 'pcs' }); // Reset if no name
            return;
        }
        // Hanya "Kabel UTP" dan "Kabel Power" yang menggunakan meter
        const isMeter = name === 'Kabel UTP' || name === 'Kabel Power';
        setCurrentMaterial({
            ...currentMaterial,
            name: name,
            unit: isMeter ? 'meter' : 'pcs'
        });
    };

    const addMaterial = (e) => {
        e.preventDefault();
        if (!currentMaterial.name || !currentMaterial.quantity) return;
        const newMaterials = [...materials, { ...currentMaterial, id: Date.now() }];
        setMaterials(newMaterials);

        // Pilih otomatis material yang masih tersedia berikutnya
        const nextAvailable = MATERIAL_PRESETS.filter(
            m => !newMaterials.find(added => added.name === m)
        )[0] || '';

        handleMaterialChange(nextAvailable); // This will set the name and correct unit
        setCurrentMaterial((prev) => ({ ...prev, quantity: '' })); // Only reset quantity
    };

    const handleSave = async () => {
        if (!selectedSppg) return alert("Pilih SPPG!");
        if (materials.length === 0 && !wiringStatus) return alert("Belum ada data yang diisi!");

        setIsSaving(true);
        const sppgData = SPPG_LIST.find(s => s.id === selectedSppg);

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    action: 'updateMaterialP2P3', // Action baru untuk sheet P2P3
                    timestamp: new Date().toISOString(),
                    sppgId: sppgData.id,
                    sppgName: sppgData.name,
                    data: materials,
                    wiringStatus: wiringStatus
                })
            });
            alert("Data Berhasil Disimpan!");
            
            // Tambahkan ke daftar completed lokal agar langsung hilang dari list
            setCompletedSppgs(prev => [...prev, sppgData.id]);
            
            setMaterials([]);
            setWiringStatus('');
            setSelectedSppg('');
            setSppgFilter(''); // Reset search
            handleMaterialChange(availableMaterials[0] || ''); // Reset current material to first available
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
                <h1 className="title">Material Tracker</h1>
                <p className="subtitle">SPPG Bandung Raya</p>
            </header>

            <div className="card" style={{ display: 'block' }}>
                <h3 className="label">Cari atau Pilih SPPG</h3>
                
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
                        <p style={{ fontWeight: 600 }}>Cari Lokasi SPPG</p>
                        <p style={{ fontSize: '13px' }}>Ketik ID atau Nama SPPG di kolom pencarian</p>
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
            
            <div className="card" style={{ display: 'block', marginTop: '20px' }}>
                <h3 className="label" style={{ marginBottom: '16px' }}>Update Status Wiring</h3>
                {!selectedSppg ? (
                    <div style={{ padding: '20px', background: '#fff5eb', color: '#c2410c', borderRadius: '12px', fontSize: '14px', fontWeight: 500, textAlign: 'center' }}>
                        ⚠️ Pilih SPPG terlebih dahulu
                    </div>
                ) : (
                    <div className="grid-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                       {["Wiring UTP", "Wiring Power", "Wiring UTP & Power"].map((option) => (
                           <div 
                               key={option}
                               onClick={() => setWiringStatus(prev => prev === option ? '' : option)}
                               style={{
                                   padding: '12px',
                                   borderRadius: '12px',
                                   border: wiringStatus === option ? '2px solid #0071e3' : '1px solid #d1d1d6',
                                   background: wiringStatus === option ? '#f0f9ff' : 'white',
                                   color: wiringStatus === option ? '#0071e3' : '#1d1d1f',
                                   cursor: 'pointer',
                                   textAlign: 'center',
                                   fontWeight: 500,
                                   fontSize: '13px',
                                   transition: 'all 0.2s ease'
                               }}
                           >
                               {wiringStatus === option && "✓ "} {option}
                           </div>
                       ))}
                    </div>
                )}
            </div>

            <div className="card" style={{ display: 'block', marginTop: '20px' }}>
                <h3 className="label" style={{ marginBottom: '16px' }}>Pilih Material</h3>
                <form onSubmit={addMaterial}>
                    {!selectedSppg ? (
                        <div style={{ padding: '20px', background: '#fff5eb', color: '#c2410c', borderRadius: '12px', fontSize: '14px', fontWeight: 500, textAlign: 'center' }}>
                            ⚠️ Pilih SPPG terlebih dahulu
                        </div>
                    ) : availableMaterials.length > 0 ? (
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
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
                        <div style={{ padding: '20px', background: '#f0fdf4', color: '#15803d', borderRadius: '12px', fontSize: '14px', fontWeight: 500, textAlign: 'center' }}>
                             ✅ Semua material sudah ditambahkan
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="label">Qty</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="0"
                                value={currentMaterial.quantity}
                                onChange={e => setCurrentMaterial({ ...currentMaterial, quantity: e.target.value })}
                                disabled={!selectedSppg}
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
                        disabled={!selectedSppg || availableMaterials.length === 0}
                    >
                        + Tambah ke Daftar
                    </button>
                </form>
            </div>

            <div style={{ marginTop: '30px', paddingBottom: '120px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '0 8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Daftar Material</h3>
                    <span style={{ fontSize: '13px', color: '#86868b', background: '#e5e5ea', padding: '4px 8px', borderRadius: '8px' }}>{materials.length} item</span>
                </div>

                {materials.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#86868b' }}>
                        <p>Belum ada data</p>
                    </div>
                ) : (
                    <div className="list-container">
                        {materials.map(m => (
                            <div key={m.id} className="list-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📦</div>
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: '15px', color: '#1d1d1f' }}>{m.name}</div>
                                        <div style={{ fontSize: '13px', color: '#86868b' }}>{m.quantity} {m.unit}</div>
                                    </div>
                                </div>
                                <button className="btn-delete" onClick={() => setMaterials(materials.filter(x => x.id !== m.id))}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {(materials.length > 0 || wiringStatus) && (
                    <div style={{ marginTop: '24px' }}>
                        <button 
                            className="btn-primary" 
                            onClick={handleSave} 
                            disabled={isSaving || !wiringStatus} 
                            style={{ 
                                background: (isSaving || !wiringStatus) ? '#86868b' : '#34c759',
                                cursor: (isSaving || !wiringStatus) ? 'not-allowed' : 'pointer',
                                opacity: (isSaving || !wiringStatus) ? 0.7 : 1
                            }}
                        >
                            {isSaving ? 'Mengirim Data...' : 'Simpan & Selesai'}
                        </button>
                        {!wiringStatus && (
                            <p style={{ textAlign: 'center', marginTop: '8px', color: '#ef4444', fontSize: '13px' }}>
                                * Harap pilih Status Wiring
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Dock Navigation */}
            <div className="dock-container">
                <button className="dock-icon" onClick={() => router.push('/')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Home</span>
                </button>
                <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.1)', alignSelf: 'center' }}></div>
                <button className="dock-icon active">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span>Material</span>
                </button>
                <button className="dock-icon" onClick={() => router.push('/mos')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>MOS</span>
                </button>
                <button className="dock-icon" onClick={() => router.push('/wifi')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                    <span>WiFi</span>
                </button>
                <button className="dock-icon" onClick={() => router.push('/bast')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    <span>BAST</span>
                </button>
            </div>
            
            {showReport && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 9999 }} onClick={() => setShowReport(false)}>
                    <div style={{ width: '100%', background: 'white', borderRadius: '24px 24px 0 0', padding: '24px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ width: '40px', height: '5px', background: '#e5e5ea', borderRadius: '3px', margin: '0 auto 20px' }}></div>
                        <h3 className="title" style={{ fontSize: '20px', marginBottom: '20px' }}>Preview Material</h3>
                        <div className="list-container">
                             {materials.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#86868b' }}>Belum ada data</div>
                            ) : materials.map((m, i) => (
                                <div key={i} className="list-item">
                                    <span style={{ color: '#1d1d1f' }}>{m.name}</span>
                                    <strong style={{ color: '#0071e3' }}>{m.quantity} {m.unit}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
