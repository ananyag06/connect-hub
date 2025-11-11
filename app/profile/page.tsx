"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { getPosts, type Post } from "@/lib/posts"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, MessageCircle, Heart } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof getCurrentUser>>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [stats, setStats] = useState({
    posts: 0,
    likes: 0,
    comments: 0,
  })

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/auth/login")
      return
    }
    setCurrentUser(user)

    // Get user's posts and calculate stats
    const allPosts = getPosts()
    const myPosts = allPosts.filter((p) => p.author === user.name)
    setUserPosts(myPosts)

    const totalLikes = myPosts.reduce((sum, post) => sum + post.likes.length, 0)
    const totalComments = myPosts.reduce((sum, post) => sum + post.comments.length, 0)

    setStats({
      posts: myPosts.length,
      likes: totalLikes,
      comments: totalComments,
    })
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-muted/30">
      <NavBar currentUser={currentUser} onLogout={handleLogout} />

      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-col items-center text-center space-y-4 pb-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Joined {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{stats.posts}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <p className="text-2xl font-bold">{stats.likes}</p>
                </div>
                <p className="text-sm text-muted-foreground">Likes</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <p className="text-2xl font-bold">{stats.comments}</p>
                </div>
                <p className="text-sm text-muted-foreground">Comments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-bold mb-4">My Posts</h2>
          {userPosts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center">You haven't posted anything yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes.length}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.comments.length}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
