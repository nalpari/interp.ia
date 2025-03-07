import { useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Lead Assigned",
    description:
      "A new lead has been assigned to you. Check your dashboard for details.",
    date: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "Meeting Reminder",
    description: "You have a team meeting scheduled in 30 minutes.",
    date: "10 minutes ago",
    read: false,
  },
  {
    id: "3",
    title: "Sales Target Update",
    description:
      "Your monthly sales target has been updated. View your new goals now.",
    date: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    title: "New Product Training",
    description:
      "New product training materials are available. Complete the course by next week.",
    date: "1 day ago",
    read: true,
  },
];

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`${unreadCount} unread notifications`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </Button>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 sm:w-96 z-50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Button
              variant="ghost"
              className="h-4 w-4 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-1">
            <ScrollArea className="h-[300px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "mb-4 p-3 rounded-lg transition-colors",
                    notification.read
                      ? "bg-gray-100"
                      : "bg-blue-50 hover:bg-blue-100"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <h3 className="text-sm font-medium">{notification.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.date}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
