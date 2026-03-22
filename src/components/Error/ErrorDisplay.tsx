import { ERROR_MESSAGE } from "@/constants/errorMessage";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  message?: ERROR_MESSAGE | string;
  onRetry?: () => void;
  onBack?: () => void;
}
 
export function ErrorPage({
  message,
  onRetry,
  onBack,
}: ErrorPageProps) {
 
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
 
        {/* Text */}
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-gray-800">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-sm text-gray-500">{message ?? "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่ภายหลัง"}</p>
          <p className="text-sm text-gray-500">หากปัญหายังคงอยู่ กรุณาติดต่อเจ้าหน้าที่</p>
        </div>
 
        {/* Actions */}
        {(onRetry || onBack) && (
          <div className="flex justify-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 active:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                กลับ
              </button>
            )}
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 active:bg-red-700"
              >
                <RefreshCw className="h-4 w-4" />
                ลองใหม่
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}