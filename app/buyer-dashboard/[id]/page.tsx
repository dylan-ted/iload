"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Car,
  CheckCircle,
  Clock,
  FileText,
  Download,
  MessageCircle,
  Bell,
  Star,
  Send,
  X,
  Package,
  Ship,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import Image from "next/image"

interface BuyerOrder {
  id: string
  vehicleModel: string
  chassisNumber: string
  year: string
  color: string
  fobPrice: number
  currency: string
  contractDate: string
  estimatedDelivery: string
  currentStatus: string
  progress: number
  timeline: TimelineItem[]
  exporter: string
  exporterContact: string
  shippingInfo?: {
    vesselName: string
    voyageNumber: string
    departurePort: string
    arrivalPort: string
    currentLocation: string
  }
}

interface TimelineItem {
  step: string
  status: "완료" | "진행중" | "대기중"
  date?: string
  description: string
  details?: string
}

interface ReviewData {
  rating: number
  comment: string
  serviceAspects: {
    communication: number
    delivery: number
    quality: number
    overall: number
  }
}

interface InquiryData {
  subject: string
  message: string
  priority: "낮음" | "보통" | "높음"
}

export default function BuyerDashboard({ params }: { params: { id: string } }) {
  const [notifications, setNotifications] = useState(2)
  const [message, setMessage] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [reviewData, setReviewData] = useState<ReviewData>({
    rating: 5,
    comment: "",
    serviceAspects: {
      communication: 5,
      delivery: 5,
      quality: 5,
      overall: 5,
    },
  })
  const [inquiryData, setInquiryData] = useState<InquiryData>({
    subject: "",
    message: "",
    priority: "보통",
  })

  // Mock data - in real app, fetch based on params.id
  const [buyerOrder, setBuyerOrder] = useState<BuyerOrder>({
    id: params.id,
    vehicleModel: "현대 아반떼 2020",
    chassisNumber: "KMHL14JA5LA123456",
    year: "2020",
    color: "화이트",
    fobPrice: 15000,
    currency: "USD",
    contractDate: "2024-01-15",
    estimatedDelivery: "2024-02-15",
    currentStatus: "선적 중",
    progress: 75,
    exporter: "글로벌모터스",
    exporterContact: "+82-2-1234-5678",
    shippingInfo: {
      vesselName: "KOREA EXPRESS",
      voyageNumber: "KE2024-001",
      departurePort: "부산항",
      arrivalPort: "두바이항",
      currentLocation: "인도양 항해 중",
    },
    timeline: [
      {
        step: "계약 체결",
        status: "완료",
        date: "2024-01-15",
        description: "차량 구매 계약이 체결되었습니다.",
        details: "계약서 서명 및 계약금 지불 완료",
      },
      {
        step: "차량 검수",
        status: "완료",
        date: "2024-01-18",
        description: "차량 상태 검수가 완료되었습니다.",
        details: "외관, 내부, 엔진 상태 모두 양호 확인",
      },
      {
        step: "서류 준비",
        status: "완료",
        date: "2024-01-20",
        description: "수출 관련 서류 준비가 완료되었습니다.",
        details: "수출신고서, 차량등록증, 매매계약서 준비",
      },
      {
        step: "관세청 승인",
        status: "완료",
        date: "2024-01-22",
        description: "관세청 수출 승인이 완료되었습니다.",
        details: "관세사 검토 및 승인 처리 완료",
      },
      {
        step: "운송 배정",
        status: "완료",
        date: "2024-01-25",
        description: "항구까지 운송이 배정되었습니다.",
        details: "쇼링업체 배정 및 운송 시작",
      },
      {
        step: "선적 중",
        status: "진행중",
        date: "2024-01-28",
        description: "선박에 적재 중입니다.",
        details: "KOREA EXPRESS호에 컨테이너 적재 진행",
      },
      {
        step: "해상 운송",
        status: "대기중",
        description: "해상 운송이 시작됩니다.",
        details: "부산항에서 두바이항까지 약 15일 소요 예정",
      },
      {
        step: "도착 및 인도",
        status: "대기중",
        description: "목적지 도착 후 차량을 인도받습니다.",
        details: "두바이항 도착 후 현지 통관 및 인도",
      },
    ],
  })

  const handleSubmitReview = () => {
    if (!reviewData.comment.trim()) {
      setMessage("리뷰 내용을 입력해주세요.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    // 리뷰 제출 시뮬레이션
    setMessage("리뷰가 성공적으로 제출되었습니다. 감사합니다!")
    setShowReviewForm(false)
    setReviewData({
      rating: 5,
      comment: "",
      serviceAspects: {
        communication: 5,
        delivery: 5,
        quality: 5,
        overall: 5,
      },
    })
    setTimeout(() => setMessage(""), 3000)
  }

  const handleSubmitInquiry = () => {
    if (!inquiryData.subject.trim() || !inquiryData.message.trim()) {
      setMessage("제목과 내용을 모두 입력해주세요.")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    // 문의 제출 시뮬레이션
    setMessage("문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.")
    setShowInquiryForm(false)
    setInquiryData({
      subject: "",
      message: "",
      priority: "보통",
    })
    setTimeout(() => setMessage(""), 3000)
  }

  const handleDownloadDocument = (docType: string) => {
    // 문서 다운로드 시뮬레이션
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
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    // 제목
    ctx.fillStyle = "#000000"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText(docType, canvas.width / 2, 70)

    // 내용
    ctx.font = "16px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`주문번호: ${buyerOrder.id}`, 50, 120)
    ctx.fillText(`차량: ${buyerOrder.vehicleModel}`, 50, 150)
    ctx.fillText(`차대번호: ${buyerOrder.chassisNumber}`, 50, 180)
    ctx.fillText(`계약일: ${buyerOrder.contractDate}`, 50, 210)
    ctx.fillText(`가격: ${buyerOrder.currency} ${buyerOrder.fobPrice.toLocaleString()}`, 50, 240)
    ctx.fillText(`수출업체: ${buyerOrder.exporter}`, 50, 270)

    // 발급일
    ctx.font = "14px Arial"
    ctx.textAlign = "right"
    ctx.fillText(`발급일: ${new Date().toLocaleDateString("ko-KR")}`, canvas.width - 50, 500)

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${docType}_${buyerOrder.id}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setMessage(`${docType}이(가) 다운로드되었습니다.`)
        setTimeout(() => setMessage(""), 3000)
      }
    }, "image/png")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "완료":
        return "text-green-400"
      case "진행중":
        return "text-blue-400"
      case "대기중":
        return "text-gray-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "완료":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "진행중":
        return <Clock className="w-4 h-4 text-blue-400 animate-spin" />
      case "대기중":
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  // 리뷰 폼 렌더링
  if (showReviewForm) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">서비스 리뷰 작성</h2>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                닫기
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">전체 평점</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                      className={`text-2xl ${star <= reviewData.rating ? "text-yellow-400" : "text-gray-600"} hover:text-yellow-300 transition-colors`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                  <span className="ml-4 text-white text-lg">{reviewData.rating}/5</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">세부 평가</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(reviewData.serviceAspects).map(([aspect, rating]) => (
                  <div key={aspect} className="space-y-2">
                    <Label className="text-gray-300 capitalize">
                      {aspect === "communication"
                        ? "소통"
                        : aspect === "delivery"
                          ? "배송"
                          : aspect === "quality"
                            ? "품질"
                            : "전반적 만족도"}
                    </Label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setReviewData((prev) => ({
                              ...prev,
                              serviceAspects: { ...prev.serviceAspects, [aspect]: star },
                            }))
                          }
                          className={`${star <= rating ? "text-yellow-400" : "text-gray-600"} hover:text-yellow-300 transition-colors`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-white">{rating}/5</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">리뷰 내용</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData((prev) => ({ ...prev, comment: e.target.value }))}
                  placeholder="서비스에 대한 자세한 후기를 작성해주세요..."
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  rows={6}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                취소
              </Button>
              <Button onClick={handleSubmitReview} className="bg-purple-500 hover:bg-purple-600 text-white">
                <Send className="w-4 h-4 mr-2" />
                리뷰 제출
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 문의 폼 렌더링
  if (showInquiryForm) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full">
          <div className="border-b border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">문의하기</h2>
              <Button
                variant="outline"
                onClick={() => setShowInquiryForm(false)}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                닫기
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label className="text-gray-300">제목 *</Label>
                  <Input
                    value={inquiryData.subject}
                    onChange={(e) => setInquiryData((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="문의 제목을 입력하세요"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">우선순위</Label>
                  <select
                    value={inquiryData.priority}
                    onChange={(e) =>
                      setInquiryData((prev) => ({ ...prev, priority: e.target.value as "낮음" | "보통" | "높음" }))
                    }
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="낮음">낮음</option>
                    <option value="보통">보통</option>
                    <option value="높음">높음</option>
                  </select>
                </div>

                <div>
                  <Label className="text-gray-300">문의 내용 *</Label>
                  <Textarea
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="문의하실 내용을 자세히 작성해주세요"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowInquiryForm(false)}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                취소
              </Button>
              <Button onClick={handleSubmitInquiry} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Send className="w-4 h-4 mr-2" />
                문의 전송
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                  <p className="text-sm text-gray-400">바이어 대시보드</p>
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
              <Button onClick={() => setShowInquiryForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                문의하기
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

        {/* Order Overview */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-500">
              <Car className="w-5 h-5" />
              <span>주문 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{buyerOrder.vehicleModel}</h3>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {buyerOrder.currentStatus}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">주문번호</span>
                    <p className="font-mono text-white">{buyerOrder.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">차대번호</span>
                    <p className="font-mono text-white">{buyerOrder.chassisNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">연식</span>
                    <p className="text-white">{buyerOrder.year}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">색상</span>
                    <p className="text-white">{buyerOrder.color}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">계약일</span>
                    <p className="text-white">{buyerOrder.contractDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">예상 인도일</span>
                    <p className="text-white">{buyerOrder.estimatedDelivery}</p>
                  </div>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300">계약 금액</span>
                    <span className="text-2xl font-bold text-purple-400">
                      {buyerOrder.currency} {buyerOrder.fobPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">진행률</span>
                    <span className="text-purple-400 font-semibold">{buyerOrder.progress}%</span>
                  </div>
                  <Progress value={buyerOrder.progress} className="h-3 bg-gray-700">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${buyerOrder.progress}%` }}
                    />
                  </Progress>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">수출업체</span>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold">{buyerOrder.exporter}</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          연락
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          메일
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{buyerOrder.exporterContact}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        {buyerOrder.shippingInfo && (
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-500">
                <Ship className="w-5 h-5" />
                <span>선적 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">선박명</span>
                  <p className="text-white font-semibold">{buyerOrder.shippingInfo.vesselName}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">항차번호</span>
                  <p className="text-white font-mono">{buyerOrder.shippingInfo.voyageNumber}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">출발항</span>
                  <p className="text-white">{buyerOrder.shippingInfo.departurePort}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">도착항</span>
                  <p className="text-white">{buyerOrder.shippingInfo.arrivalPort}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-blue-300">현재 위치: {buyerOrder.shippingInfo.currentLocation}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-500">
              <Package className="w-5 h-5" />
              <span>진행 상황</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {buyerOrder.timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">{getStatusIcon(item.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white">{item.step}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`${
                            item.status === "완료"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : item.status === "진행중"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                          }`}
                        >
                          {item.status}
                        </Badge>
                        {item.date && <span className="text-sm text-gray-400">{item.date}</span>}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                    {item.details && <p className="text-gray-500 text-xs mt-1">{item.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-500">
                <FileText className="w-5 h-5" />
                <span>문서 다운로드</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleDownloadDocument("계약서")}
                className="w-full bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30"
              >
                <Download className="w-4 h-4 mr-2" />
                계약서 다운로드
              </Button>
              <Button
                onClick={() => handleDownloadDocument("인보이스")}
                className="w-full bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30"
              >
                <Download className="w-4 h-4 mr-2" />
                인보이스 다운로드
              </Button>
              <Button
                onClick={() => handleDownloadDocument("B/L")}
                className="w-full bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30"
                disabled={buyerOrder.progress < 80}
              >
                <Download className="w-4 h-4 mr-2" />
                B/L 다운로드
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-500">
                <MessageCircle className="w-5 h-5" />
                <span>고객 지원</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setShowInquiryForm(true)}
                className="w-full bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                문의하기
              </Button>
              <Button className="w-full bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30">
                <Phone className="w-4 h-4 mr-2" />
                전화 상담
              </Button>
              <Button className="w-full bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30">
                <Mail className="w-4 h-4 mr-2" />
                이메일 문의
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-500">
                <Star className="w-5 h-5" />
                <span>서비스 평가</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setShowReviewForm(true)}
                className="w-full bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
                disabled={buyerOrder.progress < 100}
              >
                <Star className="w-4 h-4 mr-2" />
                리뷰 작성
              </Button>
              <Button className="w-full bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30">
                <User className="w-4 h-4 mr-2" />
                추천하기
              </Button>
              <div className="text-center text-sm text-gray-400">
                {buyerOrder.progress < 100 ? "배송 완료 후 이용 가능" : "서비스 평가를 남겨주세요"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
