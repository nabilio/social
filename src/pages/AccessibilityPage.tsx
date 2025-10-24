import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Eye, Ear, Hand, Brain, Mail } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function AccessibilityPage() {
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
            Accessibility Statement
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Our commitment to making SocialID accessible to everyone
          </p>
        </div>

        <Card>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                Our Commitment
              </h3>
              <p className="text-green-800 dark:text-green-200 text-sm">
                SocialID is committed to ensuring digital accessibility for people with disabilities. 
                We are continually improving the user experience for everyone and applying the relevant 
                accessibility standards.
              </p>
            </div>

            <h2>Accessibility Standards</h2>
            <p>
              We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. 
              These guidelines explain how to make web content more accessible for people with disabilities 
              and user-friendly for everyone.
            </p>

            <h2>Accessibility Features</h2>
            
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Visual Accessibility</span>
                </h3>
                <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                  <li>• High contrast color schemes</li>
                  <li>• Dark and light mode options</li>
                  <li>• Scalable text and UI elements</li>
                  <li>• Clear visual hierarchy</li>
                  <li>• Alternative text for images</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center space-x-2">
                  <Hand className="w-4 h-4" />
                  <span>Motor Accessibility</span>
                </h3>
                <ul className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
                  <li>• Keyboard navigation support</li>
                  <li>• Large clickable areas</li>
                  <li>• No time-sensitive actions</li>
                  <li>• Accessible form controls</li>
                  <li>• Focus indicators</li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2 flex items-center space-x-2">
                  <Ear className="w-4 h-4" />
                  <span>Auditory Accessibility</span>
                </h3>
                <ul className="text-orange-800 dark:text-orange-200 text-sm space-y-1">
                  <li>• No auto-playing audio</li>
                  <li>• Visual feedback for actions</li>
                  <li>• Text alternatives for audio content</li>
                  <li>• Clear error messages</li>
                </ul>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                <h3 className="font-semibold text-teal-900 dark:text-teal-100 mb-2 flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Cognitive Accessibility</span>
                </h3>
                <ul className="text-teal-800 dark:text-teal-200 text-sm space-y-1">
                  <li>• Simple, clear language</li>
                  <li>• Consistent navigation</li>
                  <li>• Helpful error messages</li>
                  <li>• Logical page structure</li>
                  <li>• Progress indicators</li>
                </ul>
              </div>
            </div>

            <h2>Keyboard Navigation</h2>
            <p>SocialID can be fully navigated using only a keyboard:</p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <ul className="text-sm space-y-2">
                <li><strong>Tab:</strong> Move forward through interactive elements</li>
                <li><strong>Shift + Tab:</strong> Move backward through interactive elements</li>
                <li><strong>Enter/Space:</strong> Activate buttons and links</li>
                <li><strong>Escape:</strong> Close modals and dropdowns</li>
                <li><strong>Arrow keys:</strong> Navigate within menus and lists</li>
              </ul>
            </div>

            <h2>Screen Reader Support</h2>
            <p>
              SocialID is designed to work with popular screen readers including:
            </p>
            <ul>
              <li>NVDA (Windows)</li>
              <li>JAWS (Windows)</li>
              <li>VoiceOver (macOS/iOS)</li>
              <li>TalkBack (Android)</li>
              <li>Orca (Linux)</li>
            </ul>

            <h2>Browser and Device Compatibility</h2>
            <p>SocialID is tested and optimized for:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Desktop Browsers:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Chrome (latest 2 versions)</li>
                  <li>• Firefox (latest 2 versions)</li>
                  <li>• Safari (latest 2 versions)</li>
                  <li>• Edge (latest 2 versions)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mobile Devices:</h4>
                <ul className="text-sm space-y-1">
                  <li>• iOS Safari</li>
                  <li>• Android Chrome</li>
                  <li>• Mobile accessibility features</li>
                  <li>• Touch and voice navigation</li>
                </ul>
              </div>
            </div>

            <h2>Known Limitations</h2>
            <p>
              While we strive for full accessibility, we acknowledge some current limitations:
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
                <li>• Some third-party social media embeds may not be fully accessible</li>
                <li>• QR code generation is visual-only (alternative sharing methods available)</li>
                <li>• Some complex interactions may require mouse/touch input</li>
              </ul>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm mt-3">
                We are actively working to address these limitations in future updates.
              </p>
            </div>

            <h2>Ongoing Improvements</h2>
            <p>
              Accessibility is an ongoing effort. We regularly:
            </p>
            <ul>
              <li>Conduct accessibility audits</li>
              <li>Test with assistive technologies</li>
              <li>Gather feedback from users with disabilities</li>
              <li>Update our code to meet evolving standards</li>
              <li>Train our development team on accessibility best practices</li>
            </ul>

            <h2>Feedback and Support</h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>We Want to Hear From You</span>
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                If you encounter any accessibility barriers while using SocialID, please let us know:
              </p>
              <div className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                <p><strong>Email:</strong> <a href="mailto:contact@nrinfra.fr" className="underline">contact@nrinfra.fr</a></p>
                <p><strong>Subject:</strong> Accessibility Issue</p>
                <p><strong>Include:</strong> Description of the issue, your device/browser, and assistive technology used</p>
                <p><strong>Response time:</strong> Within 2 business days</p>
              </div>
            </div>

            <h2>Alternative Access Methods</h2>
            <p>
              If you're unable to access certain features of SocialID, we can provide:
            </p>
            <ul>
              <li>Alternative formats for information</li>
              <li>Assistance with account setup</li>
              <li>Help with profile management</li>
              <li>Support via email or phone</li>
            </ul>

            <h2>Accessibility Resources</h2>
            <p>
              For more information about web accessibility:
            </p>
            <ul>
              <li><a href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">Web Accessibility Initiative (WAI)</a></li>
              <li><a href="https://webaim.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">WebAIM</a></li>
              <li><a href="https://www.a11y.fr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">Accessibility in France</a></li>
            </ul>

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