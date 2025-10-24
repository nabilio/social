import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { SocialShareMeta } from '../components/profile/SocialShareMeta'
import { ArrowRight, Users, Share2, Globe, Shield, Sparkles, Heart } from 'lucide-react'

export function HomePage() {
  const { user } = useAuth()

  const features = [
    {
      icon: Globe,
      title: 'One Link, All Profiles',
      description: 'Centralize all your social media profiles in one beautiful, shareable page.'
    },
    {
      icon: Shield,
      title: 'Privacy Control',
      description: 'Choose what to share publicly and what to keep private with granular visibility settings.'
    },
    {
      icon: Users,
      title: 'Connect & Discover',
      description: 'Find friends, build your network, and discover interesting people in the community.'
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your SocialID with a simple, memorable URL that works everywhere.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <SocialShareMeta
        title="SocialID - Your Digital Identity in One Place"
        description="Create your SocialID profile and centralize all your social media links in one beautiful page. Share one link and let people find you everywhere."
        url="https://SocialID.one/"
        type="website"
      />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Digital Identity</span>
              <br />
              All in One Place
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Create a beautiful, personalized page that brings together all your social profiles. 
              Share one link and let people find you everywhere.
            </p>
            
            {user ? (
              <div className="flex flex-col gap-4 justify-center max-w-sm mx-auto sm:max-w-none sm:flex-row">
                <Link to="/dashboard">
                  <Button size="lg" className="w-full">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/discover">
                  <Button variant="outline" size="lg" className="w-full">
                    Discover Users
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4 justify-center max-w-sm mx-auto sm:max-w-none sm:flex-row">
                <Link to="/signup">
                  <Button size="lg" className="w-full">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700 shadow-lg transition-all duration-200 w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SocialID?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built for creators, professionals, and anyone who wants to make their online presence more accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              See It In Action
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Here's what your SocialID page could look like
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">JD</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">John Doe</h3>
                <p className="text-gray-600 dark:text-gray-300">@johndoe</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Digital creator & entrepreneur. Sharing my journey in tech and design.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Instagram', color: 'from-pink-500 to-purple-600' },
                  { name: 'Twitter', color: 'from-blue-400 to-blue-600' },
                  { name: 'LinkedIn', color: 'from-blue-600 to-blue-800' },
                  { name: 'GitHub', color: 'from-gray-700 to-gray-900' },
                ].map((platform, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-10 h-10 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center mr-3`}>
                      <span className="text-white text-xs font-bold">{platform.name[0]}</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{platform.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your SocialID?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have already simplified their online presence.
          </p>
          {!user && (
            <Link to="/signup">
              <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700 shadow-lg transition-all duration-200">
                Start Building Your Profile
                <Heart className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}