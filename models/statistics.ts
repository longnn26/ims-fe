export interface Statistic {
  totalAccounts: number
  totalTrips: number
  totalSupportRequests: number
  totalEmergencyRequests: number
  accountDetails: number[]
  tripStatistics: number[]
  supportStatusDetails: number[]
  emergencyStatusDetails: number[]
}

export interface Income {
  monthlyIncome: number[]
}

