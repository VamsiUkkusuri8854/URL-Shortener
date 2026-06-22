import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, ArrowRight, Copy, Check } from 'lucide-react';
import axios from 'axios';

export default function CustomLinks() {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8080/api/urls/create', {
        originalUrl: url,
        customAlias: alias || null
      });
      setShortUrl(`http://localhost:8080/${response.data.shortCode}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create custom link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center pt-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-6">
            <Link2 size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Branded Custom Links</h1>
          <p className="text-muted-foreground text-lg">
            Create memorable, easy-to-read links tailored to your brand.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl border border-border shadow-2xl">
          <form onSubmit={handleShorten} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Destination URL</label>
              <input
                type="url"
                required
                placeholder="https://your-long-website-url.com/some/path"
                className="w-full p-4 rounded-xl border border-border bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Custom Alias</label>
              <div className="flex items-center border border-border rounded-xl bg-white/50 dark:bg-black/50 focus-within:ring-2 focus-within:ring-blue-500 transition overflow-hidden">
                <span className="pl-4 py-4 text-muted-foreground bg-transparent border-r border-border font-mono text-sm">
                  quicklink.com/
                </span>
                <input
                  type="text"
                  required
                  placeholder="my-brand"
                  className="w-full p-4 bg-transparent outline-none font-mono"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Only letters, numbers, and hyphens allowed.</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Generating...' : 'Create Custom Link'} <ArrowRight size={20} />
            </button>
          </form>

          {shortUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl flex flex-col items-center text-center"
            >
              <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Success! Your custom link is ready.</h3>
              <div className="flex items-center gap-4 w-full">
                <a href={shortUrl} target="_blank" rel="noreferrer" className="flex-1 text-xl font-mono text-foreground truncate hover:underline">
                  {shortUrl}
                </a>
                <button
                  onClick={handleCopy}
                  className="p-3 bg-white dark:bg-gray-800 border border-border rounded-xl shadow-sm hover:scale-105 transition"
                >
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
