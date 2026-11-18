import React, { useState, useRef, useEffect } from 'react';

export default function IrisCopilotDrawer({ currentPatientId = null, role = 'doctor' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return true;
        return document.documentElement.getAttribute('data-theme') === 'dark' ||
               document.body?.getAttribute('data-theme') === 'dark' ||
               localStorage.getItem('lazyeye-theme') === 'dark';
    });

    const [activePatient, setActivePatient] = useState({
        id: currentPatientId || 18,
        name: currentPatientId ? `Patient #${currentPatientId}` : 'Puneet Kushwaha'
    });

    const [messages, setMessages] = useState([
        {
            role: 'model',
            text: `👋 Hello Doctor, I am **Iris** — your Autonomous Clinical AI Vision Copilot.\n\nI monitor patient compliance adherence, evaluate suppression scotoma telemetry, and can dynamically adjust dichoptic red-cyan contrast filters.\n\nClick any quick prompt below or ask me any question!`,
            tools: []
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeRole, setActiveRole] = useState(role);
    const messagesEndRef = useRef(null);

    // Watch for theme toggles dynamically from navbar
    useEffect(() => {
        const updateTheme = () => {
            const dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                         document.documentElement.getAttribute('data-bs-theme') === 'dark' ||
                         document.body?.getAttribute('data-theme') === 'dark' ||
                         localStorage.getItem('lazyeye-theme') === 'dark';
            setIsDark(dark);
        };
        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-bs-theme'] });
        if (document.body) {
            observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
        }
        window.addEventListener('storage', updateTheme);

        return () => {
            observer.disconnect();
            window.removeEventListener('storage', updateTheme);
        };
    }, []);

    const quickPrompts = [
        { label: '📊 Cohort Compliance Radar', prompt: 'Summarize cohort compliance radar and tell me how many patients are at risk.' },
        { label: `👤 Patient #18 (Puneet)`, prompt: 'Give me clinical progress report for Patient #18.' },
        { label: '📈 Activity Evaluation', prompt: 'Are his activities good or not?' },
        { label: '🎯 Contrast Adjustment', prompt: `Analyze and recommend dichoptic contrast adjustments for current patient.` },
        { label: '📝 Draft SOAP Note', prompt: `Generate a formal SOAP clinical note for current patient.` },
        { label: '⚠️ At-Risk Inactivity Check', prompt: 'Which patients have been inactive for more than 7 days and need intervention?' },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (messageText = null) => {
        const query = messageText || input.trim();
        if (!query || loading) return;

        const newMessages = [...messages, { role: 'user', text: query }];
        setMessages(newMessages);
        if (!messageText) setInput('');
        setLoading(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const endpoints = ['/iris/chat', '/api/iris/chat'];
            let res = null;
            let data = null;

            for (const ep of endpoints) {
                try {
                    res = await fetch(ep, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-CSRF-TOKEN': csrfToken,
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: JSON.stringify({
                            message: query,
                            role: activeRole,
                            patient_id: activePatient.id,
                            history: messages.slice(-8).map(m => ({
                                role: m.role === 'model' ? 'model' : 'user',
                                text: m.text
                            }))
                        })
                    });
                    if (res.ok) {
                        data = await res.json();
                        break;
                    }
                } catch (e) {
                    console.warn(`Failed calling ${ep}:`, e);
                }
            }

            if (data && data.success) {
                if (data.patient_id) {
                    setActivePatient({
                        id: data.patient_id,
                        name: data.patient_name || `Patient #${data.patient_id}`
                    });
                }
                setMessages([...newMessages, {
                    role: 'model',
                    text: data.reply,
                    tools: data.tools_executed || []
                }]);
            } else {
                const errDetail = (data && (data.error || data.message)) || (res ? `HTTP ${res.status}: ${res.statusText}` : 'Unable to connect to Iris intelligence.');
                setMessages([...newMessages, {
                    role: 'model',
                    text: `⚠️ **Error:** ${errDetail}`
                }]);
            }
        } catch (err) {
            setMessages([...newMessages, {
                role: 'model',
                text: `⚠️ **Connection Error:** Could not contact clinical service (${err.message}).`
            }]);
        } finally {
            setLoading(false);
        }
    };

    const formatMarkdown = (txt) => {
        if (!txt) return '';
        const lines = txt.split('\n');
        return lines.map((line, idx) => {
            if (line.startsWith('### ')) {
                return (
                    <h4
                        key={idx}
                        style={{
                            margin: '8px 0 4px',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: isDark ? '#58A6FF' : '#1e293b'
                        }}
                    >
                        {line.replace('### ', '')}
                    </h4>
                );
            }
            if (line.startsWith('## ')) {
                return (
                    <h3
                        key={idx}
                        style={{
                            margin: '10px 0 4px',
                            fontSize: '15px',
                            fontWeight: 700,
                            color: isDark ? '#79C0FF' : '#0f172a'
                        }}
                    >
                        {line.replace('## ', '')}
                    </h3>
                );
            }
            if (line.startsWith('* ') || line.startsWith('- ')) {
                return (
                    <li
                        key={idx}
                        style={{
                            marginLeft: '16px',
                            fontSize: '13px',
                            lineHeight: '1.5',
                            color: isDark ? '#C9D1D9' : '#334155'
                        }}
                    >
                        {renderBold(line.substring(2))}
                    </li>
                );
            }
            if (line.trim() === '---') {
                return (
                    <hr
                        key={idx}
                        style={{
                            border: 'none',
                            borderTop: isDark ? '1px solid #30363D' : '1px solid #e2e8f0',
                            margin: '8px 0'
                        }}
                    />
                );
            }
            if (!line.trim()) {
                return <div key={idx} style={{ height: '6px' }} />;
            }
            return (
                <p
                    key={idx}
                    style={{
                        margin: '3px 0',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        color: isDark ? '#C9D1D9' : '#334155'
                    }}
                >
                    {renderBold(line)}
                </p>
            );
        });
    };

    const renderBold = (str) => {
        const parts = str.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong
                        key={i}
                        style={{
                            color: isDark ? '#79C0FF' : '#0f172a',
                            fontWeight: 700
                        }}
                    >
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return part;
        });
    };

    return (
        <>
            {/* Inline CSS to eradicate horizontal scrollbar completely and style smoothly */}
            <style>{`
                .iris-chips-scroll {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .iris-chips-scroll::-webkit-scrollbar {
                    display: none;
                }
                .iris-messages-scroll::-webkit-scrollbar {
                    width: 5px;
                }
                .iris-messages-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .iris-messages-scroll::-webkit-scrollbar-thumb {
                    background: ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
                    border-radius: 4px;
                }
                @keyframes irisGlowPulse {
                    0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.6); }
                    70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
                }
            `}</style>

            {/* Floating Action Launcher Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 20px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #1f6feb 0%, #2563eb 50%, #4338ca 100%)',
                        color: '#ffffff',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                        boxShadow: isDark
                            ? '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 0 20px rgba(37, 99, 235, 0.4)'
                            : '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
                        cursor: 'pointer',
                        zIndex: 99999,
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        animation: 'irisGlowPulse 3s infinite',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                    aria-label="Open Iris Clinical Copilot"
                >
                    <span style={{ fontSize: '18px' }}>👁️</span>
                    <span>Iris Clinical AI</span>
                    <span
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#4ade80',
                            boxShadow: '0 0 8px #4ade80',
                        }}
                    />
                </button>
            )}

            {/* Slide-out Copilot Drawer */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        width: '430px',
                        maxWidth: 'calc(100vw - 32px)',
                        height: '630px',
                        maxHeight: 'calc(100vh - 48px)',
                        borderRadius: '18px',
                        backgroundColor: isDark ? '#0D1117' : '#ffffff',
                        border: isDark ? '1px solid rgba(56, 139, 253, 0.3)' : '1px solid rgba(226, 232, 240, 0.9)',
                        boxShadow: isDark
                            ? '0 25px 60px -10px rgba(0, 0, 0, 0.85), 0 0 30px rgba(31, 111, 235, 0.2)'
                            : '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
                        zIndex: 99999,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    }}
                >
                    {/* Drawer Header */}
                    <div
                        style={{
                            padding: '14px 18px',
                            background: isDark
                                ? 'linear-gradient(135deg, #161B22 0%, #0D1117 100%)'
                                : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: isDark ? '1px solid #30363D' : '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #1f6feb, #6366f1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    boxShadow: '0 2px 8px rgba(31, 111, 235, 0.4)',
                                }}
                            >
                                👁️
                            </div>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', color: '#F0F6FC' }}>
                                    Iris Clinical Copilot
                                </div>
                                <div style={{ fontSize: '11px', color: '#8B949E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#238636', boxShadow: '0 0 6px #238636' }} />
                                    <span>Autonomous Agentic Core</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Active Patient Focus Tag */}
                            <span
                                style={{
                                    fontSize: '11px',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    backgroundColor: isDark ? 'rgba(56, 139, 253, 0.15)' : '#eff6ff',
                                    color: isDark ? '#79C0FF' : '#1d4ed8',
                                    border: isDark ? '1px solid rgba(56, 139, 253, 0.3)' : '1px solid #bfdbfe',
                                    fontWeight: 600,
                                }}
                            >
                                Focus: #{activePatient.id}
                            </span>

                            {/* Role Toggle */}
                            <button
                                onClick={() => setActiveRole(activeRole === 'doctor' ? 'patient' : 'doctor')}
                                title="Toggle Role (Doctor Mode vs Patient Buddy)"
                                style={{
                                    fontSize: '11px',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    backgroundColor: activeRole === 'doctor' ? '#1f6feb' : '#238636',
                                    color: '#ffffff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                }}
                            >
                                {activeRole === 'doctor' ? '🩺 Doctor' : '🎈 Buddy'}
                            </button>

                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#8B949E',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    lineHeight: 1,
                                }}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Quick Prompts Bar (Scrollbar completely hidden) */}
                    <div
                        className="iris-chips-scroll"
                        style={{
                            padding: '8px 12px',
                            backgroundColor: isDark ? '#161B22' : '#f8fafc',
                            borderBottom: isDark ? '1px solid #30363D' : '1px solid #e2e8f0',
                            display: 'flex',
                            gap: '6px',
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {quickPrompts.map((qp, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(qp.prompt)}
                                disabled={loading}
                                style={{
                                    padding: '5px 12px',
                                    borderRadius: '9999px',
                                    backgroundColor: isDark ? '#21262D' : '#ffffff',
                                    border: isDark ? '1px solid #30363D' : '1px solid #cbd5e1',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: isDark ? '#E6EDF3' : '#334155',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s ease',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#1f6feb';
                                    e.currentTarget.style.color = '#58A6FF';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = isDark ? '#30363D' : '#cbd5e1';
                                    e.currentTarget.style.color = isDark ? '#E6EDF3' : '#334155';
                                }}
                            >
                                {qp.label}
                            </button>
                        ))}
                    </div>

                    {/* Messages Body */}
                    <div
                        className="iris-messages-scroll"
                        style={{
                            flex: 1,
                            padding: '14px',
                            overflowY: 'auto',
                            backgroundColor: isDark ? '#0D1117' : '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                    >
                        {messages.map((m, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                {/* Tool execution indicator */}
                                {m.tools && m.tools.length > 0 && (
                                    <div
                                        style={{
                                            marginBottom: '4px',
                                            display: 'flex',
                                            gap: '4px',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        {m.tools.map((t, ti) => (
                                            <span
                                                key={ti}
                                                style={{
                                                    fontSize: '10px',
                                                    padding: '2px 8px',
                                                    borderRadius: '6px',
                                                    backgroundColor: isDark ? 'rgba(56, 139, 253, 0.15)' : '#eff6ff',
                                                    color: isDark ? '#79C0FF' : '#1d4ed8',
                                                    border: isDark ? '1px solid rgba(56, 139, 253, 0.35)' : '1px solid #bfdbfe',
                                                    fontWeight: 600,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}
                                            >
                                                ⚡ Tool: {t.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div
                                    style={{
                                        maxWidth: '88%',
                                        padding: '10px 14px',
                                        borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                                        backgroundColor: m.role === 'user' ? '#1f6feb' : (isDark ? '#161B22' : '#f1f5f9'),
                                        border: m.role === 'user' ? 'none' : (isDark ? '1px solid #30363D' : '1px solid #e2e8f0'),
                                        color: m.role === 'user' ? '#ffffff' : (isDark ? '#E6EDF3' : '#0f172a'),
                                        boxShadow: isDark
                                            ? (m.role === 'user' ? '0 2px 8px rgba(31, 111, 235, 0.4)' : '0 2px 6px rgba(0,0,0,0.3)')
                                            : '0 1px 2px rgba(0, 0, 0, 0.05)',
                                    }}
                                >
                                    {m.role === 'user' ? (
                                        <div style={{ fontSize: '13px', lineHeight: '1.4' }}>{m.text}</div>
                                    ) : (
                                        formatMarkdown(m.text)
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isDark ? '#8B949E' : '#64748b', fontSize: '12px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1f6feb', animation: 'pulse 1s infinite' }} />
                                Iris is querying clinical tools & synthesizing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <div
                        style={{
                            padding: '12px 14px',
                            backgroundColor: isDark ? '#161B22' : '#ffffff',
                            borderTop: isDark ? '1px solid #30363D' : '1px solid #e2e8f0',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                        }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={activeRole === 'doctor' ? `Ask Iris about Patient #${activePatient.id}, cohort, or contrast...` : "Ask Iris anything about games and vision..."}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: '10px',
                                backgroundColor: isDark ? '#0D1117' : '#ffffff',
                                border: isDark ? '1px solid #30363D' : '1px solid #cbd5e1',
                                fontSize: '13px',
                                outline: 'none',
                                color: isDark ? '#F0F6FC' : '#0f172a',
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = '#1f6feb')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = isDark ? '#30363D' : '#cbd5e1')}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '10px',
                                background: input.trim() && !loading
                                    ? 'linear-gradient(135deg, #1f6feb 0%, #238636 100%)'
                                    : (isDark ? '#21262D' : '#94a3b8'),
                                color: input.trim() && !loading ? '#ffffff' : (isDark ? '#6E7681' : '#f8fafc'),
                                border: isDark ? '1px solid #30363D' : 'none',
                                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                                fontWeight: 600,
                                fontSize: '13px',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
