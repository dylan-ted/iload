"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Ship,
  Anchor,
  Search,
  CheckCircle,
  Eye,
  Edit,
  Bell,
  Container,
  MapPin,
  X,
  Plus,
  Send,
  Download,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Image from "next/image"

interface ShippingSchedule {
  id: string
  vesselName: string
  voyageNumber: string
  route: string
  departurePort: string
  arrivalPort: string
  departureDate: string
  arrivalDate: string
  status: "예정" | "출항" | "운항중" | "도착" | "지연"
  containers: number
  capacity: number
  cargoType: string
  currentLocation?: string
  estimatedArrival?: string
  delay?: number
  weatherCondition?: string
  fuelConsumption?: number
}

interface ScheduleFormData {
  vesselName: string
  voyageNumber: string
  route: string
  departurePort: string
  arrivalPort: string
  departureDate: string
  arrivalDate: string
  capacity: string
  cargoType: string
}

interface VesselUpdate {
  scheduleId: string
  currentLocation: string
  status: ShippingSchedule["status"]
  estimatedArrival: string
  weatherCondition: string
  notes: string
}

export default function ShippingDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [notifications, setNotifications] = useState(6)
  const [message, setMessage] = useState("")
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showVesselUpdate, setShowVesselUpdate] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<ShippingSchedule | null>(null)
  const [scheduleFormData, setScheduleFormData] = useState<ScheduleFormData>({
    vesselName: "",
    voyageNumber: "",
    route: "",
    departurePort: "",
    arrivalPort: "",
    departureDate: "",
    arrivalDate: "",
    capacity: "",
    cargoType: "중고차",
  })
  const [vesselUpdate, setVesselUpdate] = useState<VesselUpdate>({
    scheduleId: "",
    currentLocation: "",
    status: "운항중",
    estimatedArrival: "",
    weatherCondition: "양호",
    notes: "",
  })

  const [shippingSchedules, setShippingSchedules] = useState<ShippingSchedule[]>([
    {
      id: "SHP001",
      vesselName: "KOREA EXPRESS",
      voyageNumber: "KE2024-001",
      route: "부산-두바이",
      departurePort: "부산항",
      arrivalPort: "두바이항",
      departureDate: "2024-01-20",
      arrivalDate: "2024-02-05",
      status: "예정",
      containers: 45,
      capacity: 200,
      cargoType: "중고차",
      weatherCondition: "양호",
      fuelConsumption: 85,
    },
    {
      id: "SHP002",
      vesselName: "ASIA PIONEER",
      voyageNumber: "AP2024-003",
      route: "인천-블라디보스토크",
      departurePort: "인천항",
      arrivalPort: "블라디보스토크항",
      departureDate: "2024-01-15",
      arrivalDate: "2024-01-18",
      status: "운항중",
      containers: 78,
      capacity: 150,
      cargoType: "중고차",
      currentLocation: "동해상 (북위 40.2도, 동경 131.5도)",
      estimatedArrival: "2024-01-18 14:30",
      weatherCondition: "양호",
      fuelConsumption: 92,
    },
    {
      id: "SHP003",
      vesselName: "GLOBAL CARRIER",
      voyageNumber: "GC2024-005",
      route: "부산-마닐라",
      departurePort: "부산항",
      arrivalPort: "마닐라항",
      departureDate: "2024-01-10",
      arrivalDate: "2024-01-14",
      status: "도착",
      containers: 92,
      capacity: 180,
      cargoType: "중고차",
      currentLocation: "마닐라항 접안",
      weatherCondition: "양호",
      fuelConsumption: 88,
    },
    {
      id: "SHP004",
      vesselName: "PACIFIC STAR",
      voyageNumber: "PS2024-007",
      route: "인천-상하이",
      departurePort: "인천항",
      arrivalPort: "상하이항",
      departureDate: "2024-01-16",
      arrivalDate: "2024-01-17",
      status: "지연",
      containers: 65,
      capacity: 120,
      cargoType: "중고차",
      currentLocation: "황해상 (기상악화로 지연)",
      estimatedArrival: "2024-01-18 09:00",
      delay: 18,
      weatherCondition: "악천후",
      fuelConsumption: 95,
    },
  ])

  const ports = [
    "부산항",
    "인천항",
    "평택항",
    "울산항",
    "광양항",
    "두바이항",
    "블라디보스토크항",
    "마닐라항",
    "상하이항",
    "홍콩항",
    "싱가포르항",
    "요코하마항",
    "카라치항",
    "뭄바이항",
    "콜롬보항",
  ]

  const vessels = [
    "KOREA EXPRESS",
    "ASIA PIONEER",
    "GLOBAL CARRIER",
    "PACIFIC STAR",
    "OCEAN MASTER",
    "SEA DRAGON",
    "BLUE WHALE",
    "WIND RUNNER",
  ]

  const handleCreateSchedule = () => {
    if (!scheduleFormData.vesselName || !scheduleFormData.departurePort || !scheduleFormData.arrivalPort) {
      setMessage("필수 항목을 모두 입력해주세요.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    const newSchedule: ShippingSchedule = {
      id: `SHP${Date.now().toString().slice(-3)}`,
      vesselName: scheduleFormData.vesselName,
      voyageNumber:
        scheduleFormData.voyageNumber ||
        `${scheduleFormData.vesselName.slice(0, 2)}2024-${Date.now().toString().slice(-3)}`,
      route: `${scheduleFormData.departurePort}-${scheduleFormData.arrivalPort}`,
      departurePort: scheduleFormData.departurePort,
      arrivalPort: scheduleFormData.arrivalPort,
      departureDate: scheduleFormData.departureDate,
      arrivalDate: scheduleFormData.arrivalDate,
      status: "예정",
      containers: 0,
      capacity: Number.parseInt(scheduleFormData.capacity) || 150,
      cargoType: scheduleFormData.cargoType,
      weatherCondition: "양호",
      fuelConsumption: Math.floor(Math.random() * 20 + 80),
    }

    setShippingSchedules((prev) => [...prev, newSchedule])
    setShowScheduleForm(false)
    setScheduleFormData({
      vesselName: "",
      voyageNumber: "",
      route: "",
      departurePort: "",
      arrivalPort: "",
      departureDate: "",
      arrivalDate: "",
      capacity: "",
      cargoType: "중고차",
    })
    setMessage("새 항차가 등록되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleUpdateVessel = () => {
    if (!selectedSchedule || !vesselUpdate.currentLocation) {
      setMessage("위치 정보를 입력해주세요.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    setShippingSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === selectedSchedule.id
          ? {
              ...schedule,
              currentLocation: vesselUpdate.currentLocation,
              status: vesselUpdate.status,
              estimatedArrival: vesselUpdate.estimatedArrival,
              weatherCondition: vesselUpdate.weatherCondition,
              delay: vesselUpdate.status === "지연" ? Math.floor(Math.random() * 24 + 6) : undefined,
            }
          : schedule,
      ),
    )

    setShowVesselUpdate(false)
    setSelectedSchedule(null)
    setVesselUpdate({
      scheduleId: "",
      currentLocation: "",
      status: "운항중",
      estimatedArrival: "",
      weatherCondition: "양호",
      notes: "",
    })

    const statusMessages = {
      출항: "출항으로 상태가 변경되었습니다.",
      운항중: "운항 중으로 상태가 변경되었습니다.",
      도착: "도착이 완료되었습니다.",
      지연: "지연 상태로 변경되었습니다.",
    }

    setMessage(statusMessages[vesselUpdate.status] || "상태가 업데이트되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleDepartVessel = (schedule: ShippingSchedule) => {
    setShippingSchedules((prev) =>
      prev.map((s) =>
        s.id === schedule.id
          ? {
              ...s,
              status: "출항",
              currentLocation: `${schedule.departurePort}에서 출항`,
              departureDate: new Date().toISOString().split("T")[0],
            }
          : s,
      ),
    )
    setMessage(`${schedule.vesselName}이(가) 출항했습니다.`)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleArriveVessel = (schedule: ShippingSchedule) => {
    setShippingSchedules((prev) =>
      prev.map((s) =>
        s.id === schedule.id
          ? {
              ...s,
              status: "도착",
              currentLocation: `${schedule.arrivalPort} 접안 완료`,
              arrivalDate: new Date().toISOString().split("T")[0],
            }
          : s,
      ),
    )
    setMessage(`${schedule.vesselName}이(가) ${schedule.arrivalPort}에 도착했습니다.`)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleDownloadBL = (schedule: ShippingSchedule) => {
    // B/L 다운로드 시뮬레이션
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 1000

    // 배경
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 테두리
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    // 제목
    ctx.fillStyle = "#000000"
    ctx.font = "bold 28px Arial"
    ctx.textAlign = "center"
    ctx.fillText("BILL OF LADING", canvas.width / 2, 70)

    // 내용
    ctx.font = "16px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`B/L No: ${schedule.voyageNumber}`, 50, 120)
    ctx.fillText(`Vessel: ${schedule.vesselName}`, 50, 150)
    ctx.fillText(`Voyage: ${schedule.voyageNumber}`, 50, 180)
    ctx.fillText(`Port of Loading: ${schedule.departurePort}`, 50, 210)
    ctx.fillText(`Port of Discharge: ${schedule.arrivalPort}`, 50, 240)
    ctx.fillText(`Date of Issue: ${new Date().toLocaleDateString()}`, 50, 270)
    ctx.fillText(`Cargo: ${schedule.cargoType}`, 50, 300)
    ctx.fillText(`Container Qty: ${schedule.containers}`, 50, 330)

    // 서명란
    ctx.font = "14px Arial"
    ctx.fillText("Carrier:", 50, 800)
    ctx.fillText("GlobalCar Shipping Co., Ltd.", 50, 820)
    ctx.fillText("Signature: ________________", 50, 860)
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 50, 890)

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `BL_${schedule.voyageNumber}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setMessage("B/L이 다운로드되었습니다.")
        setTimeout(() => setMessage(""), 3000)
      }
    }, "image/png")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "도착":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "운항중":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "출항":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "예정":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "지연":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const filteredSchedules = shippingSchedules.filter((schedule) => {
    const matchesSearch =
      schedule.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || schedule.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const activeVessels = shippingSchedules.filter((s) => s.status === "운항중" || s.status === "출항").length
  const totalContainers = shippingSchedules.reduce((sum, schedule) => sum + schedule.containers, 0)
  const arrivedToday = shippingSchedules.filter((s) => s.status === "도착").length
  const delayedVessels = shippingSchedules.filter((s) => s.status === "지연").length

  // 항차 등록 폼 렌더링
  if (showScheduleForm) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">새 항차 등록</h2>
              <Button
                variant="outline"
                onClick={() => setShowScheduleForm(false)}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                닫기
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">선박 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">선박명 *</Label>
                    <Select
                      value={scheduleFormData.vesselName}
                      onValueChange={(value) => setScheduleFormData((prev) => ({ ...prev, vesselName: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="선박 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {vessels.map((vessel) => (
                          <SelectItem key={vessel} value={vessel} className="text-white hover:bg-gray-700">
                            {vessel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">항차번호</Label>
                    <Input
                      value={scheduleFormData.voyageNumber}
                      onChange={(e) => setScheduleFormData((prev) => ({ ...prev, voyageNumber: e.target.value }))}
                      placeholder="KE2024-001"
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">출발항 *</Label>
                    <Select
                      value={scheduleFormData.departurePort}
                      onValueChange={(value) => setScheduleFormData((prev) => ({ ...prev, departurePort: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="출발항 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {ports.slice(0, 5).map((port) => (
                          <SelectItem key={port} value={port} className="text-white hover:bg-gray-700">
                            {port}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">도착항 *</Label>
                    <Select
                      value={scheduleFormData.arrivalPort}
                      onValueChange={(value) => setScheduleFormData((prev) => ({ ...prev, arrivalPort: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="도착항 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {ports.slice(5).map((port) => (
                          <SelectItem key={port} value={port} className="text-white hover:bg-gray-700">
                            {port}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">출항일</Label>
                    <Input
                      type="date"
                      value={scheduleFormData.departureDate}
                      onChange={(e) => setScheduleFormData((prev) => ({ ...prev, departureDate: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">도착 예정일</Label>
                    <Input
                      type="date"
                      value={scheduleFormData.arrivalDate}
                      onChange={(e) => setScheduleFormData((prev) => ({ ...prev, arrivalDate: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">적재 용량</Label>
                    <Input
                      value={scheduleFormData.capacity}
                      onChange={(e) => setScheduleFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                      placeholder="150"
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">화물 종류</Label>
                    <Select
                      value={scheduleFormData.cargoType}
                      onValueChange={(value) => setScheduleFormData((prev) => ({ ...prev, cargoType: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="중고차" className="text-white hover:bg-gray-700">
                          중고차
                        </SelectItem>
                        <SelectItem value="신차" className="text-white hover:bg-gray-700">
                          신차
                        </SelectItem>
                        <SelectItem value="기계류" className="text-white hover:bg-gray-700">
                          기계류
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowScheduleForm(false)}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                취소
              </Button>
              <Button onClick={handleCreateSchedule} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                항차 등록
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 선박 위치 업데이트 폼 렌더링
  if (showVesselUpdate && selectedSchedule) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full">
          <div className="border-b border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">선박 위치 업데이트</h2>
                <p className="text-gray-400">
                  {selectedSchedule.vesselName} - {selectedSchedule.voyageNumber}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowVesselUpdate(false)
                  setSelectedSchedule(null)
                }}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                닫기
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label className="text-gray-300">현재 위치 *</Label>
                  <Input
                    value={vesselUpdate.currentLocation}
                    onChange={(e) => setVesselUpdate((prev) => ({ ...prev, currentLocation: e.target.value }))}
                    placeholder="동해상 (북위 40.2도, 동경 131.5도)"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">상태 변경</Label>
                    <Select
                      value={vesselUpdate.status}
                      onValueChange={(value: ShippingSchedule["status"]) =>
                        setVesselUpdate((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="출항" className="text-white hover:bg-gray-700">
                          출항
                        </SelectItem>
                        <SelectItem value="운항중" className="text-white hover:bg-gray-700">
                          운항중
                        </SelectItem>
                        <SelectItem value="도착" className="text-white hover:bg-gray-700">
                          도착
                        </SelectItem>
                        <SelectItem value="지연" className="text-white hover:bg-gray-700">
                          지연
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">기상 상태</Label>
                    <Select
                      value={vesselUpdate.weatherCondition}
                      onValueChange={(value) => setVesselUpdate((prev) => ({ ...prev, weatherCondition: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="양호" className="text-white hover:bg-gray-700">
                          양호
                        </SelectItem>
                        <SelectItem value="보통" className="text-white hover:bg-gray-700">
                          보통
                        </SelectItem>
                        <SelectItem value="악천후" className="text-white hover:bg-gray-700">
                          악천후
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">예상 도착시간</Label>
                  <Input
                    type="datetime-local"
                    value={vesselUpdate.estimatedArrival}
                    onChange={(e) => setVesselUpdate((prev) => ({ ...prev, estimatedArrival: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">상황 메모</Label>
                  <Textarea
                    value={vesselUpdate.notes}
                    onChange={(e) => setVesselUpdate((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="현재 상황이나 특이사항을 입력하세요"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowVesselUpdate(false)
                  setSelectedSchedule(null)
                }}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                취소
              </Button>
              <Button onClick={handleUpdateVessel} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Ship className="w-4 h-4 mr-2" />
                위치 업데이트
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Image src="/images/logo.png" alt="GlobalCar" width={40} height={40} className="rounded-lg" />
                <div>
                  <h1 className="text-2xl font-bold">GlobalCar</h1>
                  <p className="text-sm text-gray-400">선사대리점 대시보드</p>
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
              <Button onClick={() => setShowScheduleForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Anchor className="w-4 h-4 mr-2" />새 항차 등록
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-6 py-8">
        {/* Alert Message */}
        {message && (
          <Alert className="mb-6 bg-green-500/20 border-green-500/30 text-green-300">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">운항중인 선박</p>
                  <p className="text-2xl font-bold text-blue-500">{activeVessels}</p>
                </div>
                <Ship className="w-8 h-8 text-blue-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">총 컨테이너</p>
                  <p className="text-2xl font-bold text-cyan-400">{totalContainers}</p>
                </div>
                <Container className="w-8 h-8 text-cyan-400/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">도착 완료</p>
                  <p className="text-2xl font-bold text-green-400">{arrivedToday}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">지연 선박</p>
                  <p className="text-2xl font-bold text-red-400">{delayedVessels}</p>
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
                  placeholder="선박명, 항로, 항차 ID로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className={filterStatus === "all" ? "bg-blue-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  전체
                </Button>
                <Button
                  variant={filterStatus === "운항중" ? "default" : "outline"}
                  onClick={() => setFilterStatus("운항중")}
                  className={filterStatus === "운항중" ? "bg-cyan-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  운항중
                </Button>
                <Button
                  variant={filterStatus === "도착" ? "default" : "outline"}
                  onClick={() => setFilterStatus("도착")}
                  className={filterStatus === "도착" ? "bg-green-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  도착
                </Button>
                <Button
                  variant={filterStatus === "지연" ? "default" : "outline"}
                  onClick={() => setFilterStatus("지연")}
                  className={filterStatus === "지연" ? "bg-red-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  지연
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Schedules */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-500">
              <Ship className="w-5 h-5" />
              <span>선박 운항 현황</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{schedule.vesselName}</h3>
                        <Badge className={getStatusColor(schedule.status)}>{schedule.status}</Badge>
                        {schedule.status === "지연" && schedule.delay && (
                          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                            {schedule.delay}시간 지연
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-400 mb-4">
                        <div>
                          <span className="block text-gray-500">항차번호</span>
                          <span className="text-white font-mono">{schedule.voyageNumber}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">항로</span>
                          <span className="text-white">{schedule.route}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">컨테이너</span>
                          <span className="text-cyan-400 font-semibold">
                            {schedule.containers}/{schedule.capacity}
                          </span>
                        </div>
                        <div>
                          <span className="block text-gray-500">화물종류</span>
                          <span className="text-white">{schedule.cargoType}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-400 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-blue-400" />
                          <span>{schedule.departurePort}</span>
                          <span className="ml-2 text-gray-500">({schedule.departureDate})</span>
                        </div>
                        <span>→</span>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-green-400" />
                          <span>{schedule.arrivalPort}</span>
                          <span className="ml-2 text-gray-500">({schedule.arrivalDate})</span>
                        </div>
                      </div>
                      {schedule.currentLocation && (
                        <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-sm">
                          <span className="text-blue-300">현재 위치: {schedule.currentLocation}</span>
                        </div>
                      )}
                      {schedule.estimatedArrival && (
                        <div className="mb-3 p-2 bg-green-500/10 border border-green-500/20 rounded text-sm">
                          <span className="text-green-300">예상 도착: {schedule.estimatedArrival}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          기상: {schedule.weatherCondition}
                        </span>
                        {schedule.fuelConsumption && <span>연료소모: {schedule.fuelConsumption}%</span>}
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(schedule.containers / schedule.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {schedule.status === "예정" && (
                        <Button
                          size="sm"
                          onClick={() => handleDepartVessel(schedule)}
                          className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          출항
                        </Button>
                      )}
                      {(schedule.status === "출항" || schedule.status === "운항중" || schedule.status === "지연") && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedSchedule(schedule)
                              setVesselUpdate({
                                scheduleId: schedule.id,
                                currentLocation: schedule.currentLocation || "",
                                status: schedule.status,
                                estimatedArrival: schedule.estimatedArrival || "",
                                weatherCondition: schedule.weatherCondition || "양호",
                                notes: "",
                              })
                              setShowVesselUpdate(true)
                            }}
                            className="bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            위치 업데이트
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleArriveVessel(schedule)}
                            className="bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            도착 완료
                          </Button>
                        </>
                      )}
                      {schedule.status === "도착" && (
                        <Button
                          size="sm"
                          onClick={() => handleDownloadBL(schedule)}
                          className="bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          B/L 다운로드
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        상세
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
