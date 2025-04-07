"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import DashboardContent from "@/components/dashboard-content"
import SleepTrackingContent from "@/components/sleep-tracking-content"
import RelaxationContent from "@/components/relaxation-content"
import SettingsContent from "@/components/settings-content"
import Requisites from "@/components/Requisites"
import ChatbotButton from "@/components/chatbot-button"
import ChatbotDialog from "@/components/chatbot-dialog"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("requisites")
  const [chatbotOpen, setChatbotOpen] = useState(false)

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-white">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "sleep-tracking" && <SleepTrackingContent />}
          {activeTab === "relaxation" && <RelaxationContent />}
          {activeTab === "requisites" && <Requisites />}
          {activeTab === "settings" && <SettingsContent />}
        </main>
        <ChatbotButton onClick={() => setChatbotOpen(true)} />
        <ChatbotDialog open={chatbotOpen} onOpenChange={setChatbotOpen} />
      </div>
    </SidebarProvider>
  )
}

