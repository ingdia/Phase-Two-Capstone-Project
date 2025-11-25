# Echo Post - Medium Clone

A full-featured publishing platform built with Next.js, and TypeScript. Create, share, and discover stories with a rich text editor, social features, and modern design.

## Features

- **Rich Text Editor** - Create formatted content with images, headings, and styling
- **User Authentication** - Secure JWT-based login and registration
- **Social Features** - Like, comment, follow authors, nested replies
- **Content Management** - Draft/publish workflow, tags, search functionality
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Real-time Updates** - React Query for optimized data fetching and caching

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **File Upload**: Cloudinary integration
- **Icons**: Lucide React
- **State Management**: React Query, Context API

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Phase-Two-Capstone-Project/echo-post.git
cd echo-post
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/echopost"
JWT_SECRET="your-jwt-secret"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. Set up the database
```bash
npx prisma migrate dev
npx prisma generate
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (api)/             # API routes
│   ├── (website)/         # Public pages
│   └── dashboard/         # Protected dashboard
├── components/            # Reusable UI components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── types/                # TypeScript definitions
```

## Key Features

### Authentication
- JWT-based authentication
- Protected routes
- User profiles with avatars and bios

### Content Creation
- Rich text editor with formatting options
- Image upload and optimization
- Draft and publish workflow
- Tag system for categorization

### Social Features
- Like/unlike posts
- Nested comment system
- Follow/unfollow authors
- User profiles and author pages

### Performance
- React Query for data caching
- Optimistic UI updates
- Image optimization with Next.js
- Responsive design for all devices

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Posts
- `GET /post` - Get posts (with filters)
- `POST /post` - Create new post
- `GET /post/[slug]` - Get single post
- `PUT /post/[slug]` - Update post
- `DELETE /post/[slug]` - Delete post

### Social
- `POST /post/[slug]/like` - Like/unlike post
- `GET /post/[slug]/comments` - Get comments
- `POST /post/[slug]/comments` - Add comment
- `POST /users/[id]/follow` - Follow/unfollow user


## Screenshots

### Dashboard
![Dashboard](docs/dashboard.png)

### Rich Text Editor
![Editor](docs/editor.png)

### Post View
![Post View](docs/post-view.png)


