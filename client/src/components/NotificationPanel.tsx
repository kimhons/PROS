import { formatDistanceToNow } from "date-fns";
import { X, Briefcase, Mail, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import type { Notification } from "../../../drizzle/schema";

interface NotificationPanelProps {
  notifications: Notification[];
}

/**
 * Notification Panel Component
 * 
 * Displays a scrollable list of notifications with actions.
 * Clicking a notification marks it as read and navigates to the related page.
 */
export function NotificationPanel({ notifications }: NotificationPanelProps) {
  const utils = trpc.useUtils();
  const [, setLocation] = useLocation();

  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.unreadCount.invalidate();
      utils.notifications.list.invalidate();
    },
  });

  const deleteNotification = trpc.notifications.delete.useMutation({
    onSuccess: () => {
      utils.notifications.unreadCount.invalidate();
      utils.notifications.list.invalidate();
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead.mutate({ id: notification.id });
    }

    // Navigate to link if provided
    if (notification.link) {
      setLocation(notification.link);
    }
  };

  const handleDelete = (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    deleteNotification.mutate({ id: notificationId });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "application":
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case "contact":
        return <Mail className="h-5 w-5 text-green-500" />;
      case "job":
        return <FileText className="h-5 w-5 text-purple-500" />;
      case "system":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Bell className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96">
      <div className="divide-y">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
              !notification.isRead ? "bg-blue-50 dark:bg-blue-950/20" : ""
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={(e) => handleDelete(e, notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

// Import Bell icon for empty state
import { Bell } from "lucide-react";
