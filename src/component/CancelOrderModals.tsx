import React, { useState } from "react";
import knittingIcon from '@/assets/knitting.png';

interface CancelOrderModalsProps {
    isConfirmOpen: boolean;
    isRefundOpen: boolean;
    isSuccessOpen: boolean;
    orderId: string | number;
    onCloseConfirm: () => void;
    onCloseRefund: () => void;
    onCloseSuccess: () => void;
    onConfirmCancel: () => void;
    onRefundSubmit: (info: { accountName: string; accountNo: string }) => void;
}

export const CancelOrderModals = ({
    isConfirmOpen,
    isRefundOpen,
    isSuccessOpen,
    orderId,
    onCloseConfirm,
    onCloseRefund,
    onCloseSuccess,
    onConfirmCancel,
    onRefundSubmit,
}: CancelOrderModalsProps) => {
    const [refundInfo, setRefundInfo] = useState({ accountName: "", accountNo: "" });

    const handleRefundFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRefundSubmit(refundInfo);
        setRefundInfo({ accountName: "", accountNo: "" });
    };

    return (
        <>
            {/* POP-UP 1: XÁC NHẬN HỦY ĐƠN HÀNG CHUNG */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-rose-50/70 flex items-center justify-center mx-auto p-4 relative animate-pulse-slow">
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

            {/* POP-UP 2: FORM NHẬP THÔNG TIN HOÀN TIỀN MOMO */}
            {isRefundOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 relative space-y-6 text-left">
                        <button
                            type="button"
                            onClick={onCloseRefund}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-50 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L12 12M12 12l7-7M12 12l-7 7m7-7l7 7" />
                            </svg>
                        </button>

                        <div className="w-16 h-16 rounded-full bg-rose-50/70 flex items-center justify-center mx-auto p-3 relative">
                            <div className="absolute inset-0 rounded-full bg-rose-100/40 scale-110 -z-10 blur-sm"></div>
                            <img src={knittingIcon} alt="Cuộn len" className="w-full h-full object-contain" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Nhập thông tin hoàn tiền MoMo</h3>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Đơn hàng <strong>#{orderId}</strong> được thanh toán qua ví MoMo. Bạn cho PeaceChill xin thông tin để bên Peacechill tiến hành hoàn tiền nhé!
                            </p>
                        </div>

                        <form onSubmit={handleRefundFormSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tên chủ tài khoản ví MoMo</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="VÍ DỤ: NGUYEN VAN A"
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm transition bg-slate-50/30 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:bg-white uppercase font-medium tracking-wide"
                                        value={refundInfo.accountName}
                                        onChange={(e) => setRefundInfo({ ...refundInfo, accountName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Số điện thoại đăng ký MoMo</label>
                                    <input
                                        type="text"
                                        required
                                        pattern="[0-9]{10}"
                                        placeholder="VÍ DỤ: 0912345678"
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm transition bg-slate-50/30 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:bg-white font-mono"
                                        value={refundInfo.accountNo}
                                        onChange={(e) => setRefundInfo({ ...refundInfo, accountNo: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-left gap-1.5 bg-rose-50/60 border border-rose-100/70 rounded-xl py-2 px-3 text-[11px] text-rose-600/90 font-medium">
                                <span>Tiền sẽ được hoàn lại tài khoản của bạn trong vòng 48h.</span>
                            </div>

                            <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onCloseRefund}
                                    className="px-6 py-3 text-sm font-medium border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 transition"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 text-sm font-medium bg-red-300 hover:bg-red-500 text-white rounded-xl shadow-md transition"
                                >
                                    Xác nhận hoàn tiền
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* POP-UP 3: THÔNG BÁO THÀNH CÔNG */}
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
                                Yêu cầu hủy đơn hàng <strong>#{orderId}</strong> đã được xử lý thành công.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};