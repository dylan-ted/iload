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
import { Upload, FileText, ImageIcon, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
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
            <h3 className="text-lg font-semibold text-cyan-400 flex items-center">🚢 바이어 추가 정보</h3>

            {/* Country and Port Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">수입국 *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    >
                      {formData.country
                        ? COUNTRIES.find((c) => c.value === formData.country)?.label
                        : "국가를 선택하세요"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-gray-800 border-gray-600">
                    <Command className="bg-gray-800">
                      <CommandInput placeholder="국가 검색..." className="text-white" />
                      <CommandList>
                        <CommandEmpty className="text-gray-400">검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {COUNTRIES.map((country) => (
                            <CommandItem
                              key={country.value}
                              value={country.value}
                              onSelect={() => {
                                handleInputChange("country", country.value)
                                handleInputChange("destinationPort", "")
                              }}
                              className="text-white hover:bg-gray-700"
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
                <Label className="text-gray-300">도착 항구 *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      disabled={!formData.country}
                    >
                      {formData.destinationPort || "항구를 선택하세요"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-gray-800 border-gray-600">
                    <Command className="bg-gray-800">
                      <CommandInput placeholder="항구 검색..." className="text-white" />
                      <CommandList>
                        <CommandEmpty className="text-gray-400">검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {formData.country &&
                            COUNTRIES.find((c) => c.value === formData.country)?.ports.map((port) => (
                              <CommandItem
                                key={port}
                                value={port}
                                onSelect={() => handleInputChange("destinationPort", port)}
                                className="text-white hover:bg-gray-700"
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
              <Label className="text-gray-300">주요 구매 차종</Label>
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
                      className="border-gray-600"
                    />
                    <Label htmlFor={`vehicle-${type}`} className="text-sm text-gray-300">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency Selection with Live Rates */}
            <div>
              <Label className="text-gray-300">거래 통화 *</Label>
              <div className="grid gap-3 mt-2">
                {CURRENCIES.map((currency) => (
                  <div
                    key={currency.code}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.preferredCurrency === currency.code
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-gray-600 hover:border-gray-500 bg-gray-800/50"
                    }`}
                    onClick={() => handleInputChange("preferredCurrency", currency.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            formData.preferredCurrency === currency.code
                              ? "border-cyan-500 bg-cyan-500"
                              : "border-gray-400"
                          }`}
                        >
                          {formData.preferredCurrency === currency.code && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-white">{currency.code}</span>
                          <span className="text-sm text-gray-400 ml-2">{currency.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm text-white">₩{currency.rate.toLocaleString()}</div>
                        <div
                          className={`text-xs flex items-center ${
                            currency.change > 0 ? "text-red-400" : "text-blue-400"
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
              <Label htmlFor="customsCode" className="text-gray-300">
                세관코드 (선택사항)
              </Label>
              <Input
                id="customsCode"
                value={formData.customsCode || ""}
                onChange={(e) => handleInputChange("customsCode", e.target.value)}
                placeholder="일부 국가에서 필요한 세관 등록코드"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
        )

      case "customs":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-green-400 flex items-center">🧾 관세사 추가 정보</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="uniPassId" className="text-gray-300">
                  UNI-PASS ID *
                </Label>
                <Input
                  id="uniPassId"
                  value={formData.uniPassId || ""}
                  onChange={(e) => handleInputChange("uniPassId", e.target.value)}
                  placeholder="UNI-PASS 아이디"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="customsOfficeName" className="text-gray-300">
                  관세사무소명 *
                </Label>
                <Input
                  id="customsOfficeName"
                  value={formData.customsOfficeName || ""}
                  onChange={(e) => handleInputChange("customsOfficeName", e.target.value)}
                  placeholder="예: ㈜스피드관세법인"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">담당 지역</Label>
                <Select onValueChange={(value) => handleInputChange("customsRegion", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="관세 담당 지역 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="incheon" className="text-white hover:bg-gray-700">
                      인천세관
                    </SelectItem>
                    <SelectItem value="busan" className="text-white hover:bg-gray-700">
                      부산세관
                    </SelectItem>
                    <SelectItem value="pyeongtaek" className="text-white hover:bg-gray-700">
                      평택세관
                    </SelectItem>
                    <SelectItem value="ulsan" className="text-white hover:bg-gray-700">
                      울산세관
                    </SelectItem>
                    <SelectItem value="gwangyang" className="text-white hover:bg-gray-700">
                      광양세관
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">전자신고 방식 *</Label>
                <Select onValueChange={(value) => handleInputChange("declarationMethod", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="신고 방식 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="API" className="text-white hover:bg-gray-700">
                      API 연동
                    </SelectItem>
                    <SelectItem value="manual" className="text-white hover:bg-gray-700">
                      수기 입력
                    </SelectItem>
                    <SelectItem value="RPA" className="text-white hover:bg-gray-700">
                      RPA 자동화
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">서류 포맷 설정</Label>
              <Select onValueChange={(value) => handleInputChange("documentFormat", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="서류 포맷 선택" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="standard" className="text-white hover:bg-gray-700">
                    표준 면장
                  </SelectItem>
                  <SelectItem value="with_photos" className="text-white hover:bg-gray-700">
                    면장 + 쇼링사진 포함
                  </SelectItem>
                  <SelectItem value="detailed" className="text-white hover:bg-gray-700">
                    상세 품목 명세 포함
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="powerOfAttorney"
                checked={formData.powerOfAttorney || false}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, powerOfAttorney: checked as boolean }))}
                className="border-gray-600"
              />
              <Label htmlFor="powerOfAttorney" className="text-gray-300">
                위임장 자동 출력 연동 가능
              </Label>
            </div>
          </div>
        )

      case "shoring":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-orange-400 flex items-center">🧰 쇼링업체 추가 정보</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">작업 항만 *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    >
                      {formData.workingPort || "항만을 선택하세요"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-gray-800 border-gray-600">
                    <Command className="bg-gray-800">
                      <CommandInput placeholder="항만 검색..." className="text-white" />
                      <CommandList>
                        <CommandEmpty className="text-gray-400">검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {KOREAN_PORTS.map((port) => (
                            <CommandItem
                              key={port}
                              value={port}
                              onSelect={() => handleInputChange("workingPort", port)}
                              className="text-white hover:bg-gray-700"
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
                <Label htmlFor="monthlyContainers" className="text-gray-300">
                  월 평균 컨테이너 처리량 *
                </Label>
                <Input
                  id="monthlyContainers"
                  type="number"
                  value={formData.monthlyContainers || ""}
                  onChange={(e) => handleInputChange("monthlyContainers", e.target.value)}
                  placeholder="예: 50"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workingArea" className="text-gray-300">
                  작업 지역
                </Label>
                <Input
                  id="workingArea"
                  value={formData.workingArea || ""}
                  onChange={(e) => handleInputChange("workingArea", e.target.value)}
                  placeholder="예: 인천항 3부두"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label className="text-gray-300">컨테이너 보관 능력</Label>
                <Select onValueChange={(value) => handleInputChange("containerCapacity", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="보관 능력 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="small" className="text-white hover:bg-gray-700">
                      소규모 (월 10-30개)
                    </SelectItem>
                    <SelectItem value="medium" className="text-white hover:bg-gray-700">
                      중규모 (월 30-100개)
                    </SelectItem>
                    <SelectItem value="large" className="text-white hover:bg-gray-700">
                      대규모 (월 100개 이상)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case "shipping":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-purple-400 flex items-center">🚚 선사대리점 추가 정보</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="routeName" className="text-gray-300">
                  담당 노선명 *
                </Label>
                <Input
                  id="routeName"
                  value={formData.routeName || ""}
                  onChange={(e) => handleInputChange("routeName", e.target.value)}
                  placeholder="예: 인천-블라디보스토크"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="blContactPhone" className="text-gray-300">
                  B/L 담당자 연락처 *
                </Label>
                <Input
                  id="blContactPhone"
                  value={formData.blContactPhone || ""}
                  onChange={(e) => handleInputChange("blContactPhone", e.target.value)}
                  placeholder="010-0000-0000"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">협력 선사</Label>
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
                      className="border-gray-600"
                    />
                    <Label htmlFor={`shipping-${line}`} className="text-sm text-gray-300">
                      {line}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-300">컨테이너 지원 종류</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["20ft 일반", "40ft 일반", "40ft HC", "냉동컨테이너", "오픈탑", "플랫랙"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`container-${type}`}
                      checked={formData.containerTypes?.includes(type) || false}
                      onCheckedChange={(checked) => handleContainerTypeChange(type, checked as boolean)}
                      className="border-gray-600"
                    />
                    <Label htmlFor={`container-${type}`} className="text-sm text-gray-300">
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
            <h3 className="text-lg font-semibold text-red-400 flex items-center">🚗 수출업체 추가 정보</h3>

            <div>
              <Label className="text-gray-300">사업자 구분 *</Label>
              <RadioGroup
                value={formData.businessType || ""}
                onValueChange={(value) => handleInputChange("businessType", value)}
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" className="border-gray-600" />
                  <Label htmlFor="individual" className="text-gray-300">
                    개인사업자
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="corporation" id="corporation" className="border-gray-600" />
                  <Label htmlFor="corporation" className="text-gray-300">
                    법인사업자
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-gray-300">주요 수출국</Label>
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
                      className="border-gray-600"
                    />
                    <Label htmlFor={`export-${country.value}`} className="text-sm text-gray-300">
                      {country.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-300">수출 경험</Label>
              <Select onValueChange={(value) => handleInputChange("exportExperience", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="수출 경험을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="beginner" className="text-white hover:bg-gray-700">
                    초보 (1년 미만)
                  </SelectItem>
                  <SelectItem value="intermediate" className="text-white hover:bg-gray-700">
                    중급 (1-3년)
                  </SelectItem>
                  <SelectItem value="experienced" className="text-white hover:bg-gray-700">
                    숙련 (3-10년)
                  </SelectItem>
                  <SelectItem value="expert" className="text-white hover:bg-gray-700">
                    전문가 (10년 이상)
                  </SelectItem>
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Network Animation */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full opacity-10" viewBox="0 0 1920 1080">
          <defs>
            <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#0099cc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#006699" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <g stroke="url(#networkGradient)" strokeWidth="1" fill="none">
            <line x1="100" y1="200" x2="300" y2="150" className="animate-pulse" />
            <line x1="300" y1="150" x2="500" y2="250" className="animate-pulse" style={{ animationDelay: "0.5s" }} />
            <line x1="500" y1="250" x2="700" y2="180" className="animate-pulse" style={{ animationDelay: "1s" }} />
          </g>

          <g fill="#00d4ff">
            <circle cx="100" cy="200" r="2" className="animate-ping" />
            <circle cx="300" cy="150" r="2" className="animate-ping" style={{ animationDelay: "0.5s" }} />
            <circle cx="500" cy="250" r="2" className="animate-ping" style={{ animationDelay: "1s" }} />
          </g>
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5 text-cyan-400" />
            <Image src="/images/logo.png" alt="GlobalCar Logo" width={200} height={50} className="h-8 w-auto" />
          </Link>
        </div>

        <div className="container mx-auto px-4 max-w-4xl pb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">기업 회원가입</h1>
            <p className="text-gray-400">GlobalCar 중고차 수출 플랫폼에 참여하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role Selection */}
            <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>기업 유형 선택</span>
                </CardTitle>
                <CardDescription className="text-gray-400">귀하의 사업 영역을 선택해주세요</CardDescription>
              </CardHeader>
              <CardContent>
                <Select onValueChange={(value: UserRole) => handleInputChange("role", value)}>
                  <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="기업 유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="buyer" className="text-white hover:bg-gray-700">
                      🌍 바이어 (Buyer)
                    </SelectItem>
                    <SelectItem value="customs" className="text-white hover:bg-gray-700">
                      🛡️ 관세사 (Customs Broker)
                    </SelectItem>
                    <SelectItem value="shoring" className="text-white hover:bg-gray-700">
                      🚛 쇼링업체 (Shoring Company)
                    </SelectItem>
                    <SelectItem value="shipping" className="text-white hover:bg-gray-700">
                      ⚓ 선사대리점 (Shipping Agent)
                    </SelectItem>
                    <SelectItem value="exporter" className="text-white hover:bg-gray-700">
                      🚗 수출업체 (Exporter)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Common Information */}
            <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>기본 정보</span>
                </CardTitle>
                <CardDescription className="text-gray-400">모든 기업 공통 정보를 입력해주세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName" className="text-gray-300">
                      회사명 *
                    </Label>
                    <Input
                      id="companyName"
                      required
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      placeholder="㈜월드익스포트"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ceoName" className="text-gray-300">
                      대표자 이름 *
                    </Label>
                    <Input
                      id="ceoName"
                      required
                      value={formData.ceoName}
                      onChange={(e) => handleInputChange("ceoName", e.target.value)}
                      placeholder="김영수"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessNumber" className="text-gray-300">
                      사업자 등록번호 *
                    </Label>
                    <Input
                      id="businessNumber"
                      required
                      value={formData.businessNumber}
                      onChange={(e) => handleInputChange("businessNumber", e.target.value)}
                      placeholder="123-45-67890"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">
                      연락처 *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="010-1234-5678"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300">
                    이메일 *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="buyer@example.com"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-gray-300">
                    회사 주소 *
                  </Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="인천광역시 연수구 컨벤시아대로 165"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>필수 서류 업로드</span>
                </CardTitle>
                <CardDescription className="text-gray-400">사업자등록증과 통장사본을 업로드해주세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block text-gray-300">📎 사업자등록증</Label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors bg-gray-800/50">
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
                            <CheckCircle className="h-8 w-8 text-green-400 mx-auto" />
                            <p className="text-sm text-green-400 font-medium">업로드 완료</p>
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
                            <p className="text-sm text-gray-400">파일을 선택하세요</p>
                            <p className="text-xs text-gray-500">JPG, PNG, PDF</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block text-gray-300">📎 통장사본</Label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors bg-gray-800/50">
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
                            <CheckCircle className="h-8 w-8 text-green-400 mx-auto" />
                            <p className="text-sm text-green-400 font-medium">업로드 완료</p>
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
                            <p className="text-sm text-gray-400">파일을 선택하세요</p>
                            <p className="text-xs text-gray-500">JPG, PNG, PDF</p>
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
              <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      4
                    </span>
                    <span>역할별 추가 정보</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    선택하신 역할에 맞는 추가 정보를 입력해주세요
                  </CardDescription>
                </CardHeader>
                <CardContent>{renderRoleSpecificFields()}</CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="sticky bottom-0 bg-black/90 backdrop-blur-sm border-t border-gray-700 p-4 -mx-4">
              <div className="max-w-4xl mx-auto">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg py-4 font-semibold transition-all duration-300 transform hover:scale-105"
                  disabled={!formData.role || !formData.companyName || !formData.email}
                >
                  회원가입 완료하기
                </Button>
              </div>
            </div>
          </form>

          {/* Success Message */}
          {isSubmitted && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="max-w-md w-full mx-4 bg-gray-900 border-gray-700">
                <CardContent className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">회원가입 완료!</h3>
                  <p className="text-gray-400">
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
    </div>
  )
}
