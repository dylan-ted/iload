"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Car, FileText, CheckCircle, Send, Building, LogOut, Plus, Upload, X, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

interface Vehicle {
  id: string
  vehicleNumber: string
  modelName: string
  buyerName: string
  registrationDate: string
  status: "inventory_registered" | "invoice_created" | "cancellation_completed" | "sent_to_customs"
  chassisNumber?: string
  year?: string
  mileage?: string
  manufacturer?: string
  price?: string
  manager?: string
  damagePoints?: number[]
  uploadedFiles?: { name: string; type: string }[]
}

interface VehicleFormData {
  vehicleName: string
  modelName: string
  mileage: string
  year: string
  manufactureDate: string
  price: string
  manager: string
  chassisNumber: string
  vehicleNumber: string
  notes: string
}

interface InvoiceFormData {
  // 수기 입력 필요 (X 표시)
  shippingMethod: string
  invoiceNumber: string
  agentBusinessNumber: string
  agentName: string
  freightCost: string
  containerNumber: string
  importCode: string
  weight: string

  // 자동 입력 가능 (✓ 표시) - 차량 정보에서 가져옴
  paymentTerms: string
  salesCustomer: string
  loadingPort: string
  exportCountry: string
  paymentTerms2: string
  currency: string
  invoiceLocation: string
  model: string
  year: string
  chassisNo: string
  quantity: string
  price: string
  amount: string
}

export default function ExporterDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "V001",
      vehicleNumber: "12가3456",
      modelName: "현대 소나타",
      buyerName: "Ahmed Hassan",
      registrationDate: "2024-01-10",
      status: "inventory_registered",
      chassisNumber: "KMHD141GPMA123456",
      year: "2020",
      mileage: "45000",
      manufacturer: "현대",
      price: "15000000",
      manager: "김수출",
    },
  ])

  const [selectedCustoms, setSelectedCustoms] = useState("")
  const [message, setMessage] = useState("")
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [selectedVehicleForInvoice, setSelectedVehicleForInvoice] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleName: "",
    modelName: "",
    mileage: "",
    year: "",
    manufactureDate: "",
    price: "",
    manager: "",
    chassisNumber: "",
    vehicleNumber: "",
    notes: "",
  })
  const [invoiceData, setInvoiceData] = useState<InvoiceFormData>({
    shippingMethod: "",
    invoiceNumber: "",
    agentBusinessNumber: "",
    agentName: "",
    freightCost: "",
    containerNumber: "",
    importCode: "",
    weight: "",
    paymentTerms: "T/T",
    salesCustomer: "수출왕",
    loadingPort: "인천항",
    exportCountry: "이집트",
    paymentTerms2: "T/T",
    currency: "USD",
    invoiceLocation: "인천",
    model: "",
    year: "",
    chassisNo: "",
    quantity: "1",
    price: "",
    amount: "",
  })
  const [damagePoints, setDamagePoints] = useState<number[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string }[]>([])

  // useState 추가
  const [showVinLookup, setShowVinLookup] = useState(false)
  const [vinNumber, setVinNumber] = useState("")

  // 말소 신청 관련 state 추가
  const [showCancellationForm, setShowCancellationForm] = useState(false)
  const [selectedVehicleForCancellation, setSelectedVehicleForCancellation] = useState<Vehicle | null>(null)
  const [cancellationData, setCancellationData] = useState({
    // 추가 입력 필요한 정보들
    ownerName: "",
    ownerIdNumber: "",
    address: "",
    email: "",
    phoneNumber: "",
    applicationDate: new Date().toISOString().split("T")[0],
    birthDate: "",
    mileage: "",
    cancellationReason: "",
    attachedDocuments: [] as string[],
  })

  // 더미 데이터베이스 (차대번호별 차량 정보)
  const vehicleDatabase = {
    KMHD141GPMA123456: {
      vehicleName: "현대 소나타",
      modelName: "소나타 2.0 가솔린",
      mileage: "45000",
      year: "2020",
      manufactureDate: "2020-03",
      price: "15000000",
      manager: "김수출",
      vehicleNumber: "12가3456",
      notes: "정기점검 완료, 상태 양호",
    },
    KNDJF3A59H7123789: {
      vehicleName: "기아 스포티지",
      modelName: "스포티지 2.0 디젤",
      mileage: "52000",
      year: "2019",
      manufactureDate: "2019-03",
      price: "18000000",
      manager: "이수출",
      vehicleNumber: "34나5678",
      notes: "정기점검 완료, 타이어 교체 필요",
    },
    KMHGH4LA5EU123456: {
      vehicleName: "현대 그랜저",
      modelName: "그랜저 3.0 가솔린",
      mileage: "38000",
      year: "2021",
      manufactureDate: "2021-05",
      price: "22000000",
      manager: "박수출",
      vehicleNumber: "56다7890",
      notes: "무사고 차량, 풀옵션",
    },
  }

  // 테스트용 선택 옵션들
  const testOptions = {
    shippingMethod: ["로로", "컨테이너", "벌크"],
    agentBusinessNumber: ["1112233333", "2223344444", "3334455555"],
    agentName: ["수출왕", "글로벌트레이드", "월드익스포트"],
    freightCost: ["500", "750", "1000"],
    containerNumber: ["MSKU1234567", "TCLU9876543", "GESU5555555"],
    importCode: ["EG001", "RU002", "MN003"],
    exportCountry: ["이집트", "러시아", "몽골", "우즈베키스탄"],
    loadingPort: ["인천항", "부산항", "평택항"],
    currency: ["USD", "EUR", "KRW"],
  }

  const customsCompanies = [
    { id: "C001", name: "㈜스피드관세법인", contact: "김관세" },
    { id: "C002", name: "인천관세사무소", contact: "이통관" },
    { id: "C003", name: "부산관세센터", contact: "박면장" },
  ]

  const vehicleDamageAreas = [
    { id: 1, name: "앞범퍼", position: { top: "15%", left: "45%" } },
    { id: 2, name: "보닛", position: { top: "25%", left: "45%" } },
    { id: 3, name: "앞유리", position: { top: "35%", left: "45%" } },
    { id: 4, name: "지붕", position: { top: "45%", left: "45%" } },
    { id: 5, name: "뒷유리", position: { top: "55%", left: "45%" } },
    { id: 6, name: "트렁크", position: { top: "65%", left: "45%" } },
    { id: 7, name: "뒷범퍼", position: { top: "75%", left: "45%" } },
  ]

  // 인보이스 작성 시작
  const handleCreateInvoice = (vehicle: Vehicle) => {
    setSelectedVehicleForInvoice(vehicle)

    // 차량 정보로 자동 입력 가능한 필드들 채우기
    setInvoiceData((prev) => ({
      ...prev,
      model: vehicle.modelName || "",
      year: vehicle.year || "",
      chassisNo: vehicle.chassisNumber || "",
      price: vehicle.price || "",
      amount: vehicle.price || "",
    }))

    setShowInvoiceForm(true)
  }

  // handleSaveInvoice 함수를 다음과 같이 수정:
  const handleSaveInvoice = () => {
    if (!selectedVehicleForInvoice) return

    // 필수 필드 체크
    if (!invoiceData.invoiceNumber || !invoiceData.weight) {
      setMessage("인보이스 번호와 중량은 필수 입력 항목입니다.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    // 차량 상태 업데이트
    setVehicles((prev) =>
      prev.map((v) => (v.id === selectedVehicleForInvoice.id ? { ...v, status: "invoice_created" } : v)),
    )

    setShowInvoiceForm(false)
    setSelectedVehicleForInvoice(null)
    setMessage("인보이스가 성공적으로 작성되었습니다. 서류를 다운로드하고 말소 신청을 진행하세요.")
    setTimeout(() => setMessage(""), 5000)
  }

  // 인보이스 다운로드 함수 추가:
  const handleDownloadInvoice = (vehicle: Vehicle) => {
    // Canvas를 사용하여 더미 인보이스 이미지 생성
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // 캔버스 크기 설정 (A4 비율)
    canvas.width = 800
    canvas.height = 1000

    // 배경색 설정
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 제목
    ctx.fillStyle = "#000000"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("CONTAINER INVOICE & PACKING", canvas.width / 2, 40)

    // 회사 정보
    ctx.font = "14px Arial"
    ctx.textAlign = "left"
    ctx.fillText("SELLER: KOREA ONE TRADE CO., LTD", 50, 80)
    ctx.fillText("323, Incheon tower-daero, Yeonsu-gu, Incheon, Republic of Korea", 50, 100)

    // 인보이스 정보
    ctx.textAlign = "right"
    ctx.fillText(`INVOICE NO: ${invoiceData.invoiceNumber}`, canvas.width - 50, 80)
    ctx.fillText(`INVOICE DATE: ${new Date().toISOString().split("T")[0]}`, canvas.width - 50, 100)
    ctx.fillText(`PAYMENT: ${invoiceData.paymentTerms}`, canvas.width - 50, 120)

    // 바이어 정보
    ctx.textAlign = "left"
    ctx.fillText(`BUYER: ${vehicle.buyerName}`, 50, 160)
    ctx.fillText(`EXPORT COUNTRY: ${invoiceData.exportCountry}`, 50, 180)

    // 항구 정보
    ctx.fillText(`Port of loading: ${invoiceData.loadingPort}`, 50, 220)
    ctx.fillText(`Final Destination: ${invoiceData.exportCountry}`, 50, 240)

    // 테이블 헤더
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(50, 280, canvas.width - 100, 30)
    ctx.fillStyle = "#000000"
    ctx.font = "bold 12px Arial"
    ctx.fillText("NO", 60, 300)
    ctx.fillText("MODEL", 120, 300)
    ctx.fillText("Year", 250, 300)
    ctx.fillText("Chassis No.", 320, 300)
    ctx.fillText("Q/T", 480, 300)
    ctx.fillText("Price", 530, 300)
    ctx.fillText("Amount", 600, 300)
    ctx.fillText("WEIGHT", 680, 300)

    // 차량 정보
    ctx.font = "12px Arial"
    ctx.fillText("1", 60, 330)
    ctx.fillText(vehicle.modelName || "", 120, 330)
    ctx.fillText(vehicle.year || "", 250, 330)
    ctx.fillText(vehicle.chassisNumber || "", 320, 330)
    ctx.fillText("1", 480, 330)
    ctx.fillText(`$${Number(vehicle.price).toLocaleString()}`, 530, 330)
    ctx.fillText(`$${Number(vehicle.price).toLocaleString()}`, 600, 330)
    ctx.fillText(`${invoiceData.weight}KG`, 680, 330)

    // 합계
    ctx.font = "bold 14px Arial"
    ctx.fillText(`TOTAL PACKAGE: 1`, 50, 400)
    ctx.fillText(`FOB PRICE: $${Number(vehicle.price).toLocaleString()}`, 50, 430)

    // 추가 정보
    ctx.font = "12px Arial"
    ctx.fillText(`송장장: ${invoiceData.invoiceLocation}`, 50, 480)
    ctx.fillText(`반입코드: ${invoiceData.importCode}`, 50, 500)
    ctx.fillText(`컨테이너 번호: ${invoiceData.containerNumber}`, 50, 520)

    // 이미지를 Blob으로 변환하여 다운로드
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `Invoice_${vehicle.vehicleNumber}_${invoiceData.invoiceNumber}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setMessage("인보이스 서류가 다운로드되었습니다.")
        setTimeout(() => setMessage(""), 3000)
      }
    }, "image/png")
  }

  // 말소 신청 시작 함수 수정
  const handleCancellationRequest = (vehicle: Vehicle) => {
    setSelectedVehicleForCancellation(vehicle)

    // 기존 정보로 자동 채우기
    setCancellationData((prev) => ({
      ...prev,
      mileage: vehicle.mileage || "",
      applicationDate: new Date().toISOString().split("T")[0],
    }))

    setShowCancellationForm(true)
  }

  // 말소 신청 저장 함수 추가
  const handleSaveCancellation = () => {
    if (!selectedVehicleForCancellation) return

    // 필수 필드 체크
    if (!cancellationData.ownerName || !cancellationData.ownerIdNumber || !cancellationData.cancellationReason) {
      setMessage("필수 항목을 모두 입력해주세요.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    // 차량 상태 업데이트
    setVehicles((prev) =>
      prev.map((v) => (v.id === selectedVehicleForCancellation.id ? { ...v, status: "cancellation_completed" } : v)),
    )

    setShowCancellationForm(false)
    setSelectedVehicleForCancellation(null)
    setMessage("말소 신청이 완료되었습니다. 관세사를 선택하여 다음 단계를 진행하세요.")
    setTimeout(() => setMessage(""), 3000)
  }

  // fillDummyData 함수를 handleVinLookup으로 변경
  const handleVinLookup = () => {
    if (!vinNumber.trim()) {
      setMessage("차대번호를 입력해주세요.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    const vehicleInfo = vehicleDatabase[vinNumber as keyof typeof vehicleDatabase]

    if (vehicleInfo) {
      setFormData({
        ...vehicleInfo,
        chassisNumber: vinNumber,
      })
      setShowVinLookup(false)
      setVinNumber("")
      setMessage("차량 정보가 성공적으로 불러와졌습니다!")
      setTimeout(() => setMessage(""), 3000)
    } else {
      setMessage("해당 차대번호의 차량 정보를 찾을 수 없습니다.")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleDummyFileUpload = (fileType: string) => {
    const dummyFiles = {
      registration: { name: "차량등록증.pdf", type: "PDF" },
      inspection: { name: "정기검사증.pdf", type: "PDF" },
      insurance: { name: "보험증서.pdf", type: "PDF" },
      photos: { name: "차량사진_5장.zip", type: "ZIP" },
    }

    const file = dummyFiles[fileType as keyof typeof dummyFiles]
    if (file && !uploadedFiles.find((f) => f.name === file.name)) {
      setUploadedFiles((prev) => [...prev, file])
      setMessage(`${file.name} 파일이 업로드되었습니다.`)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleDamagePointClick = (pointId: number) => {
    setDamagePoints((prev) => (prev.includes(pointId) ? prev.filter((id) => id !== pointId) : [...prev, pointId]))
  }

  const handleFormSubmit = () => {
    if (!formData.vehicleName || !formData.chassisNumber || !formData.vehicleNumber) {
      setMessage("필수 항목을 모두 입력해주세요.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    const newVehicle: Vehicle = {
      id: `V${Date.now().toString().slice(-3)}`,
      vehicleNumber: formData.vehicleNumber,
      modelName: formData.vehicleName,
      buyerName: "미배정",
      registrationDate: new Date().toISOString().split("T")[0],
      status: "inventory_registered",
      chassisNumber: formData.chassisNumber,
      year: formData.year,
      mileage: formData.mileage,
      manufacturer: formData.vehicleName.split(" ")[0],
      price: formData.price,
      manager: formData.manager,
      damagePoints,
      uploadedFiles,
    }

    setVehicles((prev) => [...prev, newVehicle])
    setShowRegistrationForm(false)
    setFormData({
      vehicleName: "",
      modelName: "",
      mileage: "",
      year: "",
      manufactureDate: "",
      price: "",
      manager: "",
      chassisNumber: "",
      vehicleNumber: "",
      notes: "",
    })
    setDamagePoints([])
    setUploadedFiles([])
    setMessage("차량이 성공적으로 등록되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleStatusChange = (vehicleId: string, newStatus: Vehicle["status"]) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v)))

    const statusMessages = {
      invoice_created: "인보이스가 작성되었습니다.",
      cancellation_completed: "말소가 완료되었습니다.",
      sent_to_customs: "관세사에게 전달되었습니다.",
    }

    setMessage(statusMessages[newStatus] || "상태가 변경되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const getStatusBadge = (status: Vehicle["status"]) => {
    const statusConfig = {
      inventory_registered: { label: "재고 등록 완료", color: "bg-blue-100 text-blue-700" },
      invoice_created: { label: "인보이스 작성 완료", color: "bg-yellow-100 text-yellow-700" },
      cancellation_completed: { label: "말소 신청 완료", color: "bg-green-100 text-green-700" },
      sent_to_customs: { label: "관세사 전달", color: "bg-purple-100 text-purple-700" },
    }

    const config = statusConfig[status]
    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  // 인보이스 작성 폼 렌더링
  if (showInvoiceForm && selectedVehicleForInvoice) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">인보이스 서류 등록</h2>
                <p className="text-sm text-gray-600">
                  차량: {selectedVehicleForInvoice.modelName} ({selectedVehicleForInvoice.vehicleNumber})
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowInvoiceForm(false)
                  setSelectedVehicleForInvoice(null)
                }}
              >
                <X className="w-4 h-4 mr-2" />
                닫기
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* 섹션 1: 선적 방식 */}
            <Card>
              <CardHeader className="bg-red-50">
                <CardTitle className="text-lg flex items-center">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    1
                  </span>
                  선적 방식 (수기 입력)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>선적 방식 *</Label>
                    <Select
                      value={invoiceData.shippingMethod}
                      onValueChange={(value) => setInvoiceData((prev) => ({ ...prev, shippingMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {testOptions.shippingMethod.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>인보이스 번호 *</Label>
                    <Input
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="INV-2024-001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 섹션 2: 판매고객 (자동 입력) */}
            <Card>
              <CardHeader className="bg-green-50">
                <CardTitle className="text-lg flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    2
                  </span>
                  판매고객 (자동 입력)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>결제조건</Label>
                    <Input value={invoiceData.paymentTerms} disabled className="bg-gray-50" />
                  </div>
                  <div>
                    <Label>판매고객</Label>
                    <Input value={invoiceData.salesCustomer} disabled className="bg-gray-50" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label>대행 사업자번호 *</Label>
                    <Select
                      value={invoiceData.agentBusinessNumber}
                      onValueChange={(value) => setInvoiceData((prev) => ({ ...prev, agentBusinessNumber: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {testOptions.agentBusinessNumber.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>대행자명 *</Label>
                    <Select
                      value={invoiceData.agentName}
                      onValueChange={(value) => setInvoiceData((prev) => ({ ...prev, agentName: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {testOptions.agentName.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>적재항</Label>
                    <Select
                      value={invoiceData.loadingPort}
                      onValueChange={(value) => setInvoiceData((prev) => ({ ...prev, loadingPort: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {testOptions.loadingPort.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div>
                    <Label>수출국</Label>
                    <Select
                      value={invoiceData.exportCountry}
                      onValueChange={(value) => setInvoiceData((prev) => ({ ...prev, exportCountry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {testOptions.exportCountry.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>결제조건2</Label>
                    <Input value={invoiceData.paymentTerms2} disabled className="bg-gray-50" />
                  </div>
                  <div>
                    <Label>통화단위</Label>
                    <Select
                      value={invoiceData.currency}
                      onValueChange={(value) => setInvoiceData((prev) => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {testOptions.currency.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>송장장</Label>
                    <Input value={invoiceData.invoiceLocation} disabled className="bg-gray-50" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label>운임요금 *</Label>
                    <Select
                      value={invoiceData.freightCost}
                      onValueChange={(value) => setInvoiceData((prev) => ({ ...prev, freightCost: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {testOptions.freightCost.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option} USD
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>컨테이너번호 *</Label>
                    <Select
                      value={invoiceData.containerNumber}
                      onValueChange={(value) => setInvoiceData((prev) => ({ ...prev, containerNumber: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {testOptions.containerNumber.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>반입코드 *</Label>
                    <Select
                      value={invoiceData.importCode}
                      onValueChange={(value) => setInvoiceData((prev) => ({ ...prev, importCode: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {testOptions.importCode.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 섹션 3: 차량 정보 (자동 입력) */}
            <Card>
              <CardHeader className="bg-green-50">
                <CardTitle className="text-lg flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    3
                  </span>
                  차량 정보 (자동 입력)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-6 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-gray-600">MODEL</Label>
                      <div className="font-medium">{invoiceData.model}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Year</Label>
                      <div className="font-medium">{invoiceData.year}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Chassis No.</Label>
                      <div className="font-medium font-mono text-xs">{invoiceData.chassisNo}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Q/T</Label>
                      <div className="font-medium">{invoiceData.quantity}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Price</Label>
                      <div className="font-medium">{Number(invoiceData.price).toLocaleString()}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Amount</Label>
                      <div className="font-medium">{Number(invoiceData.amount).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label>WEIGHT (수기 입력) *</Label>
                  <Input
                    value={invoiceData.weight}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, weight: e.target.value }))}
                    placeholder="1500 (kg)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 저장 버튼 */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowInvoiceForm(false)
                  setSelectedVehicleForInvoice(null)
                }}
              >
                취소
              </Button>
              <Button onClick={handleSaveInvoice} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                인보이스 발행
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 말소 신청 폼 렌더링 추가 (인보이스 폼 렌더링 다음에)
  if (showCancellationForm && selectedVehicleForCancellation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">수출말소 신고 등록</h2>
                <p className="text-sm text-gray-600">
                  차량: {selectedVehicleForCancellation.modelName} ({selectedVehicleForCancellation.vehicleNumber})
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancellationForm(false)
                  setSelectedVehicleForCancellation(null)
                }}
              >
                <X className="w-4 h-4 mr-2" />
                닫기
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* 섹션 1: 신청자 정보 */}
            <Card>
              <CardHeader className="bg-red-50">
                <CardTitle className="text-lg flex items-center">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    1
                  </span>
                  신청자 정보 (추가 입력 필요)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>성명/명칭 (필수)</Label>
                    <Input
                      value={cancellationData.ownerName}
                      onChange={(e) => setCancellationData((prev) => ({ ...prev, ownerName: e.target.value }))}
                      placeholder="김수출"
                    />
                  </div>
                  <div>
                    <Label>주민등록번호/법인등록번호 (필수)</Label>
                    <Input
                      value={cancellationData.ownerIdNumber}
                      onChange={(e) => setCancellationData((prev) => ({ ...prev, ownerIdNumber: e.target.value }))}
                      placeholder="123456-1234567 또는 123-45-67890"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label>주소 (필수)</Label>
                  <Input
                    value={cancellationData.address}
                    onChange={(e) => setCancellationData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="인천광역시 연수구 컨벤시아대로 165"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>전자우편 (필수)</Label>
                    <Input
                      type="email"
                      value={cancellationData.email}
                      onChange={(e) => setCancellationData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="export@company.co.kr"
                    />
                  </div>
                  <div>
                    <Label>휴대전화번호 (필수)</Label>
                    <Input
                      value={cancellationData.phoneNumber}
                      onChange={(e) => setCancellationData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="010-1234-5678"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label>신청일자 (필수)</Label>
                    <Input
                      type="date"
                      value={cancellationData.applicationDate}
                      onChange={(e) => setCancellationData((prev) => ({ ...prev, applicationDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>생년월일 (필수)</Label>
                    <Input
                      type="date"
                      value={cancellationData.birthDate}
                      onChange={(e) => setCancellationData((prev) => ({ ...prev, birthDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>주행거리 (필수)</Label>
                    <Input
                      value={cancellationData.mileage}
                      onChange={(e) => setCancellationData((prev) => ({ ...prev, mileage: e.target.value }))}
                      placeholder="45000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 섹션 2: 기존 차량 정보 (자동 입력) */}
            <Card>
              <CardHeader className="bg-green-50">
                <CardTitle className="text-lg flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    2
                  </span>
                  차량 정보 (자동 입력됨)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-gray-600">자동차 등록번호</Label>
                      <div className="font-medium">{selectedVehicleForCancellation.vehicleNumber}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">차대번호</Label>
                      <div className="font-medium font-mono text-xs">
                        {selectedVehicleForCancellation.chassisNumber}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">모델명</Label>
                      <div className="font-medium">{selectedVehicleForCancellation.modelName}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">연식</Label>
                      <div className="font-medium">{selectedVehicleForCancellation.year}년</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">제조사</Label>
                      <div className="font-medium">{selectedVehicleForCancellation.manufacturer}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">등록일</Label>
                      <div className="font-medium">{selectedVehicleForCancellation.registrationDate}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 섹션 3: 말소등록의 원인 */}
            <Card>
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-lg flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    3
                  </span>
                  말소등록의 원인 (필수)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {[
                    "폐차",
                    "제작·판매자에게 반품",
                    "행정처분이행",
                    "수출 예정",
                    "도난",
                    "화염",
                    "전제지방교통사고심의위원회 등의 사고",
                    "압류등록된 차량으로서 차량 조각",
                    "연구시험 사용 목적",
                    "사고 위인의 구명 등 특수용도 사용 목적",
                    "영 지역에서의 해제",
                    "외교용 또는 SOFA차량으로서 내국민에게 양도",
                    "도로 외의 지역에서의 한정사용 목적",
                    "그 밖의 국토교통부장관이 인정하는 사유",
                    "특별시장·광역시장·도지사 또는 시장·군수·구청장이 멸실 사실을 인정하는 사유",
                  ].map((reason) => (
                    <div key={reason} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={reason}
                        name="cancellationReason"
                        value={reason}
                        checked={cancellationData.cancellationReason === reason}
                        onChange={(e) =>
                          setCancellationData((prev) => ({ ...prev, cancellationReason: e.target.value }))
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <Label htmlFor={reason} className="text-sm cursor-pointer">
                        {reason}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 섹션 4: 서류 첨부 */}
            <Card>
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-lg flex items-center">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    4
                  </span>
                  서류 첨부
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { key: "owner_id", label: "차주 신분증" },
                    { key: "attorney_photo", label: "변호관사진" },
                    { key: "invoice", label: "인보이스" },
                    { key: "requester_id", label: "요청자 신분증" },
                    { key: "business_license", label: "요청자 사업자등록증" },
                  ].map((doc) => (
                    <div key={doc.key} className="text-center">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setCancellationData((prev) => ({
                              ...prev,
                              attachedDocuments: [...prev.attachedDocuments, doc.key],
                            }))
                            setMessage(`${doc.label} 파일이 첨부되었습니다.`)
                            setTimeout(() => setMessage(""), 2000)
                          }}
                          className="w-full h-full flex flex-col items-center space-y-2"
                        >
                          {cancellationData.attachedDocuments.includes(doc.key) ? (
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          ) : (
                            <Upload className="w-8 h-8 text-gray-400" />
                          )}
                          <span className="text-xs">{doc.label}</span>
                          {cancellationData.attachedDocuments.includes(doc.key) && (
                            <span className="text-xs text-green-600">첨부됨</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 저장 버튼 */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button variant="outline" className="bg-gray-100">
                임시저장
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancellationForm(false)
                  setSelectedVehicleForCancellation(null)
                }}
              >
                취소
              </Button>
              <Button onClick={handleSaveCancellation} className="bg-red-600 hover:bg-red-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                말소 신청
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showRegistrationForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setShowRegistrationForm(false)} className="bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  목록으로
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">차량 등록</h1>
                  <p className="text-sm text-gray-600">새로운 차량을 재고에 등록합니다</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowVinLookup(true)}
                  variant="outline"
                  className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  정보 불러오기
                </Button>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  🚗 수출업체 (Exporter)
                </Badge>
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 좌측: 차량 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">차량 기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleName">차량명 *</Label>
                    <Input
                      id="vehicleName"
                      value={formData.vehicleName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, vehicleName: e.target.value }))}
                      placeholder="현대 소나타"
                    />
                  </div>
                  <div>
                    <Label htmlFor="modelName">모델명</Label>
                    <Input
                      id="modelName"
                      value={formData.modelName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, modelName: e.target.value }))}
                      placeholder="소나타 2.0 가솔린"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mileage">주행거리 (km)</Label>
                    <Input
                      id="mileage"
                      value={formData.mileage}
                      onChange={(e) => setFormData((prev) => ({ ...prev, mileage: e.target.value }))}
                      placeholder="45000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">연식</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manufactureDate">제작연월</Label>
                    <Input
                      id="manufactureDate"
                      value={formData.manufactureDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, manufactureDate: e.target.value }))}
                      placeholder="2020-03"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">관매가 (원)</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="15000000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="manager">등록 담당자</Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => setFormData((prev) => ({ ...prev, manager: e.target.value }))}
                    placeholder="김수출"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="chassisNumber">차대번호 *</Label>
                    <Input
                      id="chassisNumber"
                      value={formData.chassisNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, chassisNumber: e.target.value }))}
                      placeholder="KMHD141GPMA123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleNumber">차량번호 *</Label>
                    <Input
                      id="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, vehicleNumber: e.target.value }))}
                      placeholder="12가3456"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 중앙: 차량 손상 체크 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">차량 손상 체크</CardTitle>
                <CardDescription>손상된 부위를 클릭하여 표시하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-50 rounded-lg p-6 h-96">
                  {/* 차량 실루엣 (간단한 직사각형으로 표현) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-32 h-64 bg-gray-300 rounded-lg border-2 border-gray-400">
                      {/* 차량 각 부위 */}
                      {vehicleDamageAreas.map((area) => (
                        <button
                          key={area.id}
                          onClick={() => handleDamagePointClick(area.id)}
                          className={`absolute w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                            damagePoints.includes(area.id)
                              ? "bg-red-500 text-white border-red-600"
                              : "bg-white text-gray-600 border-gray-400 hover:bg-red-100"
                          }`}
                          style={{ top: area.position.top, left: area.position.left }}
                          title={area.name}
                        >
                          {area.id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 범례 */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded p-3 shadow-sm">
                      <h4 className="text-sm font-medium mb-2">손상 부위 ({damagePoints.length}개 선택됨)</h4>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {vehicleDamageAreas.map((area) => (
                          <div
                            key={area.id}
                            className={`flex items-center space-x-1 ${
                              damagePoints.includes(area.id) ? "text-red-600 font-medium" : "text-gray-600"
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full border text-center leading-4 text-xs">{area.id}</span>
                            <span>{area.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 우측: 파일 업로드 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">서류 업로드</CardTitle>
                <CardDescription>필요한 서류들을 업로드하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    onClick={() => handleDummyFileUpload("registration")}
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    차량등록증 업로드
                  </Button>

                  <Button
                    onClick={() => handleDummyFileUpload("inspection")}
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    정기검사증 업로드
                  </Button>

                  <Button
                    onClick={() => handleDummyFileUpload("insurance")}
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    보험증서 업로드
                  </Button>

                  <Button
                    onClick={() => handleDummyFileUpload("photos")}
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    차량사진 업로드
                  </Button>
                </div>

                {/* 업로드된 파일 목록 */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">업로드된 파일</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded border">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {file.type}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 특이사항 */}
                <div className="mt-6">
                  <Label htmlFor="notes">특이사항</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="차량 상태, 수리 이력, 기타 특이사항을 입력하세요..."
                    rows={4}
                  />
                </div>

                {/* 등록 버튼 */}
                <Button onClick={handleFormSubmit} className="w-full bg-red-600 hover:bg-red-700 mt-6" size="lg">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  차량 등록 완료
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* 차대번호 조회 모달 */}
        {showVinLookup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  차량 정보 불러오기
                </CardTitle>
                <CardDescription>차대번호를 입력하면 등록된 차량 정보를 자동으로 불러옵니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vinLookup">차대번호</Label>
                  <Input
                    id="vinLookup"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value)}
                    placeholder="KMHD141GPMA123456"
                    className="font-mono"
                  />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">테스트용 차대번호:</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div
                      className="cursor-pointer hover:text-blue-600 font-mono"
                      onClick={() => setVinNumber("KMHD141GPMA123456")}
                    >
                      • KMHD141GPMA123456 (현대 소나타)
                    </div>
                    <div
                      className="cursor-pointer hover:text-blue-600 font-mono"
                      onClick={() => setVinNumber("KNDJF3A59H7123789")}
                    >
                      • KNDJF3A59H7123789 (기아 스포티지)
                    </div>
                    <div
                      className="cursor-pointer hover:text-blue-600 font-mono"
                      onClick={() => setVinNumber("KMHGH4LA5EU123456")}
                    >
                      • KMHGH4LA5EU123456 (현대 그랜저)
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleVinLookup} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    정보 불러오기
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowVinLookup(false)
                      setVinNumber("")
                    }}
                    className="bg-transparent"
                  >
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Car className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">수출업체 대시보드</h1>
                <p className="text-sm text-gray-600">차량 재고 관리 및 수출 프로세스 관리</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                🚗 수출업체 (Exporter)
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

        {/* 액션 버튼들 */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => setShowRegistrationForm(true)} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            차량 등록
          </Button>
        </div>

        {/* 차량 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-red-600" />
              등록 차량 목록
            </CardTitle>
            <CardDescription>등록된 차량들의 상태를 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>차량정보</TableHead>
                  <TableHead>차대번호</TableHead>
                  <TableHead>연식/주행거리</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-center">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vehicle.modelName}</div>
                        <div className="text-sm text-gray-500">{vehicle.vehicleNumber}</div>
                        {vehicle.manager && <div className="text-xs text-gray-400">담당: {vehicle.manager}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{vehicle.chassisNumber}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{vehicle.year}년</div>
                        <div className="text-gray-500">{vehicle.mileage?.toLocaleString()}km</div>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.registrationDate}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {vehicle.status === "inventory_registered" && (
                          <Button
                            size="sm"
                            onClick={() => handleCreateInvoice(vehicle)}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            인보이스 서류 작성
                          </Button>
                        )}

                        {vehicle.status === "invoice_created" && (
                          <div className="space-y-2">
                            <Button
                              size="sm"
                              onClick={() => handleDownloadInvoice(vehicle)}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              인보이스 다운로드
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleCancellationRequest(vehicle)}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              말소 신청
                            </Button>
                          </div>
                        )}

                        {vehicle.status === "cancellation_completed" && (
                          <div className="space-y-2">
                            <Select value={selectedCustoms} onValueChange={setSelectedCustoms}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="관세사 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                {customsCompanies.map((company) => (
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
                              onClick={() => handleStatusChange(vehicle.id, "sent_to_customs")}
                              disabled={!selectedCustoms}
                              className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              관세사에 전달
                            </Button>
                          </div>
                        )}

                        {vehicle.status === "sent_to_customs" && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            전달완료
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
