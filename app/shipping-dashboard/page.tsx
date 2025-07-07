"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Ship, CheckCircle, Send, LogOut, FileText, Calendar } from "lucide-react"
import Link from "next/link"

interface Vehicle {
  id: string
  vehicleNumber: string
  modelName: string
  buyerName: string
  shoringCompletedDate: string
  status: "shoring_completed" | "shipping_info_entered" | "bl_generated" | "shipped" | "sent_to_buyer"
  shipName?: string
  departureDate?: string
  eta?: string
  blNumber?: string
}

export default function ShippingDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "V001",
      vehicleNumber: "12가3456",
      modelName: "현대 소나타",
      buyerName: "Ahmed Hassan",
      shoringCompletedDate: "2024-01-25",
      status: "shoring_completed",
    },
  ])

  const [message, setMessage] = useState("")
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null)
  const [shippingInfo, setShippingInfo] = useState({
    shipName: "",
    departureDate: "",
    eta: "",
  })

  const fillDummyData = () => {
    const dummyVehicle: Vehicle = {
      id: `V${Date.now().toString().slice(-3)}`,
      vehicleNumber: "34나5678",
      modelName: "기아 스포티지",
      buyerName: "Vladimir Petrov",
      shoringCompletedDate: new Date().toISOString().split("T")[0],
      status: "shipped",
      shipName: "MSC OSCAR",
      departureDate: "2024-02-01",
      eta: "2024-02-15",
      blNumber: `BL${Date.now().toString().slice(-6)}`,
    }

    setVehicles((prev) => [...prev, dummyVehicle])
    setMessage("더미 선박 정보가 입력되고 선적이 완료되었습니다!")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleShippingInfoSave = (vehicleId: string) => {
    if (!shippingInfo.shipName || !shippingInfo.departureDate || !shippingInfo.eta) return

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              status: "shipping_info_entered",
              shipName: shippingInfo.shipName,
              departureDate: shippingInfo.departureDate,
              eta: shippingInfo.eta,
            }
          : v,
      ),
    )
    setEditingVehicle(null)
    setShippingInfo({ shipName: "", departureDate: "", eta: "" })
    setMessage("선박 정보가 저장되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleGenerateBL = (vehicleId: string) => {
    const blNumber = `BL${Date.now().toString().slice(-6)}`
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status: "bl_generated", blNumber } : v)))
    setMessage(`B/L이 생성되었습니다. (B/L No: ${blNumber})`)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleShippingComplete = (vehicleId: string) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status: "shipped" } : v)))
    setMessage("선적이 완료되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleSendToBuyer = (vehicleId: string) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status: "sent_to_buyer" } : v)))
    setMessage("바이어에게 선적 완료 알림과 B/L이 전달되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const getStatusBadge = (status: Vehicle["status"]) => {
    switch (status) {
      case "shoring_completed":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            쇼링완료
          </Badge>
        )
      case "shipping_info_entered":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            선박정보입력
          </Badge>
        )
      case "bl_generated":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            B/L생성
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            선적완료
          </Badge>
        )
      case "sent_to_buyer":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            바이어전달
          </Badge>
        )
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Ship className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">선사대리점 대시보드</h1>
                <p className="text-sm text-gray-600">B/L 발급 및 선적 관리</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                ⚓ 선사대리점 (Shipping Agent)
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
            더미 선박정보 입력하기
          </Button>
        </div>

        {/* 쇼링 완료 차량 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ship className="w-5 h-5 mr-2 text-purple-600" />
              쇼링 완료 차량 목록
            </CardTitle>
            <CardDescription>선적 처리가 필요한 차량들입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>차량번호</TableHead>
                  <TableHead>모델명</TableHead>
                  <TableHead>바이어</TableHead>
                  <TableHead>쇼링완료일</TableHead>
                  <TableHead>선박정보</TableHead>
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
                    <TableCell>{vehicle.shoringCompletedDate}</TableCell>
                    <TableCell>
                      {vehicle.shipName ? (
                        <div className="text-sm">
                          <div className="font-medium">{vehicle.shipName}</div>
                          <div className="text-gray-500">출항: {vehicle.departureDate}</div>
                          <div className="text-gray-500">ETA: {vehicle.eta}</div>
                          {vehicle.blNumber && <div className="text-blue-600">B/L: {vehicle.blNumber}</div>}
                        </div>
                      ) : (
                        <span className="text-gray-400">미입력</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {/* 선박 정보 입력 */}
                        {vehicle.status === "shoring_completed" && (
                          <div className="space-y-2">
                            {editingVehicle === vehicle.id ? (
                              <div className="space-y-2 p-3 border rounded-lg bg-gray-50">
                                <div>
                                  <Label className="text-xs">선박명</Label>
                                  <Input
                                    size="sm"
                                    value={shippingInfo.shipName}
                                    onChange={(e) => setShippingInfo((prev) => ({ ...prev, shipName: e.target.value }))}
                                    placeholder="MSC OSCAR"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">출항일</Label>
                                  <Input
                                    size="sm"
                                    type="date"
                                    value={shippingInfo.departureDate}
                                    onChange={(e) =>
                                      setShippingInfo((prev) => ({ ...prev, departureDate: e.target.value }))
                                    }
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">ETA</Label>
                                  <Input
                                    size="sm"
                                    type="date"
                                    value={shippingInfo.eta}
                                    onChange={(e) => setShippingInfo((prev) => ({ ...prev, eta: e.target.value }))}
                                  />
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    onClick={() => handleShippingInfoSave(vehicle.id)}
                                    className="bg-purple-600 hover:bg-purple-700"
                                  >
                                    저장
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingVehicle(null)}>
                                    취소
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => setEditingVehicle(vehicle.id)}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                              >
                                <Calendar className="w-3 h-3 mr-1" />
                                선박정보 입력
                              </Button>
                            )}
                          </div>
                        )}

                        {/* B/L 생성 */}
                        {vehicle.status === "shipping_info_entered" && (
                          <Button
                            size="sm"
                            onClick={() => handleGenerateBL(vehicle.id)}
                            className="w-full bg-orange-600 hover:bg-orange-700"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            B/L 생성
                          </Button>
                        )}

                        {/* 선적 완료 */}
                        {vehicle.status === "bl_generated" && (
                          <Button
                            size="sm"
                            onClick={() => handleShippingComplete(vehicle.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            선적 완료
                          </Button>
                        )}

                        {/* 바이어에게 전달 */}
                        {vehicle.status === "shipped" && (
                          <Button
                            size="sm"
                            onClick={() => handleSendToBuyer(vehicle.id)}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            바이어에게 전달
                          </Button>
                        )}

                        {/* 전달 완료 */}
                        {vehicle.status === "sent_to_buyer" && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            바이어 전달완료
                          </Badge>
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
