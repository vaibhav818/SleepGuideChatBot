"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export default function ChatbotButton({ onClick }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700"
      size="icon"
    >
      <MessageSquare className="h-6 w-6" />
      <span className="sr-only">Open AI Assistant</span>
    </Button>
  )
}

