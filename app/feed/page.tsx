"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { getPosts, getJobPostings, type Post, type JobPosting } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { PenSquare, Briefcase } from "lucide-react"
import Link from "next/link"
import { MotivationalBanner } from "@/components/motivational-banner"
import { JobCard } from "@/components/job-card"

export default function FeedPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getCurrentUser>>(null)
  const [showJobs, setShowJobs] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/auth/login")
      return
    }
    setCurrentUser(user)

    const allPosts = getPosts()
    setPosts(allPosts)

    const jobPostings = getJobPostings()
    setJobs(jobPostings)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const refreshPosts = () => {
    const allPosts = getPosts()
    setPosts(allPosts)
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A66C2]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <NavBar currentUser={currentUser} onLogout={handleLogout} />

      <main className="container max-w-2xl mx-auto px-4 py-6">
        <MotivationalBanner />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">{showJobs ? "Job Opportunities" : "Feed"}</h1>
          <div className="flex gap-2">
            <Button
              variant={showJobs ? "outline" : "default"}
              size="sm"
              onClick={() => setShowJobs(false)}
              className={!showJobs ? "bg-[#0A66C2] hover:bg-[#004182]" : ""}
            >
              Feed
            </Button>
            <Button
              variant={!showJobs ? "outline" : "default"}
              size="sm"
              onClick={() => setShowJobs(true)}
              className={showJobs ? "bg-[#0A66C2] hover:bg-[#004182]" : ""}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </Button>
            {!showJobs && (
              <Link href="/feed/create">
                <Button size="sm" className="gap-2 bg-[#0A66C2] hover:bg-[#004182]">
                  <PenSquare className="h-4 w-4" />
                  Create Post
                </Button>
              </Link>
            )}
          </div>
        </div>

        {showJobs ? (
          jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-[#E5E7EB]">
              <p className="text-[#65676B]">No job postings available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-[#E5E7EB]">
            <p className="text-[#65676B]">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} currentUser={currentUser} onPostDeleted={refreshPosts} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
