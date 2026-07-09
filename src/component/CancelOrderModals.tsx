import React from "react";
import knittingIcon from '@/assets/knitting.png';

interface CancelOrderModalsProps {
    isConfirmOpen: boolean;
    isSuccessOpen: boolean;
    orderId: string | number;
    paymentMethod: "COD" | "MoMo" | string; 
    onCloseConfirm: () => void;
    onCloseSuccess: () => void;
    onConfirmCancel: () => void;
}

export const CancelOrderModals = ({
    isConfirmOpen,
    isSuccessOpen,
    orderId,
    paymentMethod,
    onCloseConfirm,
    onCloseSuccess,
    onConfirmCancel,
}: CancelOrderModalsProps) => {
    return (
        <>
            {/* POP-UP 1: XÁC NHẬN HỦY ĐƠN HÀNG CHUNG */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-rose-50/70 flex items-center justify-center mx-auto p-4 relative">
                            <div className="absolute inset-0 rounded-full bg-rose-100/40 scale-110 -z-10 blur-sm"></div>
                            <img
                                src={knittingIcon}
                                alt="Cuộn len"
                                className="w-full h-full object-contain drop-shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-base font-bold text-slate-900">Xác nhận hủy đơn hàng</h3>
                            <p className="text-xs text-slate-500 leading-relaxed px-2">
                                Bạn có chắc chắn muốn hủy đơn hàng <strong>#{orderId}</strong> không?
                            </p>
                            
                            {/* Dòng note cho đơn MoMo */}
                            {paymentMethod === "MoMo" && (
                                <p className="text-[11px] text-emerald-600 bg-emerald-50 rounded-lg p-2 font-medium">
                                    Tiền thanh toán qua MoMo của đơn này sẽ được tự động hoàn trả lại vào ví của bạn.
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onCloseConfirm}
                                className="flex-1 px-4 py-2.5 text-xs font-medium border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                            >
                                Quay lại
                            </button>
                            <button
                                type="button"
                                onClick={onConfirmCancel}
                                className="flex-1 px-4 py-2.5 text-xs font-medium bg-red-300 text-white rounded-xl hover:bg-red-500 shadow-md transition"
                            >
                                Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* POP-UP 2: THÔNG BÁO THÀNH CÔNG */}
            {isSuccessOpen && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={onCloseSuccess} 
                >
                    <div
                        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 relative text-center space-y-4 animate-in fade-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <button
                            type="button"
                            onClick={onCloseSuccess}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-50 transition cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L12 12M12 12l7-7M12 12l-7 7m7-7l7 7" />
                            </svg>
                        </button>

                        <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto text-2xl font-bold">
                            ✓
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-900">Hủy đơn thành công!</h3>
                            <p className="text-xs text-slate-500 leading-relaxed px-2">
                                {paymentMethod === "MoMo" 
                                    ? `Đơn hàng #${orderId} đã được hủy thành công và hệ thống đang xử lý lệnh hoàn tiền.` 
                                    : `Yêu cầu hủy đơn hàng #${orderId} đã được xử lý thành công.`}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};