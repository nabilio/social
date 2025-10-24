import React from 'react'
import { CircleUser as UserCircle2, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'

interface OnboardingStep1Props {
  selectedType: 'creator' | 'standard' | null
  onSelectType: (type: 'creator' | 'standard') => void
  onNext: () => void
  onSkip: () => void
}

export function OnboardingStep1({ selectedType, onSelectType, onNext, onSkip }: OnboardingStep1Props) {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: '33%' }}></div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        Welcome! Let's get started
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
        Choose your account type
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => onSelectType('creator')}
          className={`p-6 rounded-xl border-2 transition-all duration-200 ${
            selectedType === 'creator'
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
              selectedType === 'creator'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              <Sparkles size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5">
              Content Creator
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Share your content and grow your audience across multiple platforms
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelectType('standard')}
          className={`p-6 rounded-xl border-2 transition-all duration-200 ${
            selectedType === 'standard'
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
              selectedType === 'standard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              <UserCircle2 size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5">
              Standard User
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Connect with friends and discover amazing content
            </p>
          </div>
        </button>
      </div>

      <Button
        onClick={onNext}
        disabled={!selectedType}
        className="w-full py-4 text-lg"
      >
        Continue
      </Button>
    </div>
  )
}
