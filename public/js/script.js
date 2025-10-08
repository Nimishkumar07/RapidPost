// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Notification System
class NotificationManager {
    constructor() {
        this.socket = null;
        this.badge = document.getElementById('notificationBadge');
        this.bell = document.getElementById('notificationBell');
        this.swRegistration = null;
        this.init();
    }

    init() {
        // Initialize Socket.io connection if user is logged in
        if (this.badge && this.bell) {
            this.initSocket();
            this.loadUnreadCount();
            this.initServiceWorker();
        }
    }

    // Initialize Service Worker for push notifications
    async initServiceWorker() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                // Register service worker
                this.swRegistration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', this.swRegistration);
                
                // Listen for messages from service worker
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data.type === 'NOTIFICATION_CLICK') {
                        // Handle notification click navigation
                        window.location.href = event.data.url;
                    }
                });
                
                // Check if user is already subscribed
                const subscription = await this.swRegistration.pushManager.getSubscription();
                if (!subscription) {
                    // Show push notification permission prompt after a delay
                    setTimeout(() => {
                        this.showPushPermissionPrompt();
                    }, 3000); // Wait 3 seconds before showing prompt
                }
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        } else {
            console.log('Push notifications not supported');
        }
    }

    // Show push notification permission prompt
    showPushPermissionPrompt() {
        // Only show if not dismissed recently
        const dismissed = localStorage.getItem('pushPromptDismissed');
        const dismissedTime = dismissed ? new Date(dismissed) : null;
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        if (dismissed && dismissedTime > oneDayAgo) {
            return; // Don't show if dismissed recently
        }

        // Create a subtle prompt for push notifications
        const promptDiv = document.createElement('div');
        promptDiv.id = 'pushPrompt';
        promptDiv.className = 'alert alert-info alert-dismissible fade show position-fixed';
        promptDiv.style.cssText = 'top: 80px; right: 20px; z-index: 1050; max-width: 350px;';
        
        promptDiv.innerHTML = `
            <button type="button" class="btn-close" id="closePushPromptBtn" aria-label="Close"></button>
            <strong>📱 Stay Updated!</strong><br>
            Enable push notifications to get alerts even when you're not on the site.
            <div class="mt-2">
                <button id="enablePushPromptBtn" class="btn btn-primary btn-sm me-2">
                    Enable Notifications
                </button>
                <button id="dismissPushPromptBtn" class="btn btn-outline-secondary btn-sm">
                    Maybe Later
                </button>
            </div>
        `;
        
        document.body.appendChild(promptDiv);
        
        // Add event listeners
        document.getElementById('enablePushPromptBtn').addEventListener('click', () => {
            this.requestPushPermission();
        });
        
        document.getElementById('dismissPushPromptBtn').addEventListener('click', () => {
            this.dismissPushPrompt();
        });

        document.getElementById('closePushPromptBtn').addEventListener('click', () => {
            this.dismissPushPrompt();
        });
    }

    // Request push notification permission
    async requestPushPermission() {
        try {
            // Disable the button to prevent multiple clicks
            const enableBtn = document.getElementById('enablePushPromptBtn');
            if (enableBtn) {
                enableBtn.disabled = true;
                enableBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Enabling...';
            }

            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                await this.subscribeToPush();
                this.dismissPushPrompt();
                this.showToast({
                    sender: { name: 'RapidPost' },
                    message: 'Push notifications enabled! You\'ll now receive notifications on this device.'
                });
            } else if (permission === 'denied') {
                this.dismissPushPrompt();
                this.showToast({
                    sender: { name: 'RapidPost' },
                    message: 'Push notifications were denied. You can enable them later in your browser settings.'
                });
            } else {
                // Permission was dismissed/default
                if (enableBtn) {
                    enableBtn.disabled = false;
                    enableBtn.innerHTML = 'Enable Notifications';
                }
            }
        } catch (error) {
            console.error('Error requesting push permission:', error);
            const enableBtn = document.getElementById('enablePushPromptBtn');
            if (enableBtn) {
                enableBtn.disabled = false;
                enableBtn.innerHTML = 'Enable Notifications';
            }
            this.showToast({
                sender: { name: 'Error' },
                message: 'Failed to enable push notifications. Please try again.'
            });
        }
    }

    // Subscribe to push notifications
    async subscribeToPush() {
        try {
            // Get VAPID public key
            const response = await fetch('/notifications/api/push/vapid-public-key');
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Failed to get VAPID public key');
            }
            
            // Subscribe to push notifications
            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(data.publicKey)
            });
            
            // Send subscription to server
            const subscribeResponse = await fetch('/notifications/api/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subscription })
            });
            
            const subscribeData = await subscribeResponse.json();
            
            if (subscribeData.success) {
                console.log('Successfully subscribed to push notifications');
            } else {
                throw new Error(subscribeData.message);
            }
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
        }
    }

    // Dismiss push prompt
    dismissPushPrompt() {
        const prompt = document.getElementById('pushPrompt');
        if (prompt) {
            // Add fade out animation
            prompt.classList.remove('show');
            setTimeout(() => {
                prompt.remove();
            }, 150);
        }
        localStorage.setItem('pushPromptDismissed', new Date().toISOString());
    }

    // Convert VAPID key
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    initSocket() {
        // Connect to Socket.io
        this.socket = io();
        
        // Get current user ID from a data attribute or global variable
        const userId = document.body.dataset.userId || window.currentUserId;
        
        if (userId) {
            // Authenticate with the server
            this.socket.emit('authenticate', userId);
            
            // Listen for new notifications
            this.socket.on('newNotification', (notification) => {
                this.handleNewNotification(notification);
            });
        }
    }

    async loadUnreadCount() {
        try {
            const response = await fetch('/notifications/api/unread-count');
            const data = await response.json();
            
            if (data.success) {
                this.updateBadge(data.count);
            }
        } catch (error) {
            console.error('Error loading unread count:', error);
        }
    }

    updateBadge(count) {
        if (count > 0) {
            this.badge.textContent = count > 99 ? '99+' : count;
            this.badge.style.display = 'block';
        } else {
            this.badge.style.display = 'none';
        }
    }

    handleNewNotification(notification) {
        // Update badge count
        this.loadUnreadCount();
        
        // Show toast notification
        this.showToast(notification);
    }

    showToast(notification) {
        // Create toast element
        const toastContainer = this.getOrCreateToastContainer();
        
        const toastElement = document.createElement('div');
        toastElement.className = 'toast align-items-center text-white bg-primary border-0';
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');
        
        toastElement.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${notification.sender?.name || 'Someone'}</strong><br>
                    ${notification.message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toastElement);
        
        // Initialize and show toast
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 5000
        });
        
        toast.show();
        
        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    getOrCreateToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '1055';
            document.body.appendChild(container);
        }
        return container;
    }
}

// Initialize notification manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notificationManager = new NotificationManager();
});