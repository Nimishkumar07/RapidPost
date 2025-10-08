# Implementation Plan

- [x] 1. Set up core notification infrastructure


  - Install Socket.io dependency for real-time WebSocket functionality
  - Create Notification model with proper schema and relationships
  - Create NotificationService class with core business logic methods
  - _Requirements: 1.2, 2.2, 4.2_



- [ ] 2. Implement notification data models and validation
  - [ ] 2.1 Create Notification model with schema validation
    - Define notification schema with recipient, sender, type, message, and metadata fields
    - Add proper indexes for performance on recipient, createdAt, and isRead fields


    - Implement schema validation for notification types and required fields
    - _Requirements: 1.1, 1.2, 2.1, 2.2_

  - [ ] 2.2 Extend User model with notification preferences
    - Add notificationPreferences object to User schema with toggles for each notification type
    - Set default preferences to enable all notification types
    - _Requirements: 6.1, 6.2, 6.3_

  - [x]* 2.3 Write unit tests for notification models


    - Create unit tests for Notification model validation and relationships
    - Test User model notification preferences functionality
    - _Requirements: 1.2, 6.1_

- [x] 3. Create notification service layer


  - [ ] 3.1 Implement NotificationService class with core methods
    - Write createNotification method to store notifications in database
    - Implement getUserNotifications method with pagination support
    - Create markAsRead and deleteNotifications methods for notification management
    - Add getUnreadCount method for badge counter functionality
    - _Requirements: 1.2, 4.1, 4.2, 7.1, 7.2, 8.1_

  - [ ] 3.2 Add notification preference checking logic
    - Implement checkUserPreferences method to respect user notification settings


    - Integrate preference checking into notification creation workflow
    - _Requirements: 6.2, 6.4_

  - [x]* 3.3 Write unit tests for notification service


    - Test all NotificationService methods with various input scenarios
    - Test preference checking logic and edge cases
    - _Requirements: 1.2, 4.1, 6.2_

- [ ] 4. Implement WebSocket real-time functionality
  - [ ] 4.1 Set up Socket.io server integration
    - Configure Socket.io with Express server in server.js
    - Implement user authentication for WebSocket connections
    - Create socket connection management and room joining logic
    - _Requirements: 5.1, 5.2_



  - [ ] 4.2 Create real-time notification broadcasting
    - Implement sendRealTimeNotification method in NotificationService
    - Add socket event handlers for notification delivery


    - Create notification broadcasting to specific user rooms
    - _Requirements: 5.2, 5.3_

  - [x]* 4.3 Write integration tests for WebSocket functionality


    - Test WebSocket connection establishment and authentication
    - Test real-time notification delivery across multiple clients
    - _Requirements: 5.1, 5.2_


- [ ] 5. Enhance existing controllers to trigger notifications
  - [ ] 5.1 Update likes controller to create like notifications
    - Modify toggleLike function in controllers/likes.js to create notifications
    - Add notification creation when user likes a blog post
    - Ensure notifications are only created for new likes, not unlikes
    - _Requirements: 1.1, 1.2_

  - [ ] 5.2 Update reviews controller to create comment notifications
    - Modify createReview function in controllers/reviews.js to create notifications
    - Add notification creation when user comments on a blog post
    - Include comment preview in notification message
    - _Requirements: 2.1, 2.2_

  - [ ] 5.3 Update follow controller to create follow notifications
    - Modify toggleFollow function in controllers/follow.js to create notifications
    - Add notification creation when user follows another user
    - Ensure notifications are only created for new follows, not unfollows
    - _Requirements: 3.1, 3.2_

  - [x] 5.4 Update blog controller to create new post notifications

    - Modify blog creation functionality to notify all followers
    - Implement batch notification creation for users with many followers
    - Add efficient follower lookup and notification creation
    - _Requirements: 3.1, 3.2_

- [ ] 6. Create notification management controller and routes
  - [x] 6.1 Implement notifications controller


    - Create controllers/notifications.js with CRUD operations
    - Implement getNotifications endpoint with pagination support
    - Add markAsRead, deleteNotification, and markAllAsRead endpoints
    - Create getUnreadCount endpoint for navigation badge
    - _Requirements: 4.1, 4.2, 7.1, 7.2, 8.1_



  - [ ] 6.2 Set up notification routes
    - Create routes/notifications.js with all notification endpoints
    - Add proper authentication middleware to protect notification routes
    - Integrate notification routes into main server.js
    - _Requirements: 4.1, 7.1, 8.1_

  - [ ]* 6.3 Write integration tests for notification endpoints
    - Test all notification CRUD operations with real database
    - Test authentication and authorization for notification endpoints


    - _Requirements: 4.1, 7.1_

- [ ] 7. Create notification preferences management
  - [x] 7.1 Implement notification preferences controller



    - Create getUserPreferences and updatePreferences endpoints
    - Add validation for preference update requests
    - Integrate with existing user profile management


    - _Requirements: 6.1, 6.3_

  - [ ] 7.2 Add preferences routes and middleware
    - Create routes for notification preference management
    - Add proper validation middleware for preference updates


    - _Requirements: 6.1, 6.3_

- [ ] 8. Build notification user interface components
  - [x] 8.1 Create notification list page

    - Build EJS template for notifications page (views/notifications/index.ejs)
    - Implement pagination controls and notification display
    - Add mark as read and delete functionality to UI
    - Style notifications with proper read/unread visual distinction
    - _Requirements: 4.1, 4.2, 4.3, 7.1, 7.3_



  - [ ] 8.2 Add notification counter to navigation
    - Update navigation template to include notification badge
    - Implement real-time counter updates via WebSocket
    - Add click handler to navigate to notifications page
    - _Requirements: 8.1, 8.2, 8.3, 8.4_



  - [ ] 8.3 Implement real-time toast notifications
    - Create JavaScript client-side WebSocket connection
    - Build toast notification component for real-time alerts


    - Add proper positioning and timing for toast messages
    - Implement auto-dismiss and manual close functionality
    - _Requirements: 5.3, 5.4_

  - [x] 8.4 Create notification preferences UI


    - Build preferences form in user profile or settings page
    - Add toggle switches for each notification type
    - Implement AJAX form submission for preference updates
    - _Requirements: 6.1, 6.3_




- [ ] 9. Implement notification cleanup and optimization
  - [x] 9.1 Add database indexes and performance optimizations



    - Create database indexes on notification collection for optimal query performance
    - Implement efficient pagination queries for large notification lists
    - Add cleanup job for old read notifications
    - _Requirements: 4.2, 4.4_

  - [ ] 9.2 Add error handling and logging
    - Implement comprehensive error handling in all notification-related code
    - Add proper logging for notification creation and delivery
    - Create fallback mechanisms for failed real-time delivery
    - _Requirements: 1.4, 5.4_

- [ ] 10. Final integration and testing
  - [ ] 10.1 Wire together all notification components
    - Ensure all notification triggers work end-to-end
    - Test complete notification flow from creation to user interaction
    - Verify real-time delivery works across different browser tabs
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

  - [ ] 10.2 Add notification system to main navigation and user flows
    - Update main layout template to include notification functionality
    - Ensure notification links and counters appear in appropriate places
    - Test notification system integration with existing user workflows
    - _Requirements: 8.1, 8.4_

  - [ ]* 10.3 Perform end-to-end testing
    - Test complete user scenarios across multiple browser sessions
    - Verify notification preferences work correctly
    - Test performance with multiple concurrent users
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_