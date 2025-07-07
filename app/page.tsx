import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Globe, Shield, Truck, Users, ArrowRight, LogIn } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-800">CarExport Pro</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#services" className="text-slate-600 hover:text-blue-600 transition-colors">
              서비스
            </Link>
            <Link href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">
              회사소개
            </Link>
            <Link href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors">
              문의하기
            </Link>
            <Link href="/all-in-one" className="text-slate-600 hover:text-blue-600 transition-colors">
              All-in-One 입력
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link href="/signup">
              <Button variant="outline" className="bg-transparent">
                회원가입
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <LogIn className="w-4 h-4 mr-2" />
                로그인
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              글로벌 중고차 수출의
              <span className="text-blue-600 block">새로운 기준</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              바이어부터 관세사까지, 중고차 수출 생태계의 모든 파트너들을 위한
              <br />
              올인원 플랫폼으로 더 쉽고 안전한 글로벌 거래를 경험하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                  역할별 대시보드 체험
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/all-in-one">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
                  All-in-One 체험하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Login Guide Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">역할별 전용 대시보드 체험</h2>
          <p className="text-lg text-slate-600 mb-8">각 업체별 독립적인 화면으로 실제 업무 환경을 체험해보세요</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">ID: 1, PW: 1</div>
                <CardTitle className="text-lg">🚗 수출업체</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">차량 등록, 말소 처리, 관세사 선택</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">ID: 2, PW: 2</div>
                <CardTitle className="text-lg">🛡️ 관세사</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">면장 처리, 문서 자동 생성</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">ID: 3, PW: 3</div>
                <CardTitle className="text-lg">🚛 쇼링업체</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">사진 업로드, 컨테이너 적재</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">ID: 4, PW: 4</div>
                <CardTitle className="text-lg">⚓ 선사대리점</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">B/L 발급, 선적 관리</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">ID: 5, PW: 5</div>
                <CardTitle className="text-lg">🌍 바이어</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">배송 추적, 문서 다운로드</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-indigo-200">
              <CardHeader className="text-center">
                <div className="text-xl font-bold text-indigo-600 mb-2">observer / observer</div>
                <CardTitle className="text-lg">👁️ 옵저버</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">전체 프로세스 모니터링</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <LogIn className="w-5 h-5 mr-2" />
                지금 체험하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">모든 역할을 위한 맞춤 서비스</h2>
            <p className="text-xl text-slate-600">중고차 수출 생태계의 각 역할별 특화된 기능을 제공합니다</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">바이어 (Buyer)</CardTitle>
                <CardDescription>해외 바이어를 위한 차량 검색, 견적 요청, 배송 추적 서비스</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• 실시간 재고 확인</li>
                  <li>• 다국가 통화 지원</li>
                  <li>• 배송 상태 추적</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">관세사</CardTitle>
                <CardDescription>통관 업무 자동화 및 UNI-PASS 연동 서비스</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• UNI-PASS API 연동</li>
                  <li>• 전자신고 자동화</li>
                  <li>• 관세 계산 도구</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Truck className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle className="text-xl">쇼링업체</CardTitle>
                <CardDescription>항만 작업 관리 및 컨테이너 최적화 솔루션</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• 컨테이너 적재 최적화</li>
                  <li>• 작업 스케줄 관리</li>
                  <li>• 실시간 진행 상황</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-xl">선사대리점</CardTitle>
                <CardDescription>B/L 발급 및 선적 스케줄 관리 시스템</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• B/L 자동 발급</li>
                  <li>• 선적 스케줄 관리</li>
                  <li>• 컨테이너 추적</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Car className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle className="text-xl">수출업체</CardTitle>
                <CardDescription>차량 등록부터 수출까지 전 과정 관리</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
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
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">지금 바로 시작하세요</h2>
          <p className="text-xl text-blue-100 mb-8">5분만에 회원가입하고 글로벌 중고차 수출 네트워크에 참여하세요</p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              역할별 대시보드 체험
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6" />
                <span className="text-xl font-bold">CarExport Pro</span>
              </div>
              <p className="text-slate-400">글로벌 중고차 수출의 새로운 기준을 제시합니다.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">서비스</h3>
              <ul className="space-y-2 text-slate-400">
                <li>바이어 서비스</li>
                <li>관세사 솔루션</li>
                <li>쇼링 관리</li>
                <li>선사 연동</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">회사</h3>
              <ul className="space-y-2 text-slate-400">
                <li>회사소개</li>
                <li>채용정보</li>
                <li>파트너십</li>
                <li>뉴스</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">고객지원</h3>
              <ul className="space-y-2 text-slate-400">
                <li>문의하기</li>
                <li>FAQ</li>
                <li>이용약관</li>
                <li>개인정보처리방침</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 CarExport Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
