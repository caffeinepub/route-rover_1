import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Cloud, Navigation, AlertTriangle, Calendar, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'weather' | 'traffic' | 'trip' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'weather',
      title: 'Weather Alert',
      message: 'Heavy rain expected in Paris tomorrow afternoon',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'traffic',
      title: 'Traffic Update',
      message: 'Moderate traffic on Main Route, consider alternative',
      time: '15 min ago',
      read: false,
    },
    {
      id: '3',
      type: 'trip',
      title: 'Trip Reminder',
      message: 'Your trip to Tokyo starts in 3 days',
      time: '1 hour ago',
      read: true,
    },
    {
      id: '4',
      type: 'alert',
      title: 'Budget Alert',
      message: 'You have spent 80% of your accommodation budget',
      time: '2 hours ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <Cloud className="h-5 w-5 text-blue-500" />;
      case 'traffic':
        return <Navigation className="h-5 w-5 text-orange-500" />;
      case 'trip':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Bell className="h-6 w-6" />
              Notification Center
            </CardTitle>
            <CardDescription>Stay updated with real-time alerts</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-sm">
              {unreadCount} New
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Bell className="mx-auto mb-3 h-12 w-12 opacity-20" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 rounded-lg border-2 p-4 transition-all ${
                  notification.read ? 'bg-muted/30' : 'bg-white dark:bg-gray-900'
                }`}
              >
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                
                <div className="flex-1">
                  <div className="mb-1 flex items-start justify-between">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setNotifications([])}
          >
            Clear All Notifications
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
