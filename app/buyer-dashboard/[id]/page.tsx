"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Ship,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Download,
  CheckCircle,
  Clock,
  Truck,
  Package,
} from "lucide-react"
import Link from "next/link"
import { dummyVehicles, type VehicleData } from "@/lib/dummyData"

export default function BuyerDashboard({ params }: { params: { id: string } }) {
  const [vehicle, setVehicle] = useState<VehicleData | null>(null)
  const [etaProgress, setEtaProgress] = useState(75)

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져옴
    const foundVehicle = dummyVehicles.find((v) => v.id === params.id) || {
      ...dummyVehicles[0],
      status: "shipped",
      currentStep: 5,
      eta: "2024-02-15",
      progress: 75,
    }
    setVehicle(foundVehicle)
    setEtaProgress(foundVehicle.progress || 75)

    // ETA 진행률 시뮬레이션
    const interval = setInterval(() => {
      setEtaProgress((prev) => {
        if (prev >= 100) return 100
        return prev + Math.random() * 2
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [params.id])

  if (!vehicle) {
    return <div>Loading...</div>
  }

  const getStatusColor = (status: VehicleData["status"]) => {
    switch (status) {
      case "shipped":
        return "bg-blue-100 text-blue-700"
      case "arrived":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const daysRemaining = Math.ceil((100 - etaProgress) / 10)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">바이어 대시보드</h1>
          <p className="text-slate-600">구매하신 차량의 배송 현황을 확인하세요</p>
        </div>

        <div className="space-y-8">
          {/* 차량 정보 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="w-6 h-6 mr-2 text-blue-600" />
                  주문 정보
                </div>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status === "shipped" ? "🚢 운송 중" : "✅ 도착 완료"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">차량 정보</span>
                    <div className="font-semibold text-lg">{vehicle.modelName}</div>
                    <div className="text-sm text-gray-500">차량번호: {vehicle.vehicleNumber}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">구매 가격</span>
                    <div className="font-semibold text-lg flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {vehicle.fobPrice.toLocaleString()} {vehicle.currency}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">계약일</span>
                    <div className="font-semibold flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {vehicle.contractDate}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">컨테이너</span>
                    <div className="font-semibold flex items-center">
                      <Truck className="w-4 h-4 mr-2" />
                      {vehicle.containerType}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 배송 추적 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ship className="w-6 h-6 mr-2 text-blue-600" />
                배송 추적
              </CardTitle>
              <CardDescription>실시간 선박 위치 및 도착 예정 시간</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 항해 진행률 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium">인천항 (출발)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">Port Said (도착)</span>
                    <MapPin className="w-4 h-4 ml-2 text-red-600" />
                  </div>
                </div>

                <div className="relative">
                  <Progress value={etaProgress} className="h-3" />
                  <div
                    className="absolute top-0 flex items-center justify-center"
                    style={{ left: `${etaProgress}%`, transform: "translateX(-50%)" }}
                  >
                    <Ship className="w-6 h-6 text-blue-600 bg-white rounded-full p-1 border-2 border-blue-600" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {etaProgress >= 100 ? "도착 완료!" : `${Math.round(etaProgress)}% 완료`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {etaProgress >= 100 ? (
                      <span className="text-green-600 font-medium">차량이 도착했습니다!</span>
                    ) : (
                      `도착까지 약 ${daysRemaining}일 남았습니다 (ETA: ${vehicle.eta})`
                    )}
                  </div>
                </div>
              </div>

              {/* 배송 단계 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-sm font-medium">출항</div>
                  <div className="text-xs text-gray-500">2024-01-20</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-sm font-medium">수에즈 운하</div>
                  <div className="text-xs text-gray-500">2024-02-05</div>
                </div>
                <div className="text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      etaProgress >= 90 ? "bg-green-100" : "bg-blue-100"
                    }`}
                  >
                    {etaProgress >= 90 ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="text-sm font-medium">지중해 항해</div>
                  <div className="text-xs text-gray-500">진행 중</div>
                </div>
                <div className="text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      etaProgress >= 100 ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {etaProgress >= 100 ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <MapPin className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="text-sm font-medium">Port Said 도착</div>
                  <div className="text-xs text-gray-500">{vehicle.eta}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 문서 다운로드 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-6 h-6 mr-2 text-green-600" />
                관련 문서
              </CardTitle>
              <CardDescription>구매 관련 문서들을 다운로드하실 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">Commercial Invoice</div>
                      <div className="text-sm text-gray-500">구매 인보이스</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    다운로드
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <div className="font-medium">Packing List</div>
                      <div className="text-sm text-gray-500">포장 명세서</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    다운로드
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <Ship className="w-5 h-5 mr-3 text-purple-600" />
                    <div>
                      <div className="font-medium">Bill of Lading</div>
                      <div className="text-sm text-gray-500">선하증권</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    다운로드
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-3 text-orange-600" />
                    <div>
                      <div className="font-medium">Certificate</div>
                      <div className="text-sm text-gray-500">말소사실증명서</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    다운로드
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 연락처 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>문의사항</CardTitle>
              <CardDescription>배송 관련 문의사항이 있으시면 연락주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800">한국 수출업체</div>
                  <div className="text-sm text-blue-600 mt-1">
                    이메일: export@carexport.co.kr
                    <br />
                    전화: +82-32-123-4567
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800">현지 에이전트</div>
                  <div className="text-sm text-green-600 mt-1">
                    이메일: agent@portsaid.com
                    <br />
                    전화: +20-66-123-4567
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
