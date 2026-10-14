# AI Chat (ChatGPT Clone)

A full-stack conversational AI application, featuring real-time streaming responses, persistent conversation history, long-term memory across sessions, and secure user authentication.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│   Next.js 15 App Router | React 19 | Tailwind CSS v4        │
│   Radix UI Primitives | TanStack React Query                │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / EventStream
┌──────────────────────────────▼──────────────────────────────┐
│                    Next.js Server & APIs                    │
│   - /api/auth/[...nextauth]    - /api/chats                 │
│   - /api/auth/signup           - /api/chats/[id]/messages   │
│   - /api/chats/[id]/ai (Text Stream Handler)                │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼─────────────┐ ┌──────────────▼───────────────┐
│     Database & Storage     │ │          AI Services         │
│   MongoDB via Mongoose     │ │   Vercel AI SDK              │
│   - Users                  │ │   Groq (Llama 3.1 8B)        │
│   - Chats                  │ │   Mem0 (User Memory Context) │
│   - Messages               │ │                              │
└────────────────────────────┘ └──────────────────────────────┘
```
> NOTE: THis architecture diagram is a high-level overview of the system components and their interactions. It does not reflect the full implementation details or all possible data flows covered in the application currently.

### High-Level Request Flow
---

## Stacks Used

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling & UI**: Tailwind CSS, Radix UI, Lucide React
- **State & Data Fetching**: TanStack Query v5
- **AI & Memory**: Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/groq`)
- **LLM Model**: Groq model
- **Memory** Mem0 (`@mem0/vercel-ai-provider`)
- **Database & ODM**: MongoDB, Mongoose
- **Authentication**: NextAuth.js v4 with bcryptjs

---

## Features

- [x] Email/Password registration and login with bcrypt hashing (changing)
- [x] Google OAuth single sign-on
- [x] JWT-based session protection and route guards
- [x] Real-time AI response streaming with Vercel AI SDK
- [x] Ultra-fast inference powered by Groq (`llama-3.1-8b-instant`)
- [x] Multi-chat conversation management (create, persist, list, and switch chats)
- [x] Auto-scroll and responsive chat window interface
- [x] Collapsible sidebar with active chat highlights and user profile menu
- [ ] Rename and delete chats directly from the sidebar
- [ ] Markdown parsing and code syntax highlighting in chat bubbles
- [ ] Regenerate and edit message support
- [ ] Long-term personalized memory per user via Mem0
- [ ] File and image upload attachments (Cloudinary)
- [ ] Model selector (switch between different LLM models)
- [ ] Export conversation history (Markdown/JSON)

---

## Directory Structure

```
├── app/
│   ├── api/
│   │   ├── auth/            # NextAuth & registration endpoints
│   │   └── chats/           # Chat management and AI streaming endpoints
│   ├── chats/               # Chat dashboard & active chat views
│   ├── user/                # Login & signup pages
│   ├── layout.tsx           # Root layout with sidebar & providers
│   └── providers.tsx        # Session & QueryClient providers
├── components/
│   ├── ui/                  # Reusable UI elements (Radix + Tailwind)
│   ├── app-sidebar.tsx      # Sidebar navigation
│   ├── chat-input.tsx       # Message input form
│   ├── chat-list.tsx        # List of past chats
│   ├── chat-ui.tsx          # Real-time streaming chat container
│   └── message.tsx          # Chat message bubble
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── db.ts                # MongoDB connection handler
│   ├── groq.ts              # Groq client instance
│   └── api.ts               # Axios client instance
└── models/                  # Mongoose models (User, Chat, Message, FileUpload)
```

---

