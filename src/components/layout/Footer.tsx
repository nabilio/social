import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, User, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About SocialID */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/logo-social.png"
                alt="SocialID"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold">SocialID</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              SocialID allows you to create a beautiful, personalized page that brings together all your social profiles. Share one link and let people find you everywhere.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Founder: Rouijel Nabil</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>92 avenue de Turin<br />Chambéry 73000, France</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:contact@nrinfra.fr" className="hover:text-white">
                  contact@nrinfra.fr
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/discover" className="text-gray-300 hover:text-white transition-colors">
                  Discover Users
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog & Updates
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-300 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/legal-notice" className="text-gray-300 hover:text-white transition-colors">
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact & Social</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-300 mb-2">Get in touch:</p>
                <a 
                  href="mailto:contact@nrinfra.fr" 
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                >
                  <Mail className="w-4 h-4" />
                  <span>contact@nrinfra.fr</span>
                </a>
              </div>
              <div>
                <p className="text-gray-300 mb-2">Follow us:</p>
                <div className="flex space-x-3">
                  <a
                    href="https://twitter.com/socialid"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/company/socialid" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 NR Infra. All rights reserved.
            </div>
            <div className="text-sm text-gray-400">
              Made with ❤️ in Chambéry, France
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}