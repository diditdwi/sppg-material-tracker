"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// We reused Auth hook if available, otherwise we might need to duplicate/import it
// Assuming we can import from ../hooks/useAuth like other pages
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

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyX8HaCSI5e03IdE4I5lLaAM3PFQMfY8xeh9_O2DkSvstBTJ5Nv0aG7xkUhxWT3199v/exec';

export default function BastPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [selectedSppg, setSelectedSppg] = useState('');
    const [sppgFilter, setSppgFilter] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) return null;
    if (!isAuthenticated) return null;

    const filteredSppg = SPPG_LIST.filter(s =>
        s.id.toLowerCase().includes(sppgFilter.toLowerCase()) ||
        s.name.toLowerCase().includes(sppgFilter.toLowerCase())
    );

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Ukuran file terlalu besar! Maksimal 5MB.");
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();

        reader.onload = async function (event) {
            const base64Data = event.target.result.split(',')[1];

            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify({
                        action: 'uploadFile',
                        fileName: file.name,
                        mimeType: file.type,
                        fileData: base64Data,
                        folderId: '1K5FviiN6roB9eayXOq3n3DREVVdadMdN',
                        sppgName: selectedSppg ? `${selectedSppg} - ${SPPG_LIST.find(s => s.id === selectedSppg)?.name}` : 'UNKNOWN_SPPG'
                    })
                });

                alert("File berhasil diupload!");
                e.target.value = null;
            } catch (error) {
                console.error("Upload Error:", error);
                alert("Gagal mengupload file.");
            } finally {
                setIsUploading(false);
            }
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="container">
            <header className="header">
                <div onClick={() => router.back()} style={{ cursor: 'pointer', marginBottom: '20px', display: 'inline-flex', background: 'white', padding: '12px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1d1d1f' }}>
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </div>
                <h1 className="title">Upload BAST</h1>
                <p className="subtitle">Berita Acara Serah Terima</p>
            </header>

            <div className="card" style={{ display: 'block' }}>
                <h3 className="label" style={{ marginBottom: '12px', fontSize: '13px' }}>1. Pilih Lokasi SPPG</h3>
                
                <input
                    className="input-field"
                    style={{ marginBottom: '16px' }}
                    placeholder="🔍 Cari ID atau Nama SPPG..."
                    value={sppgFilter}
                    onChange={e => setSppgFilter(e.target.value)}
                />

                <div style={{ position: 'relative' }}>
                    <select
                        className="select-field"
                        value={selectedSppg}
                        onChange={e => setSelectedSppg(e.target.value)}
                        style={{ backgroundColor: selectedSppg ? '#f2f2f7' : '' }}
                    >
                        <option value="">-- Pilih dari {filteredSppg.length} Lokasi --</option>
                        {filteredSppg.map(s => <option key={s.id} value={s.id}>{s.id} - {s.name}</option>)}
                    </select>
                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#86868b' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                </div>
            </div>

            <div className={`card ${!selectedSppg ? 'disabled-card' : ''}`} style={{ display: 'block', marginTop: '20px', opacity: selectedSppg ? 1 : 0.5, pointerEvents: selectedSppg ? 'auto' : 'none' }}>
                <h3 className="label" style={{ marginBottom: '12px', fontSize: '13px' }}>2. Upload Dokumen</h3>
                
                {isUploading ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div className="spinner" style={{ 
                            width: '32px', height: '32px', 
                            border: '3px solid #e5e5ea', 
                            borderTop: '3px solid #0071e3', 
                            borderRadius: '50%', 
                            margin: '0 auto 16px',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ color: '#0071e3', fontWeight: 600, fontSize: '15px' }}>Mengupload...</p>
                        <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <div 
                        onClick={() => document.getElementById('file-upload').click()}
                        style={{ 
                            border: '2px dashed #d1d1d6', 
                            borderRadius: '18px', 
                            padding: '32px', 
                            textAlign: 'center',
                            backgroundColor: '#fafafa',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            accept="image/*,.pdf"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                        <div style={{ 
                            width: '50px', height: '50px', 
                            borderRadius: '14px', 
                            background: '#e8f2ff', 
                            color: '#0071e3',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '24px'
                        }}>
                            📄
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, color: '#1d1d1f', fontSize: '15px' }}>Ketuk untuk Upload</p>
                            <p style={{ fontSize: '13px', color: '#86868b', marginTop: '4px' }}>PDF atau Foto (Max 5MB)</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
