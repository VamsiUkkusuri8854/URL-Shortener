import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { QrCode, Download, Link as LinkIcon, Palette } from 'lucide-react';

export default function QrGenerator() {
  const [url, setUrl] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const downloadQR = () => {
    const canvas = document.getElementById('qr-gen');
    if (!canvas) return;
    const svgData = new XMLSerializer().serializeToString(canvas);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const urlBlob = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = urlBlob;
    link.download = `quicklink-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center pt-20 px-4 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-start"
      >
        <div>
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mb-6">
              <QrCode size={32} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Instant QR Generator</h1>
            <p className="text-muted-foreground text-lg">
              Create high-quality, customizable QR codes instantly. No account required.
            </p>
          </div>

          <div className="space-y-6 glass p-8 rounded-3xl border border-border">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground">
                <LinkIcon size={16} /> Content / URL
              </label>
              <input
                type="text"
                placeholder="https://example.com"
                className="w-full p-4 rounded-xl border border-border bg-white/50 dark:bg-black/50 focus:ring-2 focus:ring-green-500 outline-none transition"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground">
                <Palette size={16} /> Custom Colors
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground mb-1 block">Foreground</span>
                  <input
                    type="color"
                    className="w-full h-12 rounded-xl cursor-pointer"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground mb-1 block">Background</span>
                  <input
                    type="color"
                    className="w-full h-12 rounded-xl cursor-pointer"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
          <div className="glass p-8 rounded-3xl border border-border shadow-2xl flex flex-col items-center max-w-sm w-full relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full filter blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-tr-full filter blur-xl"></div>

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 z-10">
              {url ? (
                <QRCodeSVG
                  id="qr-gen"
                  value={url}
                  size={220}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                  includeMargin={true}
                />
              ) : (
                <div className="w-[220px] h-[220px] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  <p className="text-muted-foreground text-sm text-center px-4">Enter a URL to generate your QR Code</p>
                </div>
              )}
            </div>

            <button
              onClick={downloadQR}
              disabled={!url}
              className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2 z-10"
            >
              <Download size={20} /> Download SVG
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
