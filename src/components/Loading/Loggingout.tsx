export default function LoggingOut() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-4">กำลังออกจากระบบ กรุณารอสักครู่</div>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}