import React from 'react'
import { Link } from 'react-router-dom'
import { AuthForm } from '../components/auth/AuthForm'

export function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <img 
            src="/logo-social.png" 
            alt="SocialID" 
            className="w-12 h-12 rounded-xl mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join SocialID
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in here
            </Link>
          </p>
          
          {/* Conseils pour l'inscription */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Conseil :</strong> Choisissez un nom d'utilisateur unique et mémorable pour votre URL SocialID
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm mode="signup" />
      </div>
    </div>
  )
}