# Notification System Design Document

## Overview

The notification system will be implemented as a comprehensive real-time and persistent notification service for the blog application. It will integrate with existing like, comment (review), and follow functionality to provide users with timely updates about interactions with their content and activities from users they follow.

The system will consist of:
- A new Notification model for persistent storage
- Real-time WebSocket connections for live updates
- Integration points with existing controllers
- A notification management interface
- User preference controls

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side    │    │    Database     │
│                 │    │                  │    │                 │
│ • WebSocket     │◄──►│ • Socket.io      │    │ • Notification  │
│ • Notification  │    │ • Notification   │◄──►│   Collection    │
│   UI Components │    │   Service        │    │ • User Prefs    │
│ • Toast/Popup   │    │ • Event Handlers │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Technology Stack Integration

- **Backend**: Express.js with existing MongoDB/Mongoose setup
- **Real-time**: Socket.io for WebSocket connections
- **Frontend**: EJS templates with vanilla JavaScript for real-time updates
- **Database**: MongoDB with new Notification collection

## Components and Interfaces

### 1. Notification Model

```javascript
// models/notification.js
const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['like', 'comment', 'follow', 'new_post'], 
    required: true 
  },
  message: { type: String, required: true },
  relatedBlog: { type: Schema.Types.ObjectId, ref: 'Blog' },
  relatedComment: { type: Schema.Types.ObjectId, ref: 'Review' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

### 2. Notification Service

```javascript
// services/notificationService.js
class NotificationService {
  // Create and store notification
  async createNotification(data)
  
  // Send real-time notification via WebSocket
  async sendRealTimeNotification(userId, notification)
  
  // Get user notifications with pagination
  async getUserNotifications(userId, page, limit)
  
  // Mark notifications as read
  async markAsRead(notificationIds)
  
  // Delete notifications
  async deleteNotifications(notificationIds)
  
  // Get unread count
  async getUnreadCount(userId)
}
```

### 3. WebSocket Integration

```javascript
// socket/socketHandler.js
// Handle WebSocket connections and real-time notification delivery
io.on('connection', (socket) => {
  // User authentication and room joining
  // Real-time notification broadcasting
  // Connection management
});
```

### 4. Enhanced Controllers

Existing controllers will be enhanced to trigger notifications:

- **likes.js**: Create like notifications
- **reviews.js**: Create comment notifications  
- **follow.js**: Create follow notifications
- **blogs.js**: Create new post notifications for followers

### 5. Notification Controller

```javascript
// controllers/notifications.js
export const getNotifications = async (req, res) // Get paginated notifications
export const markAsRead = async (req, res)       // Mark notifications as read
export const deleteNotification = async (req, res) // Delete specific notification
export const markAllAsRead = async (req, res)    // Bulk mark as read
export const getUnreadCount = async (req, res)   // Get unread count for badge
```

### 6. User Preferences Model Extension

```javascript
// Add to existing User model
notificationPreferences: {
  likes: { type: Boolean, default: true },
  comments: { type: Boolean, default: true },
  follows: { type: Boolean, default: true },
  newPosts: { type: Boolean, default: true }
}
```

## Data Models

### Notification Document Structure

```javascript
{
  _id: ObjectId,
  recipient: ObjectId,      // User receiving the notification
  sender: ObjectId,         // User who triggered the notification
  type: String,            // 'like', 'comment', 'follow', 'new_post'
  message: String,         // Human-readable message
  relatedBlog: ObjectId,   // Optional: related blog post
  relatedComment: ObjectId, // Optional: related comment
  isRead: Boolean,         // Read status
  createdAt: Date         // Timestamp
}
```

### Example Notification Documents

```javascript
// Like notification
{
  recipient: "user123",
  sender: "user456", 
  type: "like",
  message: "John Doe liked your blog post 'Getting Started with Node.js'",
  relatedBlog: "blog789",
  isRead: false,
  createdAt: "2024-01-15T10:30:00Z"
}

// Comment notification
{
  recipient: "user123",
  sender: "user789",
  type: "comment", 
  message: "Jane Smith commented on your blog post 'React Best Practices'",
  relatedBlog: "blog456",
  relatedComment: "comment123",
  isRead: false,
  createdAt: "2024-01-15T11:15:00Z"
}

// Follow notification
{
  recipient: "user123",
  sender: "user999",
  type: "follow",
  message: "Mike Johnson started following you",
  isRead: false,
  createdAt: "2024-01-15T12:00:00Z"
}

// New post notification
{
  recipient: "user456",
  sender: "user123", 
  type: "new_post",
  message: "John Doe published a new blog post 'Advanced JavaScript Patterns'",
  relatedBlog: "blog999",
  isRead: false,
  createdAt: "2024-01-15T14:30:00Z"
}
```

## Error Handling

### Notification Creation Errors
- Handle database connection failures gracefully
- Implement retry logic for failed notification creation
- Log errors without breaking the main user action (like, comment, etc.)

### WebSocket Connection Errors
- Handle disconnections and reconnections automatically
- Implement fallback for offline users (store notifications for later delivery)
- Handle authentication failures for WebSocket connections

### User Preference Errors
- Provide default preferences if user preferences are corrupted
- Handle preference update failures gracefully

### Database Query Errors
- Implement proper error handling for notification queries
- Handle pagination edge cases
- Provide meaningful error messages for failed operations

## Testing Strategy

### Unit Tests
- **Notification Model**: Test schema validation, required fields, and relationships
- **Notification Service**: Test all service methods with various input scenarios
- **Controller Functions**: Test notification CRUD operations and error handling
- **WebSocket Handler**: Test connection management and message broadcasting

### Integration Tests
- **End-to-End Notification Flow**: Test complete flow from trigger action to notification delivery
- **Database Integration**: Test notification storage and retrieval with real database
- **WebSocket Integration**: Test real-time notification delivery across multiple clients
- **Controller Integration**: Test enhanced controllers with notification creation

### Performance Tests
- **Bulk Notification Creation**: Test creating notifications for users with many followers
- **Real-time Delivery**: Test WebSocket performance with multiple concurrent connections
- **Database Queries**: Test notification queries with large datasets
- **Pagination Performance**: Test notification list performance with many notifications

### User Experience Tests
- **Cross-browser WebSocket Support**: Test real-time notifications across different browsers
- **Mobile Responsiveness**: Test notification UI on mobile devices
- **Accessibility**: Test notification components with screen readers
- **Toast Notification Behavior**: Test timing, positioning, and user interaction with toast messages

## Implementation Considerations

### Performance Optimizations
- **Database Indexing**: Create indexes on recipient, createdAt, and isRead fields
- **Pagination**: Implement efficient pagination for notification lists
- **Caching**: Consider caching unread counts for frequent access
- **Batch Processing**: Batch notification creation for new posts to many followers

### Security Considerations
- **Authentication**: Ensure WebSocket connections are properly authenticated
- **Authorization**: Verify users can only access their own notifications
- **Input Validation**: Validate all notification-related inputs
- **Rate Limiting**: Implement rate limiting for notification-related endpoints

### Scalability Considerations
- **WebSocket Scaling**: Design for horizontal scaling of WebSocket connections
- **Database Sharding**: Consider notification collection sharding by user
- **Queue System**: Consider implementing a queue system for high-volume notification processing
- **Cleanup Strategy**: Implement automatic cleanup of old read notifications

### User Experience Enhancements
- **Notification Grouping**: Group similar notifications (e.g., "John and 5 others liked your post")
- **Smart Timing**: Avoid overwhelming users with too many notifications at once
- **Customizable UI**: Allow users to customize notification appearance and behavior
- **Offline Support**: Queue notifications for delivery when users come back online