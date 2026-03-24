'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CompareContextType {
  compareIds: string[]
  addToCompare: (id: string) => void
  removeFromCompare: (id: string) => void
  isInCompare: (id: string) => boolean
  clearCompare: () => void
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('compareIds')
    if (saved) {
      try {
        setCompareIds(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse compareIds from localStorage', e)
      }
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('compareIds', JSON.stringify(compareIds))
    }
  }, [compareIds, isInitialized])

  const addToCompare = (id: string) => {
    if (compareIds.length >= 3) {
      alert('You can only compare up to 3 vehicles.')
      return
    }
    if (!compareIds.includes(id)) {
      setCompareIds([...compareIds, id])
    }
  }

  const removeFromCompare = (id: string) => {
    setCompareIds(compareIds.filter((cid) => cid !== id))
  }

  const isInCompare = (id: string) => compareIds.includes(id)

  const clearCompare = () => setCompareIds([])

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}
