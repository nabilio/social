import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, Database, Lock, UserCheck, Mail } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            How we collect, use, and protect your personal information
          </p>
        </div>

        <Card>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Your Privacy Matters</span>
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                At SocialID, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This policy explains how we collect, use, and safeguard your data.
              </p>
            </div>

            <h2>1. Information We Collect</h2>
            
            <div className="grid md:grid-cols-1 gap-4 my-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center space-x-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Information You Provide</span>
                </h3>
                <ul className="text-green-800 dark:text-green-200 text-sm space-y-1">
                  <li>• <strong>Account Information:</strong> Email address, username, display name</li>
                  <li>• <strong>Profile Data:</strong> Bio, avatar, social media links</li>
                  <li>• <strong>User Content:</strong> Profile descriptions, custom link names</li>
                  <li>• <strong>Communication:</strong> Messages you send to our support team</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Information We Collect Automatically</span>
                </h3>
                <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                  <li>• <strong>Usage Data:</strong> Pages visited, features used, time spent</li>
                  <li>• <strong>Device Information:</strong> Browser type, operating system, IP address</li>
                  <li>• <strong>Cookies:</strong> Session data, preferences, analytics (see Cookie Policy)</li>
                  <li>• <strong>Log Data:</strong> Access times, error logs, performance metrics</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Information from Third Parties</span>
                </h3>
                <ul className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
                  <li>• <strong>Social Media:</strong> Public profile information when you link accounts</li>
                  <li>• <strong>Analytics:</strong> Aggregated usage statistics (anonymized)</li>
                  <li>• <strong>Security:</strong> Fraud prevention and security monitoring data</li>
                </ul>
              </div>
            </div>

            <h2>2. How We Use Your Information</h2>
            <p>We use your personal information for the following purposes:</p>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 my-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Primary Uses:</h4>
              <ul className="text-sm space-y-2">
                <li><strong>Service Provision:</strong> Create and maintain your SocialID profile</li>
                <li><strong>Account Management:</strong> Authentication, password resets, account recovery</li>
                <li><strong>Communication:</strong> Send important updates, security alerts, and support responses</li>
                <li><strong>Personalization:</strong> Customize your experience and remember your preferences</li>
                <li><strong>Security:</strong> Protect against fraud, abuse, and unauthorized access</li>
                <li><strong>Legal Compliance:</strong> Meet our legal obligations and enforce our terms</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 my-4">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Secondary Uses (with your consent):</h4>
              <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-2">
                <li><strong>Analytics:</strong> Understand how users interact with SocialID to improve our service</li>
                <li><strong>Marketing:</strong> Send promotional emails about new features (you can opt out)</li>
                <li><strong>Research:</strong> Conduct surveys and research to enhance user experience</li>
              </ul>
            </div>

            <h2>3. Information Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share your information in these limited circumstances:</p>

            <div className="space-y-4 my-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Public Information</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Information you choose to make public (profile, bio, public social links) is visible to anyone who visits your SocialID page.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Service Providers</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We share data with trusted third-party services that help us operate SocialID (hosting, email, analytics).
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Legal Requirements</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We may disclose information when required by law, court order, or to protect our rights and safety.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Business Transfers</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  In the event of a merger, acquisition, or sale, your information may be transferred to the new entity.
                </p>
              </div>
            </div>

            <h2 className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>4. Data Security</span>
            </h2>
            <p>We implement industry-standard security measures to protect your information:</p>
            
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technical Safeguards</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• SSL/TLS encryption for data transmission</li>
                  <li>• Encrypted data storage</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Access controls and authentication</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Operational Safeguards</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Limited employee access to personal data</li>
                  <li>• Regular staff training on privacy practices</li>
                  <li>• Incident response procedures</li>
                  <li>• Data backup and recovery systems</li>
                </ul>
              </div>
            </div>

            <h2>5. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Access & Control</h4>
                  <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                    <li>• Access your personal data</li>
                    <li>• Update or correct information</li>
                    <li>• Download your data</li>
                    <li>• Delete your account</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Privacy Controls</h4>
                  <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                    <li>• Opt out of marketing emails</li>
                    <li>• Control profile visibility</li>
                    <li>• Manage cookie preferences</li>
                    <li>• Request data portability</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2>6. Data Retention</h2>
            <p>We retain your information for as long as necessary to provide our services and comply with legal obligations:</p>
            <ul>
              <li><strong>Active Accounts:</strong> We keep your data while your account is active</li>
              <li><strong>Deleted Accounts:</strong> Most data is deleted within 30 days of account deletion</li>
              <li><strong>Legal Requirements:</strong> Some data may be retained longer for legal compliance</li>
              <li><strong>Anonymized Data:</strong> We may retain anonymized analytics data indefinitely</li>
            </ul>

            <h2>7. International Data Transfers</h2>
            <p>
              SocialID is operated from France. If you are located outside France, your information may be 
              transferred to and processed in France. We ensure appropriate safeguards are in place for 
              international transfers in compliance with applicable data protection laws.
            </p>

            <h2>8. Children's Privacy</h2>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-orange-800 dark:text-orange-200 text-sm">
                <strong>Age Requirement:</strong> SocialID is intended for users aged 16 and older. 
                We do not knowingly collect personal information from children under 16. If we become 
                aware that we have collected information from a child under 16, we will delete it promptly.
              </p>
            </div>

            <h2>9. Third-Party Links</h2>
            <p>
              SocialID allows you to link to third-party social media platforms and websites. This privacy 
              policy does not apply to those external sites. We encourage you to review the privacy policies 
              of any third-party services you use.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or 
              applicable laws. When we make significant changes, we will:
            </p>
            <ul>
              <li>Update the "Last updated" date at the bottom of this policy</li>
              <li>Notify you via email or through our service</li>
              <li>For material changes, obtain your consent where required by law</li>
            </ul>

            <h2>11. Contact Us</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Privacy Questions?</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                If you have questions about this Privacy Policy or how we handle your personal information:
              </p>
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> <a href="mailto:contact@nrinfra.fr" className="text-blue-600 hover:text-blue-500">contact@nrinfra.fr</a></p>
                <p><strong>Subject:</strong> Privacy Policy Question</p>
                <p><strong>Address:</strong> NR Infra, 92 avenue de Turin, Chambéry 73000, France</p>
                <p><strong>Response time:</strong> Within 5 business days</p>
              </div>
            </div>

            <h2>12. Legal Basis for Processing (GDPR)</h2>
            <p>For users in the European Union, we process your personal data based on:</p>
            <div className="grid md:grid-cols-2 gap-4 my-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Legitimate Interests</h4>
                <ul className="text-green-800 dark:text-green-200 text-sm space-y-1">
                  <li>• Service improvement and analytics</li>
                  <li>• Security and fraud prevention</li>
                  <li>• Customer support</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Contract Performance</h4>
                <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                  <li>• Account creation and management</li>
                  <li>• Service delivery</li>
                  <li>• Communication about your account</li>
                </ul>
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