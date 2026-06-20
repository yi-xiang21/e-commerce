import { useState, useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
}

const Notification = ({ type, title, message }: NotificationProps) => {

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cài giờ tự động tắt sau 5 giây (5000ms)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Cleanup timer nếu component bị hủy trước 5s
    return () => clearTimeout(timer);
  }, []);


  if (!isVisible) return null;


  const colors = {
    success: 'bg-green-50 border-green-500 text-green-700',
    error: 'bg-red-50 border-red-500 text-red-700',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-700',
    info: 'bg-blue-50 border-blue-500 text-blue-700',
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] ">
      
    <div
        className={`w-80 p-4 rounded-lg shadow-lg border-l-4 animate-slide-in-right ${colors[type]}`}
      >
        <h3 className="font-bold text-base">{title}</h3>
        <p className="text-sm mt-1 opacity-90">{message}</p>
      </div>
    </div>
  );
};

export default Notification;