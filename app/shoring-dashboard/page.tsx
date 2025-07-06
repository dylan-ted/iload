"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Download, Printer, Clock, CheckCircle, AlertCircle, Ship, Bell } from "lucide-react"
import Image from "next/image"

// 선적 스케줄 데이터 타입
interface ShippingSchedule {
  id: number
  registrationDate: string
  chassisNumber: string
  client: string
  selectedSchedule: string
  shippingCompany: string
  shippingType: "컨테이너" | "로로"
  status: "대기" | "진행" | "확정"
  departureDate: string
  invoiceNumber: string
  packingList: string
  shippingMark: string
  shoringStatus: string
}

// 차량 검색 데이터 타입
interface VehicleSearchData {
  chassisNumber: string
  model: string
  client: string
  category: string
  pol: string
  pod: string
  via: string
  nation: string
  destination: string
  socTotal: string
  cocTotal: string
}

export default function ShoringDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("전체")
  const [statusFilter, setStatusFilter] = useState("전체")
  const [startDate, setStartDate] = useState("2023-01-01")
  const [endDate, setEndDate] = useState("2023-03-01")
  const [notifications, setNotifications] = useState(3)
  const [message, setMessage] = useState("")

  // 모달 상태
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isVehicleSearchModalOpen, setIsVehicleSearchModalOpen] = useState(false)
  const [isScheduleDetailModalOpen, setIsScheduleDetailModalOpen] = useState(false)
  const [isStatusDetailModalOpen, setIsStatusDetailModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isPackingListModalOpen, setIsPackingListModalOpen] = useState(false)
  const [isShippingMarkModalOpen, setIsShippingMarkModalOpen] = useState(false)

  const [selectedItem, setSelectedItem] = useState<ShippingSchedule | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSearchData | null>(null)
  const [departureHour, setDepartureHour] = useState("")
  const [departureMinute, setDepartureMinute] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")

  // 선적 스케줄 데이터
  const [scheduleData, setScheduleData] = useState<ShippingSchedule[]>([
    {
      id: 5,
      registrationDate: "2023.01.09 12:21",
      chassisNumber: "123zzcvxz",
      client: "수출왕",
      selectedSchedule: "확인",
      shippingCompany: "이중재(계정명)",
      shippingType: "컨테이너",
      status: "대기",
      departureDate: "",
      invoiceNumber: "",
      packingList: "",
      shippingMark: "",
      shoringStatus: "대기",
    },
    {
      id: 4,
      registrationDate: "2023.01.05 11:13",
      chassisNumber: "Fw1232asdf",
      client: "",
      selectedSchedule: "확인",
      shippingCompany: "수출왕2",
      shippingType: "로로",
      status: "진행",
      departureDate: "2023.01.08 13:00",
      invoiceNumber: "",
      packingList: "",
      shippingMark: "",
      shoringStatus: "",
    },
    {
      id: 3,
      registrationDate: "2023.01.04 23:00",
      chassisNumber: "Bv312zffad",
      client: "수출왕2",
      selectedSchedule: "확인",
      shippingCompany: "이중재(계정명)",
      shippingType: "로로",
      status: "대기",
      departureDate: "",
      invoiceNumber: "",
      packingList: "",
      shippingMark: "",
      shoringStatus: "",
    },
    {
      id: 2,
      registrationDate: "2023.01.01 21:12",
      chassisNumber: "Qehrq123",
      client: "수출왕3",
      selectedSchedule: "확인",
      shippingCompany: "수출왕2",
      shippingType: "로로",
      status: "확정",
      departureDate: "2023.01.07 14:00",
      invoiceNumber: "411131124",
      packingList: "보기",
      shippingMark: "",
      shoringStatus: "완료",
    },
    {
      id: 1,
      registrationDate: "2023.01.01 20:32",
      chassisNumber: "gqg4532y",
      client: "",
      selectedSchedule: "확인",
      shippingCompany: "이중재(계정명)",
      shippingType: "컨테이너",
      status: "확정",
      departureDate: "2023.01.08 18:00",
      invoiceNumber: "322218222",
      packingList: "보기",
      shippingMark: "보기",
      shoringStatus: "완료",
    },
  ])

  // 차량 검색 데이터
  const vehicleSearchData: VehicleSearchData[] = [
    {
      chassisNumber: "12421fqec",
      model: "K5 hybrid",
      client: "좋은친구",
      category: "중앙아시",
      pol: "인천",
      pod: "위해",
      via: "서안",
      nation: "키르키",
      destination: "Almedin",
      socTotal: "10,000,001",
      cocTotal: "4,000,000",
    },
  ]

  // 상태 변경 히스토리 데이터
  const statusHistory = [
    {
      id: 5,
      status: "확정",
      changeDate: "2023.09.12 15:22:33",
      departureDate: "2023.09.12 13:20",
    },
    {
      id: 4,
      status: "진행",
      changeDate: "2023.09.11 14:22:32",
      departureDate: "2023.09.12 13:20",
    },
    {
      id: 3,
      status: "대기",
      changeDate: "2023.09.04 12:22:22",
      departureDate: "-",
    },
    {
      id: 2,
      status: "진행",
      changeDate: "2023.09.02 07:22:31",
      departureDate: "2023.09.10 11:20",
    },
    {
      id: 1,
      status: "대기",
      changeDate: "2023.09.01 04:31:22",
      departureDate: "-",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "대기":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">대기</Badge>
      case "진행":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">진행</Badge>
      case "확정":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">확정</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "대기":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "진행":
        return <AlertCircle className="h-4 w-4 text-blue-400" />
      case "확정":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      default:
        return null
    }
  }

  const handleStatusClick = (item: ShippingSchedule) => {
    setSelectedItem(item)
    if (item.status === "대기") {
      setIsStatusDetailModalOpen(true)
    } else {
      setIsHistoryModalOpen(true)
    }
  }

  const handleVehicleSelect = (vehicle: VehicleSearchData) => {
    setSelectedVehicle(vehicle)
    setIsVehicleSearchModalOpen(false)
  }

  const handleRegister = () => {
    if (!selectedVehicle || !departureHour || !departureMinute || !invoiceNumber) {
      setMessage("모든 필수 항목을 입력해주세요.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    const newSchedule: ShippingSchedule = {
      id: Math.max(...scheduleData.map((s) => s.id)) + 1,
      registrationDate: new Date().toLocaleString("ko-KR").replace(/\. /g, ".").slice(0, -1),
      chassisNumber: selectedVehicle.chassisNumber,
      client: selectedVehicle.client,
      selectedSchedule: "확인",
      shippingCompany: "수출왕2",
      shippingType: "컨테이너",
      status: "대기",
      departureDate: "",
      invoiceNumber: invoiceNumber,
      packingList: "",
      shippingMark: "",
      shoringStatus: "대기",
    }

    setScheduleData((prev) => [newSchedule, ...prev])
    setIsRegisterModalOpen(false)
    setSelectedVehicle(null)
    setDepartureHour("")
    setDepartureMinute("")
    setInvoiceNumber("")
    setMessage("선적 스케줄이 등록되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleStatusUpdate = () => {
    if (!selectedItem || !departureHour || !departureMinute || !invoiceNumber) {
      setMessage("모든 필수 항목을 입력해주세요.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    setScheduleData((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              status: "확정",
              departureDate: `2023.01.08 ${departureHour}:${departureMinute}`,
              invoiceNumber: invoiceNumber,
              packingList: "보기",
              shippingMark: "보기",
              shoringStatus: "완료",
            }
          : item,
      ),
    )

    setIsStatusDetailModalOpen(false)
    setSelectedItem(null)
    setDepartureHour("")
    setDepartureMinute("")
    setInvoiceNumber("")
    setMessage("상태가 확정으로 변경되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleTrackingClick = (invoiceNumber: string) => {
    window.open(`https://www.shipgo.com/tracking/${invoiceNumber}`, "_blank")
  }

  const filteredData = scheduleData.filter((item) => {
    const matchesSearch =
      item.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shippingCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "전체" || item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const waitingCount = scheduleData.filter((s) => s.status === "대기").length
  const progressCount = scheduleData.filter((s) => s.status === "진행").length
  const completedCount = scheduleData.filter((s) => s.status === "확정").length
  const totalCount = scheduleData.length

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                  <p className="text-sm text-gray-400">쇼링업체 - 선적관리</p>
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
                  <p className="text-gray-400 text-sm">전체 스케줄</p>
                  <p className="text-2xl font-bold text-blue-400">{totalCount}</p>
                </div>
                <Ship className="w-8 h-8 text-blue-400/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">대기중</p>
                  <p className="text-2xl font-bold text-yellow-400">{waitingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">진행중</p>
                  <p className="text-2xl font-bold text-blue-500">{progressCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">확정완료</p>
                  <p className="text-2xl font-bold text-green-400">{completedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* 등록일 필터 */}
              <div className="space-y-2">
                <Label className="text-gray-300">등록일</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="date-all"
                      name="dateFilter"
                      value="전체"
                      checked={dateFilter === "전체"}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="text-blue-600"
                    />
                    <label htmlFor="date-all" className="text-sm text-gray-300">
                      전체
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="date-custom"
                      name="dateFilter"
                      value="설정"
                      checked={dateFilter === "설정"}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="text-blue-600"
                    />
                    <label htmlFor="date-custom" className="text-sm text-gray-300">
                      설정
                    </label>
                  </div>
                </div>
                {dateFilter === "설정" && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-32 bg-gray-800 border-gray-600 text-white"
                    />
                    <span className="text-gray-400">~</span>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-32 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                )}
              </div>

              {/* 상태 필터 */}
              <div className="space-y-2">
                <Label className="text-gray-300">상태</Label>
                <div className="flex flex-wrap items-center gap-4">
                  {["전체", "대기", "진행", "확정"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`status-${status}`}
                        name="statusFilter"
                        value={status}
                        checked={statusFilter === status}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-blue-600"
                      />
                      <label htmlFor={`status-${status}`} className="text-sm text-gray-300">
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 검색어 */}
              <div className="space-y-2">
                <Label className="text-gray-300">검색어</Label>
                <Input
                  placeholder="검색어를 입력해주세요."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              {/* 검색 및 등록 버튼 */}
              <div className="flex space-x-2">
                <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                  <Search className="h-4 w-4 mr-2" />
                  검색
                </Button>
                <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      등록
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 선적 스케줄 리스트 */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-400">
              <Ship className="w-5 h-5" />
              <span>선적 스케줄 리스트</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">번호</th>
                    <th className="text-left py-3 px-4 text-gray-300">등록일시</th>
                    <th className="text-left py-3 px-4 text-gray-300">차대번호</th>
                    <th className="text-left py-3 px-4 text-gray-300">거래처명</th>
                    <th className="text-left py-3 px-4 text-gray-300">선택 스케줄</th>
                    <th className="text-left py-3 px-4 text-gray-300">선사명</th>
                    <th className="text-left py-3 px-4 text-gray-300">선적형태</th>
                    <th className="text-left py-3 px-4 text-gray-300">상태</th>
                    <th className="text-left py-3 px-4 text-gray-300">확정 출발일시</th>
                    <th className="text-left py-3 px-4 text-gray-300">송장번호</th>
                    <th className="text-left py-3 px-4 text-gray-300">패킹리스트</th>
                    <th className="text-left py-3 px-4 text-gray-300">쉬핑마크</th>
                    <th className="text-left py-3 px-4 text-gray-300">쇼링여부</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-3 px-4 text-white">{item.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{item.registrationDate}</td>
                      <td className="py-3 px-4 font-mono text-sm text-white">{item.chassisNumber}</td>
                      <td className="py-3 px-4 text-white">{item.client || "-"}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-blue-400 hover:text-blue-300"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsScheduleDetailModalOpen(true)
                          }}
                        >
                          확인
                        </Button>
                      </td>
                      <td className="py-3 px-4 text-white">{item.shippingCompany}</td>
                      <td className="py-3 px-4 text-white">{item.shippingType}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" className="p-0 h-auto" onClick={() => handleStatusClick(item)}>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            {getStatusBadge(item.status)}
                          </div>
                        </Button>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">{item.departureDate || "-"}</td>
                      <td className="py-3 px-4">
                        {item.invoiceNumber ? (
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-400 hover:text-blue-300"
                            onClick={() => handleTrackingClick(item.invoiceNumber)}
                          >
                            {item.invoiceNumber}
                          </Button>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.packingList ? (
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-400 hover:text-blue-300"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsPackingListModalOpen(true)
                            }}
                          >
                            보기
                          </Button>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.shippingMark ? (
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-400 hover:text-blue-300"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsShippingMarkModalOpen(true)
                            }}
                          >
                            보기
                          </Button>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-white">{item.shoringStatus || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 등록 모달 */}
        <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
          <DialogContent className="max-w-md bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">선적 스케줄 등록</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">차대번호 *</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="차대번호"
                    value={selectedVehicle?.chassisNumber || ""}
                    readOnly
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <Dialog open={isVehicleSearchModalOpen} onOpenChange={setIsVehicleSearchModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        검색
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
                {selectedVehicle && (
                  <div className="mt-2 text-sm text-gray-400">
                    <p>거래처명: {selectedVehicle.client}</p>
                    <p>선사명: 수출왕2</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-300">출발일시 *</Label>
                <div className="flex space-x-2">
                  <Select value={departureHour} onValueChange={setDepartureHour}>
                    <SelectTrigger className="w-20 bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="시" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString().padStart(2, "0")}
                          className="text-white hover:bg-gray-700"
                        >
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={departureMinute} onValueChange={setDepartureMinute}>
                    <SelectTrigger className="w-20 bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="분" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString().padStart(2, "0")}
                          className="text-white hover:bg-gray-700"
                        >
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">송장번호 *</Label>
                <Input
                  placeholder="송장번호를 입력하세요"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  취소
                </Button>
                <Button onClick={handleRegister} className="bg-blue-500 hover:bg-blue-600">
                  등록
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 차대번호 검색 모달 */}
        <Dialog open={isVehicleSearchModalOpen} onOpenChange={setIsVehicleSearchModalOpen}>
          <DialogContent className="max-w-6xl bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">차대번호 검색</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="차대번호를 검색해주세요."
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button className="bg-blue-500 hover:bg-blue-600">검색</Button>
              </div>
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-300">선택</th>
                      <th className="px-4 py-2 text-left text-gray-300">차대번호</th>
                      <th className="px-4 py-2 text-left text-gray-300">모델명</th>
                      <th className="px-4 py-2 text-left text-gray-300">거래처명</th>
                      <th className="px-4 py-2 text-left text-gray-300">분류</th>
                      <th className="px-4 py-2 text-left text-gray-300">POL</th>
                      <th className="px-4 py-2 text-left text-gray-300">POD</th>
                      <th className="px-4 py-2 text-left text-gray-300">VIA</th>
                      <th className="px-4 py-2 text-left text-gray-300">NATION</th>
                      <th className="px-4 py-2 text-left text-gray-300">DESTINATION</th>
                      <th className="px-4 py-2 text-left text-gray-300">합계(SOC/KRW)</th>
                      <th className="px-4 py-2 text-left text-gray-300">합계(COC/KRW)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleSearchData.map((vehicle, index) => (
                      <tr key={index} className="border-t border-gray-700">
                        <td className="px-4 py-2">
                          <input
                            type="radio"
                            name="vehicleSelect"
                            onChange={() => handleVehicleSelect(vehicle)}
                            className="text-blue-600"
                          />
                        </td>
                        <td className="px-4 py-2 text-white font-mono">{vehicle.chassisNumber}</td>
                        <td className="px-4 py-2 text-white">{vehicle.model}</td>
                        <td className="px-4 py-2 text-white">{vehicle.client}</td>
                        <td className="px-4 py-2 text-white">{vehicle.category}</td>
                        <td className="px-4 py-2 text-white">{vehicle.pol}</td>
                        <td className="px-4 py-2 text-white">{vehicle.pod}</td>
                        <td className="px-4 py-2 text-white">{vehicle.via}</td>
                        <td className="px-4 py-2 text-white">{vehicle.nation}</td>
                        <td className="px-4 py-2 text-white">{vehicle.destination}</td>
                        <td className="px-4 py-2 text-white">{vehicle.socTotal}</td>
                        <td className="px-4 py-2 text-white">{vehicle.cocTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsVehicleSearchModalOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  취소
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">등록</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 선택 스케줄 확인 모달 */}
        <Dialog open={isScheduleDetailModalOpen} onOpenChange={setIsScheduleDetailModalOpen}>
          <DialogContent className="max-w-6xl bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">선택 스케줄 확인</DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">차대번호</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">모델명</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">거래처명</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">분류</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">POL</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">POD</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">VIA</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">NATION</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">DESTINATION</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">합계(SOC/KRW)</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">합계(COC/KRW)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border border-gray-700 text-white">12421fqec</td>
                    <td className="px-4 py-2 border border-gray-700 text-white">K5 hybrid</td>
                    <td className="px-4 py-2 border border-gray-700 text-white">좋은친구</td>
                    <td className="px-4 py-2 border border-gray-700 text-white">중앙아시</td>
                    <td className="px-4 py-2 border border-gray-700 text-white">인천</td>
                    <td className="px-4 py-2 border border-gray-700 text-white">위해</td>
                    <td className="px-4 py-2 border border-gray-700 text-white">서안</td>
                    <td className="px-4 py-2 border border-gray-700 text-white">키르키</td>
                    <td className="px-4 py-2 border border-gray-700 text-white">Almedin</td>
                    <td className="px-4 py-2 border border-gray-700 text-white">10,000,001</td>
                    <td className="px-4 py-2 border border-gray-700 text-white">4,000,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsScheduleDetailModalOpen(false)} className="bg-blue-500 hover:bg-blue-600">
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 상태 상세보기 모달 (대기 상태) */}
        <Dialog open={isStatusDetailModalOpen} onOpenChange={setIsStatusDetailModalOpen}>
          <DialogContent className="max-w-6xl bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">상태 상세보기</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">차대번호</th>
                      <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">모델명</th>
                      <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">거래처명</th>
                      <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">분류</th>
                      <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">POL</th>
                      <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">POD</th>
                      <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">VIA</th>
                      <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">NATION</th>
                      <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">DESTINATION</th>
                      <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">합계(SOC/KRW)</th>
                      <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">합계(COC/KRW)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border border-gray-700 text-white">12421fqec</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">K5 hybrid</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">좋은친구</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">중앙아시</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">인천</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">위해</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">서안</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">키르키</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">Almedin</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">10,000,001</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">4,000,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">출발일시 *</Label>
                  <div className="flex space-x-2">
                    <Select value={departureHour} onValueChange={setDepartureHour}>
                      <SelectTrigger className="w-20 bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="시" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                            className="text-white hover:bg-gray-700"
                          >
                            {i.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={departureMinute} onValueChange={setDepartureMinute}>
                      <SelectTrigger className="w-20 bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="분" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {Array.from({ length: 60 }, (_, i) => (
                          <SelectItem
                            key={i}
                            value={i.toString().padStart(2, "0")}
                            className="text-white hover:bg-gray-700"
                          >
                            {i.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">송장번호 *</Label>
                  <Input
                    placeholder="송장번호를 입력하세요"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsStatusDetailModalOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  닫기
                </Button>
                <Button onClick={handleStatusUpdate} className="bg-blue-500 hover:bg-blue-600">
                  등록
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 변경 히스토리 모달 */}
        <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
          <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">상태 변경 히스토리</DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">번호</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">변경상태</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">변경일시</th>
                    <th className="px-4 py-2 text-left border border-gray-700 text-gray-300">출발일시</th>
                  </tr>
                </thead>
                <tbody>
                  {statusHistory.map((history) => (
                    <tr key={history.id}>
                      <td className="px-4 py-2 border border-gray-700 text-white">{history.id}</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">{history.status}</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">{history.changeDate}</td>
                      <td className="px-4 py-2 border border-gray-700 text-white">{history.departureDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsHistoryModalOpen(false)} className="bg-blue-500 hover:bg-blue-600">
                닫기
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 패킹리스트 모달 */}
        <Dialog open={isPackingListModalOpen} onOpenChange={setIsPackingListModalOpen}>
          <DialogContent className="max-w-6xl bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">패킹리스트 보기</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Tabs defaultValue="roro" className="w-full">
                <TabsList className="bg-gray-800 border-gray-700">
                  <TabsTrigger value="roro" className="data-[state=active]:bg-gray-700 text-white">
                    로로 형태
                  </TabsTrigger>
                  <TabsTrigger value="container" className="data-[state=active]:bg-gray-700 text-white">
                    컨테이너 형태
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="roro" className="space-y-4">
                  <div className="bg-white p-6 border rounded-lg text-black">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold">COMMERCIAL INVOICE & PACKING LIST</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold mb-2">1) Shipper / Exporter</h4>
                        <div className="text-sm">
                          <p>DI GROUP</p>
                          <p>313, Central-ro, Yeonsu-gu, Incheon, Republic of Korea</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">8) No. & date of invoice</h4>
                        <div className="text-sm">
                          <p>240123-022</p>
                          <p>240123</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold mb-2">2) For account & risk of Messers.</h4>
                        <div className="text-sm">
                          <p>MILIAEV VIACHESLAV IUREVICH</p>
                          <p>Pasport36 05 022571</p>
                          <p>RUSSIA, G. SAMARA, UL. SHESTAIA PROSEKA, D. 147, KV. 27</p>
                          <p>Tel: +7 951 018-11-18</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">9) Terms of Delivery and Payment</h4>
                        <div className="text-sm">
                          <p>CFR</p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto mb-6">
                      <table className="w-full border border-black">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-xs border border-black">MARKS AND NUMBERS</th>
                            <th className="px-2 py-1 text-xs border border-black">Description of Goods</th>
                            <th className="px-2 py-1 text-xs border border-black">Quantity</th>
                            <th className="px-2 py-1 text-xs border border-black">Unit price</th>
                            <th className="px-2 py-1 text-xs border border-black">Amount</th>
                            <th className="px-2 py-1 text-xs border border-black">WEIGHT</th>
                            <th className="px-2 py-1 text-xs border border-black">CBM</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-2 py-1 text-xs border border-black">S</td>
                            <td className="px-2 py-1 text-xs border border-black">
                              <div>USED CAR</div>
                              <div>SPORTAGE</div>
                              <div>8703.23-9020</div>
                              <div>2020</div>
                              <div>KNAPN813DLK809138</div>
                              <div>DIESEL 1955CC</div>
                            </td>
                            <td className="px-2 py-1 text-xs border border-black">1</td>
                            <td className="px-2 py-1 text-xs border border-black">$ 15,530</td>
                            <td className="px-2 py-1 text-xs border border-black">$ 15,530</td>
                            <td className="px-2 py-1 text-xs border border-black">2,055</td>
                            <td className="px-2 py-1 text-xs border border-black">-</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 text-xs border border-black font-semibold" colSpan={4}>
                              SUB TOTAL :
                            </td>
                            <td className="px-2 py-1 text-xs border border-black font-semibold">$ 15,530</td>
                            <td className="px-2 py-1 text-xs border border-black font-semibold">2,055</td>
                            <td className="px-2 py-1 text-xs border border-black">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="container" className="space-y-4">
                  <div className="bg-white p-6 border rounded-lg text-black">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold">INVOICE & PACKING LIST</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold mb-2">1) Shipper / Exporter</h4>
                        <div className="text-sm">
                          <p>KOREAONE TRADE CO.,LTD</p>
                          <p>B-Dong, #30-31, 323, Incheon tower-daero, Yeonsu-gu, Incheon, Republic of Korea</p>
                          <p>82-10-8386-9574</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">8) No. & date of invoice</h4>
                        <div className="text-sm">
                          <p>KOREA240130-01</p>
                          <p>240130</p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto mb-6">
                      <table className="w-full border border-black">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-xs border border-black">MARKS AND NUMBERS</th>
                            <th className="px-2 py-1 text-xs border border-black">Description of Goods</th>
                            <th className="px-2 py-1 text-xs border border-black">Quantity</th>
                            <th className="px-2 py-1 text-xs border border-black">Unit price</th>
                            <th className="px-2 py-1 text-xs border border-black">Amount</th>
                            <th className="px-2 py-1 text-xs border border-black">WEIGHT</th>
                            <th className="px-2 py-1 text-xs border border-black">CBM</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-2 py-1 text-xs border border-black">KPHU7140551 / A16119</td>
                            <td className="px-2 py-1 text-xs border border-black">
                              <div>USED CAR</div>
                              <div>KIA SELTOS</div>
                              <div>8703.32-1020</div>
                              <div>2022</div>
                              <div>KNAES812HPK308265</div>
                              <div>GASOLINE 1,598CC</div>
                            </td>
                            <td className="px-2 py-1 text-xs border border-black">1</td>
                            <td className="px-2 py-1 text-xs border border-black">$ 7,350</td>
                            <td className="px-2 py-1 text-xs border border-black">$ 7,350</td>
                            <td className="px-2 py-1 text-xs border border-black">1400</td>
                            <td className="px-2 py-1 text-xs border border-black">-</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 text-xs border border-black font-semibold" colSpan={4}>
                              SUB TOTAL :
                            </td>
                            <td className="px-2 py-1 text-xs border border-black font-semibold">$ 7,350</td>
                            <td className="px-2 py-1 text-xs border border-black font-semibold">1,400</td>
                            <td className="px-2 py-1 text-xs border border-black">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPackingListModalOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  닫기
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                  <Printer className="h-4 w-4 mr-2" />
                  출력하기
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 쉬핑마크 모달 */}
        <Dialog open={isShippingMarkModalOpen} onOpenChange={setIsShippingMarkModalOpen}>
          <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">쉬핑마크 보기</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-white p-8 border rounded-lg text-center">
                <div className="border-4 border-black p-8 inline-block">
                  <div className="text-2xl font-bold mb-4 text-black">SHIPPING MARK</div>
                  <div className="space-y-2 text-lg text-black">
                    <div>KPHU7140551</div>
                    <div>A16119</div>
                    <div className="border-t border-black pt-2 mt-4">
                      <div>KIA SELTOS</div>
                      <div>2022</div>
                      <div>KNAES812HPK308265</div>
                    </div>
                    <div className="border-t border-black pt-2 mt-4">
                      <div>MADE IN KOREA</div>
                      <div>DESTINATION: ALMATY</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsShippingMarkModalOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  닫기
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                  <Printer className="h-4 w-4 mr-2" />
                  출력하기
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
