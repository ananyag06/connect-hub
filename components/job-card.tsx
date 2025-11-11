"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Users } from "lucide-react"
import type { JobPosting } from "@/lib/posts"

interface JobCardProps {
  job: JobPosting
}

export function JobCard({ job }: JobCardProps) {
  const getPostedTime = (timestamp: string) => {
    const now = new Date()
    const jobDate = new Date(timestamp)
    const diffInMs = now.getTime() - jobDate.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays < 1) return "Today"
    if (diffInDays === 1) return "Yesterday"
    return `${diffInDays} days ago`
  }

  return (
    <Card className="border-[#E5E7EB] bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="mb-3">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="font-semibold text-[16px] text-black">{job.position}</h3>
              <p className="text-[14px] text-[#0A66C2] font-medium">{job.company}</p>
            </div>
            <span className="text-[12px] text-[#65676B] whitespace-nowrap">{getPostedTime(job.posted)}</span>
          </div>
          <p className="text-[14px] text-[#65676B] mb-2 line-clamp-2">{job.description}</p>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-[13px] text-[#65676B]">
            <MapPin className="h-4 w-4" />
            {job.location}
          </div>
          {job.salary && (
            <div className="flex items-center gap-2 text-[13px] text-[#65676B]">
              <Briefcase className="h-4 w-4" />
              {job.salary}
            </div>
          )}
          <div className="flex items-center gap-2 text-[13px] text-[#65676B]">
            <Users className="h-4 w-4" />
            {job.applicants} applicants
          </div>
        </div>

        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.tags.map((tag, idx) => (
              <span key={idx} className="inline-block bg-[#F0F0F0] text-[#65676B] text-[12px] px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <Button className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white h-9 text-[14px]">View Job</Button>
      </CardContent>
    </Card>
  )
}
