"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { type Post, toggleLike, addComment, deletePost, updatePost } from "@/lib/posts"
import type { User } from "@/lib/auth"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PostCardProps {
  post: Post
  currentUser: User
  onPostDeleted?: () => void
}

export function PostCard({ post, currentUser, onPostDeleted }: PostCardProps) {
  const [localPost, setLocalPost] = useState(post)
  const [comment, setComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const initials = localPost.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const isLiked = localPost.likes.includes(currentUser.email)
  const isAuthor = localPost.authorEmail === currentUser.email

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const postDate = new Date(timestamp)
    const diffInMs = now.getTime() - postDate.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMins = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMins}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const handleLike = () => {
    const updatedPost = toggleLike(localPost.id, currentUser.email)
    if (updatedPost) {
      setLocalPost(updatedPost)
    }
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    const updatedPost = addComment(localPost.id, {
      author: currentUser.name,
      text: comment.trim(),
      timestamp: new Date().toISOString(),
    })

    if (updatedPost) {
      setLocalPost(updatedPost)
      setComment("")
      setShowComments(true)
    }
  }

  const handleEdit = () => {
    if (!editContent.trim()) return

    const updatedPost = updatePost(localPost.id, { content: editContent.trim() })
    if (updatedPost) {
      setLocalPost(updatedPost)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    const success = deletePost(localPost.id)
    if (success && onPostDeleted) {
      onPostDeleted()
    }
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className="border-[#E5E7EB] bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between p-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-[#0A66C2] ring-opacity-20">
              <AvatarFallback className="bg-[#0A66C2] text-white font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[15px] text-black">{localPost.author}</p>
              <p className="text-[13px] text-[#65676B]">{getTimeAgo(localPost.timestamp)}</p>
            </div>
          </div>
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#F0F0F0]">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <CardContent className="p-4">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px] resize-none text-[15px]"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(localPost.content)
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleEdit} className="bg-[#0A66C2] hover:bg-[#004182]">
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[15px] leading-relaxed text-black whitespace-pre-wrap">{localPost.content}</p>

              {localPost.hashtags && localPost.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {localPost.hashtags.map((tag, idx) => (
                    <button
                      key={idx}
                      className="inline-flex px-3 py-1.5 bg-[#E7F3FF] rounded-full text-[#0A66C2] hover:bg-[#CCE5FF] transition-colors font-medium text-[13px] border border-[#0A66C2] border-opacity-20"
                      onClick={() => {
                        console.log(`Clicked hashtag: ${tag}`)
                      }}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

              {localPost.image && (
                <div className="mt-3 rounded-lg overflow-hidden bg-[#F0F0F0]">
                  <img
                    src={localPost.image || "/placeholder.svg"}
                    alt="Post image"
                    className="w-full object-cover max-h-[400px] hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>

        <div className="px-4 py-2 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[13px] text-[#65676B] mb-2 px-2">
            <span>{localPost.likes.length} likes</span>
            <span>{localPost.comments.length} comments</span>
          </div>
          <div className="flex items-center divide-x divide-[#E5E7EB] mb-2">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 gap-2 text-[15px] font-500 hover:bg-[#F0F0F0] rounded-none ${
                isLiked ? "text-[#0A66C2]" : "text-[#65676B]"
              }`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              Like
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-2 text-[15px] font-500 text-[#65676B] hover:bg-[#F0F0F0] rounded-none"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              Comment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-2 text-[15px] font-500 text-[#65676B] hover:bg-[#F0F0F0] rounded-none"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {showComments && (
            <div className="mt-3 pt-3 border-t border-[#E5E7EB] space-y-3">
              {localPost.comments.map((c, idx) => (
                <div key={idx} className="flex gap-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-[#0A66C2] text-white text-xs">
                      {c.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-black">{c.author}</p>
                    <p className="text-[13px] text-[#65676B]">{c.text}</p>
                  </div>
                </div>
              ))}

              <form onSubmit={handleComment} className="flex gap-2 mt-3">
                <Input
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="h-9 text-[13px] border-[#E5E7EB]"
                />
                <Button type="submit" size="sm" className="bg-[#0A66C2] hover:bg-[#004182] text-white">
                  Post
                </Button>
              </form>
            </div>
          )}
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
