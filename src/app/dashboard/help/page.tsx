"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  FileText, 
  Video, 
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react"
import { useState } from "react"

// FAQ Data
const faqData = [
  {
    question: "How do I upload a file for analysis?",
    answer: "Navigate to the 'Uploaded Files' section in the sidebar, click the 'Upload File' button, and select your file. Supported formats include CSV, Excel, and JSON files.",
    category: "Getting Started"
  },
  {
    question: "What file formats are supported?",
    answer: "We currently support CSV (.csv), Excel (.xlsx, .xls), and JSON (.json) files. Make sure your files are properly formatted with headers for best results.",
    category: "File Management"
  },
  {
    question: "How do I view analytics for my uploaded files?",
    answer: "Go to the 'Analytics' section, select the file you want to analyze from the dropdown, and view the generated insights and visualizations.",
    category: "Analytics"
  },
  {
    question: "Can I delete uploaded files?",
    answer: "Yes, you can delete any uploaded file by going to the 'Uploaded Files' section and clicking the delete icon next to the file you want to remove.",
    category: "File Management"
  },
  {
    question: "How accurate are the analytics?",
    answer: "Our analytics are based on the data you provide. The accuracy depends on the quality and completeness of your uploaded data. We recommend reviewing the data before analysis.",
    category: "Analytics"
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. All uploaded files are encrypted and stored securely. We do not share your data with third parties.",
    category: "Security"
  }
]

// Contact Information
const contactInfo = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    contact: "support@xanalyzr.com",
    action: "Send Email"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team",
    contact: "Available 24/7",
    action: "Start Chat"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us directly",
    contact: "+1 (555) 123-4567",
    action: "Call Now"
  }
]

// Resources
const resources = [
  {
    icon: FileText,
    title: "Documentation",
    description: "Comprehensive guides and API docs",
    link: "#"
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    link: "#"
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description: "Searchable help articles",
    link: "#"
  }
]

const HelpPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground">
            Find answers to common questions and get support
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search help articles..."
            className="px-3 py-2 border rounded-md bg-background"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {contactInfo.map((contact, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <contact.icon className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">{contact.title}</CardTitle>
                  <CardDescription>{contact.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium mb-3">{contact.contact}</p>
              <Button variant="outline" size="sm" className="w-full">
                {contact.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Find quick answers to common questions about using Xanalyzr
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      {faq.category}
                    </Badge>
                    <span className="font-medium">{faq.question}</span>
                  </div>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-3">
                    <Separator className="mb-3" />
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle>Helpful Resources</CardTitle>
          <CardDescription>
            Additional resources to help you get the most out of Xanalyzr
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <resource.icon className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{resource.title}</h4>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>
            Follow these steps to get started with Xanalyzr
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Upload Your Data</h4>
                                 <p className="text-sm text-muted-foreground">
                   Go to the &ldquo;Uploaded Files&rdquo; section and upload your CSV, Excel, or JSON file.
                 </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Select File for Analysis</h4>
                                 <p className="text-sm text-muted-foreground">
                   Navigate to the &ldquo;Analytics&rdquo; section and choose the file you want to analyze.
                 </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">View Insights</h4>
                <p className="text-sm text-muted-foreground">
                  Explore the generated charts, metrics, and insights from your data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HelpPage 