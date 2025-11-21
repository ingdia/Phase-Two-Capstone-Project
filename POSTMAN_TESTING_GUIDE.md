# Postman Testing Guide for Echo Post API

##  Prerequisites

1. **Base URL**: `http://localhost:3000` (or your server URL)
2. **Get Authentication Token First** - You need to login to get a token

---

##  Step 1: Get Authentication Token

### Login Endpoint
**Method**: `POST`  
**URL**: `http://localhost:3000/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Expected Response** (200 OK):
```json
{
  "user": {
    "id": "user-id-here",
    "email": "your-email@example.com",
    "name": "Your Name",
    "username": "your-username"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

** IMPORTANT**: Copy the `token` value - you'll need it for all other requests!

---

##  Step 2: Get a Post ID or Slug

### Option A: Get Post by Slug
**Method**: `GET`  
**URL**: `http://localhost:3000/post/slug/your-post-slug`

**Headers** (optional - for like status):
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):
```json
{
  "id": "post-id-here",
  "slug": "your-post-slug",
  "title": "Post Title",
  "content": "Post content...",
  "userLiked": false,
  "likeCount": 5,
  ...
}
```

### Option B: Get All Posts
**Method**: `GET`  
**URL**: `http://localhost:3000/post?status=PUBLISHED&limit=10`

**Headers** (optional):
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):
```json
{
  "items": [
    {
      "id": "post-id-1",
      "slug": "post-slug-1",
      "title": "Post Title",
      ...
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

---

##  Step 3: Test LIKE Endpoint

### Like/Unlike a Post
**Method**: `POST`  
**URL**: `http://localhost:3000/post/[POST_ID]/like`

**Replace `[POST_ID]` with actual post ID**  
Example: `http://localhost:3000/post/abc123-def456-ghi789/like`

**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body**: None (empty body)

**Expected Response** (200 OK):
```json
{
  "liked": true
}
```

**To Unlike**: Call the same endpoint again - it toggles!
```json
{
  "liked": false
}
```

**Error Responses**:
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Post doesn't exist
- `429 Too Many Requests` - Rate limit exceeded

---

##  Step 4: Test COMMENT Endpoints

### Get Comments for a Post
**Method**: `GET`  
**URL**: `http://localhost:3000/post/[POST_ID]/comments`

**Headers** (optional):
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):
```json
{
  "comments": [
    {
      "id": "comment-id",
      "content": "Great post!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "author": {
        "id": "user-id",
        "name": "Author Name",
        "username": "author-username",
        "avatarUrl": "https://..."
      }
    }
  ]
}
```

### Create a Comment
**Method**: `POST`  
**URL**: `http://localhost:3000/post/[POST_ID]/comments`

**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "content": "This is my comment on the post!"
}
```

**Expected Response** (201 Created):
```json
{
  "comment": {
    "id": "comment-id",
    "content": "This is my comment on the post!",
    "postId": "post-id",
    "authorId": "your-user-id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "id": "your-user-id",
      "name": "Your Name",
      "username": "your-username",
      "avatarUrl": "https://..."
    }
  }
}
```

**Error Responses**:
- `400 Bad Request` - Empty comment content
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Post doesn't exist

---

##  Step 5: Test FOLLOW Endpoint

### Follow/Unfollow a User
**Method**: `POST`  
**URL**: `http://localhost:3000/users/[USER_ID]/follow`

**Replace `[USER_ID]` with the user ID you want to follow**  
Example: `http://localhost:3000/users/abc123-def456-ghi789/follow`

**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body**: None (empty body)

**Expected Response** (200 OK):
```json
{
  "following": true
}
```

**To Unfollow**: Call the same endpoint again - it toggles!
```json
{
  "following": false
}
```

**Error Responses**:
- `400 Bad Request` - Cannot follow yourself
- `401 Unauthorized` - Missing or invalid token
- `429 Too Many Requests` - Rate limit exceeded

---

##  Step 6: Check Following Status

### Check if You're Following a User
**Method**: `GET`  
**URL**: `http://localhost:3000/users/[USER_ID]/following-status`

**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):
```json
{
  "following": true,
  "canFollow": true
}
```

---

##  Complete Postman Collection Setup

### Environment Variables (Recommended)
Create a Postman Environment with:
- `base_url`: `http://localhost:3000`
- `token`: (set after login)
- `post_id`: (set after getting a post)
- `user_id`: (set after getting user info)

### Request Examples

#### 1. Login
```
POST {{base_url}}/auth/login
Body: { "email": "...", "password": "..." }
→ Save token to environment variable
```

#### 2. Get Posts
```
GET {{base_url}}/post?status=PUBLISHED&limit=5
Header: Authorization: Bearer {{token}}
→ Save post_id to environment variable
```

#### 3. Like Post
```
POST {{base_url}}/post/{{post_id}}/like
Header: Authorization: Bearer {{token}}
```

#### 4. Get Comments
```
GET {{base_url}}/post/{{post_id}}/comments
Header: Authorization: Bearer {{token}}
```

#### 5. Create Comment
```
POST {{base_url}}/post/{{post_id}}/comments
Header: Authorization: Bearer {{token}}
Body: { "content": "My comment" }
```

#### 6. Follow User
```
POST {{base_url}}/users/{{user_id}}/follow
Header: Authorization: Bearer {{token}}
```

---

##  Testing Checklist

- [ ] Login and get token
- [ ] Get a post ID (from slug or list)
- [ ] Like a post (should return `{"liked": true}`)
- [ ] Unlike the same post (should return `{"liked": false}`)
- [ ] Get comments for a post
- [ ] Create a comment
- [ ] Get comments again (should include your new comment)
- [ ] Follow a user (should return `{"following": true}`)
- [ ] Unfollow the same user (should return `{"following": false}`)
- [ ] Check following status

---

##  Common Issues

1. **401 Unauthorized**: 
   - Make sure you included `Authorization: Bearer YOUR_TOKEN`
   - Token might be expired - login again

2. **404 Not Found**:
   - Check the post ID is correct
   - Make sure the post exists in your database

3. **400 Bad Request**:
   - For comments: Make sure content is not empty
   - For follow: Make sure you're not trying to follow yourself

4. **429 Too Many Requests**:
   - You're hitting the rate limit - wait a moment and try again

---

##  Pro Tips

1. **Save Token as Variable**: After login, save the token as a Postman environment variable
2. **Use Collection Variables**: Create a collection with base URL variable
3. **Test in Sequence**: Login → Get Post → Like/Comment/Follow
4. **Check Response Status**: Always check the status code (200, 201, 400, 401, etc.)

---

##  Quick Reference

| Endpoint | Method | Auth Required | Body |
|----------|--------|---------------|------|
| `/auth/login` | POST | No | `{email, password}` |
| `/post/slug/[slug]` | GET | Optional | None |
| `/post/[id]/like` | POST | Yes | None |
| `/post/[id]/comments` | GET | No | None |
| `/post/[id]/comments` | POST | Yes | `{content}` |
| `/users/[id]/follow` | POST | Yes | None |
| `/users/[id]/following-status` | GET | Yes | None |

