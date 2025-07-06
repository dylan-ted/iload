"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Clock,
  CheckCircle,
  Search,
  DollarSign,
  Eye,
  Download,
  Bell,
  X,
  Edit,
  AlertTriangle,
  Stamp,
} from "lucide-react"
import Image from "next/image"

interface CustomsDocument {
  id: string
  exportId: string
  vehicleModel: string
  exporter: string
  status: "대기중" | "검토중" | "승인" | "반려" | "수정요청"
  submittedDate: string
  reviewDate?: string
  approvalDate?: string
  documents: string[]
  customsValue: number
  tariffCode: string
  priority: "높음" | "보통" | "낮음"
  reviewNotes?: string
  rejectionReason?: string
}

interface ReviewFormData {
  reviewNotes: string
  customsValue: string
  tariffCode: string
  additionalDocuments: string[]
  decision: "approve" | "reject" | "request_modification"
  rejectionReason: string
}

export default function CustomsDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [notifications, setNotifications] = useState(5)
  const [message, setMessage] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<CustomsDocument | null>(null)
  const [reviewFormData, setReviewFormData] = useState<ReviewFormData>({
    reviewNotes: "",
    customsValue: "",
    tariffCode: "",
    additionalDocuments: [],
    decision: "approve",
    rejectionReason: "",
  })

  const [customsDocuments, setCustomsDocuments] = useState<CustomsDocument[]>([
    {
      id: "CUS001",
      exportId: "EXP001",
      vehicleModel: "현대 아반떼 2020",
      exporter: "글로벌모터스",
      status: "검토중",
      submittedDate: "2024-01-15",
      documents: ["수출신고서", "차량등록증", "매매계약서"],
      customsValue: 15000,
      tariffCode: "8703.23.00",
      priority: "높음",
    },
    {
      id: "CUS002",
      exportId: "EXP002",
      vehicleModel: "기아 쏘렌토 2019",
      exporter: "코리아오토",
      status: "승인",
      submittedDate: "2024-01-10",
      reviewDate: "2024-01-12",
      approvalDate: "2024-01-12",
      documents: ["수출신고서", "차량등록증", "매매계약서", "검사증명서"],
      customsValue: 22000,
      tariffCode: "8703.24.00",
      priority: "보통",
      reviewNotes: "모든 서류가 완비되어 승인 처리합니다.",
    },
    {
      id: "CUS003",
      exportId: "EXP003",
      vehicleModel: "현대 투싼 2021",
      exporter: "아시아모터스",
      status: "대기중",
      submittedDate: "2024-01-20",
      documents: ["수출신고서", "차량등록증"],
      customsValue: 18500,
      tariffCode: "8703.23.00",
      priority: "보통",
    },
    {
      id: "CUS004",
      exportId: "EXP004",
      vehicleModel: "기아 카니발 2022",
      exporter: "익스포트킹",
      status: "반려",
      submittedDate: "2024-01-18",
      reviewDate: "2024-01-19",
      documents: ["수출신고서"],
      customsValue: 25000,
      tariffCode: "8703.21.00",
      priority: "높음",
      rejectionReason: "차량등록증 및 매매계약서가 누락되었습니다. 필요 서류를 보완하여 재신청해주세요.",
    },
  ])

  const handleStartReview = (document: CustomsDocument) => {
    setSelectedDocument(document)
    setReviewFormData({
      reviewNotes: document.reviewNotes || "",
      customsValue: document.customsValue.toString(),
      tariffCode: document.tariffCode,
      additionalDocuments: [],
      decision: "approve",
      rejectionReason: document.rejectionReason || "",
    })
    setShowReviewForm(true)
  }

  const handleSubmitReview = () => {
    if (!selectedDocument) return

    let newStatus: CustomsDocument["status"] = "승인"
    const reviewDate = new Date().toISOString().split("T")[0]
    let approvalDate: string | undefined

    switch (reviewFormData.decision) {
      case "approve":
        newStatus = "승인"
        approvalDate = reviewDate
        break
      case "reject":
        newStatus = "반려"
        break
      case "request_modification":
        newStatus = "수정요청"
        break
    }

    setCustomsDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDocument.id
          ? {
              ...doc,
              status: newStatus,
              reviewDate,
              approvalDate,
              reviewNotes: reviewFormData.reviewNotes,
              rejectionReason: reviewFormData.rejectionReason,
              customsValue: Number.parseFloat(reviewFormData.customsValue),
              tariffCode: reviewFormData.tariffCode,
            }
          : doc,
      ),
    )

    setShowReviewForm(false)
    setSelectedDocument(null)

    const statusMessages = {
      approve: "승인 처리가 완료되었습니다.",
      reject: "반려 처리가 완료되었습니다.",
      request_modification: "수정 요청이 전달되었습니다.",
    }

    setMessage(statusMessages[reviewFormData.decision])
    setTimeout(() => setMessage(""), 3000)
  }

  const handleBulkApprove = () => {
    const pendingDocs = customsDocuments.filter((doc) => doc.status === "대기중" || doc.status === "검토중")

    setCustomsDocuments((prev) =>
      prev.map((doc) =>
        doc.status === "대기중" || doc.status === "검토중"
          ? {
              ...doc,
              status: "승인",
              reviewDate: new Date().toISOString().split("T")[0],
              approvalDate: new Date().toISOString().split("T")[0],
              reviewNotes: "일괄 승인 처리",
            }
          : doc,
      ),
    )

    setMessage(`${pendingDocs.length}건의 서류가 일괄 승인되었습니다.`)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleDownloadCertificate = (document: CustomsDocument) => {
    // 승인증 다운로드 시뮬레이션
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    // 배경
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 테두리
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 3
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    // 제목
    ctx.fillStyle = "#000000"
    ctx.font = "bold 32px Arial"
    ctx.textAlign = "center"
    ctx.fillText("수출승인증", canvas.width / 2, 80)

    // 내용
    ctx.font = "18px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`승인번호: ${document.id}`, 60, 150)
    ctx.fillText(`수출업체: ${document.exporter}`, 60, 180)
    ctx.fillText(`차량모델: ${document.vehicleModel}`, 60, 210)
    ctx.fillText(`신고가액: $${document.customsValue.toLocaleString()}`, 60, 240)
    ctx.fillText(`HS코드: ${document.tariffCode}`, 60, 270)
    ctx.fillText(`승인일자: ${document.approvalDate}`, 60, 300)

    // 승인 도장
    ctx.fillStyle = "#ff0000"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("승인", canvas.width - 150, 200)

    // 서명
    ctx.fillStyle = "#000000"
    ctx.font = "16px Arial"
    ctx.textAlign = "right"
    ctx.fillText("관세사: 김관세", canvas.width - 60, 450)
    ctx.fillText(`발급일: ${new Date().toLocaleDateString("ko-KR")}`, canvas.width - 60, 480)

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `수출승인증_${document.id}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setMessage("수출승인증이 다운로드되었습니다.")
        setTimeout(() => setMessage(""), 3000)
      }
    }, "image/png")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "승인":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "검토중":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "대기중":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "반려":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "수정요청":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "높음":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "보통":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "낮음":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const filteredDocuments = customsDocuments.filter((doc) => {
    const matchesSearch =
      doc.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.exporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || doc.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const pendingReviews = customsDocuments.filter((d) => d.status === "검토중" || d.status === "대기중").length
  const approvedToday = customsDocuments.filter((d) => d.status === "승인").length
  const totalValue = customsDocuments.reduce((sum, doc) => sum + doc.customsValue, 0)
  const rejectedCount = customsDocuments.filter((d) => d.status === "반려").length

  // 검토 폼 렌더링
  if (showReviewForm && selectedDocument) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">관세 서류 검토</h2>
                <p className="text-gray-400">
                  {selectedDocument.vehicleModel} - {selectedDocument.exporter}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false)
                  setSelectedDocument(null)
                }}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                닫기
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* 서류 정보 */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">제출된 서류 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">서류 ID</Label>
                    <Input
                      value={selectedDocument.id}
                      disabled
                      className="bg-gray-700/50 border-gray-600 text-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">제출일</Label>
                    <Input
                      value={selectedDocument.submittedDate}
                      disabled
                      className="bg-gray-700/50 border-gray-600 text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">수출업체</Label>
                    <Input
                      value={selectedDocument.exporter}
                      disabled
                      className="bg-gray-700/50 border-gray-600 text-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">차량모델</Label>
                    <Input
                      value={selectedDocument.vehicleModel}
                      disabled
                      className="bg-gray-700/50 border-gray-600 text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">제출된 서류</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDocument.documents.map((doc, index) => (
                      <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 검토 내용 */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">검토 및 승인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">신고가액 (USD)</Label>
                    <Input
                      value={reviewFormData.customsValue}
                      onChange={(e) => setReviewFormData((prev) => ({ ...prev, customsValue: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">HS 코드</Label>
                    <Input
                      value={reviewFormData.tariffCode}
                      onChange={(e) => setReviewFormData((prev) => ({ ...prev, tariffCode: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">검토 의견</Label>
                  <Textarea
                    value={reviewFormData.reviewNotes}
                    onChange={(e) => setReviewFormData((prev) => ({ ...prev, reviewNotes: e.target.value }))}
                    placeholder="검토 의견을 입력하세요..."
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">처리 결정</Label>
                  <Select
                    value={reviewFormData.decision}
                    onValueChange={(value: "approve" | "reject" | "request_modification") =>
                      setReviewFormData((prev) => ({ ...prev, decision: value }))
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="approve" className="text-white hover:bg-gray-700">
                        승인
                      </SelectItem>
                      <SelectItem value="request_modification" className="text-white hover:bg-gray-700">
                        수정 요청
                      </SelectItem>
                      <SelectItem value="reject" className="text-white hover:bg-gray-700">
                        반려
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(reviewFormData.decision === "reject" || reviewFormData.decision === "request_modification") && (
                  <div>
                    <Label className="text-gray-300">
                      {reviewFormData.decision === "reject" ? "반려 사유" : "수정 요청 사항"}
                    </Label>
                    <Textarea
                      value={reviewFormData.rejectionReason}
                      onChange={(e) => setReviewFormData((prev) => ({ ...prev, rejectionReason: e.target.value }))}
                      placeholder={
                        reviewFormData.decision === "reject"
                          ? "반려 사유를 입력하세요..."
                          : "수정이 필요한 사항을 입력하세요..."
                      }
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 처리 버튼 */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false)
                  setSelectedDocument(null)
                }}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                취소
              </Button>
              <Button
                onClick={handleSubmitReview}
                className={`${
                  reviewFormData.decision === "approve"
                    ? "bg-green-500 hover:bg-green-600"
                    : reviewFormData.decision === "reject"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-orange-500 hover:bg-orange-600"
                } text-white`}
              >
                {reviewFormData.decision === "approve" && <CheckCircle className="w-4 h-4 mr-2" />}
                {reviewFormData.decision === "reject" && <X className="w-4 h-4 mr-2" />}
                {reviewFormData.decision === "request_modification" && <Edit className="w-4 h-4 mr-2" />}
                {reviewFormData.decision === "approve"
                  ? "승인 처리"
                  : reviewFormData.decision === "reject"
                    ? "반려 처리"
                    : "수정 요청"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                  <p className="text-sm text-gray-400">관세사 대시보드</p>
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
              <Button onClick={handleBulkApprove} className="bg-orange-500 hover:bg-orange-600 text-white">
                <Stamp className="w-4 h-4 mr-2" />
                일괄 승인
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">검토 대기</p>
                  <p className="text-2xl font-bold text-orange-500">{pendingReviews}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">승인 완료</p>
                  <p className="text-2xl font-bold text-green-400">{approvedToday}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">총 신고가액</p>
                  <p className="text-2xl font-bold text-blue-400">${totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-400/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">반려 건수</p>
                  <p className="text-2xl font-bold text-red-400">{rejectedCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="차량 모델, 수출업체, 관세 ID로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className={filterStatus === "all" ? "bg-orange-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  전체
                </Button>
                <Button
                  variant={filterStatus === "대기중" ? "default" : "outline"}
                  onClick={() => setFilterStatus("대기중")}
                  className={filterStatus === "대기중" ? "bg-yellow-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  대기중
                </Button>
                <Button
                  variant={filterStatus === "검토중" ? "default" : "outline"}
                  onClick={() => setFilterStatus("검토중")}
                  className={filterStatus === "검토중" ? "bg-blue-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  검토중
                </Button>
                <Button
                  variant={filterStatus === "승인" ? "default" : "outline"}
                  onClick={() => setFilterStatus("승인")}
                  className={filterStatus === "승인" ? "bg-green-500 text-white" : "border-gray-600 text-gray-300"}
                >
                  승인
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customs Documents */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-500">
              <FileText className="w-5 h-5" />
              <span>관세 서류 현황</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{doc.vehicleModel}</h3>
                        <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                        <Badge className={getPriorityColor(doc.priority)}>{doc.priority}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-400 mb-4">
                        <div>
                          <span className="block text-gray-500">관세 ID</span>
                          <span className="text-white font-mono">{doc.id}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">수출업체</span>
                          <span className="text-white">{doc.exporter}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">신고가액</span>
                          <span className="text-orange-500 font-semibold">${doc.customsValue.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">HS 코드</span>
                          <span className="text-white font-mono">{doc.tariffCode}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {doc.documents.map((docType, index) => (
                          <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                            {docType}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-400">
                        <span>제출일: {doc.submittedDate}</span>
                        {doc.reviewDate && <span className="ml-4">검토일: {doc.reviewDate}</span>}
                        {doc.approvalDate && <span className="ml-4">승인일: {doc.approvalDate}</span>}
                      </div>
                      {doc.reviewNotes && (
                        <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-300">
                          검토의견: {doc.reviewNotes}
                        </div>
                      )}
                      {doc.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-300">
                          반려사유: {doc.rejectionReason}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {(doc.status === "대기중" || doc.status === "검토중") && (
                        <Button
                          size="sm"
                          onClick={() => handleStartReview(doc)}
                          className="bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          검토
                        </Button>
                      )}
                      {doc.status === "승인" && (
                        <Button
                          size="sm"
                          onClick={() => handleDownloadCertificate(doc)}
                          className="bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          승인증
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        상세
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
