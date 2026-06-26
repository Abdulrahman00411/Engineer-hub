import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function MessagesPage() {
  const { user, convos, sendMessage, markRead, activeConvo, setActiveConvo } = useApp();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const convo = convos.find(c => (c._id || c.id) === activeConvo);

  useEffect(() => {
    if (convo) markRead(convo);
  }, [activeConvo, convos.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convo?.messages?.length]);

  const getOtherName = (c) => user?.role === 'client' ? c.engineerName : c.clientName;
  const getOtherInitials = (c) => user?.role === 'client' ? c.engineerInitials : (c.clientName?.split(' ').map(w=>w[0]).join('').slice(0,2) || 'CL');

  const handleSend = () => {
    if (!input.trim() || !convo) return;
    const otherId = convo.participants.find(p => p !== user.id);
    sendMessage(otherId, input);
    setInput('');
  };

  if (!user) return (
    <div className="wrap" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: '1rem' }}>🔐</div>
      <h3>Login</h3>
      <p>Login is required to view messages</p>
    </div>
  );

  return (
    <div className="wrap" style={{ padding: '1.5rem' }}>
      <div className="sec-label">Inbox</div>
      <h2 style={{ marginBottom: '1.5rem' }}>Messages</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--rm)', overflow: 'hidden', height: '70vh' }}>
        {/* Conversation list */}
        <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto', background: 'var(--steel-mid)' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Conversations ({convos.length})
          </div>
          {convos.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              No messages yet
            </div>
          )}
          {convos.map(c => {
            const unread = c.unread?.[user._id || user.id] || 0;
            return (
              <div key={c.id} onClick={() => setActiveConvo(c.id)} style={{
                padding: '1rem', cursor: 'pointer', transition: 'background 0.15s',
                background: activeConvo === c.id ? 'var(--accent-dim)' : 'transparent',
                borderBottom: '1px solid var(--border)',
                borderLeft: activeConvo === c.id ? '3px solid var(--accent)' : '3px solid transparent'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="av av-sm" style={{ background: 'var(--steel-light)', color: 'var(--text-2)', fontSize: 11, flexShrink: 0 }}>
                    {getOtherInitials(c)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: activeConvo === c.id ? 'var(--accent)' : 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>
                        {getOtherName(c)}
                      </span>
                      <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-3)' }}>{c.lastTime}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                      {c.lastMsg}
                    </div>
                  </div>
                  {unread > 0 && (
                    <span style={{ background: 'var(--accent)', color: 'var(--steel)', width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{unread}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat area */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--card)' }}>
          {convo ? (
            <>
              {/* Chat header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--steel-mid)' }}>
                <div className="av av-sm" style={{ background: 'var(--steel-light)', color: 'var(--text-2)', fontSize: 12 }}>
                  {getOtherInitials(convo)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{getOtherName(convo)}</div>
                  <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: '#4ADE80' }}>● Online</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {convo.messages.map((msg, i) => {
                  const isMe = msg.from === user.id;
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      {i === 0 || convo.messages[i-1]?.date !== msg.date ? (
                        <div style={{ textAlign: 'center', fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-3)', margin: '0.5rem 0' }}>{msg.date}</div>
                      ) : null}
                      <div className={`chat-bubble ${isMe ? 'me' : 'them'}`}>{msg.text}</div>
                      <span className="chat-time" style={{ marginTop: 4 }}>{msg.time}</span>
                    </div>
                  );
                })}
                <div ref={bottomRef}></div>
              </div>

              {/* Input */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                <input
                  className="form-input"
                  placeholder="Type Message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-primary" onClick={handleSend} disabled={!input.trim()}>Send ↵</button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 48 }}>💬</div>
              <div style={{ fontFamily: 'var(--font-d)', fontSize: 18 }}>Conversation select karo</div>
              <div style={{ fontSize: 13 }}>Click on the conversation from the left side</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
