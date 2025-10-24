import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cookie, Settings, Eye, BarChart } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Cookie Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            How SocialID uses cookies and similar technologies
          </p>
        </div>

        <Card>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 mb-6">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2 flex items-center space-x-2">
                <Cookie className="w-5 h-5" />
                <span>What Are Cookies?</span>
              </h3>
              <p className="text-orange-800 dark:text-orange-200 text-sm">
                Cookies are small text files stored on your device when you visit websites. 
                They help us provide you with a better experience and understand how you use SocialID.
              </p>
            </div>

            <h2>1. Types of Cookies We Use</h2>
            
            <div className="grid md:grid-cols-1 gap-4 my-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Essential Cookies (Always Active)</span>
                </h3>
                <p className="text-green-800 dark:text-green-200 text-sm mb-2">
                  These cookies are necessary for SocialID to function properly.
                </p>
                <ul className="text-green-800 dark:text-green-200 text-sm space-y-1">
                  <li>• <strong>Authentication:</strong> Keep you logged in</li>
                  <li>• <strong>Security:</strong> Protect against fraud and attacks</li>
                  <li>• <strong>Preferences:</strong> Remember your settings (theme, language)</li>
                  <li>• <strong>Session:</strong> Maintain your session across pages</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center space-x-2">
                  <BarChart className="w-4 h-4" />
                  <span>Analytics Cookies (Optional)</span>
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm mb-2">
                  Help us understand how you use SocialID to improve our service.
                </p>
                <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                  <li>• <strong>Usage statistics:</strong> Pages visited, time spent</li>
                  <li>• <strong>Performance:</strong> Loading times, errors</li>
                  <li>• <strong>User behavior:</strong> How you interact with features</li>
                  <li>• <strong>Demographics:</strong> General location, device type</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Marketing Cookies (Optional)</span>
                </h3>
                <p className="text-purple-800 dark:text-purple-200 text-sm mb-2">
                  Used to show you relevant content and measure campaign effectiveness.
                </p>
                <ul className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
                  <li>• <strong>Personalization:</strong> Tailored content and features</li>
                  <li>• <strong>Social media:</strong> Integration with social platforms</li>
                  <li>• <strong>Advertising:</strong> Relevant ads (if applicable)</li>
                  <li>• <strong>Tracking:</strong> Cross-site behavior (with consent)</li>
                </ul>
              </div>
            </div>

            <h2>2. Specific Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">Cookie Name</th>
                    <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">Purpose</th>
                    <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">Duration</th>
                    <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">sb-access-token</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Authentication</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">1 hour</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Essential</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">sb-refresh-token</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Session refresh</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">30 days</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Essential</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">theme</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Dark/light mode preference</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">1 year</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Essential</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">cookie-consent</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Remember your cookie preferences</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">1 year</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Essential</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">_ga</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Google Analytics (if enabled)</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">2 years</td>
                    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>3. Third-Party Cookies</h2>
            <p>We may use third-party services that set their own cookies:</p>
            <ul>
              <li><strong>Supabase:</strong> Authentication and database services</li>
              <li><strong>Google Analytics:</strong> Website analytics (if enabled)</li>
              <li><strong>Social Media:</strong> When you share content or use social features</li>
            </ul>

            <h2>4. Managing Your Cookie Preferences</h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">You can control cookies in several ways:</h3>
              
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Browser Settings</h4>
              <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1 mb-3">
                <li>• <strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                <li>• <strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                <li>• <strong>Edge:</strong> Settings → Cookies and site permissions</li>
              </ul>

              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">SocialID Settings</h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                You can manage your cookie preferences through our cookie banner or in your account settings.
              </p>
            </div>

            <h2>5. Cookie Consent</h2>
            <p>
              When you first visit SocialID, we'll show you a cookie banner where you can:
            </p>
            <ul>
              <li><strong>Accept all:</strong> Allow all cookies for the best experience</li>
              <li><strong>Essential only:</strong> Only use necessary cookies</li>
              <li><strong>Customize:</strong> Choose which types of cookies to allow</li>
              <li><strong>Learn more:</strong> Read this policy for detailed information</li>
            </ul>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Important Notes:</h4>
              <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
                <li>• Essential cookies cannot be disabled as they're required for basic functionality</li>
                <li>• Disabling analytics cookies won't affect your experience</li>
                <li>• You can change your preferences at any time</li>
                <li>• Some features may not work properly without certain cookies</li>
              </ul>
            </div>

            <h2>6. Data Protection</h2>
            <p>
              Cookie data is processed in accordance with GDPR requirements:
            </p>
            <ul>
              <li>We only collect necessary data</li>
              <li>Data is stored securely</li>
              <li>You can request deletion of your data</li>
              <li>We don't sell cookie data to third parties</li>
            </ul>

            <h2>7. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. When we do, we'll:
            </p>
            <ul>
              <li>Update the "Last updated" date</li>
              <li>Notify you through our service or by email</li>
              <li>Ask for renewed consent if required by law</li>
            </ul>

            <h2>8. Contact Us</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="mb-2">Questions about our use of cookies?</p>
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> <a href="mailto:contact@nrinfra.fr" className="text-blue-600 hover:text-blue-500">contact@nrinfra.fr</a></p>
                <p><strong>Subject:</strong> Cookie Policy Question</p>
                <p><strong>Response time:</strong> Within 5 business days</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}