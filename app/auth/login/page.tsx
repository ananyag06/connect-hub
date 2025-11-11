"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const DEMO_USERS = [
  { email: "sarah@demo.com", password: "demo123", name: "Sarah Johnson" },
  { email: "mike@demo.com", password: "demo123", name: "Mike Chen" },
  { email: "emma@demo.com", password: "demo123", name: "Emma Davis" },
]

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = DEMO_USERS.find((u) => u.email === email && u.password === password)

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      toast({
        title: "Login successful!",
        description: "Welcome back to ConnectHub",
      })
      setTimeout(() => router.push("/feed"), 1000)
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your email and password",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleDemoLogin = (demoUser: (typeof DEMO_USERS)[0]) => {
    localStorage.setItem("currentUser", JSON.stringify(demoUser))
    toast({
      title: "Login successful!",
      description: `Welcome back, ${demoUser.name}`,
    })
    setTimeout(() => router.push("/feed"), 500)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* LEFT: Branding Panel */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 text-white flex items-center justify-center p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 max-w-lg"
        >
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-blue-100 text-transparent bg-clip-text mb-4">
              ConnectHub
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl opacity-90 leading-relaxed"
          >
            Your professional network for meaningful connections and engaging conversations
          </motion.p>
        </motion.div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Welcome Back</h2>
          <p className="text-slate-600 mb-6 text-center">Sign in to continue to ConnectHub</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm text-slate-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 h-11 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm text-slate-700 font-medium">
                Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                <span>Remember me</span>
              </label>
              <Link href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or try demo accounts</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.email}
                  onClick={() => handleDemoLogin(user)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-slate-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
