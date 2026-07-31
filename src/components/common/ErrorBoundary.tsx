'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error Boundary exception:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-8 rounded-3xl bg-amber-50 border border-amber-200 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Došlo je do neočekivane pogreške</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Ispričavamo se na neugodnosti. Molimo osvježite stranicu ili pokušajte ponovno.
          </p>
          <Button
            type="button"
            onClick={this.handleReset}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 text-xs rounded-xl shadow"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Pokušaj ponovno
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
