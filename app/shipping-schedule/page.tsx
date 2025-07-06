"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Download, Printer, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 더미 데이터
const scheduleData = [
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
]

const vehicleSearchData = [
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

export default function ShippingSchedulePage() {
  const [dateFilter, setDateFilter] = useState("전체")
  const [statusFilter, setStatusFilter] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("2023-01-01")
  const [endDate, setEndDate] = useState("2023-03-01")

  // 모달 상태
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isVehicleSearchModalOpen, setIsVehicleSearchModalOpen] = useState(false)
  const [isScheduleDetailModalOpen, setIsScheduleDetailModalOpen] = useState(false)
  const [isStatusDetailModalOpen, setIsStatusDetailModalOpen] = useState(false)
  const [isPackingListModalOpen, setIsPackingListModalOpen] = useState(false)
  const [isShippingMarkModalOpen, setIsShippingMarkModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  const getStatusBadge = (status) => {
    switch (status) {
      case "대기":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            대기
          </Badge>
        )
      case "진행":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            진행
          </Badge>
        )
      case "확정":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            확정
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "대기":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "진행":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "확정":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return null
    }
  }

  const handleStatusClick = (item) => {
    setSelectedItem(item)
    if (item.status === "대기") {
      setIsStatusDetailModalOpen(true)
    } else {
      setIsHistoryModalOpen(true)
    }
  }

  const handlePackingListView = (item) => {
    setSelectedItem(item)
    setIsPackingListModalOpen(true)
  }

  const handleShippingMarkView = (item) => {
    setSelectedItem(item)
    setIsShippingMarkModalOpen(true)
  }

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle)
    setIsVehicleSearchModalOpen(false)
  }

  const handleTrackingClick = (invoiceNumber) => {
    // SHIPGO 연동 시뮬레이션
    window.open(`https://www.shipgo.com/tracking/${invoiceNumber}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">선적관리</h1>
          <p className="text-gray-600">선적 스케줄 관리</p>
        </div>

        {/* 검색 필터 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* 등록일 필터 */}
              <div className="space-y-2">
                <Label>등록일</Label>
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
                    <label htmlFor="date-all" className="text-sm">
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
                    <label htmlFor="date-custom" className="text-sm">
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
                      className="w-32"
                    />
                    <span>~</span>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-32" />
                  </div>
                )}
              </div>

              {/* 상태 필터 */}
              <div className="space-y-2">
                <Label>상태</Label>
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
                      <label htmlFor={`status-${status}`} className="text-sm">
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 검색어 */}
              <div className="space-y-2">
                <Label>검색어</Label>
                <Input
                  placeholder="검색어를 입력해주세요."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* 검색 버튼 */}
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  검색
                </Button>
                <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      등록
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>선적 스케줄 등록</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>차대번호 *</Label>
                        <div className="flex space-x-2">
                          <Input placeholder="차대번호" value={selectedVehicle?.chassisNumber || ""} readOnly />
                          <Dialog open={isVehicleSearchModalOpen} onOpenChange={setIsVehicleSearchModalOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline">검색</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>차대번호 검색</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex space-x-2">
                                  <Input placeholder="차대번호를 검색해주세요." />
                                  <Button>검색</Button>
                                </div>
                                <div className="border rounded-lg overflow-hidden">
                                  <table className="w-full">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-2 text-left">선택</th>
                                        <th className="px-4 py-2 text-left">차대번호</th>
                                        <th className="px-4 py-2 text-left">모델명</th>
                                        <th className="px-4 py-2 text-left">거래처명</th>
                                        <th className="px-4 py-2 text-left">분류</th>
                                        <th className="px-4 py-2 text-left">POL</th>
                                        <th className="px-4 py-2 text-left">POD</th>
                                        <th className="px-4 py-2 text-left">VIA</th>
                                        <th className="px-4 py-2 text-left">NATION</th>
                                        <th className="px-4 py-2 text-left">DESTINATION</th>
                                        <th className="px-4 py-2 text-left">합계(SOC/KRW)</th>
                                        <th className="px-4 py-2 text-left">합계(COC/KRW)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {vehicleSearchData.map((vehicle, index) => (
                                        <tr key={index} className="border-t">
                                          <td className="px-4 py-2">
                                            <input
                                              type="radio"
                                              name="vehicleSelect"
                                              onChange={() => handleVehicleSelect(vehicle)}
                                            />
                                          </td>
                                          <td className="px-4 py-2">{vehicle.chassisNumber}</td>
                                          <td className="px-4 py-2">{vehicle.model}</td>
                                          <td className="px-4 py-2">{vehicle.client}</td>
                                          <td className="px-4 py-2">{vehicle.category}</td>
                                          <td className="px-4 py-2">{vehicle.pol}</td>
                                          <td className="px-4 py-2">{vehicle.pod}</td>
                                          <td className="px-4 py-2">{vehicle.via}</td>
                                          <td className="px-4 py-2">{vehicle.nation}</td>
                                          <td className="px-4 py-2">{vehicle.destination}</td>
                                          <td className="px-4 py-2">{vehicle.socTotal}</td>
                                          <td className="px-4 py-2">{vehicle.cocTotal}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setIsVehicleSearchModalOpen(false)}>
                                    취소
                                  </Button>
                                  <Button>등록</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        {selectedVehicle && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>거래처명: {selectedVehicle.client}</p>
                            <p>선사명: {selectedVehicle.shippingCompany}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label>출발일시 *</Label>
                        <div className="flex space-x-2">
                          <Select>
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="시" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                                  {i.toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="분" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 60 }, (_, i) => (
                                <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                                  {i.toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>송장번호 *</Label>
                        <Input placeholder="송장번호를 입력하세요" />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsRegisterModalOpen(false)}>
                          취소
                        </Button>
                        <Button>등록</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 선적 스케줄 리스트 */}
        <Card>
          <CardHeader>
            <CardTitle>선적 스케줄 리스트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">번호</th>
                    <th className="text-left py-3 px-4">등록일시</th>
                    <th className="text-left py-3 px-4">차대번호</th>
                    <th className="text-left py-3 px-4">거래처명</th>
                    <th className="text-left py-3 px-4">선택 스케줄</th>
                    <th className="text-left py-3 px-4">선사명</th>
                    <th className="text-left py-3 px-4">선적형태</th>
                    <th className="text-left py-3 px-4">상태</th>
                    <th className="text-left py-3 px-4">확정 출발일시</th>
                    <th className="text-left py-3 px-4">송장번호</th>
                    <th className="text-left py-3 px-4">패킹리스트</th>
                    <th className="text-left py-3 px-4">쉬핑마크</th>
                    <th className="text-left py-3 px-4">쇼링여부</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{item.id}</td>
                      <td className="py-3 px-4 text-sm">{item.registrationDate}</td>
                      <td className="py-3 px-4 font-mono text-sm">{item.chassisNumber}</td>
                      <td className="py-3 px-4">{item.client || "-"}</td>
                      <td className="py-3 px-4">
                        <Dialog open={isScheduleDetailModalOpen} onOpenChange={setIsScheduleDetailModalOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="link"
                              className="p-0 h-auto text-blue-600"
                              onClick={() => setSelectedItem(item)}
                            >
                              확인
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>선택 스케줄 확인</DialogTitle>
                            </DialogHeader>
                            <div className="overflow-x-auto">
                              <table className="w-full border">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left border">차대번호</th>
                                    <th className="px-4 py-2 text-left border">모델명</th>
                                    <th className="px-4 py-2 text-left border">거래처명</th>
                                    <th className="px-4 py-2 text-left border">분류</th>
                                    <th className="px-4 py-2 text-left border">POL</th>
                                    <th className="px-4 py-2 text-left border">POD</th>
                                    <th className="px-4 py-2 text-left border">VIA</th>
                                    <th className="px-4 py-2 text-left border">NATION</th>
                                    <th className="px-4 py-2 text-left border">DESTINATION</th>
                                    <th className="px-4 py-2 text-left border">합계(SOC/KRW)</th>
                                    <th className="px-4 py-2 text-left border">합계(COC/KRW)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="px-4 py-2 border">12421fqec</td>
                                    <td className="px-4 py-2 border">K5 hybrid</td>
                                    <td className="px-4 py-2 border">좋은친구</td>
                                    <td className="px-4 py-2 border">중앙아시</td>
                                    <td className="px-4 py-2 border">인천</td>
                                    <td className="px-4 py-2 border">위해</td>
                                    <td className="px-4 py-2 border">서안</td>
                                    <td className="px-4 py-2 border">키르키</td>
                                    <td className="px-4 py-2 border">Almedin</td>
                                    <td className="px-4 py-2 border">10,000,001</td>
                                    <td className="px-4 py-2 border">4,000,000</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-end">
                              <Button onClick={() => setIsScheduleDetailModalOpen(false)}>닫기</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                      <td className="py-3 px-4">{item.shippingCompany}</td>
                      <td className="py-3 px-4">{item.shippingType}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" className="p-0 h-auto" onClick={() => handleStatusClick(item)}>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            {getStatusBadge(item.status)}
                          </div>
                        </Button>
                      </td>
                      <td className="py-3 px-4 text-sm">{item.departureDate || "-"}</td>
                      <td className="py-3 px-4">
                        {item.invoiceNumber ? (
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                            onClick={() => handleTrackingClick(item.invoiceNumber)}
                          >
                            {item.invoiceNumber}
                          </Button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.packingList ? (
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                            onClick={() => handlePackingListView(item)}
                          >
                            보기
                          </Button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.shippingMark ? (
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                            onClick={() => handleShippingMarkView(item)}
                          >
                            보기
                          </Button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4">{item.shoringStatus || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 상태 상세보기 모달 (대기 상태) */}
        <Dialog open={isStatusDetailModalOpen} onOpenChange={setIsStatusDetailModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>상태 상세보기</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left border">차대번호</th>
                      <th className="px-4 py-2 text-left border">모델명</th>
                      <th className="px-4 py-2 text-left border">거래처명</th>
                      <th className="px-4 py-2 text-left border">분류</th>
                      <th className="px-4 py-2 text-left border">POL</th>
                      <th className="px-4 py-2 text-left border">POD</th>
                      <th className="px-4 py-2 text-left border">VIA</th>
                      <th className="px-4 py-2 text-left border">NATION</th>
                      <th className="px-4 py-2 text-left border">DESTINATION</th>
                      <th className="px-4 py-2 text-left border">합계(SOC/KRW)</th>
                      <th className="px-4 py-2 text-left border">합계(COC/KRW)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border">12421fqec</td>
                      <td className="px-4 py-2 border">K5 hybrid</td>
                      <td className="px-4 py-2 border">좋은친구</td>
                      <td className="px-4 py-2 border">중앙아시</td>
                      <td className="px-4 py-2 border">인천</td>
                      <td className="px-4 py-2 border">위해</td>
                      <td className="px-4 py-2 border">서안</td>
                      <td className="px-4 py-2 border">키르키</td>
                      <td className="px-4 py-2 border">Almedin</td>
                      <td className="px-4 py-2 border">10,000,001</td>
                      <td className="px-4 py-2 border">4,000,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>출발일시 *</Label>
                  <div className="flex space-x-2">
                    <Select>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="시" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                            {i.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="분" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 60 }, (_, i) => (
                          <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                            {i.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>송장번호 *</Label>
                  <Input placeholder="송장번호를 입력하세요" />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsStatusDetailModalOpen(false)}>
                  닫기
                </Button>
                <Button>등록</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 변경 히스토리 모달 */}
        <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>상태 변경 히스토리</DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border">번호</th>
                    <th className="px-4 py-2 text-left border">변경상태</th>
                    <th className="px-4 py-2 text-left border">변경일시</th>
                    <th className="px-4 py-2 text-left border">출발일시</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border">5</td>
                    <td className="px-4 py-2 border">확정</td>
                    <td className="px-4 py-2 border">2023.09.12 15:22:33</td>
                    <td className="px-4 py-2 border">2023.09.12 13:20</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">4</td>
                    <td className="px-4 py-2 border">진행</td>
                    <td className="px-4 py-2 border">2023.09.11 14:22:32</td>
                    <td className="px-4 py-2 border">2023.09.12 13:20</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">3</td>
                    <td className="px-4 py-2 border">대기</td>
                    <td className="px-4 py-2 border">2023.09.04 12:22:22</td>
                    <td className="px-4 py-2 border">-</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">2</td>
                    <td className="px-4 py-2 border">진행</td>
                    <td className="px-4 py-2 border">2023.09.02 07:22:31</td>
                    <td className="px-4 py-2 border">2023.09.10 11:20</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">1</td>
                    <td className="px-4 py-2 border">대기</td>
                    <td className="px-4 py-2 border">2023.09.01 04:31:22</td>
                    <td className="px-4 py-2 border">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsHistoryModalOpen(false)}>닫기</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 패킹리스트 모달 */}
        <Dialog open={isPackingListModalOpen} onOpenChange={setIsPackingListModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>패킹리스트 보기</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Tabs defaultValue="roro" className="w-full">
                <TabsList>
                  <TabsTrigger value="roro">로로 형태</TabsTrigger>
                  <TabsTrigger value="container">컨테이너 형태</TabsTrigger>
                </TabsList>

                <TabsContent value="roro" className="space-y-4">
                  <div className="bg-white p-6 border rounded-lg">
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
                      <table className="w-full border">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-xs border">MARKS AND NUMBERS</th>
                            <th className="px-2 py-1 text-xs border">Description of Goods</th>
                            <th className="px-2 py-1 text-xs border">Quantity</th>
                            <th className="px-2 py-1 text-xs border">Unit price</th>
                            <th className="px-2 py-1 text-xs border">Amount</th>
                            <th className="px-2 py-1 text-xs border">WEIGHT</th>
                            <th className="px-2 py-1 text-xs border">CBM</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-2 py-1 text-xs border">S</td>
                            <td className="px-2 py-1 text-xs border">
                              <div>USED CAR</div>
                              <div>SPORTAGE</div>
                              <div>8703.23-9020</div>
                              <div>2020</div>
                              <div>KNAPN813DLK809138</div>
                              <div>DIESEL 1955CC</div>
                            </td>
                            <td className="px-2 py-1 text-xs border">1</td>
                            <td className="px-2 py-1 text-xs border">$ 15,530</td>
                            <td className="px-2 py-1 text-xs border">$ 15,530</td>
                            <td className="px-2 py-1 text-xs border">2,055</td>
                            <td className="px-2 py-1 text-xs border">-</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 text-xs border font-semibold" colSpan="4">
                              SUB TOTAL :
                            </td>
                            <td className="px-2 py-1 text-xs border font-semibold">$ 15,530</td>
                            <td className="px-2 py-1 text-xs border font-semibold">2,055</td>
                            <td className="px-2 py-1 text-xs border">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="container" className="space-y-4">
                  <div className="bg-white p-6 border rounded-lg">
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
                      <table className="w-full border">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-xs border">MARKS AND NUMBERS</th>
                            <th className="px-2 py-1 text-xs border">Description of Goods</th>
                            <th className="px-2 py-1 text-xs border">Quantity</th>
                            <th className="px-2 py-1 text-xs border">Unit price</th>
                            <th className="px-2 py-1 text-xs border">Amount</th>
                            <th className="px-2 py-1 text-xs border">WEIGHT</th>
                            <th className="px-2 py-1 text-xs border">CBM</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-2 py-1 text-xs border">KPHU7140551 / A16119</td>
                            <td className="px-2 py-1 text-xs border">
                              <div>USED CAR</div>
                              <div>KIA SELTOS</div>
                              <div>8703.32-1020</div>
                              <div>2022</div>
                              <div>KNAES812HPK308265</div>
                              <div>GASOLINE 1,598CC</div>
                            </td>
                            <td className="px-2 py-1 text-xs border">1</td>
                            <td className="px-2 py-1 text-xs border">$ 7,350</td>
                            <td className="px-2 py-1 text-xs border">$ 7,350</td>
                            <td className="px-2 py-1 text-xs border">1400</td>
                            <td className="px-2 py-1 text-xs border">-</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 text-xs border font-semibold" colSpan="4">
                              SUB TOTAL :
                            </td>
                            <td className="px-2 py-1 text-xs border font-semibold">$ 7,350</td>
                            <td className="px-2 py-1 text-xs border font-semibold">1,400</td>
                            <td className="px-2 py-1 text-xs border">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPackingListModalOpen(false)}>
                  닫기
                </Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  출력하기
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 쉬핑마크 모달 */}
        <Dialog open={isShippingMarkModalOpen} onOpenChange={setIsShippingMarkModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>쉬핑마크 보기</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-white p-8 border rounded-lg text-center">
                <div className="border-4 border-black p-8 inline-block">
                  <div className="text-2xl font-bold mb-4">SHIPPING MARK</div>
                  <div className="space-y-2 text-lg">
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
                <Button variant="outline" onClick={() => setIsShippingMarkModalOpen(false)}>
                  닫기
                </Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  출력하기
                </Button>
                <Button>
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
