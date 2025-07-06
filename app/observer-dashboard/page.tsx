"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Eye,
  BarChart3,
  TrendingUp,
  Activity,
  Search,
  Download,
  RefreshCw,
  Bell,
  DollarSign,
  AlertTriangle,
} from "lucide-react"

interface ObserverData {
  id: string
  exportId: string
  vehicleModel: string
  exporter: string
  buyer: string
  country: string
  status: string
  value: number
  lastUpdate: string
  progress: number
  alerts: number
}

export default function ObserverDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [notifications, setNotifications] = useState(8)

  const observerData: ObserverData[] = [
    {
      id: "OBS001",
      exportId: "EXP001",
      vehicleModel: "현대 아반떼 2020",
      exporter: "글로벌모터스",
      buyer: "Ahmed Motors",
      country: "UAE",
      status: "관세검토중",
      value: 15000,
      lastUpdate: "2024-01-15 14:30",
      progress: 65,
      alerts: 0,
    },
    {
      id: "OBS002",
      exportId: "EXP002",
      vehicleModel: "기아 쏘렌토 2019",
      exporter: "코리아오토",
      buyer: "Global Auto Ltd",
      country: "러시아",
      status: "운송중",
      value: 22000,
      lastUpdate: "2024-01-15 16:45",
      progress: 85,
      alerts: 1,
    },
    {
      id: "OBS003",
      exportId: "EXP003",
      vehicleModel: "현대 투싼 2021",
      exporter: "아시아모터스",
      buyer: "Pacific Motors",
      country: "필리핀",
      status: "서류준비중",
      value: 18500,
      lastUpdate: "2024-01-15 10:15",
      progress: 25,
      alerts: 2,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "완료":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "운송중":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "관세검토중":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "서류준비중":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const filteredData = observerData.filter((data) => {
    const matchesSearch =
      data.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.exporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.buyer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || data.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalValue = observerData.reduce((sum, data) => sum + data.value, 0)
  const totalAlerts = observerData.reduce((sum, data) => sum + data.alerts, 0)
  const avgProgress = Math.round(observerData.reduce((sum, data) => sum + data.progress, 0) / observerData.length)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Eye className="w-8 h-8 text-purple-500" />
                <div>
                  <h1 className="text-2xl font-bold">GlobalCar</h1>
                  <p className="text-sm text-gray-400">옵저버 대시보드</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <Bell className="w-4 h-4 mr-2" />
                알림 {notifications > 0 && <Badge className="ml-2 bg-red-500">{notifications}</Badge>}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </Button>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                <Download className="w-4 h-4 mr-2" />
                리포트 다운로드
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">모니터링 건수</p>
                  <p className="text-2xl font-bold text-purple-500">{observerData.length}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">총 거래액</p>
                  <p className="text-2xl font-bold text-green-400">${totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">평균 진행률</p>
                  <p className="text-2xl font-bold text-blue-400">{avgProgress}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">알림</p>
                  <p className="text-2xl font-bold text-red-400">{totalAlerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="차량 모델, 수출업체, 바이어로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className={filterStatus === "all" ? "bg-purple-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  전체
                </Button>
                <Button
                  variant={filterStatus === "운송중" ? "default" : "outline"}
                  onClick={() => setFilterStatus("운송중")}
                  className={filterStatus === "운송중" ? "bg-blue-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  운송중
                </Button>
                <Button
                  variant={filterStatus === "관세검토중" ? "default" : "outline"}
                  onClick={() => setFilterStatus("관세검토중")}
                  className={
                    filterStatus === "관세검토중" ? "bg-yellow-500 text-white" : "border-gray-600 text-gray-300"
                  }
                >
                  검토중
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observer Data */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-500">
              <BarChart3 className="w-5 h-5" />
              <span>수출 모니터링 현황</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((data) => (
                <div
                  key={data.id}
                  className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{data.vehicleModel}</h3>
                        <Badge className={getStatusColor(data.status)}>{data.status}</Badge>
                        {data.alerts > 0 && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">알림 {data.alerts}</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-400 mb-4">
                        <div>
                          <span className="block text-gray-500">수출 ID</span>
                          <span className="text-white font-mono">{data.exportId}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">수출업체</span>
                          <span className="text-white">{data.exporter}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">바이어</span>
                          <span className="text-white">{data.buyer}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">거래액</span>
                          <span className="text-purple-400 font-semibold">${data.value.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">진행률</span>
                        <span className="text-sm text-white">{data.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${data.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-400">
                        <span>최종 업데이트: {data.lastUpdate}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        상세보기
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        분석
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
