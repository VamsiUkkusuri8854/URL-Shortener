import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Search, Users, Globe, Monitor } from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { API_BASE_URL } from '../config';

export default function AnalyticsPage() {
  const [shortCode, setShortCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!shortCode.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Extract just the alias/shortcode if user pastes a full URL
      let query = shortCode.trim();
      if (query.includes('/')) {
        query = query.substring(query.lastIndexOf('/') + 1);
      }
      query = query.toLowerCase();

      const allUrlsRes = await axios.get(`${API_BASE_URL}/urls`);
      const urlRecord = allUrlsRes.data.find(u => 
        (u.shortCode && u.shortCode.toLowerCase() === query) || 
        (u.customAlias && u.customAlias.toLowerCase() === query)
      );
      
      if (!urlRecord) {
        throw new Error("Short link not found. Please ensure you have created this link first and check the spelling.");
      }

      // Then fetch its analytics
      const analyticsRes = await axios.get(`${API_BASE_URL}/urls/${urlRecord.id}/analytics`);
      
      setData({
        url: urlRecord,
        analytics: analyticsRes.data
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 max-w-7xl mx-auto pt-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3 mb-4">
          <BarChart2 className="text-purple-500" size={40} />
          Advanced Analytics
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enter any of your QuickLink short codes below to view comprehensive traffic statistics, geographic data, and device metrics.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-16">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Paste URL or enter short code (e.g. my-brand)"
              required
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-foreground shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Analyze'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* URL Header */}
          <div className="glass p-8 rounded-3xl border border-border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">Analytics for /{data.url.shortCode}</h2>
                  {data.url.category && (
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium text-sm">
                      {data.url.category}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-lg text-foreground mb-1">{data.url.title || 'Untitled Link'}</p>
                <p className="text-muted-foreground text-sm break-all">{data.url.originalUrl}</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard icon={<Users />} title="Total Clicks" value={data.url.clickCount} color="text-blue-500" />
            <StatCard icon={<Monitor />} title="Unique Devices" value={new Set(data.analytics.map(a => a.device)).size} color="text-purple-500" />
            <StatCard icon={<Globe />} title="Countries" value={new Set(data.analytics.map(a => a.country)).size} color="text-green-500" />
            <StatCard icon={<BarChart2 />} title="Status" value={data.url.status} color="text-yellow-500" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Timeline Chart */}
            <div className="glass p-6 rounded-2xl border border-border">
              <h3 className="text-lg font-bold mb-6">Traffic Timeline</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.analytics.map((a, i) => ({ name: `Click ${i+1}`, clicks: i+1 }))}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Line type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 4, fill: '#8b5cf6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Device Chart (Mocked grouping) */}
            <div className="glass p-6 rounded-2xl border border-border">
              <h3 className="text-lg font-bold mb-6">Device Breakdown</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Desktop', value: data.analytics.filter(a => a.device === 'Desktop').length },
                    { name: 'Mobile', value: data.analytics.filter(a => a.device === 'Mobile').length },
                    { name: 'Tablet', value: data.analytics.filter(a => a.device === 'Tablet').length },
                    { name: 'Unknown', value: data.analytics.filter(a => a.device === 'Unknown').length },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="glass p-6 rounded-2xl border border-border flex items-center gap-4 hover:shadow-xl transition-shadow">
      <div className={`p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}
