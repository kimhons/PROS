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
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

/**
 * Notification Bell Component
 * 
 * Displays a bell icon with badge showing unread notification count.
 * Opens a popover panel with notification history when clicked.
 * Polls for new notifications and shows toast alerts.
 * Animates bell when new notifications arrive.
 */
export function NotificationBell() {
  const utils = trpc.useUtils();
  const [isAnimating, setIsAnimating] = useState(false);
  const previousUnreadCount = useRef(0);
  const animationTimeout = useRef<NodeJS.Timeout | null>(null);
  
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

  // Trigger animation when new notifications arrive
  useEffect(() => {
    if (unreadCount > previousUnreadCount.current && unreadCount > 0) {
      // New notification arrived, trigger animation
      setIsAnimating(true);
      
      // Clear existing timeout if any
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
      
      // Stop animation after 3 seconds
      animationTimeout.current = setTimeout(() => {
        setIsAnimating(false);
      }, 3000);
    }
    
    previousUnreadCount.current = unreadCount;
    
    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
    };
  }, [unreadCount]);

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

  const handleBellClick = () => {
    // Stop animation when user clicks the bell
    setIsAnimating(false);
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={handleBellClick}
        >
          <Bell 
            className={`h-5 w-5 transition-transform ${
              isAnimating ? 'animate-bell-ring' : ''
            }`}
          />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs ${
                isAnimating ? 'animate-pulse-badge' : ''
              }`}
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
