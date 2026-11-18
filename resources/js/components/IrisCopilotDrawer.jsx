import React, { useState, useRef, useEffect } from 'react';

export default function IrisCopilotDrawer({ currentPatientId = null, role = 'doctor' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'model',
            text: `👋 Hello Doctor, I am **Iris** — your Clinical AI Vision Copilot.\n\nI monitor patient compliance adherence, evaluate suppression scotoma telemetry, and can dynamically adjust dichoptic red-cyan contrast filters.\n\nClick any quick prompt below or ask me any question!`,
            tools: []
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeRole, setActiveRole] = useState(role);
    const messagesEndRef = useRef(null);

    const quickPrompts = [
        { label: '📊 Cohort Compliance Radar', prompt: 'Summarize cohort compliance radar and tell me how many patients are at risk.' },
        { label: '📝 Draft SOAP Note', prompt: `Generate a formal SOAP clinical note for patient #${currentPatientId || 4}.` },
        { label: '🎯 Contrast Adjustment', prompt: `Analyze and recommend dichoptic contrast adjustments for patient #${currentPatientId || 4}.` },
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
            const res = await fetch('/iris/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: query,
                    role: activeRole,
                    patient_id: currentPatientId || 4,
                    history: messages.slice(-6).map(m => ({
                        role: m.role === 'model' ? 'model' : 'user',
                        text: m.text
                    }))
                })
            });

            const data = await res.json();
            if (data.success) {
                setMessages([...newMessages, {
                    role: 'model',
                    text: data.reply,
                    tools: data.tools_executed || []
                }]);
            } else {
                setMessages([...newMessages, {
                    role: 'model',
                    text: `⚠️ **Error:** ${data.error || 'Unable to connect to Iris intelligence.'}`
                }]);
            }
        } catch (err) {
            setMessages([...newMessages, {
                role: 'model',
                text: `⚠️ **Connection Error:** Could not contact clinical service. Please verify your connection.`
            }]);
        } finally {
            setLoading(false);
        }
    };

    const formatMarkdown = (txt) => {
        if (!txt) return '';
        // Basic Markdown parser for headings, bold, bullet points
        const lines = txt.split('\n');
        return lines.map((line, idx) => {
            if (line.startsWith('### ')) {
                return <h4 key={idx} style={{ margin: '8px 0 4px', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{line.replace('### ', '')}</h4>;
            }
            if (line.startsWith('## ')) {
                return <h3 key={idx} style={{ margin: '10px 0 4px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{line.replace('## ', '')}</h3>;
            }
            if (line.startsWith('* ') || line.startsWith('- ')) {
                return (
                    <li key={idx} style={{ marginLeft: '16px', fontSize: '13px', lineHeight: '1.5', color: '#334155' }}>
                        {renderBold(line.substring(2))}
                    </li>
                );
            }
            if (line.trim() === '---') {
                return <hr key={idx} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />;
            }
            if (!line.trim()) {
                return <div key={idx} style={{ height: '6px' }} />;
            }
            return (
                <p key={idx} style={{ margin: '3px 0', fontSize: '13px', lineHeight: '1.5', color: '#334155' }}>
                    {renderBold(line)}
                </p>
            );
        });
    };

    const renderBold = (str) => {
        const parts = str.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} style={{ color: '#0f172a' }}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <>
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
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #4338ca 100%)',
                        color: '#ffffff',
                        border: 'none',
                        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4), 0 8px 10px -6px rgba(37, 99, 235, 0.3)',
                        cursor: 'pointer',
                        zIndex: 99999,
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
                    aria-label="Open Iris Clinical Copilot"
                >
                    <span style={{ fontSize: '18px', animation: 'spin 4s linear infinite' }}>👁️</span>
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
                        width: '420px',
                        maxWidth: 'calc(100vw - 32px)',
                        height: '620px',
                        maxHeight: 'calc(100vh - 48px)',
                        borderRadius: '20px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
                        zIndex: 99999,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                        animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    {/* Drawer Header */}
                    <div
                        style={{
                            padding: '16px 20px',
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                }}
                            >
                                👁️
                            </div>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>
                                    Iris Clinical Copilot
                                </div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                                    Autonomous Agentic Core
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Role Toggle */}
                            <button
                                onClick={() => setActiveRole(activeRole === 'doctor' ? 'patient' : 'doctor')}
                                title="Toggle Role (Doctor Mode vs Patient Buddy)"
                                style={{
                                    fontSize: '11px',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    backgroundColor: activeRole === 'doctor' ? '#1e3a8a' : '#047857',
                                    color: '#ffffff',
                                    border: '1px solid rgba(255,255,255,0.2)',
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
                                    color: '#94a3b8',
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

                    {/* Quick Prompts Bar */}
                    <div
                        style={{
                            padding: '10px 14px',
                            backgroundColor: '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
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
                                    padding: '4px 10px',
                                    borderRadius: '9999px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#334155',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s ease',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#2563eb';
                                    e.currentTarget.style.color = '#2563eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.color = '#334155';
                                }}
                            >
                                {qp.label}
                            </button>
                        ))}
                    </div>

                    {/* Messages Body */}
                    <div
                        style={{
                            flex: 1,
                            padding: '16px',
                            overflowY: 'auto',
                            backgroundColor: '#ffffff',
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
                                                    backgroundColor: '#eff6ff',
                                                    color: '#1d4ed8',
                                                    border: '1px solid #bfdbfe',
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
                                        maxWidth: '85%',
                                        padding: '10px 14px',
                                        borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                                        backgroundColor: m.role === 'user' ? '#2563eb' : '#f1f5f9',
                                        color: m.role === 'user' ? '#ffffff' : '#0f172a',
                                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb', animation: 'pulse 1s infinite' }} />
                                Iris is querying clinical tools & synthesizing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <div
                        style={{
                            padding: '12px 16px',
                            backgroundColor: '#ffffff',
                            borderTop: '1px solid #e2e8f0',
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
                            placeholder={activeRole === 'doctor' ? "Ask Iris about cohort, patient, or contrast..." : "Ask Iris anything about games and vision..."}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: '10px',
                                border: '1px solid #cbd5e1',
                                fontSize: '13px',
                                outline: 'none',
                                color: '#0f172a',
                            }}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '10px',
                                backgroundColor: input.trim() && !loading ? '#2563eb' : '#94a3b8',
                                color: '#ffffff',
                                border: 'none',
                                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                                fontWeight: 600,
                                fontSize: '13px',
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
