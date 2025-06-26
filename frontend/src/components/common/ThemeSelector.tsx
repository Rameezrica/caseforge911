import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      key: 'light' as const,
      label: 'Light',
      description: 'Clean, professional Kaggle-inspired design',
      icon: Sun,
      preview: 'bg-white border-gray-200',
      colors: ['bg-blue-500', 'bg-orange-500', 'bg-gray-100']
    },
    {
      key: 'dark' as const,
      label: 'Dark',
      description: 'Premium dark mode with glass effects',
      icon: Moon,
      preview: 'bg-dark-900 border-dark-700',
      colors: ['bg-brand-500', 'bg-purple-500', 'bg-dark-700']
    },
    {
      key: 'system' as const,
      label: 'System',
      description: 'Follow your device preference',
      icon: Monitor,
      preview: 'bg-gradient-to-br from-white to-dark-900 border-gray-400',
      colors: ['bg-blue-500', 'bg-brand-500', 'bg-gray-400']
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-brand-500/10">
          <Monitor className="h-5 w-5 text-blue-600 dark:text-brand-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Theme Preference
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose your preferred appearance
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isSelected = theme === themeOption.key;
          
          return (
            <motion.button
              key={themeOption.key}
              onClick={() => setTheme(themeOption.key)}
              className={`
                relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 dark:border-brand-500 bg-blue-50 dark:bg-brand-500/10' 
                  : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500 bg-white dark:bg-dark-800/50'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                {/* Theme Preview */}
                <div className={`
                  relative w-12 h-8 rounded-lg ${themeOption.preview} overflow-hidden
                  ring-1 ring-gray-300 dark:ring-dark-600
                `}>
                  <div className="flex h-full">
                    {themeOption.colors.map((color, index) => (
                      <div key={index} className={`flex-1 ${color}`} />
                    ))}
                  </div>
                </div>

                {/* Theme Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {themeOption.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {themeOption.description}
                  </p>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-blue-500 dark:bg-brand-500 flex items-center justify-center"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-600">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Tip:</strong> System theme automatically switches between light and dark based on your device settings.
        </p>
      </div>
    </div>
  );
};

export default ThemeSelector;
