"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Eye,
  Activity,
  FileText,
  CheckCircle,
  Clock,
  LogOut,
  BarChart3,
  Users,
  ArrowRight,
  RefreshCw,
  Car,
} from "lucide-react"
import Link from "next/link"

interface VehicleFlow {
  id: string
  vehicleNumber: string
  modelName: string
  buyerName: string
  currentStatus: string
  currentStep: number
  totalSteps: number
  lastUpdated: string
  assignedCompanies: {
    exporter?: string
    customs?: string
    shoring?: string
    shipping?: string
  }
  documents: string[]
}

interface ProcessStep {
  step: number
  name: string
  status: "completed" | "in_progress" | "pending"
  company: string
  timestamp?: string
}

export default function ObserverDashboard() {
  const [vehicles, setVehicles] = useState<VehicleFlow[]>([
    {
      id: "V001",
      vehicleNumber: "12가3456",
      modelName: "현대 소나타",
      buyerName: "Ahmed Hassan",
      currentStatus: "말소완료",
      currentStep: 2,
      totalSteps: 6,
      lastUpdated: "2024-01-20 14:30",
      assignedCompanies: {
        exporter: "㈜월드익스포트",
        customs: "㈜스피드관세법인",
      },
      documents: ["등록증", "말소증"],
    },
    {
      id: "V002",
      vehicleNumber: "34나5678",
      modelName: "기아 스포티지",
      buyerName: "Vladimir Petrov",
      currentStatus: "선적완료",
      currentStep: 5,
      totalSteps: 6,
      lastUpdated: "2024-01-25 16:45",
      assignedCompanies: {
        exporter: "㈜월드익스포트",
        customs: "인천관세사무소",
        shoring: "㈜디오로지스",
        shipping: "MSC Korea",
      },
      documents: ["등록증", "말소증", "인보이스", "패킹리스트", "B/L"],
    },
  ])

  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [message, setMessage] = useState("")
  const [timeline, setTimeline] = useState<ProcessStep[]>([])

  const statusSteps = [
    { step: 1, name: "매입완료", company: "수출업체" },
    { step: 2, name: "말소완료", company: "수출업체" },
    { step: 3, name: "면장완료", company: "관세사" },
    { step: 4, name: "쇼링완료", company: "쇼링업체" },
    { step: 5, name: "선적완료", company: "선사대리점" },
    { step: 6, name: "도착완료", company: "바이어" },
  ]

  useEffect(() => {
    if (selectedVehicle) {
      const vehicle = vehicles.find((v) => v.id === selectedVehicle)
      if (vehicle) {
        const steps: ProcessStep[] = statusSteps.map((step) => ({
          ...step,
          status:
            step.step < vehicle.currentStep
              ? "completed"
              : step.step === vehicle.currentStep
                ? "in_progress"
                : "pending",
          timestamp: step.step <= vehicle.currentStep ? `2024-01-${15 + step.step} ${10 + step.step}:00` : undefined,
        }))
        setTimeline(steps)
      }
    }
  }, [selectedVehicle])

  const forceStatusChange = (vehicleId: string, newStep: number) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              currentStep: newStep,
              currentStatus: statusSteps[newStep - 1]?.name || "완료",
              lastUpdated: new Date().toLocaleString("ko-KR"),
            }
          : v,
      ),
    )
    setMessage(`차량 ${vehicleId}의 상태가 ${statusSteps[newStep - 1]?.name}로 변경되었습니다.`)
    setTimeout(() => setMessage(""), 3000)
  }

  const generateDummyDocument = (vehicleId: string, docType: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              documents: [...v.documents, docType],
              lastUpdated: new Date().toLocaleString("ko-KR"),
            }
          : v,
      ),
    )
    setMessage(`${docType} 문서가 생성되었습니다.`)
    setTimeout(() => setMessage(""), 3000)
  }

  const getProgressPercentage = (currentStep: number, totalSteps: number) => {
    return (currentStep / totalSteps) * 100
  }

  const getStatusColor = (step: number, currentStep: number) => {
    if (step < currentStep) return "text-green-600"
    if (step === currentStep) return "text-blue-600"
    return "text-gray-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Eye className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">All-in-One 옵저버 대시보드</h1>
                <p className="text-sm text-gray-600">전체 프로세스 흐름 관리 및 모니터링</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                👁️ 옵저버 (Observer)
              </Badge>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Car className="w-4 h-4 mr-2" />
                  홈으로
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* 알림 메시지 */}
        {message && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {/* 전체 통계 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">전체 차량</p>
                  <p className="text-2xl font-bold text-indigo-600">{vehicles.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">진행 중</p>
                  <p className="text-2xl font-bold text-blue-600">{vehicles.filter((v) => v.currentStep < 6).length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">완료</p>
                  <p className="text-2xl font-bold text-green-600">
                    {vehicles.filter((v) => v.currentStep === 6).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">참여 업체</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 좌측: 전체 차량 리스트 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                전체 차량 현황
              </CardTitle>
              <CardDescription>모든 차량의 실시간 진행 상황</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>차량번호</TableHead>
                    <TableHead>현재상태</TableHead>
                    <TableHead>진행률</TableHead>
                    <TableHead>최종업데이트</TableHead>
                    <TableHead>제어</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vehicle.vehicleNumber}</div>
                          <div className="text-sm text-gray-500">{vehicle.modelName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${getStatusColor(vehicle.currentStep, vehicle.currentStep)} bg-opacity-10`}
                        >
                          {vehicle.currentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={getProgressPercentage(vehicle.currentStep, vehicle.totalSteps)} />
                          <div className="text-xs text-gray-500">
                            {vehicle.currentStep}/{vehicle.totalSteps} 단계
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">{vehicle.lastUpdated}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Select onValueChange={(value) => forceStatusChange(vehicle.id, Number.parseInt(value))}>
                            <SelectTrigger className="w-full h-8 text-xs">
                              <SelectValue placeholder="상태 변경" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusSteps.map((step) => (
                                <SelectItem key={step.step} value={step.step.toString()}>
                                  {step.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedVehicle(vehicle.id)}
                            className="h-6 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            상세보기
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 우측: 프로세스 흐름 시각화 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRight className="w-5 h-5 mr-2 text-indigo-600" />
                프로세스 흐름 시각화
              </CardTitle>
              <CardDescription>
                {selectedVehicle
                  ? `${vehicles.find((v) => v.id === selectedVehicle)?.vehicleNumber} 상세 흐름`
                  : "차량을 선택하여 상세 흐름을 확인하세요"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedVehicle ? (
                <div className="space-y-4">
                  {/* 타임라인 */}
                  <div className="space-y-3">
                    {timeline.map((step, index) => (
                      <div key={step.step} className="flex items-center space-x-4">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            step.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : step.status === "in_progress"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {step.status === "completed" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : step.status === "in_progress" ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div
                                className={`font-medium ${
                                  step.status === "completed"
                                    ? "text-green-600"
                                    : step.status === "in_progress"
                                      ? "text-blue-600"
                                      : "text-gray-400"
                                }`}
                              >
                                {step.name}
                              </div>
                              <div className="text-sm text-gray-500">{step.company}</div>
                            </div>
                            <div className="text-right">
                              {step.timestamp && <div className="text-xs text-gray-500">{step.timestamp}</div>}
                              {step.status === "in_progress" && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  진행중
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 문서 생성 히스토리 */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      생성된 문서
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {vehicles
                        .find((v) => v.id === selectedVehicle)
                        ?.documents.map((doc, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>{doc}</span>
                          </div>
                        ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateDummyDocument(selectedVehicle, "인보이스")}
                      >
                        인보이스 생성
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => generateDummyDocument(selectedVehicle, "B/L")}>
                        B/L 생성
                      </Button>
                    </div>
                  </div>

                  {/* 업체 연결 현황 */}
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      참여 업체 현황
                    </h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(vehicles.find((v) => v.id === selectedVehicle)?.assignedCompanies || {}).map(
                        ([role, company]) => (
                          <div key={role} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{role}:</span>
                            <span className="font-medium">{company}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>좌측에서 차량을 선택하여</p>
                  <p>상세 프로세스 흐름을 확인하세요</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 하단: 전체 프로세스 맵 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
              전체 프로세스 맵
            </CardTitle>
            <CardDescription>모든 단계별 현황을 한눈에 확인</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {statusSteps.map((step) => {
                const vehiclesInStep = vehicles.filter((v) => v.currentStep === step.step).length
                return (
                  <div key={step.step} className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        vehiclesInStep > 0 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <span className="font-bold">{vehiclesInStep}</span>
                    </div>
                    <div className="text-sm font-medium">{step.name}</div>
                    <div className="text-xs text-gray-500">{step.company}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
