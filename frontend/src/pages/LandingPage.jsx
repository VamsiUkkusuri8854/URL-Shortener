import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link2, BarChart2, QrCode, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';
import axios from 'axios';

export default function LandingPage() {
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
      setError(err.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Shorten. Share. <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Analyze.</span>
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            The ultimate tool to simplify your links, track your audience, and generate QR codes instantly. No registration required.
          </p>

          <div className="max-w-2xl mx-auto glass rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleShorten} className="flex flex-col gap-4">
              <input
                type="url"
                required
                placeholder="Paste your long URL here..."
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Custom alias (optional)"
                  className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Shortening...' : 'Shorten'} <ArrowRight size={20} />
                </button>
              </div>
            </form>

            {error && <p className="text-red-500 mt-4 text-left">{error}</p>}

            {shortUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between"
              >
                <div className="text-left">
                  <p className="text-sm text-muted-foreground mb-1">Your short link is ready:</p>
                  <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-500 font-medium hover:underline text-lg">
                    {shortUrl}
                  </a>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:scale-105 transition"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Powerful Features</h2>
            <p className="text-muted-foreground mt-4">Everything you need to manage your links efficiently.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/custom-links" className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl">
              <FeatureCard
                icon={<Link2 className="text-blue-500" size={32} />}
                title="Custom Short Links"
                description="Create memorable, branded links with custom aliases instead of random characters."
              />
            </Link>
            <Link to="/analytics" className="block focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-2xl">
              <FeatureCard
                icon={<BarChart2 className="text-purple-500" size={32} />}
                title="Advanced Analytics"
                description="Track clicks, geographic locations, devices, and referrers in real-time."
              />
            </Link>
            <Link to="/qr-generator" className="block focus:outline-none focus:ring-2 focus:ring-green-500 rounded-2xl">
              <FeatureCard
                icon={<QrCode className="text-green-500" size={32} />}
                title="QR Code Generation"
                description="Instantly generate downloadable QR codes for every link you create."
              />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <Step number="1" title="Paste URL" desc="Enter your long URL into the input field." />
            <ArrowRight className="hidden md:block text-gray-300 dark:text-gray-700" size={32} />
            <Step number="2" title="Click Shorten" desc="Hit the button to generate a tiny link." />
            <ArrowRight className="hidden md:block text-gray-300 dark:text-gray-700" size={32} />
            <Step number="3" title="Share & Track" desc="Share your link and monitor performance." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Vamsi. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="p-6 glass rounded-2xl border border-border cursor-pointer hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col items-start text-left"
    >
      <div className="mb-4 bg-white dark:bg-black w-16 h-16 rounded-xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="flex flex-col items-center max-w-xs">
      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
