/*
 * Copyright 2025 Daytona Platforms Inc.
 * SPDX-License-Identifier: AGPL-3.0
 */

import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { useSelectedOrganization } from '@/hooks/useSelectedOrganization'
import { VerifyEmailDialog } from '@/components/VerifyEmailDialog'

type SortingState = {
  [key: string]: {
    field: string
    direction: 'asc' | 'desc'
  }
}

const STORAGE_KEY = 'dashboard-sorting-storage'

const useDashboardStore = () => {
  const [sortingStates, setSortingStates] = useState<SortingState>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    }
    return {}
  })

  const updateSortingState = (viewId: string, field: string, direction: 'asc' | 'desc') => {
    const newState = {
      ...sortingStates,
      [viewId]: { field, direction },
    }
    setSortingStates(newState)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
  }

  return { sortingStates, updateSortingState }
}

const Dashboard: React.FC = () => {
  const { selectedOrganization } = useSelectedOrganization()
  const [showVerifyEmailDialog, setShowVerifyEmailDialog] = useState(false)
  const { sortingStates, updateSortingState } = useDashboardStore()

  useEffect(() => {
    if (
      selectedOrganization?.suspended &&
      selectedOrganization.suspensionReason === 'Please verify your email address'
    ) {
      setShowVerifyEmailDialog(true)
    }
  }, [selectedOrganization])

  return (
    <div className="relative w-full">
      <SidebarProvider>
        <Sidebar />
        <SidebarTrigger className="md:hidden" />
        <div className="w-full">
          <Outlet context={{ sortingStates, updateSortingState }} />
        </div>
        <Toaster />
        <VerifyEmailDialog open={showVerifyEmailDialog} onOpenChange={setShowVerifyEmailDialog} />
      </SidebarProvider>
    </div>
  )
}

export default Dashboard
