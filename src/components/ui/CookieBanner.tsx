import React, { useState, useEffect } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { Cookie, Settings, X } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...prefs,
      timestamp: Date.now(),
      version: '1.0'
    }))
    
    // Set cookies based on preferences
    if (prefs.analytics) {
      // Enable analytics cookies
      console.log('Analytics cookies enabled')
    }
    
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled')
    }
    
    setShowBanner(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true
    })
  }

  const acceptEssential = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false
    })
  }

  const handleCustomSave = () => {
    savePreferences(preferences)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto border-2 border-blue-200 dark:border-blue-800 shadow-2xl">
        {!showSettings ? (
          // Main banner
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start space-x-3 flex-1">
              <Cookie className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  We use cookies to enhance your experience
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We use essential cookies to make SocialID work. We'd also like to use analytics cookies 
                  to understand how you use our service and improve it. You can choose which cookies to accept.
                </p>
                <Link 
                  to="/cookie-policy" 
                  className="text-sm text-blue-600 hover:text-blue-500 underline"
                >
                  Learn more about our cookies
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSettings(true)}
                className="w-full sm:w-auto"
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={acceptEssential}
                className="w-full sm:w-auto"
              >
                Essential Only
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="w-full sm:w-auto"
              >
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          // Settings panel
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Cookie className="w-5 h-5 text-orange-500" />
                <span>Cookie Preferences</span>
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {/* Essential Cookies */}
              <div className="flex items-start justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex-1">
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Essential Cookies
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                    Required for SocialID to function properly. These cannot be disabled.
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Analytics Cookies
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Help us understand how you use SocialID to improve our service.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.analytics 
                        ? 'bg-blue-500 justify-end' 
                        : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                  </button>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Marketing Cookies
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Used to show you relevant content and measure campaign effectiveness.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.marketing 
                        ? 'bg-purple-500 justify-end' 
                        : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={acceptEssential}
                className="w-full sm:w-auto"
              >
                Essential Only
              </Button>
              <Button
                size="sm"
                onClick={handleCustomSave}
                className="w-full sm:w-auto"
              >
                Save Preferences
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="w-full sm:w-auto"
              >
                Accept All
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}