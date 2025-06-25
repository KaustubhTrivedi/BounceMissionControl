import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DataToggleProps {
  isSimulated: boolean
  onToggle: (isSimulated: boolean) => void
  isLoading?: boolean
}

export function DataToggle({ isSimulated, onToggle, isLoading = false }: DataToggleProps) {
  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          Mars Weather Data Source
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">
              {isSimulated ? 'Simulated Data' : 'Real Data'}
            </span>
            <p className="text-xs text-muted-foreground">
              {isSimulated 
                ? 'Using generated Mars weather data for demonstration'
                : 'Fetching actual Mars weather data from NASA APIs'
              }
            </p>
          </div>
          <Switch
            checked={isSimulated}
            onCheckedChange={onToggle}
            disabled={isLoading}
            className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-blue-500"
          />
        </div>
        {isLoading && (
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Loading data...
          </div>
        )}
      </CardContent>
    </Card>
  )
} 