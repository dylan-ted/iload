"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, FileText, Send, Building, Ship, MapPin, Download, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"
import { dummyVehicles, dummyCompanies, statusSteps, type VehicleData } from "@/lib/dummyData"

export default function ProcessFlowPage({ params }: { params: { id: string } }) {
  const [vehicle, setVehicle] = useState<VehicleData | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [currentStep, setCurrentStep] = useState<number>(1)

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져옴
    const foundVehicle = dummyVehicles.find((v) => v.id === params.id) || dummyVehicles[0]
    setVehicle(foundVehicle)
    setCurrentStep(foundVehicle.currentStep)
  }, [params.id])

  if (!vehicle) {
    return <div>Loading...</div>
  }

  const getCurrentStepInfo = () => {
    return statusSteps.find((step) => step.step === currentStep) || statusSteps[0]
  }

  const getNextStepCompanies = () => {
    switch (currentStep) {
      case 1: // 매입완료 -> 말소완료 (자체 처리)
        return []
      case 2: // 말소완료 -> 면장완료 (관세사 필요)
        return dummyCompanies.filter((c) => c.type === "customs")
      case 3: // 면장완료 -> 쇼링완료 (쇼링업체 필요)
        return dummyCompanies.filter((c) => c.type === "shoring")
      case 4: // 쇼링완료 -> 선적완료 (선사 필요)
        return dummyCompanies.filter((c) => c.type === "shipping")
      default:
        return []
    }
  }

  const handleStepComplete = () => {
    if (currentStep === 1) {
      // 말소 완료 처리 (자체)
      setCurrentStep(2)
      setVehicle((prev) =>
        prev
          ? { ...prev, status: "cancelled", currentStep: 2, documents: { ...prev.documents, cancellation: true } }
          : null,
      )
      setMessage("말소사실증명서가 생성되었습니다. 관세사를 선택하여 면장 처리를 진행하세요.")
    } else if (selectedCompany && currentStep < 6) {
      const company = dummyCompanies.find((c) => c.id === selectedCompany)
      if (company) {
        setMessage(`${company.name}에게 메시지와 서류를 전송했습니다.`)
        setCurrentStep(currentStep + 1)

        // 상태 업데이트
        const newStatus =
          (statusSteps.find((s) => s.step === currentStep + 1)?.key as VehicleData["status"]) || "purchased"
        setVehicle((prev) => (prev ? { ...prev, status: newStatus, currentStep: currentStep + 1 } : null))

        setSelectedCompany("")

        // 3초 후 메시지 클리어
        setTimeout(() => setMessage(""), 3000)
      }
    }
  }

  const generateDocument = (docType: string) => {
    setMessage(`${docType} 문서가 생성되었습니다.`)
    setTimeout(() => setMessage(""), 3000)
  }

  const currentStepInfo = getCurrentStepInfo()
  const nextStepCompanies = getNextStepCompanies()
  const progressPercentage = (currentStep / 6) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/all-in-one" className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block">
            ← All-in-One 입력으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">프로세스 플로우 관리</h1>
          <p className="text-slate-600">
            차량 ID: {vehicle.id} - {vehicle.modelName}
          </p>
        </div>

        {/* 알림 메시지 */}
        {message && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {/* 진행률 표시 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>전체 진행률</span>
              <Badge
                variant="secondary"
                className={`bg-${currentStepInfo.color}-100 text-${currentStepInfo.color}-700`}
              >
                {currentStepInfo.label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              {statusSteps.map((step) => (
                <div
                  key={step.key}
                  className={`flex flex-col items-center ${
                    step.step <= currentStep ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      step.step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {step.step <= currentStep ? <CheckCircle className="w-4 h-4" /> : step.step}
                  </div>
                  <span className="text-xs">{step.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 좌측: 차량 정보 및 현재 단계 */}
          <div className="space-y-6">
            {/* 차량 정보 카드 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  차량 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">차량번호:</span>
                    <div className="font-medium">{vehicle.vehicleNumber}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">모델명:</span>
                    <div className="font-medium">{vehicle.modelName}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">바이어:</span>
                    <div className="font-medium">{vehicle.buyerName}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">수출국:</span>
                    <div className="font-medium">{vehicle.exportCountry}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">FOB 가격:</span>
                    <div className="font-medium">${vehicle.fobPrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">컨테이너:</span>
                    <div className="font-medium">{vehicle.containerType}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 현재 단계 액션 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-600" />
                  현재 단계: {currentStepInfo.label}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "차량 말소 처리를 진행하세요"}
                  {currentStep === 2 && "관세사를 선택하여 면장 처리를 요청하세요"}
                  {currentStep === 3 && "쇼링업체를 선택하여 컨테이너 적재를 요청하세요"}
                  {currentStep === 4 && "선사를 선택하여 선적 처리를 요청하세요"}
                  {currentStep === 5 && "선적이 완료되었습니다. 바이어에게 알림이 전송됩니다."}
                  {currentStep === 6 && "모든 프로세스가 완료되었습니다."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStep === 1 && (
                  <Button onClick={handleStepComplete} className="w-full bg-orange-600 hover:bg-orange-700">
                    <FileText className="w-4 h-4 mr-2" />
                    말소 완료 처리
                  </Button>
                )}

                {nextStepCompanies.length > 0 && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {currentStep === 2 && "관세사 선택"}
                        {currentStep === 3 && "쇼링업체 선택"}
                        {currentStep === 4 && "선사 선택"}
                      </label>
                      <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                        <SelectTrigger>
                          <SelectValue placeholder="업체를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {nextStepCompanies.map((company) => (
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
                    </div>
                    <Button
                      onClick={handleStepComplete}
                      disabled={!selectedCompany}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      업체에 요청 전송
                    </Button>
                  </>
                )}

                {currentStep >= 5 && (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">
                      {currentStep === 5 ? "선적 완료!" : "모든 프로세스 완료!"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 우측: 생성된 문서 및 상태 */}
          <div className="space-y-6">
            {/* 생성된 문서 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  생성된 문서
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm">등록증</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      완료
                    </Badge>
                  </div>

                  {currentStep >= 2 && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-orange-600" />
                        <span className="text-sm">말소사실증명서</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          완료
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => generateDocument("말소증")}>
                          <Download className="w-3 h-3 mr-1" />
                          다운로드
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep >= 3 && (
                    <>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-green-600" />
                          <span className="text-sm">인보이스</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            완료
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => generateDocument("인보이스")}>
                            <Eye className="w-3 h-3 mr-1" />
                            미리보기
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-purple-600" />
                          <span className="text-sm">패킹리스트</span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          완료
                        </Badge>
                      </div>
                    </>
                  )}

                  {currentStep >= 5 && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <Ship className="w-4 h-4 mr-2 text-indigo-600" />
                        <span className="text-sm">B/L (선하증권)</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        완료
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 배송 추적 (선적 완료 후) */}
            {currentStep >= 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                    배송 추적
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">출발지</span>
                      <span className="font-medium">인천항</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">도착지</span>
                      <span className="font-medium">Port Said, 이집트</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">ETA</span>
                      <span className="font-medium text-blue-600">2024-02-15</span>
                    </div>
                    <Progress value={vehicle.progress || 75} className="mt-4" />
                    <p className="text-sm text-center text-gray-600">
                      도착까지 약 {Math.ceil((100 - (vehicle.progress || 75)) / 10)}일 남았습니다
                    </p>
                    <Link href={`/buyer-dashboard/${vehicle.id}`}>
                      <Button variant="outline" className="w-full bg-transparent">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        바이어 대시보드 보기
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
