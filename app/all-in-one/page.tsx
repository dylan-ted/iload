"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Car, User, Package, Ship, CheckCircle } from "lucide-react"
import Link from "next/link"

interface AllInOneFormData {
  // 차량 정보
  chassisNumber: string
  vehicleNumber: string
  modelName: string
  year: string
  fuel: string
  vin: string
  // 계약 정보
  buyerName: string
  contractDate: string
  exportCountry: string
  fobPrice: string
  currency: string
  // 수출 조건
  containerType: string
  departureDate: string
  shoringCompany: string
  // 추가 정보
  notes: string
}

export default function AllInOnePage() {
  const [formData, setFormData] = useState<AllInOneFormData>({
    chassisNumber: "",
    vehicleNumber: "",
    modelName: "",
    year: "",
    fuel: "",
    vin: "",
    buyerName: "",
    contractDate: "",
    exportCountry: "",
    fobPrice: "",
    currency: "USD",
    containerType: "",
    departureDate: "",
    shoringCompany: "",
    notes: "",
  })

  const [files, setFiles] = useState({
    registration: null as File | null,
    photos: null as File | null,
    bankAccount: null as File | null,
    logo: null as File | null,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [generatedId, setGeneratedId] = useState<string>("")

  const handleInputChange = (field: keyof AllInOneFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (fileType: keyof typeof files, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFiles((prev) => ({ ...prev, [fileType]: file }))
    }
  }

  const fillDummyData = () => {
    setFormData({
      chassisNumber: "KMHD141GPMA123456",
      vehicleNumber: "12가3456",
      modelName: "현대 소나타",
      year: "2020",
      fuel: "가솔린",
      vin: "KMHD141GPMA123456",
      buyerName: "Ahmed Hassan",
      contractDate: "2024-01-15",
      exportCountry: "이집트",
      fobPrice: "15000",
      currency: "USD",
      containerType: "20ft",
      departureDate: "2024-02-01",
      shoringCompany: "㈜디오로지스",
      notes: "Port Said 항구 도착 예정, 바이어 직접 픽업",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 더미 ID 생성
    const newId = `V${Date.now().toString().slice(-3)}`
    setGeneratedId(newId)

    // observer_dataset.json 형태로 콘솔 출력
    const observerData = {
      id: newId,
      timestamp: new Date().toISOString(),
      vehicle_info: {
        chassis_number: formData.chassisNumber,
        vehicle_number: formData.vehicleNumber,
        model_name: formData.modelName,
        year: Number.parseInt(formData.year),
        fuel: formData.fuel,
        vin: formData.vin,
      },
      contract_info: {
        buyer_name: formData.buyerName,
        contract_date: formData.contractDate,
        export_country: formData.exportCountry,
        fob_price: Number.parseFloat(formData.fobPrice),
        currency: formData.currency,
      },
      export_conditions: {
        container_type: formData.containerType,
        departure_date: formData.departureDate,
        shoring_company: formData.shoringCompany,
      },
      files_uploaded: Object.entries(files)
        .filter(([_, file]) => file !== null)
        .map(([key, _]) => key),
      status: "purchased",
      current_step: 1,
      notes: formData.notes,
    }

    console.log("=== Observer Dataset Generated ===")
    console.log(JSON.stringify(observerData, null, 2))

    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">All-in-One 통합정보 입력</h1>
          <p className="text-slate-600">수출 프로세스 전 과정에 필요한 모든 정보를 한 번에 입력하세요</p>

          <div className="flex justify-center mt-6">
            <Button
              onClick={fillDummyData}
              variant="outline"
              className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              <FileText className="w-4 h-4 mr-2" />
              더미 데이터 자동 입력
            </Button>
          </div>
        </div>

        {isSubmitted ? (
          // 성공 화면
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-800 mb-4">정보 등록 완료!</h2>
              <p className="text-slate-600 mb-6">
                차량 ID: <span className="font-mono font-bold text-blue-600">{generatedId}</span>
                <br />
                observer_dataset.json이 생성되었습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/process-flow/${generatedId}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">프로세스 플로우로 이동</Button>
                </Link>
                <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                  새로운 차량 등록
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 차량 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 mr-2 text-blue-600" />
                  차량 정보
                </CardTitle>
                <CardDescription>수출할 차량의 기본 정보를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="chassisNumber">차대번호 *</Label>
                    <Input
                      id="chassisNumber"
                      value={formData.chassisNumber}
                      onChange={(e) => handleInputChange("chassisNumber", e.target.value)}
                      placeholder="KMHD141GPMA123456"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleNumber">차량번호 *</Label>
                    <Input
                      id="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={(e) => handleInputChange("vehicleNumber", e.target.value)}
                      placeholder="12가3456"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="modelName">모델명 *</Label>
                    <Input
                      id="modelName"
                      value={formData.modelName}
                      onChange={(e) => handleInputChange("modelName", e.target.value)}
                      placeholder="현대 소나타"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">연식 *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange("year", e.target.value)}
                      placeholder="2020"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuel">연료 *</Label>
                    <Select onValueChange={(value) => handleInputChange("fuel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="연료 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="가솔린">가솔린</SelectItem>
                        <SelectItem value="디젤">디젤</SelectItem>
                        <SelectItem value="하이브리드">하이브리드</SelectItem>
                        <SelectItem value="전기">전기</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="vin">VIN 번호</Label>
                  <Input
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => handleInputChange("vin", e.target.value)}
                    placeholder="17자리 VIN 번호"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 계약 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  계약 정보
                </CardTitle>
                <CardDescription>바이어 및 계약 조건을 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buyerName">바이어명 *</Label>
                    <Input
                      id="buyerName"
                      value={formData.buyerName}
                      onChange={(e) => handleInputChange("buyerName", e.target.value)}
                      placeholder="Ahmed Hassan"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contractDate">계약일 *</Label>
                    <Input
                      id="contractDate"
                      type="date"
                      value={formData.contractDate}
                      onChange={(e) => handleInputChange("contractDate", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="exportCountry">수출국 *</Label>
                    <Select onValueChange={(value) => handleInputChange("exportCountry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="수출국 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="이집트">이집트</SelectItem>
                        <SelectItem value="러시아">러시아</SelectItem>
                        <SelectItem value="몽골">몽골</SelectItem>
                        <SelectItem value="우즈베키스탄">우즈베키스탄</SelectItem>
                        <SelectItem value="카자흐스탄">카자흐스탄</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fobPrice">FOB 가격 *</Label>
                    <Input
                      id="fobPrice"
                      type="number"
                      value={formData.fobPrice}
                      onChange={(e) => handleInputChange("fobPrice", e.target.value)}
                      placeholder="15000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">통화 *</Label>
                    <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 수출 조건 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ship className="w-5 h-5 mr-2 text-purple-600" />
                  수출 조건
                </CardTitle>
                <CardDescription>컨테이너 및 배송 조건을 설정하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="containerType">컨테이너 종류 *</Label>
                    <Select onValueChange={(value) => handleInputChange("containerType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="컨테이너 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20ft">20ft 일반</SelectItem>
                        <SelectItem value="40ft">40ft 일반</SelectItem>
                        <SelectItem value="40ft HC">40ft HC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="departureDate">출항예정일 *</Label>
                    <Input
                      id="departureDate"
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => handleInputChange("departureDate", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shoringCompany">쇼링업체</Label>
                    <Select onValueChange={(value) => handleInputChange("shoringCompany", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="쇼링업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="㈜디오로지스">㈜디오로지스</SelectItem>
                        <SelectItem value="인천항만쇼링">인천항만쇼링</SelectItem>
                        <SelectItem value="부산쇼링센터">부산쇼링센터</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 파일 첨부 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-orange-600" />
                  파일 첨부
                </CardTitle>
                <CardDescription>필요한 서류들을 업로드하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">📄 등록증</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileUpload("registration", e)}
                        className="hidden"
                        id="registration"
                      />
                      <label htmlFor="registration" className="cursor-pointer">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">파일 선택</p>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">📸 차량 사진</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload("photos", e)}
                        className="hidden"
                        id="photos"
                      />
                      <label htmlFor="photos" className="cursor-pointer">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">파일 선택</p>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">🏦 통장사본</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileUpload("bankAccount", e)}
                        className="hidden"
                        id="bankAccount"
                      />
                      <label htmlFor="bankAccount" className="cursor-pointer">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">파일 선택</p>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">🏢 인보이스용 로고</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload("logo", e)}
                        className="hidden"
                        id="logo"
                      />
                      <label htmlFor="logo" className="cursor-pointer">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">파일 선택</p>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 추가 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>추가 정보</CardTitle>
                <CardDescription>특별한 요청사항이나 메모를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="특별 요청사항, 배송 주의사항 등을 입력하세요..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* 제출 버튼 */}
            <div className="text-center">
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 px-12 py-4 text-lg">
                <Package className="w-5 h-5 mr-2" />
                통합정보 등록 완료
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
