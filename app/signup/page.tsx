"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, FileText, ImageIcon, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, TrendingUp, TrendingDown } from "lucide-react"

type UserRole = "buyer" | "customs" | "shoring" | "shipping" | "exporter" | ""

interface FormData {
  role: UserRole
  companyName: string
  ceoName: string
  businessNumber: string
  phone: string
  email: string
  address: string
  // Buyer fields
  country?: string
  destinationPort?: string
  preferredCurrency?: string
  mainVehicleTypes?: string[]
  customsCode?: string
  // Shoring fields
  workingPort?: string
  monthlyContainers?: string
  workingArea?: string
  containerCapacity?: string
  // Customs fields
  uniPassId?: string
  customsOfficeName?: string
  declarationMethod?: string
  customsRegion?: string
  documentFormat?: string
  powerOfAttorney?: boolean
  // Shipping fields
  routeName?: string
  blContactPhone?: string
  containerTypes?: string[]
  shippingLines?: string[]
  // Exporter fields
  businessType?: string
  mainExportCountries?: string[]
  exportExperience?: string
  // Warehouse fields
  warehouseLocation?: string
  storageCapacity?: string
  facilityType?: string
}

interface FileUpload {
  file: File | null
  preview: string
  uploaded: boolean
}

const COUNTRIES = [
  { value: "russia", label: "러시아", ports: ["Vladivostok", "Novorossiysk", "St. Petersburg"] },
  { value: "egypt", label: "이집트", ports: ["Port Said", "Alexandria", "Suez"] },
  { value: "mongolia", label: "몽골", ports: ["Ulaanbaatar", "Zamyn-Uud"] },
  { value: "uzbekistan", label: "우즈베키스탄", ports: ["Tashkent", "Samarkand"] },
  { value: "kazakhstan", label: "카자흐스탄", ports: ["Almaty", "Nur-Sultan"] },
  { value: "georgia", label: "조지아", ports: ["Batumi", "Poti"] },
]

const VEHICLE_TYPES = ["승용차", "SUV", "트럭", "버스", "승합차", "화물차", "특수차량", "이륜차"]

const KOREAN_PORTS = ["인천항", "부산항", "평택항", "울산항", "광양항", "목포항", "군산항", "포항항"]

const CURRENCIES = [
  { code: "USD", name: "미국 달러", rate: 1340.5, change: 2.3 },
  { code: "EUR", name: "유로", rate: 1456.8, change: -1.2 },
  { code: "JPY", name: "일본 엔", rate: 9.12, change: 0.8 },
  { code: "RUB", name: "러시아 루블", rate: 14.25, change: -3.1 },
  { code: "CNY", name: "중국 위안", rate: 184.3, change: 1.5 },
]

const SHIPPING_LINES = [
  "MSC",
  "MAERSK",
  "CMA CGM",
  "COSCO",
  "Evergreen",
  "OOCL",
  "Yang Ming",
  "Hyundai Merchant Marine",
]

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    role: "",
    companyName: "",
    ceoName: "",
    businessNumber: "",
    phone: "",
    email: "",
    address: "",
    containerTypes: [],
  })

  const [files, setFiles] = useState({
    businessLicense: { file: null, preview: "", uploaded: false } as FileUpload,
    bankAccount: { file: null, preview: "", uploaded: false } as FileUpload,
    shoringTemplate: { file: null, preview: "", uploaded: false } as FileUpload,
    exportRecord: { file: null, preview: "", uploaded: false } as FileUpload,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (fileType: keyof typeof files, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFiles((prev) => ({
          ...prev,
          [fileType]: {
            file,
            preview: e.target?.result as string,
            uploaded: true,
          },
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleContainerTypeChange = (type: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      containerTypes: checked
        ? [...(prev.containerTypes || []), type]
        : (prev.containerTypes || []).filter((t) => t !== type),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("=== 회원가입 정보 ===")
    console.log("기본 정보:", formData)
    console.log(
      "업로드된 파일:",
      Object.entries(files).filter(([_, file]) => file.uploaded),
    )
    setIsSubmitted(true)

    // 3초 후 메시지 숨기기
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case "buyer":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-blue-600 flex items-center">🚢 바이어 추가 정보</h3>

            {/* Country and Port Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>수입국 *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      {formData.country
                        ? COUNTRIES.find((c) => c.value === formData.country)?.label
                        : "국가를 선택하세요"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="국가 검색..." />
                      <CommandList>
                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {COUNTRIES.map((country) => (
                            <CommandItem
                              key={country.value}
                              value={country.value}
                              onSelect={() => {
                                handleInputChange("country", country.value)
                                handleInputChange("destinationPort", "")
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${formData.country === country.value ? "opacity-100" : "opacity-0"}`}
                              />
                              {country.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>도착 항구 *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-transparent"
                      disabled={!formData.country}
                    >
                      {formData.destinationPort || "항구를 선택하세요"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="항구 검색..." />
                      <CommandList>
                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {formData.country &&
                            COUNTRIES.find((c) => c.value === formData.country)?.ports.map((port) => (
                              <CommandItem
                                key={port}
                                value={port}
                                onSelect={() => handleInputChange("destinationPort", port)}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${formData.destinationPort === port ? "opacity-100" : "opacity-0"}`}
                                />
                                {port}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Vehicle Types */}
            <div>
              <Label>주요 구매 차종</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {VEHICLE_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vehicle-${type}`}
                      checked={formData.mainVehicleTypes?.includes(type) || false}
                      onCheckedChange={(checked) => {
                        const current = formData.mainVehicleTypes || []
                        const updated = checked ? [...current, type] : current.filter((t) => t !== type)
                        setFormData((prev) => ({ ...prev, mainVehicleTypes: updated }))
                      }}
                    />
                    <Label htmlFor={`vehicle-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency Selection with Live Rates */}
            <div>
              <Label>거래 통화 *</Label>
              <div className="grid gap-3 mt-2">
                {CURRENCIES.map((currency) => (
                  <div
                    key={currency.code}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.preferredCurrency === currency.code
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleInputChange("preferredCurrency", currency.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            formData.preferredCurrency === currency.code
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.preferredCurrency === currency.code && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">{currency.code}</span>
                          <span className="text-sm text-gray-600 ml-2">{currency.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm">₩{currency.rate.toLocaleString()}</div>
                        <div
                          className={`text-xs flex items-center ${
                            currency.change > 0 ? "text-red-600" : "text-blue-600"
                          }`}
                        >
                          {currency.change > 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {Math.abs(currency.change)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customs Code */}
            <div>
              <Label htmlFor="customsCode">세관코드 (선택사항)</Label>
              <Input
                id="customsCode"
                value={formData.customsCode || ""}
                onChange={(e) => handleInputChange("customsCode", e.target.value)}
                placeholder="일부 국가에서 필요한 세관 등록코드"
              />
            </div>
          </div>
        )

      case "customs":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-green-600 flex items-center">🧾 관세사 추가 정보</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="uniPassId">UNI-PASS ID *</Label>
                <Input
                  id="uniPassId"
                  value={formData.uniPassId || ""}
                  onChange={(e) => handleInputChange("uniPassId", e.target.value)}
                  placeholder="UNI-PASS 아이디"
                />
              </div>
              <div>
                <Label htmlFor="customsOfficeName">관세사무소명 *</Label>
                <Input
                  id="customsOfficeName"
                  value={formData.customsOfficeName || ""}
                  onChange={(e) => handleInputChange("customsOfficeName", e.target.value)}
                  placeholder="예: ㈜스피드관세법인"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>담당 지역</Label>
                <Select onValueChange={(value) => handleInputChange("customsRegion", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="관세 담당 지역 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incheon">인천세관</SelectItem>
                    <SelectItem value="busan">부산세관</SelectItem>
                    <SelectItem value="pyeongtaek">평택세관</SelectItem>
                    <SelectItem value="ulsan">울산세관</SelectItem>
                    <SelectItem value="gwangyang">광양세관</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>전자신고 방식 *</Label>
                <Select onValueChange={(value) => handleInputChange("declarationMethod", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="신고 방식 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="API">API 연동</SelectItem>
                    <SelectItem value="manual">수기 입력</SelectItem>
                    <SelectItem value="RPA">RPA 자동화</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>서류 포맷 설정</Label>
              <Select onValueChange={(value) => handleInputChange("documentFormat", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="서류 포맷 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">표준 면장</SelectItem>
                  <SelectItem value="with_photos">면장 + 쇼링사진 포함</SelectItem>
                  <SelectItem value="detailed">상세 품목 명세 포함</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="powerOfAttorney"
                checked={formData.powerOfAttorney || false}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, powerOfAttorney: checked as boolean }))}
              />
              <Label htmlFor="powerOfAttorney">위임장 자동 출력 연동 가능</Label>
            </div>
          </div>
        )

      case "shoring":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-orange-600 flex items-center">🧰 쇼링업체 추가 정보</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>작업 항만 *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      {formData.workingPort || "항만을 선택하세요"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="항만 검색..." />
                      <CommandList>
                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {KOREAN_PORTS.map((port) => (
                            <CommandItem
                              key={port}
                              value={port}
                              onSelect={() => handleInputChange("workingPort", port)}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${formData.workingPort === port ? "opacity-100" : "opacity-0"}`}
                              />
                              {port}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="monthlyContainers">월 평균 컨테이너 처리량 *</Label>
                <Input
                  id="monthlyContainers"
                  type="number"
                  value={formData.monthlyContainers || ""}
                  onChange={(e) => handleInputChange("monthlyContainers", e.target.value)}
                  placeholder="예: 50"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workingArea">작업 지역</Label>
                <Input
                  id="workingArea"
                  value={formData.workingArea || ""}
                  onChange={(e) => handleInputChange("workingArea", e.target.value)}
                  placeholder="예: 인천항 3부두"
                />
              </div>
              <div>
                <Label htmlFor="containerCapacity">컨테이너 보관 능력</Label>
                <Select onValueChange={(value) => handleInputChange("containerCapacity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="보관 능력 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">소규모 (월 10-30개)</SelectItem>
                    <SelectItem value="medium">중규모 (월 30-100개)</SelectItem>
                    <SelectItem value="large">대규모 (월 100개 이상)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case "shipping":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-purple-600 flex items-center">🚚 선사대리점 추가 정보</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="routeName">담당 노선명 *</Label>
                <Input
                  id="routeName"
                  value={formData.routeName || ""}
                  onChange={(e) => handleInputChange("routeName", e.target.value)}
                  placeholder="예: 인천-블라디보스토크"
                />
              </div>
              <div>
                <Label htmlFor="blContactPhone">B/L 담당자 연락처 *</Label>
                <Input
                  id="blContactPhone"
                  value={formData.blContactPhone || ""}
                  onChange={(e) => handleInputChange("blContactPhone", e.target.value)}
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            <div>
              <Label>협력 선사</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {SHIPPING_LINES.map((line) => (
                  <div key={line} className="flex items-center space-x-2">
                    <Checkbox
                      id={`shipping-${line}`}
                      checked={formData.shippingLines?.includes(line) || false}
                      onCheckedChange={(checked) => {
                        const current = formData.shippingLines || []
                        const updated = checked ? [...current, line] : current.filter((l) => l !== line)
                        setFormData((prev) => ({ ...prev, shippingLines: updated }))
                      }}
                    />
                    <Label htmlFor={`shipping-${line}`} className="text-sm">
                      {line}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>컨테이너 지원 종류</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["20ft 일반", "40ft 일반", "40ft HC", "냉동컨테이너", "오픈탑", "플랫랙"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`container-${type}`}
                      checked={formData.containerTypes?.includes(type) || false}
                      onCheckedChange={(checked) => handleContainerTypeChange(type, checked as boolean)}
                    />
                    <Label htmlFor={`container-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "exporter":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-red-600 flex items-center">🚗 수출업체 추가 정보</h3>

            <div>
              <Label>사업자 구분 *</Label>
              <RadioGroup
                value={formData.businessType || ""}
                onValueChange={(value) => handleInputChange("businessType", value)}
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual">개인사업자</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="corporation" id="corporation" />
                  <Label htmlFor="corporation">법인사업자</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>주요 수출국</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {COUNTRIES.map((country) => (
                  <div key={country.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`export-${country.value}`}
                      checked={formData.mainExportCountries?.includes(country.value) || false}
                      onCheckedChange={(checked) => {
                        const current = formData.mainExportCountries || []
                        const updated = checked
                          ? [...current, country.value]
                          : current.filter((c) => c !== country.value)
                        setFormData((prev) => ({ ...prev, mainExportCountries: updated }))
                      }}
                    />
                    <Label htmlFor={`export-${country.value}`} className="text-sm">
                      {country.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>수출 경험</Label>
              <Select onValueChange={(value) => handleInputChange("exportExperience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="수출 경험을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">초보 (1년 미만)</SelectItem>
                  <SelectItem value="intermediate">중급 (1-3년)</SelectItem>
                  <SelectItem value="experienced">숙련 (3-10년)</SelectItem>
                  <SelectItem value="expert">전문가 (10년 이상)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">기업 회원가입</h1>
          <p className="text-slate-600">All-in-One 중고차 수출 플랫폼에 참여하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span>기업 유형 선택</span>
              </CardTitle>
              <CardDescription>귀하의 사업 영역을 선택해주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value: UserRole) => handleInputChange("role", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="기업 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">🌍 바이어 (Buyer)</SelectItem>
                  <SelectItem value="customs">🛡️ 관세사 (Customs Broker)</SelectItem>
                  <SelectItem value="shoring">🚛 쇼링업체 (Shoring Company)</SelectItem>
                  <SelectItem value="shipping">⚓ 선사대리점 (Shipping Agent)</SelectItem>
                  <SelectItem value="exporter">🚗 수출업체 (Exporter)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Common Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span>기본 정보</span>
              </CardTitle>
              <CardDescription>모든 기업 공통 정보를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">회사명 *</Label>
                  <Input
                    id="companyName"
                    required
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="㈜월드익스포트"
                  />
                </div>
                <div>
                  <Label htmlFor="ceoName">대표자 이름 *</Label>
                  <Input
                    id="ceoName"
                    required
                    value={formData.ceoName}
                    onChange={(e) => handleInputChange("ceoName", e.target.value)}
                    placeholder="김영수"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessNumber">사업자 등록번호 *</Label>
                  <Input
                    id="businessNumber"
                    required
                    value={formData.businessNumber}
                    onChange={(e) => handleInputChange("businessNumber", e.target.value)}
                    placeholder="123-45-67890"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">연락처 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="buyer@example.com"
                />
              </div>
              <div>
                <Label htmlFor="address">회사 주소 *</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="인천광역시 연수구 컨벤시아대로 165"
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span>필수 서류 업로드</span>
              </CardTitle>
              <CardDescription>사업자등록증과 통장사본을 업로드해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">📎 사업자등록증</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileUpload("businessLicense", e)}
                      className="hidden"
                      id="businessLicense"
                    />
                    <label htmlFor="businessLicense" className="cursor-pointer">
                      {files.businessLicense.uploaded ? (
                        <div className="space-y-2">
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                          <p className="text-sm text-green-600 font-medium">업로드 완료</p>
                          {files.businessLicense.preview && (
                            <div className="mt-2">
                              {files.businessLicense.file?.type.includes("image") ? (
                                <ImageIcon className="h-6 w-6 mx-auto text-gray-400" />
                              ) : (
                                <FileText className="h-6 w-6 mx-auto text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-600">파일을 선택하세요</p>
                          <p className="text-xs text-gray-400">JPG, PNG, PDF</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">📎 통장사본</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileUpload("bankAccount", e)}
                      className="hidden"
                      id="bankAccount"
                    />
                    <label htmlFor="bankAccount" className="cursor-pointer">
                      {files.bankAccount.uploaded ? (
                        <div className="space-y-2">
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                          <p className="text-sm text-green-600 font-medium">업로드 완료</p>
                          {files.bankAccount.preview && (
                            <div className="mt-2">
                              {files.bankAccount.file?.type.includes("image") ? (
                                <ImageIcon className="h-6 w-6 mx-auto text-gray-400" />
                              ) : (
                                <FileText className="h-6 w-6 mx-auto text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-600">파일을 선택하세요</p>
                          <p className="text-xs text-gray-400">JPG, PNG, PDF</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role-specific fields */}
          {formData.role && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>역할별 추가 정보</span>
                </CardTitle>
                <CardDescription>선택하신 역할에 맞는 추가 정보를 입력해주세요</CardDescription>
              </CardHeader>
              <CardContent>{renderRoleSpecificFields()}</CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white border-t p-4 -mx-4">
            <div className="max-w-4xl mx-auto">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-4"
                disabled={!formData.role || !formData.companyName || !formData.email}
              >
                회원가입 완료하기
              </Button>
            </div>
          </div>
        </form>

        {/* Success Message */}
        {isSubmitted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <CardContent className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">회원가입 완료!</h3>
                <p className="text-slate-600">
                  정보가 성공적으로 저장되었습니다.
                  <br />
                  콘솔에서 입력된 정보를 확인하세요.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
