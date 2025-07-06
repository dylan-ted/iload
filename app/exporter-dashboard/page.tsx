"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Car,
  Upload,
  FileText,
  Download,
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  Phone,
  Mail,
  DollarSign,
  Eye,
  Bell,
  Star,
} from "lucide-react"
import Image from "next/image"

interface Vehicle {
  id: string
  vin: string
  make: string
  model: string
  year: string
  color: string
  mileage: string
  fobPrice: number
  buyer: string
  buyerCountry: string
  status: "등록완료" | "검수중" | "서류준비" | "관세청승인" | "운송중" | "선적완료" | "배송중" | "완료"
  registrationDate: string
  estimatedDelivery: string
  documents: {
    registration: boolean
    inspection: boolean
    insurance: boolean
    photos: boolean
  }
  damageCheck: {
    exterior: string[]
    interior: string[]
    engine: string[]
    notes: string
  }
  invoiceGenerated: boolean
  customsBroker?: string
}

interface InvoiceData {
  vehicleInfo: {
    make: string
    model: string
    year: string
    vin: string
    color: string
    mileage: string
  }
  pricing: {
    vehiclePrice: number
    inspectionFee: number
    documentFee: number
    shippingFee: number
    insurance: number
    total: number
  }
  buyer: {
    name: string
    company: string
    address: string
    country: string
    phone: string
    email: string
  }
  seller: {
    name: string
    company: string
    address: string
    phone: string
    email: string
  }
}

interface CustomsBroker {
  id: string
  name: string
  company: string
  phone: string
  email: string
  rating: number
  specialties: string[]
  processingTime: string
}

export default function ExporterDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "V001",
      vin: "KMHL14JA5LA123456",
      make: "현대",
      model: "아반떼",
      year: "2020",
      color: "화이트",
      mileage: "45,000",
      fobPrice: 15000,
      buyer: "Ahmed Al-Rashid",
      buyerCountry: "UAE",
      status: "선적완료",
      registrationDate: "2024-01-15",
      estimatedDelivery: "2024-02-15",
      documents: {
        registration: true,
        inspection: true,
        insurance: true,
        photos: true,
      },
      damageCheck: {
        exterior: ["좌측 범퍼 스크래치"],
        interior: ["운전석 시트 약간 마모"],
        engine: [],
        notes: "전반적으로 양호한 상태",
      },
      invoiceGenerated: true,
      customsBroker: "김관세",
    },
    {
      id: "V002",
      vin: "KNDJX3AE8K7123789",
      make: "기아",
      model: "쏘렌토",
      year: "2019",
      color: "블랙",
      mileage: "62,000",
      fobPrice: 22000,
      buyer: "John Smith",
      buyerCountry: "USA",
      status: "관세청승인",
      registrationDate: "2024-01-20",
      estimatedDelivery: "2024-02-20",
      documents: {
        registration: true,
        inspection: true,
        insurance: false,
        photos: true,
      },
      damageCheck: {
        exterior: [],
        interior: [],
        engine: ["엔진오일 교체 필요"],
        notes: "정기 점검 필요",
      },
      invoiceGenerated: false,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [showDamageCheck, setShowDamageCheck] = useState(false)
  const [showCustomsBrokerSelect, setShowCustomsBrokerSelect] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [message, setMessage] = useState("")
  const [notifications, setNotifications] = useState(3)

  // Form states
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    vin: "",
    make: "",
    model: "",
    year: "",
    color: "",
    mileage: "",
    fobPrice: 0,
    buyer: "",
    buyerCountry: "",
    documents: {
      registration: false,
      inspection: false,
      insurance: false,
      photos: false,
    },
    damageCheck: {
      exterior: [],
      interior: [],
      engine: [],
      notes: "",
    },
  })

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    vehicleInfo: {
      make: "",
      model: "",
      year: "",
      vin: "",
      color: "",
      mileage: "",
    },
    pricing: {
      vehiclePrice: 0,
      inspectionFee: 200,
      documentFee: 150,
      shippingFee: 1200,
      insurance: 300,
      total: 0,
    },
    buyer: {
      name: "",
      company: "",
      address: "",
      country: "",
      phone: "",
      email: "",
    },
    seller: {
      name: "GlobalCar Export",
      company: "GlobalCar Co., Ltd.",
      address: "서울시 강남구 테헤란로 123",
      phone: "+82-2-1234-5678",
      email: "export@globalcar.com",
    },
  })

  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const fileInputRefs = {
    registration: useRef<HTMLInputElement>(null),
    inspection: useRef<HTMLInputElement>(null),
    insurance: useRef<HTMLInputElement>(null),
    photos: useRef<HTMLInputElement>(null),
  }

  const customsBrokers: CustomsBroker[] = [
    {
      id: "CB001",
      name: "김관세",
      company: "한국관세법인",
      phone: "+82-2-1111-2222",
      email: "kim@customs.co.kr",
      rating: 4.8,
      specialties: ["자동차", "기계류", "전자제품"],
      processingTime: "2-3일",
    },
    {
      id: "CB002",
      name: "이통관",
      company: "글로벌관세사무소",
      phone: "+82-2-3333-4444",
      email: "lee@globalcustoms.co.kr",
      rating: 4.6,
      specialties: ["자동차", "화학제품", "섬유"],
      processingTime: "3-4일",
    },
    {
      id: "CB003",
      name: "박수출",
      company: "수출전문관세사",
      phone: "+82-2-5555-6666",
      email: "park@exportcustoms.co.kr",
      rating: 4.9,
      specialties: ["자동차", "선박", "항공기"],
      processingTime: "1-2일",
    },
  ]

  // VIN 조회 시뮬레이션
  const handleVinLookup = async (vin: string) => {
    if (!vin || vin.length < 17) {
      setMessage("올바른 VIN을 입력해주세요 (17자리)")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    setMessage("VIN 조회 중...")

    // 시뮬레이션 지연
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 더미 데이터 매칭
    const vinDatabase: { [key: string]: any } = {
      KMHL14JA5LA123456: {
        make: "현대",
        model: "아반떼",
        year: "2020",
        color: "화이트",
        mileage: "45,000",
      },
      KNDJX3AE8K7123789: {
        make: "기아",
        model: "쏘렌토",
        year: "2019",
        color: "블랙",
        mileage: "62,000",
      },
      WVWZZZ1JZ3W123456: {
        make: "폭스바겐",
        model: "골프",
        year: "2021",
        color: "실버",
        mileage: "25,000",
      },
    }

    const vehicleData = vinDatabase[vin]
    if (vehicleData) {
      setNewVehicle((prev) => ({
        ...prev,
        vin,
        ...vehicleData,
      }))
      setMessage("VIN 조회 완료! 차량 정보가 자동으로 입력되었습니다.")
    } else {
      setMessage("해당 VIN의 차량 정보를 찾을 수 없습니다.")
    }

    setTimeout(() => setMessage(""), 3000)
  }

  // 파일 업로드 시뮬레이션
  const handleFileUpload = async (type: keyof typeof fileInputRefs, file: File) => {
    setUploadProgress((prev) => ({ ...prev, [type]: 0 }))

    // 업로드 진행률 시뮬레이션
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setUploadProgress((prev) => ({ ...prev, [type]: i }))
    }

    setNewVehicle((prev) => ({
      ...prev,
      documents: {
        ...prev.documents!,
        [type]: true,
      },
    }))

    setMessage(`${type} 파일이 업로드되었습니다.`)
    setTimeout(() => setMessage(""), 3000)
  }

  // 차량 등록
  const handleVehicleRegistration = () => {
    if (!newVehicle.vin || !newVehicle.make || !newVehicle.model || !newVehicle.buyer) {
      setMessage("필수 정보를 모두 입력해주세요.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    const vehicle: Vehicle = {
      id: `V${String(vehicles.length + 1).padStart(3, "0")}`,
      vin: newVehicle.vin!,
      make: newVehicle.make!,
      model: newVehicle.model!,
      year: newVehicle.year!,
      color: newVehicle.color!,
      mileage: newVehicle.mileage!,
      fobPrice: newVehicle.fobPrice!,
      buyer: newVehicle.buyer!,
      buyerCountry: newVehicle.buyerCountry!,
      status: "등록완료",
      registrationDate: new Date().toISOString().split("T")[0],
      estimatedDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      documents: newVehicle.documents!,
      damageCheck: newVehicle.damageCheck!,
      invoiceGenerated: false,
    }

    setVehicles((prev) => [...prev, vehicle])
    setShowVehicleForm(false)
    setNewVehicle({
      vin: "",
      make: "",
      model: "",
      year: "",
      color: "",
      mileage: "",
      fobPrice: 0,
      buyer: "",
      buyerCountry: "",
      documents: {
        registration: false,
        inspection: false,
        insurance: false,
        photos: false,
      },
      damageCheck: {
        exterior: [],
        interior: [],
        engine: [],
        notes: "",
      },
    })
    setMessage("차량이 성공적으로 등록되었습니다!")
    setTimeout(() => setMessage(""), 3000)
  }

  // 인보이스 생성
  const handleGenerateInvoice = () => {
    if (!selectedVehicle) return

    // 총액 계산
    const total =
      invoiceData.pricing.vehiclePrice +
      invoiceData.pricing.inspectionFee +
      invoiceData.pricing.documentFee +
      invoiceData.pricing.shippingFee +
      invoiceData.pricing.insurance

    const updatedInvoiceData = {
      ...invoiceData,
      pricing: { ...invoiceData.pricing, total },
    }

    // Canvas로 인보이스 생성
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 1000

    // 배경
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 헤더
    ctx.fillStyle = "#000000"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("COMMERCIAL INVOICE", canvas.width / 2, 50)

    // 회사 정보
    ctx.font = "16px Arial"
    ctx.textAlign = "left"
    ctx.fillText("From:", 50, 100)
    ctx.fillText(updatedInvoiceData.seller.company, 50, 120)
    ctx.fillText(updatedInvoiceData.seller.address, 50, 140)
    ctx.fillText(updatedInvoiceData.seller.phone, 50, 160)

    // 바이어 정보
    ctx.fillText("To:", 400, 100)
    ctx.fillText(updatedInvoiceData.buyer.name, 400, 120)
    ctx.fillText(updatedInvoiceData.buyer.company, 400, 140)
    ctx.fillText(updatedInvoiceData.buyer.address, 400, 160)
    ctx.fillText(updatedInvoiceData.buyer.country, 400, 180)

    // 차량 정보
    ctx.fillText("Vehicle Information:", 50, 220)
    ctx.fillText(`${updatedInvoiceData.vehicleInfo.make} ${updatedInvoiceData.vehicleInfo.model}`, 50, 240)
    ctx.fillText(`Year: ${updatedInvoiceData.vehicleInfo.year}`, 50, 260)
    ctx.fillText(`VIN: ${updatedInvoiceData.vehicleInfo.vin}`, 50, 280)
    ctx.fillText(`Color: ${updatedInvoiceData.vehicleInfo.color}`, 50, 300)

    // 가격 정보
    ctx.fillText("Pricing Details:", 50, 340)
    ctx.fillText(`Vehicle Price: $${updatedInvoiceData.pricing.vehiclePrice.toLocaleString()}`, 50, 360)
    ctx.fillText(`Inspection Fee: $${updatedInvoiceData.pricing.inspectionFee.toLocaleString()}`, 50, 380)
    ctx.fillText(`Document Fee: $${updatedInvoiceData.pricing.documentFee.toLocaleString()}`, 50, 400)
    ctx.fillText(`Shipping Fee: $${updatedInvoiceData.pricing.shippingFee.toLocaleString()}`, 50, 420)
    ctx.fillText(`Insurance: $${updatedInvoiceData.pricing.insurance.toLocaleString()}`, 50, 440)

    // 총액
    ctx.font = "bold 18px Arial"
    ctx.fillText(`TOTAL: $${updatedInvoiceData.pricing.total.toLocaleString()}`, 50, 480)

    // 날짜
    ctx.font = "14px Arial"
    ctx.textAlign = "right"
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, canvas.width - 50, 900)

    // 다운로드
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `invoice_${selectedVehicle.id}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        // 차량 상태 업데이트
        setVehicles((prev) => prev.map((v) => (v.id === selectedVehicle.id ? { ...v, invoiceGenerated: true } : v)))

        setMessage("인보이스가 생성되고 다운로드되었습니다!")
        setShowInvoiceForm(false)
        setTimeout(() => setMessage(""), 3000)
      }
    }, "image/png")
  }

  // 관세사 선택
  const handleSelectCustomsBroker = (brokerId: string, vehicleId: string) => {
    const broker = customsBrokers.find((b) => b.id === brokerId)
    if (!broker) return

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              customsBroker: broker.name,
              status: v.status === "서류준비" ? "관세청승인" : v.status,
            }
          : v,
      ),
    )

    setMessage(`${broker.name} 관세사에게 서류가 전달되었습니다.`)
    setShowCustomsBrokerSelect(false)
    setTimeout(() => setMessage(""), 3000)
  }

  // 상태 변경
  const handleStatusChange = (vehicleId: string, newStatus: Vehicle["status"]) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v)))
    setMessage("차량 상태가 업데이트되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  // 필터링된 차량 목록
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // 통계 계산
  const stats = {
    total: vehicles.length,
    completed: vehicles.filter((v) => v.status === "완료").length,
    inProgress: vehicles.filter((v) =>
      ["등록완료", "검수중", "서류준비", "관세청승인", "운송중", "선적완료", "배송중"].includes(v.status),
    ).length,
    totalRevenue: vehicles.reduce((sum, v) => sum + v.fobPrice, 0),
  }

  const getStatusColor = (status: Vehicle["status"]) => {
    switch (status) {
      case "완료":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "배송중":
      case "선적완료":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "운송중":
      case "관세청승인":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "서류준비":
      case "검수중":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "등록완료":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                  <p className="text-sm text-gray-400">수출업체 대시보드</p>
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
              <Button onClick={() => setShowVehicleForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                차량 등록
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">총 차량</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
                </div>
                <Car className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">진행 중</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.inProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">완료</p>
                  <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">총 매출</p>
                  <p className="text-3xl font-bold text-purple-400">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="차량 ID, 제조사, 모델, 바이어, VIN으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="등록완료">등록완료</SelectItem>
                  <SelectItem value="검수중">검수중</SelectItem>
                  <SelectItem value="서류준비">서류준비</SelectItem>
                  <SelectItem value="관세청승인">관세청승인</SelectItem>
                  <SelectItem value="운송중">운송중</SelectItem>
                  <SelectItem value="선적완료">선적완료</SelectItem>
                  <SelectItem value="배송중">배송중</SelectItem>
                  <SelectItem value="완료">완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle List */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-500">
              <Car className="w-5 h-5" />
              <span>차량 관리</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </h3>
                        <p className="text-sm text-gray-400">
                          {vehicle.id} • VIN: {vehicle.vin}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                      <span className="text-lg font-bold text-green-400">${vehicle.fobPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-gray-400 text-sm">바이어</span>
                      <p className="text-white">{vehicle.buyer}</p>
                      <p className="text-gray-400 text-xs">{vehicle.buyerCountry}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">등록일</span>
                      <p className="text-white">{vehicle.registrationDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">예상 인도일</span>
                      <p className="text-white">{vehicle.estimatedDelivery}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">관세사</span>
                      <p className="text-white">{vehicle.customsBroker || "미배정"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedVehicle(vehicle)
                        setShowDamageCheck(true)
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      손상 체크
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedVehicle(vehicle)
                        setInvoiceData((prev) => ({
                          ...prev,
                          vehicleInfo: {
                            make: vehicle.make,
                            model: vehicle.model,
                            year: vehicle.year,
                            vin: vehicle.vin,
                            color: vehicle.color,
                            mileage: vehicle.mileage,
                          },
                          pricing: {
                            ...prev.pricing,
                            vehiclePrice: vehicle.fobPrice,
                          },
                        }))
                        setShowInvoiceForm(true)
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      disabled={vehicle.invoiceGenerated}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      {vehicle.invoiceGenerated ? "인보이스 완료" : "인보이스 생성"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedVehicle(vehicle)
                        setShowCustomsBrokerSelect(true)
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      disabled={!!vehicle.customsBroker}
                    >
                      <Building className="w-3 h-3 mr-1" />
                      {vehicle.customsBroker ? "관세사 배정됨" : "관세사 선택"}
                    </Button>

                    <Select
                      value={vehicle.status}
                      onValueChange={(value) => handleStatusChange(vehicle.id, value as Vehicle["status"])}
                    >
                      <SelectTrigger className="w-32 h-8 bg-gray-700 border-gray-600 text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="등록완료">등록완료</SelectItem>
                        <SelectItem value="검수중">검수중</SelectItem>
                        <SelectItem value="서류준비">서류준비</SelectItem>
                        <SelectItem value="관세청승인">관세청승인</SelectItem>
                        <SelectItem value="운송중">운송중</SelectItem>
                        <SelectItem value="선적완료">선적완료</SelectItem>
                        <SelectItem value="배송중">배송중</SelectItem>
                        <SelectItem value="완료">완료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}

              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <Car className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">검색 조건에 맞는 차량이 없습니다.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Registration Form */}
      <Dialog open={showVehicleForm} onOpenChange={setShowVehicleForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-500">차량 등록</DialogTitle>
            <DialogDescription className="text-gray-400">
              새로운 차량을 등록하고 수출 프로세스를 시작하세요.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="basic" className="data-[state=active]:bg-blue-500">
                기본 정보
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-blue-500">
                서류 업로드
              </TabsTrigger>
              <TabsTrigger value="damage" className="data-[state=active]:bg-blue-500">
                손상 체크
              </TabsTrigger>
              <TabsTrigger value="buyer" className="data-[state=active]:bg-blue-500">
                바이어 정보
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">VIN 조회</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="VIN 번호 입력 (17자리)"
                      value={newVehicle.vin}
                      onChange={(e) => setNewVehicle((prev) => ({ ...prev, vin: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      maxLength={17}
                    />
                    <Button
                      onClick={() => handleVinLookup(newVehicle.vin!)}
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={!newVehicle.vin || newVehicle.vin.length < 17}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      조회
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">차량 정보</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">제조사 *</Label>
                    <Input
                      value={newVehicle.make}
                      onChange={(e) => setNewVehicle((prev) => ({ ...prev, make: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="예: 현대"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">모델 *</Label>
                    <Input
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle((prev) => ({ ...prev, model: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="예: 아반떼"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">연식 *</Label>
                    <Input
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle((prev) => ({ ...prev, year: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="예: 2020"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">색상</Label>
                    <Input
                      value={newVehicle.color}
                      onChange={(e) => setNewVehicle((prev) => ({ ...prev, color: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="예: 화이트"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">주행거리</Label>
                    <Input
                      value={newVehicle.mileage}
                      onChange={(e) => setNewVehicle((prev) => ({ ...prev, mileage: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="예: 45,000"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">FOB 가격 (USD) *</Label>
                    <Input
                      type="number"
                      value={newVehicle.fobPrice}
                      onChange={(e) => setNewVehicle((prev) => ({ ...prev, fobPrice: Number(e.target.value) }))}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="예: 15000"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">필수 서류 업로드</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(fileInputRefs).map(([type, ref]) => (
                    <div key={type} className="space-y-2">
                      <Label className="text-gray-300 capitalize">
                        {type === "registration"
                          ? "차량등록증"
                          : type === "inspection"
                            ? "검사증"
                            : type === "insurance"
                              ? "보험증서"
                              : "차량 사진"}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <input
                          ref={ref}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload(type as keyof typeof fileInputRefs, file)
                            }
                          }}
                          className="hidden"
                        />
                        <Button
                          onClick={() => ref.current?.click()}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          disabled={newVehicle.documents?.[type as keyof typeof newVehicle.documents]}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {newVehicle.documents?.[type as keyof typeof newVehicle.documents]
                            ? "업로드 완료"
                            : "파일 선택"}
                        </Button>
                        {uploadProgress[type] !== undefined && uploadProgress[type] < 100 && (
                          <div className="flex-1">
                            <Progress value={uploadProgress[type]} className="h-2" />
                          </div>
                        )}
                        {newVehicle.documents?.[type as keyof typeof newVehicle.documents] && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="damage" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">차량 손상 체크</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">외관 손상</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["앞범퍼", "뒷범퍼", "좌측면", "우측면", "지붕", "후드"].map((part) => (
                        <label key={part} className="flex items-center space-x-2 text-gray-300">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              const isChecked = e.target.checked
                              setNewVehicle((prev) => ({
                                ...prev,
                                damageCheck: {
                                  ...prev.damageCheck!,
                                  exterior: isChecked
                                    ? [...prev.damageCheck!.exterior, `${part} 손상`]
                                    : prev.damageCheck!.exterior.filter((item) => !item.includes(part)),
                                },
                              }))
                            }}
                            className="rounded"
                          />
                          <span>{part}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">내부 손상</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["운전석", "조수석", "뒷좌석", "대시보드", "스티어링휠", "기어박스"].map((part) => (
                        <label key={part} className="flex items-center space-x-2 text-gray-300">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              const isChecked = e.target.checked
                              setNewVehicle((prev) => ({
                                ...prev,
                                damageCheck: {
                                  ...prev.damageCheck!,
                                  interior: isChecked
                                    ? [...prev.damageCheck!.interior, `${part} 손상`]
                                    : prev.damageCheck!.interior.filter((item) => !item.includes(part)),
                                },
                              }))
                            }}
                            className="rounded"
                          />
                          <span>{part}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">엔진/기계 손상</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["엔진", "변속기", "브레이크", "서스펜션", "배터리", "에어컨"].map((part) => (
                        <label key={part} className="flex items-center space-x-2 text-gray-300">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              const isChecked = e.target.checked
                              setNewVehicle((prev) => ({
                                ...prev,
                                damageCheck: {
                                  ...prev.damageCheck!,
                                  engine: isChecked
                                    ? [...prev.damageCheck!.engine, `${part} 문제`]
                                    : prev.damageCheck!.engine.filter((item) => !item.includes(part)),
                                },
                              }))
                            }}
                            className="rounded"
                          />
                          <span>{part}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">추가 메모</Label>
                    <Textarea
                      value={newVehicle.damageCheck?.notes}
                      onChange={(e) =>
                        setNewVehicle((prev) => ({
                          ...prev,
                          damageCheck: {
                            ...prev.damageCheck!,
                            notes: e.target.value,
                          },
                        }))
                      }
                      placeholder="차량 상태에 대한 추가 설명을 입력하세요..."
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="buyer" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">바이어 정보</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">바이어 이름 *</Label>
                    <Input
                      value={newVehicle.buyer}
                      onChange={(e) => setNewVehicle((prev) => ({ ...prev, buyer: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      placeholder="예: Ahmed Al-Rashid"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">국가 *</Label>
                    <Select
                      value={newVehicle.buyerCountry}
                      onValueChange={(value) => setNewVehicle((prev) => ({ ...prev, buyerCountry: value }))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="국가 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="UAE">UAE</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="Russia">Russia</SelectItem>
                        <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowVehicleForm(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              취소
            </Button>
            <Button onClick={handleVehicleRegistration} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              차량 등록
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Generation Form */}
      <Dialog open={showInvoiceForm} onOpenChange={setShowInvoiceForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-500">인보이스 생성</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedVehicle && `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.id})`}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="vehicle" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="vehicle" className="data-[state=active]:bg-green-500">
                차량 정보
              </TabsTrigger>
              <TabsTrigger value="pricing" className="data-[state=active]:bg-green-500">
                가격 정보
              </TabsTrigger>
              <TabsTrigger value="buyer" className="data-[state=active]:bg-green-500">
                바이어 정보
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-green-500">
                미리보기
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vehicle" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">차량 정보</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">제조사</Label>
                    <Input
                      value={invoiceData.vehicleInfo.make}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          vehicleInfo: { ...prev.vehicleInfo, make: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">모델</Label>
                    <Input
                      value={invoiceData.vehicleInfo.model}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          vehicleInfo: { ...prev.vehicleInfo, model: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">연식</Label>
                    <Input
                      value={invoiceData.vehicleInfo.year}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          vehicleInfo: { ...prev.vehicleInfo, year: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">VIN</Label>
                    <Input
                      value={invoiceData.vehicleInfo.vin}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          vehicleInfo: { ...prev.vehicleInfo, vin: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">색상</Label>
                    <Input
                      value={invoiceData.vehicleInfo.color}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          vehicleInfo: { ...prev.vehicleInfo, color: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">주행거리</Label>
                    <Input
                      value={invoiceData.vehicleInfo.mileage}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          vehicleInfo: { ...prev.vehicleInfo, mileage: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">가격 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">차량 가격 (USD)</Label>
                      <Input
                        type="number"
                        value={invoiceData.pricing.vehiclePrice}
                        onChange={(e) =>
                          setInvoiceData((prev) => ({
                            ...prev,
                            pricing: { ...prev.pricing, vehiclePrice: Number(e.target.value) },
                          }))
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">검수 수수료 (USD)</Label>
                      <Input
                        type="number"
                        value={invoiceData.pricing.inspectionFee}
                        onChange={(e) =>
                          setInvoiceData((prev) => ({
                            ...prev,
                            pricing: { ...prev.pricing, inspectionFee: Number(e.target.value) },
                          }))
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">서류 수수료 (USD)</Label>
                      <Input
                        type="number"
                        value={invoiceData.pricing.documentFee}
                        onChange={(e) =>
                          setInvoiceData((prev) => ({
                            ...prev,
                            pricing: { ...prev.pricing, documentFee: Number(e.target.value) },
                          }))
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">운송비 (USD)</Label>
                      <Input
                        type="number"
                        value={invoiceData.pricing.shippingFee}
                        onChange={(e) =>
                          setInvoiceData((prev) => ({
                            ...prev,
                            pricing: { ...prev.pricing, shippingFee: Number(e.target.value) },
                          }))
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">보험료 (USD)</Label>
                      <Input
                        type="number"
                        value={invoiceData.pricing.insurance}
                        onChange={(e) =>
                          setInvoiceData((prev) => ({
                            ...prev,
                            pricing: { ...prev.pricing, insurance: Number(e.target.value) },
                          }))
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-green-300 font-semibold">총 금액</span>
                      <span className="text-2xl font-bold text-green-400">
                        $
                        {(
                          invoiceData.pricing.vehiclePrice +
                          invoiceData.pricing.inspectionFee +
                          invoiceData.pricing.documentFee +
                          invoiceData.pricing.shippingFee +
                          invoiceData.pricing.insurance
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="buyer" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">바이어 정보</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">이름</Label>
                    <Input
                      value={invoiceData.buyer.name}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          buyer: { ...prev.buyer, name: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="바이어 이름"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">회사명</Label>
                    <Input
                      value={invoiceData.buyer.company}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          buyer: { ...prev.buyer, company: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="회사명"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">주소</Label>
                    <Textarea
                      value={invoiceData.buyer.address}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          buyer: { ...prev.buyer, address: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="주소"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">국가</Label>
                    <Input
                      value={invoiceData.buyer.country}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          buyer: { ...prev.buyer, country: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="국가"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">전화번호</Label>
                    <Input
                      value={invoiceData.buyer.phone}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          buyer: { ...prev.buyer, phone: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="전화번호"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">이메일</Label>
                    <Input
                      value={invoiceData.buyer.email}
                      onChange={(e) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          buyer: { ...prev.buyer, email: e.target.value },
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="이메일"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">인보이스 미리보기</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white text-black p-8 rounded-lg">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold">COMMERCIAL INVOICE</h1>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="font-bold mb-2">From:</h3>
                        <p>{invoiceData.seller.company}</p>
                        <p>{invoiceData.seller.address}</p>
                        <p>{invoiceData.seller.phone}</p>
                        <p>{invoiceData.seller.email}</p>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">To:</h3>
                        <p>{invoiceData.buyer.name}</p>
                        <p>{invoiceData.buyer.company}</p>
                        <p>{invoiceData.buyer.address}</p>
                        <p>{invoiceData.buyer.country}</p>
                        <p>{invoiceData.buyer.phone}</p>
                        <p>{invoiceData.buyer.email}</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="font-bold mb-4">Vehicle Information:</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <p>
                          <strong>Make & Model:</strong> {invoiceData.vehicleInfo.make} {invoiceData.vehicleInfo.model}
                        </p>
                        <p>
                          <strong>Year:</strong> {invoiceData.vehicleInfo.year}
                        </p>
                        <p>
                          <strong>VIN:</strong> {invoiceData.vehicleInfo.vin}
                        </p>
                        <p>
                          <strong>Color:</strong> {invoiceData.vehicleInfo.color}
                        </p>
                        <p>
                          <strong>Mileage:</strong> {invoiceData.vehicleInfo.mileage}
                        </p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="font-bold mb-4">Pricing Details:</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Vehicle Price:</span>
                          <span>${invoiceData.pricing.vehiclePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inspection Fee:</span>
                          <span>${invoiceData.pricing.inspectionFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Document Fee:</span>
                          <span>${invoiceData.pricing.documentFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping Fee:</span>
                          <span>${invoiceData.pricing.shippingFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Insurance:</span>
                          <span>${invoiceData.pricing.insurance.toLocaleString()}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-bold text-lg">
                          <span>TOTAL:</span>
                          <span>
                            $
                            {(
                              invoiceData.pricing.vehiclePrice +
                              invoiceData.pricing.inspectionFee +
                              invoiceData.pricing.documentFee +
                              invoiceData.pricing.shippingFee +
                              invoiceData.pricing.insurance
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-sm">
                      <p>Date: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowInvoiceForm(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              취소
            </Button>
            <Button onClick={handleGenerateInvoice} className="bg-green-500 hover:bg-green-600 text-white">
              <Download className="w-4 h-4 mr-2" />
              인보이스 생성 및 다운로드
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Damage Check Modal */}
      <Dialog open={showDamageCheck} onOpenChange={setShowDamageCheck}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-500">차량 손상 체크</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedVehicle && `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.id})`}
            </DialogDescription>
          </DialogHeader>

          {selectedVehicle && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">외관 손상</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedVehicle.damageCheck.exterior.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedVehicle.damageCheck.exterior.map((damage, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-orange-400" />
                          <span className="text-orange-300">{damage}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      외관 손상 없음
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">내부 손상</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedVehicle.damageCheck.interior.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedVehicle.damageCheck.interior.map((damage, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-orange-400" />
                          <span className="text-orange-300">{damage}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      내부 손상 없음
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">엔진/기계 문제</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedVehicle.damageCheck.engine.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedVehicle.damageCheck.engine.map((issue, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-red-300">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      엔진/기계 문제 없음
                    </p>
                  )}
                </CardContent>
              </Card>

              {selectedVehicle.damageCheck.notes && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">추가 메모</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{selectedVehicle.damageCheck.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowDamageCheck(false)} className="bg-gray-700 hover:bg-gray-600 text-white">
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customs Broker Selection */}
      <Dialog open={showCustomsBrokerSelect} onOpenChange={setShowCustomsBrokerSelect}>
        <DialogContent className="max-w-3xl bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-500">관세사 선택</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedVehicle && `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.id})`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {customsBrokers.map((broker) => (
              <Card key={broker.id} className="bg-gray-800 border-gray-700 hover:bg-gray-800/80 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{broker.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-yellow-400">{broker.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-2">{broker.company}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {broker.phone}
                        </span>
                        <span className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {broker.email}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {broker.processingTime}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {broker.specialties.map((specialty, index) => (
                            <Badge
                              key={index}
                              className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => selectedVehicle && handleSelectCustomsBroker(broker.id, selectedVehicle.id)}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      선택
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCustomsBrokerSelect(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              취소
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
