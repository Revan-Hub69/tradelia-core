/**
 * Education Memory Hook - Ultra-Chicca 2026
 * 
 * User Education Memory System
 * - Tracks user education progress
 * - Unlocks tools based on preparation
 * - Personalized messaging without AI
 * - Intelligent personalization based on behavior
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface EducationState {
  // Reading progress
  hasReadErrors: Record<string, boolean>
  hasSeenIntro: Record<string, boolean>
  hasReadEducational: Record<string, boolean>
  
  // Interaction tracking
  completedChecklists: string[]
  visitedTools: string[]
  lastVisited: Record<string, number>
  
  // Behavior patterns
  preferredStartTab: Record<string, string>
  toolUsageCount: Record<string, number>
  
  // Timestamps
  firstVisit: number
  lastActivity: number
}

const STORAGE_KEY = 'tradelia-education-memory'
const ACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes

const DEFAULT_STATE: EducationState = {
  hasReadErrors: {},
  hasSeenIntro: {},
  hasReadEducational: {},
  completedChecklists: [],
  visitedTools: [],
  lastVisited: {},
  preferredStartTab: {},
  toolUsageCount: {},
  firstVisit: Date.now(),
  lastActivity: Date.now()
}

export function useEducationMemory(sectionId: string) {
  const t = useTranslations('common.educationMemory')
  const [state, setState] = useState<EducationState>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...DEFAULT_STATE, ...parsed }
      }
    } catch (error) {
      console.warn('Failed to load education memory:', error)
    }
    return DEFAULT_STATE
  })

  // Save state to localStorage
  const saveState = useCallback((newState: EducationState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
    } catch (error) {
      console.warn('Failed to save education memory:', error)
    }
  }, [])

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    setState(prev => {
      const newState = {
        ...prev,
        lastActivity: Date.now(),
        lastVisited: { ...prev.lastVisited, [sectionId]: Date.now() }
      }
      saveState(newState)
      return newState
    })
  }, [sectionId, saveState])

  // Mark errors as read
  const markErrorsRead = useCallback(() => {
    setState(prev => {
      const newState = {
        ...prev,
        hasReadErrors: { ...prev.hasReadErrors, [sectionId]: true }
      }
      saveState(newState)
      return newState
    })
    updateActivity()
  }, [sectionId, saveState, updateActivity])

  // Mark intro as seen
  const markIntroSeen = useCallback(() => {
    setState(prev => {
      const newState = {
        ...prev,
        hasSeenIntro: { ...prev.hasSeenIntro, [sectionId]: true }
      }
      saveState(newState)
      return newState
    })
    updateActivity()
  }, [sectionId, saveState, updateActivity])

  // Mark educational content as read
  const markEducationalRead = useCallback(() => {
    setState(prev => {
      const newState = {
        ...prev,
        hasReadEducational: { ...prev.hasReadEducational, [sectionId]: true }
      }
      saveState(newState)
      return newState
    })
    updateActivity()
  }, [sectionId, saveState, updateActivity])

  // Complete a checklist
  const completeChecklist = useCallback((checklistId: string) => {
    setState(prev => {
      const fullId = `${sectionId}-${checklistId}`
      if (prev.completedChecklists.includes(fullId)) return prev
      
      const newState = {
        ...prev,
        completedChecklists: [...prev.completedChecklists, fullId]
      }
      saveState(newState)
      return newState
    })
    updateActivity()
  }, [sectionId, saveState, updateActivity])

  // Track tool usage
  const trackToolUsage = useCallback((toolId: string) => {
    setState(prev => {
      const fullId = `${sectionId}-${toolId}`
      const newState = {
        ...prev,
        visitedTools: prev.visitedTools.includes(fullId) 
          ? prev.visitedTools 
          : [...prev.visitedTools, fullId],
        toolUsageCount: {
          ...prev.toolUsageCount,
          [fullId]: (prev.toolUsageCount[fullId] || 0) + 1
        }
      }
      saveState(newState)
      return newState
    })
    updateActivity()
  }, [sectionId, saveState, updateActivity])

  // Track preferred start tab
  const trackTabPreference = useCallback((tabId: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        preferredStartTab: { ...prev.preferredStartTab, [sectionId]: tabId }
      }
      saveState(newState)
      return newState
    })
  }, [sectionId, saveState])

  // Check if tool is unlocked
  const isToolUnlocked = useCallback((toolId: string) => {
    const hasReadErrors = state.hasReadErrors[sectionId] || false
    const hasSeenIntro = state.hasSeenIntro[sectionId] || false
    const hasReadEducational = state.hasReadEducational[sectionId] || false
    
    // Tool is unlocked if user has read errors OR seen intro OR read educational
    return hasReadErrors || hasSeenIntro || hasReadEducational
  }, [state, sectionId])

  // Get education level (0-100)
  const getEducationLevel = useCallback(() => {
    let score = 0
    
    if (state.hasSeenIntro[sectionId]) score += 25
    if (state.hasReadErrors[sectionId]) score += 35
    if (state.hasReadEducational[sectionId]) score += 25
    
    const sectionChecklists = state.completedChecklists.filter(id => 
      id.startsWith(`${sectionId}-`)
    )
    score += Math.min(sectionChecklists.length * 5, 15)
    
    return Math.min(score, 100)
  }, [state, sectionId])

  // Get personalized message based on progress
  const getPersonalizedMessage = useCallback(() => {
    const hasReadErrors = state.hasReadErrors[sectionId] || false
    const hasSeenIntro = state.hasSeenIntro[sectionId] || false
    const hasReadEducational = state.hasReadEducational[sectionId] || false
    const educationLevel = getEducationLevel()

    if (educationLevel === 0) {
      return t('messages.getStarted')
    }
    
    if (educationLevel < 30) {
      return hasSeenIntro 
        ? t('messages.readErrors')
        : t('messages.readIntro')
    }
    
    if (educationLevel < 60) {
      return hasReadEducational 
        ? t('messages.almostReady')
        : t('messages.readEducational')
    }
    
    if (educationLevel < 85) {
      return t('messages.completeChecklists')
    }
    
    return t('messages.fullyPrepared')
  }, [state, sectionId, getEducationLevel, t])

  // Get recommended next action
  const getRecommendedAction = useCallback(() => {
    const hasReadErrors = state.hasReadErrors[sectionId] || false
    const hasSeenIntro = state.hasSeenIntro[sectionId] || false
    const hasReadEducational = state.hasReadEducational[sectionId] || false

    if (!hasSeenIntro && !hasReadErrors) {
      return { tab: 'intro', reason: t('actions.startWithIntro') }
    }
    
    if (!hasReadErrors) {
      return { tab: 'errors', reason: t('actions.readErrorsFirst') }
    }
    
    if (!hasReadEducational) {
      return { tab: 'educational', reason: t('actions.expandKnowledge') }
    }
    
    return { tab: 'tools', reason: t('actions.readyForTools') }
  }, [state, sectionId, t])

  // Get usage statistics
  const getUsageStats = useCallback(() => {
    const sectionTools = Object.entries(state.toolUsageCount)
      .filter(([id]) => id.startsWith(`${sectionId}-`))
      .map(([id, count]) => ({ toolId: id.replace(`${sectionId}-`, ''), count }))
      .sort((a, b) => b.count - a.count)

    const totalVisits = state.lastVisited[sectionId] ? 1 : 0
    const daysSinceFirstVisit = Math.floor(
      (Date.now() - state.firstVisit) / (1000 * 60 * 60 * 24)
    )

    return {
      mostUsedTool: sectionTools[0]?.toolId || null,
      totalToolUsage: sectionTools.reduce((sum, tool) => sum + tool.count, 0),
      totalVisits,
      daysSinceFirstVisit,
      isReturningUser: totalVisits > 1
    }
  }, [state, sectionId])

  // Check if user is active (visited recently)
  const isActiveUser = useCallback(() => {
    const lastActivity = state.lastActivity
    return Date.now() - lastActivity < ACTIVITY_TIMEOUT
  }, [state.lastActivity])

  // Auto-update activity on mount
  useEffect(() => {
    updateActivity()
  }, [updateActivity])

  return {
    // State getters
    hasReadErrors: state.hasReadErrors[sectionId] || false,
    hasSeenIntro: state.hasSeenIntro[sectionId] || false,
    hasReadEducational: state.hasReadEducational[sectionId] || false,
    educationLevel: getEducationLevel(),
    
    // Actions
    markErrorsRead,
    markIntroSeen,
    markEducationalRead,
    completeChecklist,
    trackToolUsage,
    trackTabPreference,
    
    // Computed values
    isToolUnlocked,
    getPersonalizedMessage,
    getRecommendedAction,
    getUsageStats,
    isActiveUser: isActiveUser(),
    
    // Preferences
    preferredStartTab: state.preferredStartTab[sectionId] || null,
    
    // Raw state for debugging
    state
  }
}