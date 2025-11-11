export interface Post {
  id: string
  author: string
  authorEmail: string
  content: string
  timestamp: string
  likes: string[]
  comments: Array<{
    author: string
    text: string
    timestamp: string
  }>
  image?: string
  hashtags?: string[]
}

export interface JobPosting {
  id: string
  company: string
  position: string
  location: string
  description: string
  salary?: string
  posted: string
  applicants: number
  tags?: string[]
}

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: "Sarah Johnson",
    authorEmail: "sarah@demo.com",
    content:
      "Just launched my new portfolio website! Check it out and let me know what you think. Really proud of how it turned out.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: ["mike@demo.com"],
    comments: [
      {
        author: "Mike Chen",
        text: "Looks amazing! Love the design.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
    image: "/modern-portfolio-website.png",
    hashtags: ["WebDesign", "Portfolio", "Launch"],
  },
  {
    id: "2",
    author: "Mike Chen",
    authorEmail: "mike@demo.com",
    content: "Who else is excited about the new React features? The compiler looks incredible!",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: ["sarah@demo.com", "emma@demo.com"],
    comments: [],
    image: "/react-programming-code-on-computer-screen.jpg",
    hashtags: ["React", "JavaScript", "WebDev"],
  },
  {
    id: "3",
    author: "Emma Davis",
    authorEmail: "emma@demo.com",
    content:
      "Just finished a 5k run! Feeling energized and ready to tackle the rest of the day. Remember to take care of your health!",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: ["sarah@demo.com"],
    comments: [
      {
        author: "Sarah Johnson",
        text: "Great job! Keep it up!",
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      },
    ],
    image: "/person-running-outdoors-on-scenic-trail.jpg",
    hashtags: ["Fitness", "Running", "HealthyLifestyle"],
  },
  {
    id: "4",
    author: "Sarah Johnson",
    authorEmail: "sarah@demo.com",
    content: "Beautiful sunset from my balcony today. Nature never fails to amaze me!",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: ["emma@demo.com"],
    comments: [],
    image: "/beautiful-sunset-view-from-balcony.jpg",
    hashtags: ["Sunset", "Nature", "Photography"],
  },
  {
    id: "5",
    author: "Mike Chen",
    authorEmail: "mike@demo.com",
    content: "Coffee and coding - the perfect combination for a productive morning!",
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    likes: ["sarah@demo.com", "emma@demo.com"],
    comments: [
      {
        author: "Emma Davis",
        text: "That setup looks cozy!",
        timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(),
      },
    ],
    image: "/coffee-cup-next-to-laptop-with-code-on-screen.jpg",
    hashtags: ["Coffee", "Coding", "Programming"],
  },
  {
    id: "6",
    author: "Emma Davis",
    authorEmail: "emma@demo.com",
    content: "Trying out a new recipe today. Homemade pasta from scratch!",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: ["mike@demo.com"],
    comments: [],
    image: "/homemade-fresh-pasta-dish.jpg",
    hashtags: ["Cooking", "Foodie", "Homemade"],
  },
]

const INITIAL_JOB_POSTINGS: JobPosting[] = [
  {
    id: "job-1",
    company: "TechCorp",
    position: "Senior React Developer",
    location: "San Francisco, CA",
    description:
      "We're looking for an experienced React developer to join our growing team. Work on cutting-edge projects with modern tech stack.",
    salary: "$120K - $150K",
    posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 45,
    tags: ["React", "JavaScript", "Full-time"],
  },
  {
    id: "job-2",
    company: "InnovateLabs",
    position: "UX/UI Designer",
    location: "New York, NY",
    description:
      "Join our design team to create beautiful and user-friendly interfaces. We value creativity and attention to detail.",
    salary: "$90K - $120K",
    posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 32,
    tags: ["Design", "Figma", "Full-time"],
  },
  {
    id: "job-3",
    company: "CloudFirst",
    position: "DevOps Engineer",
    location: "Remote",
    description:
      "Help us build and maintain scalable cloud infrastructure. Experience with AWS and Kubernetes preferred.",
    salary: "$110K - $140K",
    posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 28,
    tags: ["DevOps", "AWS", "Full-time"],
  },
]

export function getPosts(): Post[] {
  if (typeof window === "undefined") return INITIAL_POSTS

  const stored = localStorage.getItem("posts")
  if (!stored) {
    localStorage.setItem("posts", JSON.stringify(INITIAL_POSTS))
    return INITIAL_POSTS
  }

  try {
    return JSON.parse(stored)
  } catch {
    return INITIAL_POSTS
  }
}

export function savePosts(posts: Post[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("posts", JSON.stringify(posts))
  }
}

export function addPost(post: Omit<Post, "id" | "timestamp" | "likes" | "comments">): Post {
  const posts = getPosts()
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    likes: [],
    comments: [],
  }
  posts.unshift(newPost)
  savePosts(posts)
  return newPost
}

export function toggleLike(postId: string, userEmail: string): Post | null {
  const posts = getPosts()
  const post = posts.find((p) => p.id === postId)

  if (!post) return null

  const likeIndex = post.likes.indexOf(userEmail)
  if (likeIndex > -1) {
    post.likes.splice(likeIndex, 1)
  } else {
    post.likes.push(userEmail)
  }

  savePosts(posts)
  return post
}

export function addComment(postId: string, comment: { author: string; text: string; timestamp: string }): Post | null {
  const posts = getPosts()
  const post = posts.find((p) => p.id === postId)

  if (!post) return null

  post.comments.push(comment)
  savePosts(posts)
  return post
}

export function deletePost(postId: string): boolean {
  const posts = getPosts()
  const filteredPosts = posts.filter((p) => p.id !== postId)

  if (filteredPosts.length === posts.length) {
    return false // Post not found
  }

  savePosts(filteredPosts)
  return true
}

export function updatePost(
  postId: string,
  updates: { content?: string; image?: string; hashtags?: string[] },
): Post | null {
  const posts = getPosts()
  const post = posts.find((p) => p.id === postId)

  if (!post) return null

  if (updates.content !== undefined) {
    post.content = updates.content
  }
  if (updates.image !== undefined) {
    post.image = updates.image
  }
  if (updates.hashtags !== undefined) {
    post.hashtags = updates.hashtags
  }

  savePosts(posts)
  return post
}

export function getJobPostings(): JobPosting[] {
  if (typeof window === "undefined") return INITIAL_JOB_POSTINGS

  const stored = localStorage.getItem("jobPostings")
  if (!stored) {
    localStorage.setItem("jobPostings", JSON.stringify(INITIAL_JOB_POSTINGS))
    return INITIAL_JOB_POSTINGS
  }

  try {
    return JSON.parse(stored)
  } catch {
    return INITIAL_JOB_POSTINGS
  }
}
