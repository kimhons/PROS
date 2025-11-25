import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { NotificationPanel } from "./NotificationPanel";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Notification Bell Component
 * 
 * Displays a bell icon with badge showing unread notification count.
 * Opens a popover panel with notification history when clicked.
 * Polls for new notifications and shows toast alerts.
 */
export function NotificationBell() {
  const utils = trpc.useUtils();
  
  // Get unread count
  const { data: unreadCount = 0 } = trpc.notifications.unreadCount.useQuery(undefined, {
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Get all notifications
  const { data: notifications = [] } = trpc.notifications.list.useQuery(undefined, {
    refetchInterval: 10000, // Poll every 10 seconds
  });

  // Mark all as read mutation
  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.unreadCount.invalidate();
      utils.notifications.list.invalidate();
    },
  });

  // Show toast for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      const notificationTime = new Date(latestNotification.createdAt).getTime();
      const now = Date.now();
      
      // If notification is less than 10 seconds old and unread, show toast
      if (now - notificationTime < 10000 && !latestNotification.isRead) {
        toast.success(latestNotification.title, {
          description: latestNotification.message,
          duration: 5000,
        });
      }
    }
  }, [notifications]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <NotificationPanel notifications={notifications} />
      </PopoverContent>
    </Popover>
  );
}
