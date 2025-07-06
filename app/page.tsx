import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Globe, Shield, Truck, Users, ArrowRight, Menu } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/images/logo.png" alt="GlobalCar Logo" width={200} height={50} className="h-10 w-auto" />
          </div>
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="#information" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
              Information
            </Link>
            <Link href="/all-in-one" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
              Service
            </Link>
            <Link href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
              Contact
            </Link>
          </nav>
          <div className="md:hidden">
            <Menu className="h-6 w-6 text-white" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-background.png"
            alt="Global Car Export Network"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        </div>

        {/* Network Animation Overlay */}
        <div className="absolute inset-0 z-10">
          <svg className="w-full h-full opacity-30" viewBox="0 0 1920 1080">
            <defs>
              <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#0099cc" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#006699" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Network Lines */}
            <g stroke="url(#networkGradient)" strokeWidth="2" fill="none">
              <line x1="100" y1="200" x2="300" y2="150" className="animate-pulse" />
              <line x1="300" y1="150" x2="500" y2="250" className="animate-pulse" style={{ animationDelay: "0.5s" }} />
              <line x1="500" y1="250" x2="700" y2="180" className="animate-pulse" style={{ animationDelay: "1s" }} />
              <line x1="700" y1="180" x2="900" y2="300" className="animate-pulse" style={{ animationDelay: "1.5s" }} />
              <line x1="900" y1="300" x2="1200" y2="200" className="animate-pulse" style={{ animationDelay: "2s" }} />
              <line
                x1="1200"
                y1="200"
                x2="1500"
                y2="350"
                className="animate-pulse"
                style={{ animationDelay: "2.5s" }}
              />

              <line x1="200" y1="400" x2="400" y2="350" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
              <line x1="400" y1="350" x2="600" y2="450" className="animate-pulse" style={{ animationDelay: "0.8s" }} />
              <line x1="600" y1="450" x2="800" y2="380" className="animate-pulse" style={{ animationDelay: "1.3s" }} />
              <line x1="800" y1="380" x2="1000" y2="500" className="animate-pulse" style={{ animationDelay: "1.8s" }} />
              <line
                x1="1000"
                y1="500"
                x2="1300"
                y2="400"
                className="animate-pulse"
                style={{ animationDelay: "2.3s" }}
              />
            </g>

            {/* Network Nodes */}
            <g fill="#00d4ff">
              <circle cx="100" cy="200" r="4" className="animate-ping" />
              <circle cx="300" cy="150" r="4" className="animate-ping" style={{ animationDelay: "0.5s" }} />
              <circle cx="500" cy="250" r="4" className="animate-ping" style={{ animationDelay: "1s" }} />
              <circle cx="700" cy="180" r="4" className="animate-ping" style={{ animationDelay: "1.5s" }} />
              <circle cx="900" cy="300" r="4" className="animate-ping" style={{ animationDelay: "2s" }} />
              <circle cx="1200" cy="200" r="4" className="animate-ping" style={{ animationDelay: "2.5s" }} />
              <circle cx="1500" cy="350" r="4" className="animate-ping" style={{ animationDelay: "3s" }} />

              <circle cx="200" cy="400" r="4" className="animate-ping" style={{ animationDelay: "0.3s" }} />
              <circle cx="400" cy="350" r="4" className="animate-ping" style={{ animationDelay: "0.8s" }} />
              <circle cx="600" cy="450" r="4" className="animate-ping" style={{ animationDelay: "1.3s" }} />
              <circle cx="800" cy="380" r="4" className="animate-ping" style={{ animationDelay: "1.8s" }} />
              <circle cx="1000" cy="500" r="4" className="animate-ping" style={{ animationDelay: "2.3s" }} />
              <circle cx="1300" cy="400" r="4" className="animate-ping" style={{ animationDelay: "2.8s" }} />
            </g>
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="text-white block mb-4">글로벌 중고차 수출의</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 block">
                새로운 기준
              </span>
            </h1>

            <div className="space-y-4 max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                전 세계 바이어와 수출 파트너들 하나로 잇는
              </p>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                더 쉽고 안전한 중고차 거래의 시작, All-in-One 통합 플랫폼
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 text-lg px-12 py-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  회원가입
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg px-12 py-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="information" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">모든 역할을 위한 맞춤 서비스</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              중고차 수출 생태계의 각 역할별 특화된 기능을 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <Globe className="h-12 w-12 text-cyan-400 mb-4" />
                <CardTitle className="text-xl text-white">바이어 (Buyer)</CardTitle>
                <CardDescription className="text-gray-300">
                  해외 바이어를 위한 차량 검색, 견적 요청, 배송 추적 서비스
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• 실시간 재고 확인</li>
                  <li>• 다국가 통화 지원</li>
                  <li>• 배송 상태 추적</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-xl text-white">관세사</CardTitle>
                <CardDescription className="text-gray-300">통관 업무 자동화 및 UNI-PASS 연동 서비스</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• UNI-PASS API 연동</li>
                  <li>• 전자신고 자동화</li>
                  <li>• 관세 계산 도구</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <Truck className="h-12 w-12 text-orange-400 mb-4" />
                <CardTitle className="text-xl text-white">쇼링업체</CardTitle>
                <CardDescription className="text-gray-300">항만 작업 관리 및 컨테이너 최적화 솔루션</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• 컨테이너 적재 최적화</li>
                  <li>• 작업 스케줄 관리</li>
                  <li>• 실시간 진행 상황</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-xl text-white">선사대리점</CardTitle>
                <CardDescription className="text-gray-300">B/L 발급 및 선적 스케줄 관리 시스템</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• B/L 자동 발급</li>
                  <li>• 선적 스케줄 관리</li>
                  <li>• 컨테이너 추적</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <CardHeader>
                <Car className="h-12 w-12 text-red-400 mb-4" />
                <CardTitle className="text-xl text-white">수출업체</CardTitle>
                <CardDescription className="text-gray-300">차량 등록부터 수출까지 전 과정 관리</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• 차량 재고 관리</li>
                  <li>• 수출 실적 분석</li>
                  <li>• 바이어 매칭</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">지금 바로 시작하세요</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            5분만에 회원가입하고 글로벌 중고차 수출 네트워크에 참여하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/all-in-one">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                All-in-One 체험하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                역할별 대시보드 체험
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black text-white py-16 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Image src="/images/logo.png" alt="GlobalCar Logo" width={150} height={40} className="h-8 w-auto" />
              </div>
              <p className="text-gray-400 leading-relaxed">글로벌 중고차 수출의 새로운 기준을 제시합니다.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-cyan-400">서비스</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">바이어 서비스</li>
                <li className="hover:text-white transition-colors cursor-pointer">관세사 솔루션</li>
                <li className="hover:text-white transition-colors cursor-pointer">쇼링 관리</li>
                <li className="hover:text-white transition-colors cursor-pointer">선사 연동</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-cyan-400">회사</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">회사소개</li>
                <li className="hover:text-white transition-colors cursor-pointer">채용정보</li>
                <li className="hover:text-white transition-colors cursor-pointer">파트너십</li>
                <li className="hover:text-white transition-colors cursor-pointer">뉴스</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-cyan-400">고객지원</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">문의하기</li>
                <li className="hover:text-white transition-colors cursor-pointer">FAQ</li>
                <li className="hover:text-white transition-colors cursor-pointer">이용약관</li>
                <li className="hover:text-white transition-colors cursor-pointer">개인정보처리방침</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GlobalCar Export Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
