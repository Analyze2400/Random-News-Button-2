/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch a random news article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Random News
          </h1>
          <p className="text-zinc-400">
            Click the button to open a random top headline.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchRandomNews}
            disabled={loading}
            className="relative group flex items-center justify-center w-48 h-48 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 rounded-full border-4 border-red-400/30 group-hover:border-red-400/50 transition-colors" />
            <div className="absolute inset-2 rounded-full border-2 border-red-500/20" />
            
            {loading ? (
              <Loader2 className="w-12 h-12 animate-spin" />
            ) : (
              <span className="text-2xl font-bold uppercase tracking-wider">
                Im Bored
              </span>
            )}
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl text-red-200 text-sm"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
}
