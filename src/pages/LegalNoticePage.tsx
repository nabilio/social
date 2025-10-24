import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Building, User, MapPin, Mail } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function LegalNoticePage() {
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
            Legal Notice
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Legal information about SocialID and NR Infra
          </p>
        </div>

        <Card>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Company Information</span>
            </h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                NR Infra
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Legal form:</span>
                  <span>Sole Proprietorship (Auto-entrepreneur)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-blue-600" />
                  <div>
                    <span className="font-medium">Address:</span><br />
                    92 avenue de Turin<br />
                    Chambéry 73000<br />
                    France
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">SIRET:</span>
                  <span className="text-gray-600 dark:text-gray-400">[To be provided]</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">RCS:</span>
                  <span className="text-gray-600 dark:text-gray-400">[To be provided]</span>
                </div>
              </div>
            </div>

            <h2 className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Publication Manager</span>
            </h2>
            <p>
              <strong>Rouijel Nabil</strong><br />
              Founder and Publication Manager<br />
              Email: <a href="mailto:contact@nrinfra.fr" className="text-blue-600 hover:text-blue-500">contact@nrinfra.fr</a>
            </p>

            <h2>Hosting Provider</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Hosting details to be completed:</strong><br />
                • Provider name<br />
                • Provider address<br />
                • Provider contact information
              </p>
            </div>

            <h2>Intellectual Property</h2>
            <p>
              The SocialID website and all its content (texts, images, graphics, logo, icons, sounds, software) 
              are the exclusive property of NR Infra, unless otherwise stated.
            </p>
            <p>
              Any reproduction, representation, modification, publication, adaptation of all or part of the 
              elements of the site, regardless of the means or process used, is prohibited without prior 
              written authorization from NR Infra.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              NR Infra cannot be held responsible for direct or indirect damage caused to the user's equipment 
              when accessing the SocialID website, resulting either from the use of equipment that does not 
              meet the specifications indicated, or from the appearance of a bug or incompatibility.
            </p>

            <h2>Applicable Law</h2>
            <p>
              This legal notice is governed by French law. Any dispute relating to the use of the SocialID 
              website is subject to the exclusive jurisdiction of French courts.
            </p>

            <h2>Contact</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="flex items-center space-x-2 mb-2">
                <Mail className="w-4 h-4" />
                <span>For any questions regarding this legal notice:</span>
              </p>
              <p>
                <a href="mailto:contact@nrinfra.fr" className="text-blue-600 hover:text-blue-500 font-medium">
                  contact@nrinfra.fr
                </a>
              </p>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
              Last updated: {new Date().toLocaleDateString('en-US', { 
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