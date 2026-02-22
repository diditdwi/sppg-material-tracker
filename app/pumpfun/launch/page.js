'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TokenLauncher() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        description: '',
        twitter: '',
        telegram: '',
        website: '',
        amount: '0.1'
    });
    const [preview, setPreview] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);

    const generateTrend = async () => {
        setLoading(true);
        setStatus('Wizards are dreaming of your koin...');
        try {
            const res = await fetch('/api/pumpfun/trends/generate');
            const data = await res.json();
            if (data.success) {
                setFormData({
                    ...formData,
                    name: data.name,
                    symbol: data.symbol,
                    description: data.description,
                    twitter: data.twitter,
                    telegram: data.telegram,
                    website: data.website
                });

                setStatus('AI is painting your viral mascot...');
                const randomSeed = Math.floor(Math.random() * 1000000);
                const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(data.name + " mascot logo meme coin style, high quality vector art, vibrant colors, 3d render style")}?width=512&height=512&seed=${randomSeed}&nologo=true`;

                // We set the preview directly. 
                // The server will handle downloading the image from URL during launch to avoid CORS.
                setPreview(imageUrl);
                setImageBlob(null); // Clear manual file if AI is being used
            }
        } catch (e) {
            console.error('Trend Generation Error:', e);
            alert('Failed to generate trend. Please try again.');
        } finally {
            setLoading(false);
            setStatus('');
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setImageBlob(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!preview) {
            alert("Please generate or upload a logo first!");
            return;
        }

        setLoading(true);
        setStatus('Deploying to Solana... (Wait 15-30s)');

        try {
            const data = new FormData();

            if (imageBlob) {
                // Manual file upload
                data.append('file', imageBlob);
            } else if (preview.startsWith('http')) {
                // Tell the server to download the logo from the AI URL
                data.append('imageUrl', preview);
            }

            data.append('name', formData.name);
            data.append('symbol', formData.symbol);
            data.append('description', formData.description);
            data.append('twitter', formData.twitter);
            data.append('telegram', formData.telegram);
            data.append('website', formData.website);
            data.append('amount', formData.amount);

            const res = await fetch('/api/pumpfun/launch', {
                method: 'POST',
                body: data
            });

            const resData = await res.json();
            if (resData.success) {
                setResult(resData);
            } else {
                alert(`Error: ${resData.error}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
            setStatus('');
        }
    };

    return (
        <div className="launch-container">
            <style jsx>{`
                .launch-container {
                    min-height: 100vh;
                    background: radial-gradient(circle at top left, #2d0a4e, #050505 50%);
                    color: white;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px 20px;
                }
                .card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 32px;
                    width: 100%;
                    max-width: 900px;
                    padding: 40px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                }
                .title-group h1 {
                    font-size: 3rem;
                    font-weight: 900;
                    margin: 0;
                    background: linear-gradient(to right, #ffffff, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .title-group p {
                    color: #94a3b8;
                    margin: 5px 0 0;
                }
                .btn-magic {
                    background: white;
                    color: black;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-magic:hover {
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
                    transform: translateY(-2px);
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 30px;
                }
                .form-section { display: flex; flex-direction: column; gap: 20px; }
                .input-group { display: flex; flex-direction: column; gap: 8px; }
                .input-group label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; }
                input, textarea {
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 15px;
                    border-radius: 16px;
                    font-size: 16px;
                }
                input:focus, textarea:focus {
                    outline: none;
                    border-color: #8b5cf6;
                }
                .preview-box {
                    background: rgba(0, 0, 0, 0.3);
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    position: relative;
                }
                .preview-box img { width: 100%; height: 100%; object-fit: cover; }
                .submit-btn {
                    width: 100%;
                    padding: 20px;
                    border-radius: 16px;
                    border: none;
                    font-size: 20px;
                    font-weight: 900;
                    cursor: pointer;
                    background: linear-gradient(to right, #8b5cf6, #ec4899);
                    color: white;
                    margin-top: 30px;
                    transition: all 0.2s;
                }
                .submit-btn:disabled { background: #334155; color: #64748b; cursor: not-allowed; }
                .submit-btn:not(:disabled):hover { transform: scale(1.02); box-shadow: 0 0 30px rgba(139, 92, 246, 0.4); }
                .loading-status { text-align: center; margin-top: 15px; color: #8b5cf6; font-weight: 600; font-size: 14px; }
                .success-card { text-align: center; padding: 40px; }
                .success-icon { font-size: 60px; margin-bottom: 20px; }
            `}</style>

            <div className="card">
                {result ? (
                    <div className="success-card">
                        <div className="success-icon">🚀</div>
                        <h1>LAUNCH SUCCESS!</h1>
                        <p style={{ color: '#94a3b8' }}>Your token is live on pump.fun</p>
                        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '16px', margin: '20px 0', fontSize: '14px', wordBreak: 'break-all' }}>
                            {result.mint}
                        </div>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <a href={result.explorerUrl} target="_blank" style={{ background: '#8b5cf6', color: 'white', padding: '15px 30px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' }}>View on Solscan</a>
                            <button onClick={() => router.push('/pumpfun')} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '12px', fontWeight: 'bold' }}>Dashboard</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="header">
                            <div className="title-group">
                                <h1>TOKEN LAUNCHER</h1>
                                <p>Automate your viral meme coin project</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn-magic" onClick={generateTrend} disabled={loading}>
                                    {loading ? '...' : '🪄 AI MAGIC'}
                                </button>
                                <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => router.push('/pumpfun')}>Back</button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-section">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div className="input-group">
                                            <label>Name</label>
                                            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Moon Dog" required />
                                        </div>
                                        <div className="input-group">
                                            <label>Symbol</label>
                                            <input value={formData.symbol} onChange={e => setFormData({ ...formData, symbol: e.target.value })} placeholder="MOON" required />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Description</label>
                                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="The story of the moon..." style={{ height: '100px' }} required />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div className="input-group">
                                            <label>Twitter</label>
                                            <input value={formData.twitter} onChange={e => setFormData({ ...formData, twitter: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label>Initial Buy (SOL)</label>
                                            <input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <div className="input-group">
                                        <label>Logo Asset</label>
                                        <div className="preview-box">
                                            {preview ? <img key={preview} src={preview} alt="Preview" /> : <span style={{ fontSize: '40px' }}>🖼️</span>}
                                        </div>
                                        <input type="file" onChange={handleFileChange} style={{ fontSize: '10px', marginTop: '10px' }} />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading || !preview}>
                                {loading ? 'PROCESSING...' : preview ? '🚀 LAUNCH TO PUMP.FUN' : 'GENERATE AI LOGO FIRST'}
                            </button>
                            {status && <div className="loading-status">{status}</div>}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
