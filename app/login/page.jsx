"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


const CORRECT_PASSWORD = "Balonkuada5678!";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        setTimeout(() => {
            if (password === CORRECT_PASSWORD) {
                sessionStorage.setItem("authenticated", "true");
                router.push("/");
            } else {
                setError("Password salah! Silakan coba lagi.");
                setPassword("");
                setIsLoading(false);
            }
        }, 500);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7', padding: '20px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 30px' }}>
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <div style={{ 
                        width: '80px', height: '80px', 
                        background: 'white', borderRadius: '20px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <img src="/baraya_logo.png" alt="Baraya Logo" style={{ width: '60px', height: 'auto' }} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1d1d1f', marginBottom: '8px' }}>Welcome Back</h1>
                    <p style={{ fontSize: '15px', color: '#86868b' }}>Masuk untuk melanjutkan ke Material Tracker</p>
                </div>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Masukkan Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                            style={{ textAlign: 'center', fontSize: '16px', letterSpacing: '0.1em' }}
                        />
                    </div>

                    {error && (
                        <div style={{ 
                            background: '#fff2f2', color: '#ff3b30', 
                            padding: '12px', borderRadius: '12px', 
                            fontSize: '13px', fontWeight: 500, 
                            marginBottom: '20px', textAlign: 'center',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={isLoading || !password}
                        style={{ width: '100%' }}
                    >
                        {isLoading ? (
                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <div className="spinner" style={{ 
                                    width: '18px', height: '18px', 
                                    border: '2px solid rgba(255,255,255,0.3)', 
                                    borderTop: '2px solid white', 
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                Verifikasi...
                            </div>
                        ) : 'Masuk'}
                    </button>
                </form>

                <p style={{ marginTop: '30px', fontSize: '12px', color: '#a1a1a6', fontWeight: 500 }}>
                    Telkom Akses BARAYA &copy; 2024
                </p>
            </div>
        </div>
    );
}
