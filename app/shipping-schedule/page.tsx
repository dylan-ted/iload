"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Package, ExternalLink, Printer, Download } from "lucide-react"

// 더미 데이터
const shippingScheduleData = [
  {
    id: 5,
    registrationDate: "2023.01.09 12:21",
    chassisNumber: "123zzcvxz",
    client: "수출왕",
    schedule: "확인",
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
    client: "수출왕2",
    schedule: "확인",
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
    schedule: "확인",
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
    schedule: "확인",
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
    client: "이중재(계정명)",
    schedule: "확인",
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
  const [dateFilter, setDateFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
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

  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [newRegistration, setNewRegistration] = useState({
    chassisNumber: "",
    departureDate: "",
    departureTime: "",
    invoiceNumber: "",
  })

  const getStatusBadge = (status: string) => {
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

  const handleVehicleSelect = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setNewRegistration({
      ...newRegistration,
      chassisNumber: vehicle.chassisNumber,
    })
    setIsVehicleSearchModalOpen(false)
  }

  const handleRegister = () => {
    console.log("등록:", newRegistration)
    setIsRegisterModalOpen(false)
    setNewRegistration({
      chassisNumber: "",
      departureDate: "",
      departureTime: "",
      invoiceNumber: "",
    })
    setSelectedVehicle(null)
  }

  const handleStatusUpdate = (item: any) => {
    if (item.status === "대기") {
      setSelectedItem(item)
      setIsStatusDetailModalOpen(true)
    } else {
      setSelectedItem(item)
      setIsHistoryModalOpen(true)
    }
  }

  const openTrackingWindow = (invoiceNumber: string) => {
    // SHIPGO 연동 시뮬레이션
    window.open(`https://shipgo.com/tracking/${invoiceNumber}`, "_blank", "width=800,height=600")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* 헤더 */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">선적관리</h1>
                <p className="text-sm text-slate-300">선적 스케쥴 관리</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* 검색 필터 섹션 */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">검색 조건</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 등록일 필터 */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">등록일</Label>
              <RadioGroup value={dateFilter} onValueChange={setDateFilter} className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="date-all" />
                  <Label htmlFor="date-all" className="text-sm">
                    전체
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="date-custom" />
                  <Label htmlFor="date-custom" className="text-sm">
                    설정
                  </Label>
                </div>
              </RadioGroup>
              {dateFilter === "custom" && (
                <div className="flex items-center space-x-3">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                  <span className="text-slate-500">~</span>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" />
                </div>
              )}
            </div>

            {/* 상태 필터 */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">상태</Label>
              <RadioGroup value={statusFilter} onValueChange={setStatusFilter} className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="status-all" />
                  <Label htmlFor="status-all" className="text-sm">
                    전체
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="waiting" id="status-waiting" />
                  <Label htmlFor="status-waiting" className="text-sm">
                    대기
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="progress" id="status-progress" />
                  <Label htmlFor="status-progress" className="text-sm">
                    진행
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="confirmed" id="status-confirmed" />
                  <Label htmlFor="status-confirmed" className="text-sm">
                    확정
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* 검색어 */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">검색어</Label>
              <div className="flex space-x-3">
                <Input
                  placeholder="검색어를 입력해주세요."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4 mr-2" />
                  검색
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 선적 스케쥴 리스트 */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-slate-800">선적 스케쥴 리스트</CardTitle>
            <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  등록
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>선적 스케쥴 등록</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">차대번호 *</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        value={selectedVehicle ? `${selectedVehicle.chassisNumber} (${selectedVehicle.client})` : ""}
                        placeholder="차대번호 검색"
                        readOnly
                        className="flex-1"
                      />
                      <Dialog open={isVehicleSearchModalOpen} onOpenChange={setIsVehicleSearchModalOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Search className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>차대번호 검색</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex space-x-2">
                              <Input placeholder="차대번호를 검색해주세요." className="flex-1" />
                              <Button>검색</Button>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                  <tr>
                                    <th className="p-3 text-left">선택</th>
                                    <th className="p-3 text-left">차대번호</th>
                                    <th className="p-3 text-left">모델명</th>
                                    <th className="p-3 text-left">거래처명</th>
                                    <th className="p-3 text-left">분류</th>
                                    <th className="p-3 text-left">POL</th>
                                    <th className="p-3 text-left">POD</th>
                                    <th className="p-3 text-left">VIA</th>
                                    <th className="p-3 text-left">NATION</th>
                                    <th className="p-3 text-left">DESTINATION</th>
                                    <th className="p-3 text-left">합계(SOC/KRW)</th>
                                    <th className="p-3 text-left">합계(COC/KRW)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {vehicleSearchData.map((vehicle, index) => (
                                    <tr key={index} className="border-t hover:bg-slate-50">
                                      <td className="p-3">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleVehicleSelect(vehicle)}
                                        >
                                          선택
                                        </Button>
                                      </td>
                                      <td className="p-3">{vehicle.chassisNumber}</td>
                                      <td className="p-3">{vehicle.model}</td>
                                      <td className="p-3">{vehicle.client}</td>
                                      <td className="p-3">{vehicle.category}</td>
                                      <td className="p-3">{vehicle.pol}</td>
                                      <td className="p-3">{vehicle.pod}</td>
                                      <td className="p-3">{vehicle.via}</td>
                                      <td className="p-3">{vehicle.nation}</td>
                                      <td className="p-3">{vehicle.destination}</td>
                                      <td className="p-3">{vehicle.socTotal}</td>
                                      <td className="p-3">{vehicle.cocTotal}</td>
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
                  </div>

                  <div>
                    <Label className="text-sm font-medium">출발일시 *</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        type="date"
                        value={newRegistration.departureDate}
                        onChange={(e) => setNewRegistration({ ...newRegistration, departureDate: e.target.value })}
                      />
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
                    <Label className="text-sm font-medium">송장번호 *</Label>
                    <Input
                      value={newRegistration.invoiceNumber}
                      onChange={(e) => setNewRegistration({ ...newRegistration, invoiceNumber: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsRegisterModalOpen(false)}>
                      취소
                    </Button>
                    <Button onClick={handleRegister}>등록</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left">번호</th>
                    <th className="p-3 text-left">등록일시</th>
                    <th className="p-3 text-left">차대번호</th>
                    <th className="p-3 text-left">거래처명</th>
                    <th className="p-3 text-left">선택 스케쥴</th>
                    <th className="p-3 text-left">선사명</th>
                    <th className="p-3 text-left">선적형태</th>
                    <th className="p-3 text-left">상태</th>
                    <th className="p-3 text-left">확정 출발일시</th>
                    <th className="p-3 text-left">송장번호</th>
                    <th className="p-3 text-left">패킹리스트</th>
                    <th className="p-3 text-left">쉬핑마크</th>
                    <th className="p-3 text-left">쇼링여부</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingScheduleData.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-slate-50">
                      <td className="p-3">{item.id}</td>
                      <td className="p-3">{item.registrationDate}</td>
                      <td className="p-3">{item.chassisNumber}</td>
                      <td className="p-3">{item.client}</td>
                      <td className="p-3">
                        <Dialog open={isScheduleDetailModalOpen} onOpenChange={setIsScheduleDetailModalOpen}>
                          <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto text-blue-600">
                              {item.schedule}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>선택 스케쥴 확인</DialogTitle>
                            </DialogHeader>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                  <tr>
                                    <th className="p-2 text-left">차대번호</th>
                                    <th className="p-2 text-left">모델명</th>
                                    <th className="p-2 text-left">거래처명</th>
                                    <th className="p-2 text-left">분류</th>
                                    <th className="p-2 text-left">POL</th>
                                    <th className="p-2 text-left">POD</th>
                                    <th className="p-2 text-left">VIA</th>
                                    <th className="p-2 text-left">NATION</th>
                                    <th className="p-2 text-left">DESTINATION</th>
                                    <th className="p-2 text-left">합계(SOC/KRW)</th>
                                    <th className="p-2 text-left">합계(COC/KRW)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="p-2">12421fqec</td>
                                    <td className="p-2">K5 hybrid</td>
                                    <td className="p-2">좋은친구</td>
                                    <td className="p-2">중앙아시</td>
                                    <td className="p-2">인천</td>
                                    <td className="p-2">위해</td>
                                    <td className="p-2">서안</td>
                                    <td className="p-2">키르키</td>
                                    <td className="p-2">Almedin</td>
                                    <td className="p-2">10,000,001</td>
                                    <td className="p-2">4,000,000</td>
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
                      <td className="p-3">{item.shippingCompany}</td>
                      <td className="p-3">{item.shippingType}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(item)} className="p-0">
                          {getStatusBadge(item.status)}
                        </Button>
                      </td>
                      <td className="p-3">{item.departureDate}</td>
                      <td className="p-3">
                        {item.invoiceNumber && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => openTrackingWindow(item.invoiceNumber)}
                            className="p-0 h-auto text-blue-600"
                          >
                            {item.invoiceNumber}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </td>
                      <td className="p-3">
                        {item.packingList && (
                          <Dialog open={isPackingListModalOpen} onOpenChange={setIsPackingListModalOpen}>
                            <DialogTrigger asChild>
                              <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                                {item.packingList}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>패킹리스트 보기</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="bg-white p-6 border rounded-lg">
                                  <div className="text-center mb-6">
                                    <h2 className="text-xl font-bold">COMMERCIAL INVOICE & PACKING LIST</h2>
                                  </div>
                                  <div className="grid grid-cols-2 gap-6 text-sm">
                                    <div>
                                      <p>
                                        <strong>1) Shipper / Exporter</strong>
                                      </p>
                                      <p>DI GROUP</p>
                                      <p>313, Central-ro, Yeonsu-gu, Incheon, Republic of Korea</p>
                                    </div>
                                    <div>
                                      <p>
                                        <strong>8) No. & date of invoice</strong>
                                      </p>
                                      <p>240123-0220240123</p>
                                    </div>
                                    <div>
                                      <p>
                                        <strong>2) For account & risk of Messers.</strong>
                                      </p>
                                      <p>MILIAEV VIACHESLAV IUREVICH</p>
                                      <p>Pasport36 05 022571</p>
                                      <p>RUSSIA, G. SAMARA, UL. SHESTAIA PROSEKA, D. 147, KV. 27</p>
                                      <p>Tel: +7 951 018-11-18</p>
                                    </div>
                                    <div>
                                      <p>
                                        <strong>9) Terms of Delivery and Payment</strong>
                                      </p>
                                      <p>CFR</p>
                                    </div>
                                  </div>
                                  <div className="mt-6">
                                    <table className="w-full border-collapse border border-gray-300 text-xs">
                                      <thead>
                                        <tr className="bg-gray-50">
                                          <th className="border border-gray-300 p-2">MARKS AND NUMBERS</th>
                                          <th className="border border-gray-300 p-2">Description of Goods</th>
                                          <th className="border border-gray-300 p-2">Quantity</th>
                                          <th className="border border-gray-300 p-2">Unit price</th>
                                          <th className="border border-gray-300 p-2">Amount</th>
                                          <th className="border border-gray-300 p-2">WEIGHT</th>
                                          <th className="border border-gray-300 p-2">CBM</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td className="border border-gray-300 p-2">S</td>
                                          <td className="border border-gray-300 p-2">
                                            USED CAR
                                            <br />
                                            SPORTAGE
                                            <br />
                                            8703.23-9020
                                            <br />
                                            2020KNAPN813DLK809138
                                            <br />
                                            DIESEL 1955CC
                                          </td>
                                          <td className="border border-gray-300 p-2">1</td>
                                          <td className="border border-gray-300 p-2">$ 15,530</td>
                                          <td className="border border-gray-300 p-2">$ 15,530</td>
                                          <td className="border border-gray-300 p-2">2,055</td>
                                          <td className="border border-gray-300 p-2"></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline">
                                    <Printer className="w-4 h-4 mr-2" />
                                    출력하기
                                  </Button>
                                  <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    다운로드
                                  </Button>
                                  <Button onClick={() => setIsPackingListModalOpen(false)}>닫기</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </td>
                      <td className="p-3">
                        {item.shippingMark && (
                          <Dialog open={isShippingMarkModalOpen} onOpenChange={setIsShippingMarkModalOpen}>
                            <DialogTrigger asChild>
                              <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                                {item.shippingMark}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>쉬핑마크 보기</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="bg-white p-6 border rounded-lg min-h-96 flex items-center justify-center">
                                  <div className="text-center text-gray-500">
                                    <Package className="w-16 h-16 mx-auto mb-4" />
                                    <p>쉬핑마크 이미지</p>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline">
                                    <Printer className="w-4 h-4 mr-2" />
                                    출력하기
                                  </Button>
                                  <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    다운로드
                                  </Button>
                                  <Button onClick={() => setIsShippingMarkModalOpen(false)}>닫기</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </td>
                      <td className="p-3">{item.shoringStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 상태 상세보기 모달 (대기 상태) */}
        <Dialog open={isStatusDetailModalOpen} onOpenChange={setIsStatusDetailModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>상태 상세보기</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-2 text-left">차대번호</th>
                        <th className="p-2 text-left">모델명</th>
                        <th className="p-2 text-left">거래처명</th>
                        <th className="p-2 text-left">분류</th>
                        <th className="p-2 text-left">POL</th>
                        <th className="p-2 text-left">POD</th>
                        <th className="p-2 text-left">VIA</th>
                        <th className="p-2 text-left">NATION</th>
                        <th className="p-2 text-left">DESTINATION</th>
                        <th className="p-2 text-left">합계(SOC/KRW)</th>
                        <th className="p-2 text-left">합계(COC/KRW)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2">12421fqec</td>
                        <td className="p-2">K5 hybrid</td>
                        <td className="p-2">좋은친구</td>
                        <td className="p-2">중앙아시</td>
                        <td className="p-2">인천</td>
                        <td className="p-2">위해</td>
                        <td className="p-2">서안</td>
                        <td className="p-2">키르키</td>
                        <td className="p-2">Almedin</td>
                        <td className="p-2">10,000,001</td>
                        <td className="p-2">4,000,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">출발일시 *</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input type="date" />
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
                    <Label className="text-sm font-medium">송장번호 *</Label>
                    <Input className="mt-1" />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsStatusDetailModalOpen(false)}>
                    닫기
                  </Button>
                  <Button>등록</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 변경 히스토리 모달 */}
        <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>상태 상세보기</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left">번호</th>
                    <th className="p-3 text-left">변경상태</th>
                    <th className="p-3 text-left">변경일시</th>
                    <th className="p-3 text-left">출발일시</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">5</td>
                    <td className="p-3">확정</td>
                    <td className="p-3">2023.09.12 15:22:33</td>
                    <td className="p-3">2023.09.12 13:20</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">4</td>
                    <td className="p-3">진행</td>
                    <td className="p-3">2023.09.11 14:22:32</td>
                    <td className="p-3">2023.09.12 13:20</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">3</td>
                    <td className="p-3">대기</td>
                    <td className="p-3">2023.09.04 12:22:22</td>
                    <td className="p-3">-</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">2</td>
                    <td className="p-3">진행</td>
                    <td className="p-3">2023.09.02 07:22:31</td>
                    <td className="p-3">2023.09.10 11:20</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">1</td>
                    <td className="p-3">대기</td>
                    <td className="p-3">2023.09.01 04:31:22</td>
                    <td className="p-3">-</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end">
                <Button onClick={() => setIsHistoryModalOpen(false)}>닫기</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
