"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck, Upload, CheckCircle, Send, Building, LogOut, FileText } from "lucide-react"
import Link from "next/link"

interface Vehicle {
  id: string
  vehicleNumber: string
  modelName: string
  buyerName: string
  customsCompletedDate: string
  status: "customs_completed" | "photos_uploaded" | "shoring_completed" | "sent_to_shipping"
  photos?: File[]
  specialNotes?: string
}

export default function ShoringDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "V001",
      vehicleNumber: "12가3456",
      modelName: "현대 소나타",
      buyerName: "Ahmed Hassan",
      customsCompletedDate: "2024-01-20",
      status: "customs_completed",
    },
  ])

  const [selectedShipping, setSelectedShipping] = useState("")
  const [message, setMessage] = useState("")
  const [uploadingVehicleId, setUploadingVehicleId] = useState<string | null>(null)

  const shippingCompanies = [
    { id: "S001", name: "MSC Korea", contact: "정선박" },
    { id: "S002", name: "MAERSK 대리점", contact: "한바다" },
    { id: "S003", name: "CMA CGM", contact: "김컨테이너" },
  ]

  const fillDummyData = () => {
    const dummyVehicle: Vehicle = {
      id: `V${Date.now().toString().slice(-3)}`,
      vehicleNumber: "34나5678",
      modelName: "기아 스포티지",
      buyerName: "Vladimir Petrov",
      customsCompletedDate: new Date().toISOString().split("T")[0],
      status: "shoring_completed",
      specialNotes: "컨테이너 좌측 배치, 타이어 공기압 체크 완료",
    }

    setVehicles((prev) => [...prev, dummyVehicle])
    setMessage("더미 차량 쇼링이 완료되었습니다!")
    setTimeout(() => setMessage(""), 3000)
  }

  const handlePhotoUpload = (vehicleId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, photos: files, status: "photos_uploaded" } : v)),
      )
      setMessage("사진이 업로드되었습니다.")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleSpecialNotesChange = (vehicleId: string, notes: string) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, specialNotes: notes } : v)))
  }

  const handleShoringComplete = (vehicleId: string) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status: "shoring_completed" } : v)))
    setMessage("쇼링 작업이 완료되었습니다. 선사를 선택하여 선적 처리를 진행하세요.")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleSendToShipping = (vehicleId: string) => {
    if (!selectedShipping) return

    const shippingCompany = shippingCompanies.find((c) => c.id === selectedShipping)
    if (shippingCompany) {
      setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status: "sent_to_shipping" } : v)))
      setMessage(`${shippingCompany.name}에게 쇼링 완료 정보가 전달되었습니다.`)
      setSelectedShipping("")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const getStatusBadge = (status: Vehicle["status"]) => {
    switch (status) {
      case "customs_completed":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            면장완료
          </Badge>
        )
      case "photos_uploaded":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            사진업로드
          </Badge>
        )
      case "shoring_completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            쇼링완료
          </Badge>
        )
      case "sent_to_shipping":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            선사전달
          </Badge>
        )
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Truck className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">쇼링업체 대시보드</h1>
                <p className="text-sm text-gray-600">컨테이너 적재 및 쇼링 작업 관리</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                🚛 쇼링업체 (Shoring Company)
              </Badge>
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

        {/* 더미 데이터 버튼 */}
        <div className="mb-8">
          <Button
            onClick={fillDummyData}
            variant="outline"
            className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
          >
            <FileText className="w-4 h-4 mr-2" />
            더미 쇼링 완료하기
          </Button>
        </div>

        {/* 면장 완료 차량 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="w-5 h-5 mr-2 text-orange-600" />
              면장 완료 차량 목록
            </CardTitle>
            <CardDescription>쇼링 작업이 필요한 차량들입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>차량번호</TableHead>
                  <TableHead>모델명</TableHead>
                  <TableHead>바이어</TableHead>
                  <TableHead>면장완료일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-center">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.vehicleNumber}</TableCell>
                    <TableCell>{vehicle.modelName}</TableCell>
                    <TableCell>{vehicle.buyerName}</TableCell>
                    <TableCell>{vehicle.customsCompletedDate}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>
                      <div className="space-y-3">
                        {/* 사진 업로드 */}
                        {(vehicle.status === "customs_completed" || vehicle.status === "photos_uploaded") && (
                          <div className="space-y-2">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handlePhotoUpload(vehicle.id, e)}
                                className="hidden"
                                id={`photos-${vehicle.id}`}
                              />
                              <label htmlFor={`photos-${vehicle.id}`} className="cursor-pointer">
                                {vehicle.photos && vehicle.photos.length > 0 ? (
                                  <div className="space-y-1">
                                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                                    <p className="text-sm text-green-600 font-medium">
                                      {vehicle.photos.length}개 사진 업로드됨
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                                    <p className="text-sm text-gray-600">쇼링 사진 업로드</p>
                                  </div>
                                )}
                              </label>
                            </div>
                          </div>
                        )}

                        {/* 특이사항 입력 */}
                        {vehicle.status !== "sent_to_shipping" && (
                          <Textarea
                            placeholder="특이사항을 입력하세요 (예: 컨테이너 배치, 주의사항 등)"
                            value={vehicle.specialNotes || ""}
                            onChange={(e) => handleSpecialNotesChange(vehicle.id, e.target.value)}
                            rows={2}
                            className="text-sm"
                          />
                        )}

                        {/* 쇼링 완료 버튼 */}
                        {vehicle.status === "photos_uploaded" && (
                          <Button
                            size="sm"
                            onClick={() => handleShoringComplete(vehicle.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            쇼링 완료
                          </Button>
                        )}

                        {/* 선사 선택 및 전달 */}
                        {vehicle.status === "shoring_completed" && (
                          <div className="space-y-2">
                            <Select value={selectedShipping} onValueChange={setSelectedShipping}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="선사 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                {shippingCompanies.map((company) => (
                                  <SelectItem key={company.id} value={company.id}>
                                    <div className="flex items-center">
                                      <Building className="w-4 h-4 mr-2" />
                                      <div>
                                        <div className="font-medium">{company.name}</div>
                                        <div className="text-xs text-gray-500">{company.contact}</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => handleSendToShipping(vehicle.id)}
                              disabled={!selectedShipping}
                              className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              선사에 전달
                            </Button>
                          </div>
                        )}

                        {/* 전달 완료 상태 */}
                        {vehicle.status === "sent_to_shipping" && (
                          <div className="text-center">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              선사 전달완료
                            </Badge>
                            {vehicle.specialNotes && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                특이사항: {vehicle.specialNotes}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
