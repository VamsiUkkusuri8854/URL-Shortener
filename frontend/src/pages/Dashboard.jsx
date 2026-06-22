import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Link2, Copy, Trash2, Edit2, BarChart3, QrCode, Download, Search, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [urlToDelete, setUrlToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/urls');
      setUrls(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    setUrlToDelete(id);
  };

  const confirmDelete = async () => {
    if (!urlToDelete) return;
    try {
      await axios.delete(`http://localhost:8080/api/urls/${urlToDelete}`);
      fetchUrls();
      setUrlToDelete(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error('Error deleting URL:', error);
      alert('Failed to delete URL');
    }
  };

  const handleCopy = (shortCode) => {
    navigator.clipboard.writeText(`http://localhost:8080/${shortCode}`);
    setCopiedId(shortCode);
    setTimeout(() => setCopiedId(null), 5000);
  };

  const openQrModal = (url) => {
    setSelectedUrl(url);
    setShowQrModal(true);
  };

  const openAnalyticsModal = async (url) => {
    setSelectedUrl(url);
    try {
      const res = await axios.get(`http://localhost:8080/api/urls/${url.id}/analytics`);
      setAnalytics(res.data);
      setShowAnalyticsModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-gen");
    const svgData = new XMLSerializer().serializeToString(canvas);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedUrl.shortCode}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUrls = urls.filter(u => 
    u.originalUrl.includes(searchTerm) || u.shortCode.includes(searchTerm)
  );

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Link Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search links..."
              className="pl-10 pr-4 py-2 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-foreground shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden shadow-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Link Details</th>
                <th className="p-4 font-semibold">Short Link</th>
                <th className="p-4 font-semibold">Clicks</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUrls.map((u, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={u.id} 
                  className="border-b border-border last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition"
                >
                  <td className="p-4 max-w-xs text-muted-foreground">
                    <div className="font-semibold text-foreground truncate" title={u.title || 'Untitled'}>
                      {u.title || 'Untitled'}
                    </div>
                    <div className="text-xs flex items-center gap-2 mt-1">
                      <span title={u.originalUrl} className="truncate max-w-[200px] block">{u.originalUrl}</span>
                      {u.category && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium shrink-0">
                          {u.category}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <a href={`http://localhost:8080/${u.shortCode}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-medium">
                      {u.shortCode}
                    </a>
                  </td>
                  <td className="p-4 font-medium">{u.clickCount}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <button onClick={() => handleCopy(u.shortCode)} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition" title="Copy">
                      {copiedId === u.shortCode ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                    <button onClick={() => openQrModal(u)} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition" title="QR Code">
                      <QrCode size={16} />
                    </button>
                    <button onClick={() => openAnalyticsModal(u)} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition" title="Analytics">
                      <BarChart3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 rounded hover:bg-red-100 text-red-500 transition" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filteredUrls.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-muted-foreground">No links found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showQrModal && selectedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-black p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-center">QR Code</h3>
            <div className="flex justify-center mb-6 bg-white p-4 rounded-xl">
              <QRCodeSVG id="qr-gen" value={`http://localhost:8080/${selectedUrl.shortCode}`} size={200} />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowQrModal(false)} className="flex-1 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 hover:opacity-80 transition">
                Close
              </button>
              <button onClick={downloadQR} className="flex-1 py-2 rounded-xl bg-blue-600 text-white hover:opacity-80 transition flex items-center justify-center gap-2">
                <Download size={18} /> Download
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showAnalyticsModal && selectedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-black p-6 rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Analytics for /{selectedUrl.shortCode}</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-center">
                <p className="text-muted-foreground text-sm">Total Clicks</p>
                <p className="text-3xl font-bold text-blue-500">{selectedUrl.clickCount}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-center">
                <p className="text-muted-foreground text-sm">Unique Devices</p>
                <p className="text-3xl font-bold text-purple-500">
                  {new Set(analytics.map(a => a.device)).size}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-center">
                <p className="text-muted-foreground text-sm">Countries</p>
                <p className="text-3xl font-bold text-green-500">
                  {new Set(analytics.map(a => a.country)).size}
                </p>
              </div>
            </div>

            <div className="h-64 mb-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Click Timeline (Demo Chart)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.map((a, i) => ({ name: i, clicks: i+1 }))}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 text-right">
              <button onClick={() => setShowAnalyticsModal(false)} className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 hover:opacity-80 transition">
                Close Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {urlToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-black p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-800 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Delete Link?</h3>
            <p className="text-muted-foreground mb-8">This action cannot be undone. All analytics and data associated with this link will be permanently lost.</p>
            
            <div className="flex gap-4">
              <button onClick={() => setUrlToDelete(null)} className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 hover:opacity-80 transition font-medium">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-medium">
                Delete Permanently
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-medium"
        >
          <div className="bg-white/20 p-1 rounded-full"><Check size={16} /></div>
          Link deleted successfully
        </motion.div>
      )}
    </div>
  );
}
