#  Echo Post - Modern Blogging Platform

A full-stack blogging platform built with Next.js, TypeScript, and PostgreSQL. Create, share, and discover engaging content with a Medium-inspired interface.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

##  Features

###  Content Management
- **Rich Text Editor**: Create beautiful posts with Lexical editor
- **Draft System**: Save drafts and publish when ready
- **Cover Images**: Upload and manage post cover images via Cloudinary
- **Tags & Categories**: Organize content with tags and categories
- **Reading Time**: Automatic reading time calculation

###  Social Features
- **Like Posts**: Show appreciation with likes (claps)
- **Comments**: Engage with authors through comments
- **Follow System**: Follow your favorite authors
- **User Profiles**: Customizable profiles with bio and avatar
- **Trending Content**: Discover trending posts and authors

###  User Experience
- **Responsive Design**: Beautiful, mobile-first UI with Tailwind CSS
- **Dark Mode Ready**: Modern design system
- **Real-time Updates**: Instant feedback on interactions
- **Search & Explore**: Find content by tags, authors, or keywords
- **Featured Stories**: Highlighted content on homepage

###  Security & Performance
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protect APIs from abuse
- **Password Hashing**: Bcrypt password encryption
- **Protected Routes**: Secure dashboard and API endpoints

##  Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lexical** - Rich text editor
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Robust relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image upload and management

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Prisma Migrate** - Database migrations

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ and npm/yarn/pnpm
- **PostgreSQL** 14+ database
- **Cloudinary account** (for image uploads)

##  Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd echo-post
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/echo_post?schema=public"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-here"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Generate JWT Secret:**
```bash
# On Linux/Mac
openssl rand -base64 32

# Or use any random string generator
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database with sample data
# npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

##  Project Structure

```
echo-post/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/             # Database migrations
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── (api)/             # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── post/          # Post endpoints
│   │   │   ├── users/         # User endpoints
│   │   │   └── tags/          # Tag endpoints
│   │   ├── (website)/         # Public pages
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   └── dashboard/         # Protected dashboard
│   │       ├── overview/      # Home feed
│   │       ├── createPost/    # Create post
│   │       ├── mypost/        # My posts
│   │       ├── explore/       # Explore content
│   │       └── profile/       # User profile
│   ├── components/            # React components
│   │   ├── dash/              # Dashboard components
│   │   ├── editor/            # Rich text editor
│   │   └── ...                # Other components
│   ├── context/               # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/                    # Utility libraries
│   │   ├── auth.ts            # JWT utilities
│   │   ├── prisma.ts          # Prisma client
│   │   ├── cloudinary.ts      # Cloudinary config
│   │   └── validators.ts      # Validation helpers
│   └── types/                 # TypeScript types
├── package.json
├── tsconfig.json
└── README.md
```

##  API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/post` | Get all posts (with filters) | Optional |
| POST | `/post` | Create new post | Yes |
| GET | `/post/slug/[slug]` | Get post by slug | Optional |
| GET | `/post/[postId]` | Get post by ID | Optional |
| PUT | `/post/[postId]` | Update post | Yes |
| DELETE | `/post/[postId]` | Delete post | Yes |
| GET | `/post/featured` | Get featured posts | Optional |
| GET | `/post/trending` | Get trending posts | Optional |

### Likes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/post/[postId]/like` | Like/Unlike post | Yes |

### Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/post/[postId]/comments` | Get post comments | No |
| POST | `/post/[postId]/comments` | Create comment | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/trending` | Get trending authors | No |
| POST | `/users/[id]/follow` | Follow/Unfollow user | Yes |
| GET | `/users/[id]/following-status` | Check follow status | Yes |
| GET | `/users/[id]/followers` | Get user followers | No |
| GET | `/users/[id]/following` | Get user following | No |

### Tags

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tags` | Get all tags | No |

For detailed API documentation, see [POSTMAN_TESTING_GUIDE.md](../POSTMAN_TESTING_GUIDE.md)

##  Key Features Explained

### Rich Text Editor
Built with Lexical, providing a modern, extensible rich text editing experience with support for:
- Headings, paragraphs, lists
- Bold, italic, underline
- Links and formatting
- Real-time preview

### Authentication Flow
1. User registers/logs in
2. JWT token generated and stored
3. Token sent with each authenticated request
4. Protected routes verify token validity

### Post Management
- **Drafts**: Save work in progress
- **Publishing**: One-click publish to make posts public
- **Editing**: Full edit capability for your posts
- **Deletion**: Remove posts with confirmation

### Social Interactions
- **Likes**: Toggle likes on posts (users can like their own posts)
- **Comments**: Threaded comments with author info
- **Follow**: Follow authors to see their content
- **Trending**: Algorithm-based trending content

##  Testing

### Manual Testing
Use the provided [Postman Testing Guide](../POSTMAN_TESTING_GUIDE.md) to test all API endpoints.

### Database Management

```bash
# Open Prisma Studio (Database GUI)
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name migration-name

# Deploy migrations to production
npx prisma migrate deploy
```

##  Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- `DATABASE_URL` - Production PostgreSQL connection string
- `JWT_SECRET` - Strong secret key
- `CLOUDINARY_*` - Cloudinary credentials
- `NEXT_PUBLIC_APP_URL` - Your production URL

### Database Migration

```bash
# Run migrations in production
npx prisma migrate deploy
```

##  Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lexical](https://lexical.dev/) - Rich text editor
- [Cloudinary](https://cloudinary.com/) - Image management


