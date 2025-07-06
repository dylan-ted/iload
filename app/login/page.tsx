"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, AlertCircle, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // 간단한 로컬 역할 매핑
    const roleMapping = {
      "1": { role: "exporter", path: "/exporter-dashboard" },
      "2": { role: "customs", path: "/customs-dashboard" },
      "3": { role: "shoring", path: "/shoring-dashboard" },
      "4": { role: "shipping", path: "/shipping-dashboard" },
      "5": { role: "buyer", path: "/buyer-dashboard/V001" },
      observer: { role: "observer", path: "/observer-dashboard" },
    }

    // 로그인 시뮬레이션 (1초 대기)
    setTimeout(() => {
      const userRole = roleMapping[id as keyof typeof roleMapping]

      if (userRole && password === id) {
        // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem("userRole", userRole.role)
        localStorage.setItem("userId", id)
        router.push(userRole.path)
      } else {
        setError("잘못된 ID 또는 비밀번호입니다.")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Network Animation */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full opacity-20" viewBox="0 0 1920 1080">
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
            <line x1="700" y1="180" x2="900" y2="300" className="animate-pulse" style={{ animationDelay: "1.5s" }} />
          </g>

          <g fill="#00d4ff">
            <circle cx="100" cy="200" r="3" className="animate-ping" />
            <circle cx="300" cy="150" r="3" className="animate-ping" style={{ animationDelay: "0.5s" }} />
            <circle cx="500" cy="250" r="3" className="animate-ping" style={{ animationDelay: "1s" }} />
            <circle cx="700" cy="180" r="3" className="animate-ping" style={{ animationDelay: "1.5s" }} />
          </g>
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="inline-block">
          <Image src="/images/logo.png" alt="GlobalCar Logo" width={200} height={50} className="h-10 w-auto" />
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-md">
          <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">GlobalCar 로그인</CardTitle>
              <CardDescription className="text-gray-300">역할별 전용 대시보드에 접속하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="id" className="text-gray-300">
                    사용자 ID
                  </Label>
                  <Input
                    id="id"
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="ID를 입력하세요"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-300">
                    비밀번호
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                  />
                </div>

                {error && (
                  <Alert className="bg-red-900/50 border-red-700">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      로그인 중...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      로그인
                    </>
                  )}
                </Button>
              </form>

              {/* 테스트용 계정 안내 */}
              <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="font-medium text-sm mb-3 text-cyan-400">테스트 계정:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <div className="p-2 bg-gray-700/50 rounded">
                    <div className="text-red-400 font-medium">ID: 1, PW: 1</div>
                    <div>🚗 수출업체</div>
                  </div>
                  <div className="p-2 bg-gray-700/50 rounded">
                    <div className="text-green-400 font-medium">ID: 2, PW: 2</div>
                    <div>🛡️ 관세사</div>
                  </div>
                  <div className="p-2 bg-gray-700/50 rounded">
                    <div className="text-orange-400 font-medium">ID: 3, PW: 3</div>
                    <div>🚛 쇼링업체</div>
                  </div>
                  <div className="p-2 bg-gray-700/50 rounded">
                    <div className="text-purple-400 font-medium">ID: 4, PW: 4</div>
                    <div>⚓ 선사대리점</div>
                  </div>
                  <div className="p-2 bg-gray-700/50 rounded">
                    <div className="text-blue-400 font-medium">ID: 5, PW: 5</div>
                    <div>🌍 바이어</div>
                  </div>
                  <div className="p-2 bg-gray-700/50 rounded border border-cyan-500/30">
                    <div className="text-cyan-400 font-medium">observer</div>
                    <div>👁️ 옵저버</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                  계정이 없으신가요? 회원가입하기
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
