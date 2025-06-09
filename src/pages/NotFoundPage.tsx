import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Brain, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center p-6">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-brand-500/20 to-purple-500/20 rounded-full blur-2xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-2xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <Card variant="glass" className="p-12 text-center">
          {/* Floating Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-brand-500 to-purple-600 rounded-3xl mb-8 shadow-neon floating"
          >
            <Brain className="h-12 w-12 text-white" />
          </motion.div>

          {/* 404 Text with Gradient */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-8xl font-bold mb-6"
          >
            <span className="text-gradient">404</span>
          </motion.h1>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-semibold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-dark-300 max-w-md mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off into the digital void. 
              Let's get you back to solving some cases!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/">
              <Button 
                variant="primary" 
                size="lg"
                leftIcon={<Home className="h-5 w-5" />}
                glow
                shimmer
              >
                Back to Home
              </Button>
            </Link>
            
            <Link to="/problems">
              <Button 
                variant="glass" 
                size="lg"
                leftIcon={<Sparkles className="h-5 w-5" />}
              >
                Browse Problems
              </Button>
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-8 pt-8 border-t border-white/10"
          >
            <p className="text-sm text-dark-400">
              Error 404 • Page Not Found • 
              <span className="text-brand-400"> CaseForge</span>
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}