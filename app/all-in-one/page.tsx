"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Car,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  User,
  Building,
  Truck,
  Ship,
  Download,
  Send,
  X,
  ArrowRight,
  Package,
  Globe,
} from "lucide-react"
import Image from "next/image"

interface VehicleInfo {
  vehicleNumber: string
  modelName: string
  chassisNumber: string
  year: string
  mileage: string
  buyerName: string
  buyerCountry: string
  fobPrice: string
  currency: string
}

interface ProcessStep {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed"
  assignedTo: string
  completedDate?: string
  documents: string[]
}

interface FileUpload {
  name: string
  type: string
  size: string
  uploadDate: string
}

export default function AllInOnePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    vehicleNumber: "",
    modelName: "",
    chassisNumber: "",
    year: "",
    mileage: "",
    buyerName: "",
    buyerCountry: "",
    fobPrice: "",
    currency: "USD",
  })

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    {
      id: "registration",
      title: "차량 등록",
      description: "수출할 차량의 기본 정보를 등록합니다",
      status: "in_progress",
      assignedTo: "수출업체",
      documents: [],
    },
    {
      id: "invoice",
      title: "인보이스 작성",
      description: "수출 인보이스 및 관련 서류를 작성합니다",
      status: "pending",
      assignedTo: "수출업체",
      documents: [],
    },
    {
      id: "cancellation",
      title: "말소 신청",
      description: "차량 말소 신청을 진행합니다",
      status: "pending",
      assignedTo: "수출업체",
      documents: [],
    },
    {
      id: "customs",
      title: "관세 처리",
      description: "관세사가 수출 신고서를 작성하고 승인을 받습니다",
      status: "pending",
      assignedTo: "관세사",
      documents: [],
    },
    {
      id: "shoring",
      title: "쇼링 작업",
      description: "차량을 항구로 운송하고 컨테이너에 적재합니다",
      status: "pending",
      assignedTo: "쇼링업체",
      documents: [],
    },
    {
      id: "shipping",
      title: "선적 처리",
      description: "선박에 적재하고 B/L을 발급합니다",
      status: "pending",
      assignedTo: "선사대리점",
      documents: [],
    },
    {
      id: "delivery",
      title: "배송 완료",
      description: "목적지 도착 및 바이어에게 인도합니다",
      status: "pending",
      assignedTo: "바이어",
      documents: [],
    },
  ])

  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([])
  const [message, setMessage] = useState("")
  const [showSimulation, setShowSimulation] = useState(false)

  const handleVehicleInfoChange = (field: keyof VehicleInfo, value: string) => {
    setVehicleInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (fileType: string) => {
    const newFile: FileUpload = {
      name: `${fileType}_${Date.now()}.pdf`,
      type: fileType,
      size: `${Math.floor(Math.random() * 500 + 100)}KB`,
      uploadDate: new Date().toLocaleDateString("ko-KR"),
    }
    setUploadedFiles((prev) => [...prev, newFile])
    setMessage(`${fileType} 파일이 업로드되었습니다.`)
    setTimeout(() => setMessage(""), 3000)
  }

  const completeCurrentStep = () => {
    setProcessSteps((prev) =>
      prev.map((step, index) => {
        if (index === currentStep) {
          return {
            ...step,
            status: "completed",
            completedDate: new Date().toLocaleDateString("ko-KR"),
            documents: uploadedFiles.map((file) => file.name),
          }
        }
        if (index === currentStep + 1) {
          return { ...step, status: "in_progress" }
        }
        return step
      }),
    )

    if (currentStep < processSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setMessage(`${processSteps[currentStep].title}이(가) 완료되었습니다!`)
    } else {
      setMessage("모든 수출 프로세스가 완료되었습니다! 🎉")
      setShowSimulation(true)
    }
    setTimeout(() => setMessage(""), 3000)
  }

  const resetProcess = () => {
    setCurrentStep(0)
    setProcessSteps((prev) =>
      prev.map((step, index) => ({
        ...step,
        status: index === 0 ? "in_progress" : "pending",
        completedDate: undefined,
        documents: [],
      })),
    )
    setUploadedFiles([])
    setVehicleInfo({
      vehicleNumber: "",
      modelName: "",
      chassisNumber: "",
      year: "",
      mileage: "",
      buyerName: "",
      buyerCountry: "",
      fobPrice: "",
      currency: "USD",
    })
    setShowSimulation(false)
    setMessage("프로세스가 초기화되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const fillDummyData = () => {
    setVehicleInfo({
      vehicleNumber: "12가3456",
      modelName: "현대 소나타 2020",
      chassisNumber: "KMHD141GPMA123456",
      year: "2020",
      mileage: "45000",
      buyerName: "Ahmed Hassan",
      buyerCountry: "UAE",
      fobPrice: "15000",
      currency: "USD",
    })

    const dummyFiles: FileUpload[] = [
      { name: "차량등록증.pdf", type: "등록증", size: "245KB", uploadDate: new Date().toLocaleDateString("ko-KR") },
      { name: "인보이스.pdf", type: "인보이스", size: "189KB", uploadDate: new Date().toLocaleDateString("ko-KR") },
      { name: "말소증명서.pdf", type: "말소증", size: "156KB", uploadDate: new Date().toLocaleDateString("ko-KR") },
    ]
    setUploadedFiles(dummyFiles)
    setMessage("더미 데이터가 입력되었습니다!")
    setTimeout(() => setMessage(""), 3000)
  }

  const getStepIcon = (status: ProcessStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case "in_progress":
        return <Clock className="w-6 h-6 text-blue-400 animate-pulse" />
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
    }
  }

  const getAssigneeIcon = (assignedTo: string) => {
    switch (assignedTo) {
      case "수출업체":
        return <Car className="w-4 h-4" />
      case "관세사":
        return <FileText className="w-4 h-4" />
      case "쇼링업체":
        return <Truck className="w-4 h-4" />
      case "선사대리점":
        return <Ship className="w-4 h-4" />
      case "바이어":
        return <User className="w-4 h-4" />
      default:
        return <Building className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D4AA]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                  <p className="text-sm text-gray-400">All-in-One 수출 프로세스</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={fillDummyData}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <Package className="w-4 h-4 mr-2" />
                더미 데이터
              </Button>
              <Button
                onClick={resetProcess}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                초기화
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

        {/* Process Overview */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#00D4AA]">
              <Globe className="w-5 h-5" />
              <span>수출 프로세스 현황</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              전체 {processSteps.length}단계 중 {processSteps.filter((s) => s.status === "completed").length}단계 완료
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 ${
                    index === currentStep
                      ? "border-[#00D4AA]/50 bg-[#00D4AA]/5"
                      : step.status === "completed"
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-gray-700/50 bg-gray-800/20"
                  }`}
                >
                  <div className="flex-shrink-0">{getStepIcon(step.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white">{step.title}</h3>
                      <div className="flex items-center space-x-2">
                        {getAssigneeIcon(step.assignedTo)}
                        <span className="text-sm text-gray-400">{step.assignedTo}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                    {step.completedDate && <p className="text-green-400 text-xs mt-1">완료일: {step.completedDate}</p>}
                  </div>
                  {step.status === "completed" && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">완료</Badge>
                  )}
                  {index === currentStep && step.status === "in_progress" && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">진행중</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Vehicle Information */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#00D4AA]">
                <Car className="w-5 h-5" />
                <span>차량 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">차량번호</Label>
                  <Input
                    value={vehicleInfo.vehicleNumber}
                    onChange={(e) => handleVehicleInfoChange("vehicleNumber", e.target.value)}
                    placeholder="12가3456"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">모델명</Label>
                  <Input
                    value={vehicleInfo.modelName}
                    onChange={(e) => handleVehicleInfoChange("modelName", e.target.value)}
                    placeholder="현대 소나타 2020"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300">차대번호</Label>
                <Input
                  value={vehicleInfo.chassisNumber}
                  onChange={(e) => handleVehicleInfoChange("chassisNumber", e.target.value)}
                  placeholder="KMHD141GPMA123456"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">연식</Label>
                  <Input
                    value={vehicleInfo.year}
                    onChange={(e) => handleVehicleInfoChange("year", e.target.value)}
                    placeholder="2020"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">주행거리 (km)</Label>
                  <Input
                    value={vehicleInfo.mileage}
                    onChange={(e) => handleVehicleInfoChange("mileage", e.target.value)}
                    placeholder="45000"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div>
                <Label className="text-gray-300">바이어명</Label>
                <Input
                  value={vehicleInfo.buyerName}
                  onChange={(e) => handleVehicleInfoChange("buyerName", e.target.value)}
                  placeholder="Ahmed Hassan"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">수출국</Label>
                  <Select
                    value={vehicleInfo.buyerCountry}
                    onValueChange={(value) => handleVehicleInfoChange("buyerCountry", value)}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                      <SelectValue placeholder="국가 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="UAE" className="text-white hover:bg-gray-700">
                        UAE
                      </SelectItem>
                      <SelectItem value="러시아" className="text-white hover:bg-gray-700">
                        러시아
                      </SelectItem>
                      <SelectItem value="몽골" className="text-white hover:bg-gray-700">
                        몽골
                      </SelectItem>
                      <SelectItem value="우즈베키스탄" className="text-white hover:bg-gray-700">
                        우즈베키스탄
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">FOB 가격</Label>
                  <div className="flex">
                    <Input
                      value={vehicleInfo.fobPrice}
                      onChange={(e) => handleVehicleInfoChange("fobPrice", e.target.value)}
                      placeholder="15000"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-r-none"
                    />
                    <Select
                      value={vehicleInfo.currency}
                      onValueChange={(value) => handleVehicleInfoChange("currency", value)}
                    >
                      <SelectTrigger className="w-20 bg-gray-800/50 border-gray-600 text-white rounded-l-none border-l-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="USD" className="text-white hover:bg-gray-700">
                          USD
                        </SelectItem>
                        <SelectItem value="EUR" className="text-white hover:bg-gray-700">
                          EUR
                        </SelectItem>
                        <SelectItem value="KRW" className="text-white hover:bg-gray-700">
                          KRW
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Management */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-[#00D4AA]">
                <FileText className="w-5 h-5" />
                <span>서류 관리</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleFileUpload("차량등록증")}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  등록증
                </Button>
                <Button
                  onClick={() => handleFileUpload("인보이스")}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  인보이스
                </Button>
                <Button
                  onClick={() => handleFileUpload("말소증명서")}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  말소증
                </Button>
                <Button
                  onClick={() => handleFileUpload("B/L")}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  B/L
                </Button>
              </div>

              <Separator className="bg-gray-700" />

              {/* Uploaded Files */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">업로드된 파일</h4>
                {uploadedFiles.length === 0 ? (
                  <p className="text-gray-400 text-sm">업로드된 파일이 없습니다.</p>
                ) : (
                  uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{file.name}</p>
                          <p className="text-gray-400 text-xs">
                            {file.type} • {file.size} • {file.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Separator className="bg-gray-700" />

              {/* Action Button */}
              <Button
                onClick={completeCurrentStep}
                disabled={currentStep >= processSteps.length - 1 && processSteps[currentStep]?.status === "completed"}
                className="w-full bg-[#00D4AA] hover:bg-[#00B894] text-black"
              >
                {currentStep >= processSteps.length - 1 && processSteps[currentStep]?.status === "completed" ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    모든 단계 완료
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {processSteps[currentStep]?.title} 완료
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Simulation Results */}
        {showSimulation && (
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>시뮬레이션 완료</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <div className="text-center space-y-4">
                  <div className="text-4xl">🎉</div>
                  <h3 className="text-xl font-bold text-white">수출 프로세스 완료!</h3>
                  <p className="text-gray-300">
                    {vehicleInfo.modelName} ({vehicleInfo.vehicleNumber})이(가) {vehicleInfo.buyerCountry}의{" "}
                    {vehicleInfo.buyerName}님에게 성공적으로 수출되었습니다.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#00D4AA]">{processSteps.length}</div>
                      <div className="text-sm text-gray-400">완료된 단계</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{uploadedFiles.length}</div>
                      <div className="text-sm text-gray-400">처리된 서류</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {vehicleInfo.fobPrice} {vehicleInfo.currency}
                      </div>
                      <div className="text-sm text-gray-400">FOB 가격</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">30</div>
                      <div className="text-sm text-gray-400">소요 일수</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
