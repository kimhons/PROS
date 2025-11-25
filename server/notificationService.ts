import { EventEmitter } from "events";
import { createNotification, getNotificationsForUser, getUnreadNotificationCount } from "./db";
import { InsertNotification } from "../drizzle/schema";

/**
 * Notification Service
 * 
 * Handles real-time notifications for admin users using Server-Sent Events (SSE).
 * When a notification is created, it's saved to the database and emitted to connected clients.
 */

class NotificationService extends EventEmitter {
  private static instance: NotificationService;

  private constructor() {
    super();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Create and emit a notification
   */
  async notify(notification: InsertNotification) {
    try {
      // Save to database
      await createNotification(notification);
      
      // Emit event for real-time delivery
      this.emit("notification", notification);
      
      console.log(`[NotificationService] Notification created for user ${notification.userId}: ${notification.title}`);
    } catch (error) {
      console.error("[NotificationService] Failed to create notification:", error);
    }
  }

  /**
   * Notify all admin users
   */
  async notifyAdmins(notification: Omit<InsertNotification, "userId">, adminUserIds: number[]) {
    for (const userId of adminUserIds) {
      await this.notify({ ...notification, userId });
    }
  }

  /**
   * Subscribe to notifications for a specific user
   * Returns an event listener that can be used with SSE
   */
  subscribeToNotifications(userId: number, callback: (notification: InsertNotification) => void) {
    const listener = (notification: InsertNotification) => {
      if (notification.userId === userId) {
        callback(notification);
      }
    };

    this.on("notification", listener);

    // Return cleanup function
    return () => {
      this.off("notification", listener);
    };
  }
}

export const notificationService = NotificationService.getInstance();

/**
 * Helper functions for creating specific notification types
 */

export async function notifyNewApplication(adminUserId: number, applicationId: number, applicantName: string, jobTitle: string) {
  await notificationService.notify({
    userId: adminUserId,
    type: "application",
    title: "New Job Application",
    message: `${applicantName} applied for ${jobTitle}`,
    link: `/admin/applications/${applicationId}`,
    relatedId: applicationId,
    isRead: 0,
  });
}

export async function notifyNewContact(adminUserId: number, contactId: number, contactName: string, inquiryType: string) {
  await notificationService.notify({
    userId: adminUserId,
    type: "contact",
    title: "New Contact Inquiry",
    message: `${contactName} submitted a ${inquiryType} inquiry`,
    link: `/admin/contacts/${contactId}`,
    relatedId: contactId,
    isRead: 0,
  });
}

export async function notifySystemEvent(adminUserId: number, title: string, message: string) {
  await notificationService.notify({
    userId: adminUserId,
    type: "system",
    title,
    message,
    isRead: 0,
  });
}
