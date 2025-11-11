"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

export function MotivationalBanner() {
  const [quote, setQuote] = useState("")

  const motivationalQuotes = [
    "Your potential is endless. Push yourself to be better every single day.",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Don't watch the clock; do what it does. Keep going.",
    "Success is not final, failure is not fatal. It is the courage to continue that counts.",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams.",
    "You are never too old to set another goal or to dream a new dream.",
    "Excellence is not a skill, it's an attitude.",
    "Every expert was once a beginner.",
    "Your limitation—it's only your imagination. Push beyond.",
  ]

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setQuote(randomQuote)
  }, [])

  return (
    <Card className="border-[#E5E7EB] bg-gradient-to-r from-[#0A66C2] to-[#0052A3] mb-6">
      <CardContent className="p-4 flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
        <p className="text-white text-[15px] leading-relaxed">{quote}</p>
      </CardContent>
    </Card>
  )
}
