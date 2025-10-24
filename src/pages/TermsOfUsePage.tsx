import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, AlertTriangle, Shield } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function TermsOfUsePage() {
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
            Terms of Use
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Terms and conditions for using SocialID
          </p>
        </div>

        <Card>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Agreement to Terms</span>
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                By accessing and using SocialID, you agree to be bound by these Terms of Use. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </div>

            <h2>1. About SocialID</h2>
            <p>
              SocialID is a service provided by <strong>NR Infra</strong> that allows users to create 
              personalized pages that bring together all their social profiles. Users can share one 
              link to let people find them across all their social media platforms.
            </p>

            <h2>2. Acceptance of Terms</h2>
            <p>
              These Terms of Use constitute a legally binding agreement between you and NR Infra. 
              By creating an account or using SocialID, you acknowledge that you have read, 
              understood, and agree to be bound by these terms.
            </p>

            <h2>3. Eligibility</h2>
            <ul>
              <li>You must be at least 16 years old to use SocialID</li>
              <li>You must provide accurate and complete information</li>
              <li>You must not be prohibited from using our service under applicable law</li>
              <li>You can only maintain one account per person</li>
            </ul>

            <h2>4. User Accounts and Responsibilities</h2>
            
            <h3>Account Creation</h3>
            <ul>
              <li>You must provide a valid email address and choose a unique username</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h3>User Obligations</h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">You agree to:</h4>
              <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
                <li>• Use SocialID only for lawful purposes</li>
                <li>• Provide accurate and up-to-date information</li>
                <li>• Respect other users' privacy and rights</li>
                <li>• Not impersonate others or create fake profiles</li>
                <li>• Not use the service for spam or malicious activities</li>
                <li>• Not attempt to hack, disrupt, or damage our systems</li>
              </ul>
            </div>

            <h2>5. Content and Conduct</h2>
            
            <h3>Your Content</h3>
            <p>
              You retain ownership of the content you post on SocialID (profile information, bio, social links). 
              By posting content, you grant us a license to display, store, and share it as necessary to provide our service.
            </p>

            <h3>Prohibited Content</h3>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Prohibited Content Includes:</span>
              </h4>
              <ul className="text-red-800 dark:text-red-200 text-sm space-y-1">
                <li>• Illegal, harmful, or offensive content</li>
                <li>• Harassment, bullying, or hate speech</li>
                <li>• Spam, scams, or fraudulent content</li>
                <li>• Adult content or content harmful to minors</li>
                <li>• Content that violates intellectual property rights</li>
                <li>• Malware, viruses, or malicious code</li>
              </ul>
            </div>

            <h2 className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>6. Intellectual Property Rights</span>
            </h2>
            
            <h3>Our Rights</h3>
            <p>
              SocialID, its logo, design, and functionality are owned by NR Infra and protected by 
              intellectual property laws. You may not copy, modify, or distribute our intellectual property 
              without written permission.
            </p>

            <h3>Your Rights</h3>
            <p>
              You retain all rights to your original content. We do not claim ownership of your profile 
              information, bio, or social media links.
            </p>

            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. We collect and use your information in accordance with applicable data protection laws to provide and improve our service.
            </p>

            <h2>8. Service Availability</h2>
            <ul>
              <li>We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service</li>
              <li>We may temporarily suspend service for maintenance or updates</li>
              <li>We reserve the right to modify or discontinue features with notice</li>
            </ul>

            <h2>9. Limitation of Liability</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm">
                <strong>To the maximum extent permitted by law:</strong>
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• SocialID is provided "as is" without warranties</li>
                <li>• We are not liable for indirect, incidental, or consequential damages</li>
                <li>• Our total liability is limited to the amount you paid us (if any)</li>
                <li>• We are not responsible for third-party content or services</li>
              </ul>
            </div>

            <h2>10. Account Termination</h2>
            
            <h3>By You</h3>
            <p>
              You may delete your account at any time through your account settings. 
              Upon deletion, your data will be removed within 30 days.
            </p>

            <h3>By Us</h3>
            <p>We may suspend or terminate your account if you:</p>
            <ul>
              <li>Violate these Terms of Use</li>
              <li>Engage in prohibited activities</li>
              <li>Pose a security risk to our service</li>
              <li>Remain inactive for an extended period</li>
            </ul>

            <h2>11. Modifications to Terms</h2>
            <p>
              We may update these Terms of Use from time to time. We will notify you of significant 
              changes by email or through our service. Continued use after changes constitutes acceptance 
              of the new terms.
            </p>

            <h2>12. Dispute Resolution</h2>
            <p>
              Any disputes arising from these terms or your use of SocialID will be resolved through:
            </p>
            <ol>
              <li><strong>Direct communication:</strong> Contact us first to resolve issues amicably</li>
              <li><strong>Mediation:</strong> If needed, through a mutually agreed mediator</li>
              <li><strong>French courts:</strong> As a last resort, under French jurisdiction</li>
            </ol>

            <h2>13. Governing Law</h2>
            <p>
              These Terms of Use are governed by French law. Any legal proceedings must be conducted 
              in French courts with jurisdiction over Chambéry, France.
            </p>

            <h2>14. Severability</h2>
            <p>
              If any provision of these terms is found to be unenforceable, the remaining provisions 
              will continue to be valid and enforceable.
            </p>

            <h2>15. Contact Information</h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-900 dark:text-blue-100 mb-2">
                For questions about these Terms of Use:
              </p>
              <div className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                <p><strong>Email:</strong> <a href="mailto:contact@nrinfra.fr" className="underline">contact@nrinfra.fr</a></p>
                <p><strong>Address:</strong> NR Infra, 92 avenue de Turin, Chambéry 73000, France</p>
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