"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Car, LogIn, AlertCircle } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Car className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">CarExport Pro</CardTitle>
            <CardDescription>역할별 전용 대시보드 로그인</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="id">사용자 ID</Label>
                <Input
                  id="id"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="ID를 입력하세요"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>

              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
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
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">테스트 계정:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• ID: 1, PW: 1 → 수출업체</div>
                <div>• ID: 2, PW: 2 → 관세사</div>
                <div>• ID: 3, PW: 3 → 쇼링업체</div>
                <div>• ID: 4, PW: 4 → 선사대리점</div>
                <div>• ID: 5, PW: 5 → 바이어</div>
                <div>• ID: observer, PW: observer → 옵저버</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
