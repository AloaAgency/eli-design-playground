'use client'

import { useState } from 'react'
import AnimationPlayground from '@/components/AnimationPlayground'
import DataTable from '@/components/DataTable'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'animations' | 'table'>('animations')

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Animation & Interaction Playground
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('animations')}
              className={`px-6 py-3 rounded-l-lg font-medium transition-colors ${
                activeTab === 'animations'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Animations
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-6 py-3 rounded-r-lg font-medium transition-colors ${
                activeTab === 'table'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Data Table
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'animations' ? <AnimationPlayground /> : <DataTable />}
        </div>
      </div>
    </main>
  )
}