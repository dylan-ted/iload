"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
  User,
  Calendar,
  BarChart3,
  LogOut,
  Building,
  Send,
} from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Vehicle {
  id: string
  vehicleNumber: string
  vehicleType: string
  buyerName: string
  buyerCountry: string
  cancellationDate: string
  status: "말소완료" | "면장완료" | "대기" | "작성중" | "제출완료"
}

interface DocumentResult {
  vehicleId: string
  documentNumber: string
  productName: string
  exportCondition: string
  issuedDate: string
  status: "요청" | "완료" | "보류" | "실패"
  processedTime?: string
  processor?: string
}

export default function CustomsDashboard() {
  const [vehicles] = useState<Vehicle[]>([
    {
      id: "V001",
      vehicleNumber: "12가3456",
      vehicleType: "현대 소나타",
      buyerName: "Ahmed Hassan",
      buyerCountry: "이집트",
      cancellationDate: "2024-01-15",
      status: "말소완료",
    },
    {
      id: "V002",
      vehicleNumber: "34나5678",
      vehicleType: "기아 스포티지",
      buyerName: "Vladimir Petrov",
      buyerCountry: "러시아",
      cancellationDate: "2024-01-14",
      status: "말소완료",
    },
    {
      id: "V003",
      vehicleNumber: "78라1234",
      vehicleType: "토요타 캠리",
      buyerName: "Rustam Karimov",
      buyerCountry: "우즈베키스탄",
      cancellationDate: "2024-01-12",
      status: "말소완료",
    },
  ])

  const shoringCompanies = [
    { id: "S001", name: "㈜디오로지스", contact: "박쇼링" },
    { id: "S002", name: "인천항만쇼링", contact: "최적재" },
    { id: "S003", name: "부산쇼링센터", contact: "김컨테이너" },
  ]

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [documentResult, setDocumentResult] = useState<DocumentResult | null>(null)
  const [message, setMessage] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedShoring, setSelectedShoring] = useState("")
  const [editingDocument, setEditingDocument] = useState<string | null>(null)
  const [editDocumentData, setEditDocumentData] = useState({
    documentNumber: "",
    productName: "",
    exportCondition: "",
  })

  // 상태별 통계 (더미 데이터)
  const statusStats = {
    processing: 2, // 작성 중
    completed: 5, // 제출 완료
    waiting: 1, // 대기 중
  }

  const handleGenerateDocuments = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsGenerating(true)

    // 문서 생성 시뮬레이션 (2초 후 완료)
    setTimeout(() => {
      const currentTime = new Date().toLocaleString("ko-KR")
      const documentNumber = `DOC${Date.now().toString().slice(-6)}`

      setDocumentResult({
        vehicleId: vehicle.id,
        documentNumber,
        productName: vehicle.vehicleType,
        exportCondition: `FOB ${vehicle.buyerCountry}`,
        issuedDate: currentTime.split(" ")[0],
        status: "완료",
        processedTime: currentTime,
        processor: "customs_id:2",
      })

      setIsGenerating(false)
      setMessage(`${vehicle.vehicleNumber} 차량의 면장이 성공적으로 생성되었습니다.`)
      setTimeout(() => setMessage(""), 3000)
    }, 2000)
  }

  const handleDownloadDocument = () => {
    if (!documentResult) return

    // 더미 다운로드 시뮬레이션
    setMessage("면장 문서가 다운로드되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const changeDocumentStatus = (newStatus: DocumentResult["status"]) => {
    if (!documentResult) return

    const currentTime = new Date().toLocaleString("ko-KR")
    setDocumentResult((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            processedTime: currentTime,
          }
        : null,
    )

    setMessage(`문서 상태가 "${newStatus}"로 변경되었습니다.`)
    setTimeout(() => setMessage(""), 3000)
  }

  const getStatusColor = (status: DocumentResult["status"]) => {
    switch (status) {
      case "요청":
        return "bg-blue-100 text-blue-700"
      case "완료":
        return "bg-green-100 text-green-700"
      case "보류":
        return "bg-yellow-100 text-yellow-700"
      case "실패":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleEditDocument = () => {
    if (!documentResult) return

    setEditDocumentData({
      documentNumber: documentResult.documentNumber,
      productName: documentResult.productName,
      exportCondition: documentResult.exportCondition,
    })
    setEditingDocument(documentResult.vehicleId)
  }

  const handleSaveEdit = () => {
    if (!documentResult) return

    const currentTime = new Date().toLocaleString("ko-KR")
    setDocumentResult((prev) =>
      prev
        ? {
            ...prev,
            documentNumber: editDocumentData.documentNumber,
            productName: editDocumentData.productName,
            exportCondition: editDocumentData.exportCondition,
            processedTime: currentTime,
          }
        : null,
    )

    setEditingDocument(null)
    setMessage("면장 정보가 수정되었습니다.")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleSendToShoring = () => {
    if (!selectedShoring || !documentResult) return

    const shoringCompany = shoringCompanies.find((c) => c.id === selectedShoring)
    if (shoringCompany) {
      setMessage(`${shoringCompany.name}에게 면장 완료 정보가 전달되었습니다.`)
      setSelectedShoring("")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
                ← 홈으로
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">면장 처리 대시보드</h1>
                <p className="text-sm text-gray-600">관세사 전용 업무 관리 시스템</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                🧾 관세사 (Customs Broker)
              </Badge>
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
        {/* 알림 배너 */}
        {message && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {/* Section 1: 수출신고 상태 모니터링 */}
        <Card className="mb-8 rounded-xl shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              수출신고 상태 모니터링
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 작성 중 */}
              <div className="bg-orange-50 rounded-xl p-6 text-center border border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-2">{statusStats.processing}</div>
                <div className="text-sm text-orange-700 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  작성 중
                </div>
              </div>

              {/* 제출 완료 */}
              <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">{statusStats.completed}</div>
                <div className="text-sm text-green-700 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  제출 완료
                </div>
              </div>

              {/* 대기 중 */}
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                <div className="text-3xl font-bold text-gray-600 mb-2">{statusStats.waiting}</div>
                <div className="text-sm text-gray-700 flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-1" />
                  대기 중
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 메인 콘텐츠 - 2열 그리드 */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Section 2: 말소 완료 차량 목록 */}
          <Card className="rounded-xl shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <FileCheck className="w-5 h-5 mr-2 text-blue-600" />
                말소 완료 차량 목록
              </CardTitle>
              <CardDescription>면장 처리가 필요한 차량들입니다 ({vehicles.length}건)</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">차량번호</TableHead>
                      <TableHead className="text-base">차량</TableHead>
                      <TableHead className="text-base">바이어명</TableHead>
                      <TableHead className="text-base">말소일자</TableHead>
                      <TableHead className="text-base text-center">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-base">{vehicle.vehicleNumber}</TableCell>
                        <TableCell className="text-base">
                          <div>
                            <div className="font-medium">{vehicle.vehicleType}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-base">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div>{vehicle.buyerName}</div>
                              <div className="text-xs text-gray-500">({vehicle.buyerCountry})</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-base">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {vehicle.cancellationDate}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={() => handleGenerateDocuments(vehicle)}
                            disabled={isGenerating && selectedVehicle?.id === vehicle.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {isGenerating && selectedVehicle?.id === vehicle.id ? (
                              <>
                                <Clock className="w-4 h-4 mr-1 animate-spin" />
                                생성 중...
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 mr-1" />
                                문서 자동 생성
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: 문서 자동 생성 결과 */}
          <Card className="rounded-xl shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                문서 자동 생성 결과
              </CardTitle>
              <CardDescription>
                {selectedVehicle
                  ? `${selectedVehicle.vehicleNumber} 차량의 문서 생성 결과`
                  : "차량을 선택하여 문서를 생성하세요"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {!selectedVehicle ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base">
                    좌측에서 차량을 선택하고
                    <br />
                    문서 자동 생성 버튼을 클릭하세요
                  </p>
                </div>
              ) : isGenerating ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-base text-gray-600">문서를 생성하고 있습니다...</p>
                </div>
              ) : documentResult ? (
                <div className="space-y-6">
                  {/* 선택된 차량 정보 */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-base mb-2">선택된 차량</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">차량번호:</span> {selectedVehicle.vehicleNumber}
                      </div>
                      <div>
                        <span className="text-gray-600">차종:</span> {selectedVehicle.vehicleType}
                      </div>
                      <div>
                        <span className="text-gray-600">바이어:</span> {selectedVehicle.buyerName}
                      </div>
                      <div>
                        <span className="text-gray-600">국가:</span> {selectedVehicle.buyerCountry}
                      </div>
                    </div>
                  </div>

                  {/* 생성된 문서 정보 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-base">생성된 면장 정보</h4>
                      {documentResult && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditDocument}
                          className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          면장 수정
                        </Button>
                      )}
                    </div>

                    {editingDocument === documentResult?.vehicleId ? (
                      // 수정 모드
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                        <h5 className="font-medium text-yellow-800">면장 정보 수정</h5>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm">면장번호</Label>
                            <Input
                              value={editDocumentData.documentNumber}
                              onChange={(e) =>
                                setEditDocumentData((prev) => ({ ...prev, documentNumber: e.target.value }))
                              }
                              className="bg-white"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">상품명</Label>
                            <Input
                              value={editDocumentData.productName}
                              onChange={(e) =>
                                setEditDocumentData((prev) => ({ ...prev, productName: e.target.value }))
                              }
                              className="bg-white"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">수출조건</Label>
                            <Input
                              value={editDocumentData.exportCondition}
                              onChange={(e) =>
                                setEditDocumentData((prev) => ({ ...prev, exportCondition: e.target.value }))
                              }
                              className="bg-white"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              저장
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingDocument(null)}>
                              취소
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 일반 표시 모드
                      <div className="bg-white border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                              <FileText className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <div className="font-medium text-base">면장번호: {documentResult.documentNumber}</div>
                              <div className="text-sm text-gray-500">발급일자: {documentResult.issuedDate}</div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(documentResult.status)}>{documentResult.status}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">상품명:</span>
                            <div className="font-medium">{documentResult.productName}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">수출조건:</span>
                            <div className="font-medium">{documentResult.exportCondition}</div>
                          </div>
                        </div>

                        {documentResult.processedTime && (
                          <div className="text-xs text-gray-500 border-t pt-2">
                            처리시간: {documentResult.processedTime} / 담당자: {documentResult.processor}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="space-y-3">
                    <Button onClick={handleDownloadDocument} className="w-full bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      면장 다운로드
                    </Button>

                    {/* 면장 처리 완료 후 쇼링업체 선택 */}
                    {documentResult?.status === "완료" && (
                      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-800">쇼링업체 선택</h5>
                        <Select value={selectedShoring} onValueChange={setSelectedShoring}>
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="쇼링업체를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            {shoringCompanies.map((company) => (
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
                          onClick={handleSendToShoring}
                          disabled={!selectedShoring}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          쇼링업체에 전달
                        </Button>
                      </div>
                    )}

                    {/* 상태 변경 버튼들 */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeDocumentStatus("보류")}
                        className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                      >
                        보류 처리
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeDocumentStatus("실패")}
                        className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                      >
                        실패 처리
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-base">문서 생성을 시작하세요</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
