
import anhlen1 from '@/assets/len1.jpg';
import anhlen2 from '@/assets/len2.jpg';


const About = () => {
    return (
        <div className="bg-[#ffffff] text-[#5c4a44] font-sans min-h-[70vh]">
            {/* Tiny Cutie Header */}
            <div className="py-16 px-6 text-center max-w-2xl mx-auto space-y-3">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#4a3731] tracking-tight font-serif">
                    Welcome to PeaceChill
                </h1>
                <div className="w-12 h-[1.5px] bg-[#e07a5f] mx-auto my-3"></div>
                <p className="text-base md:text-lg text-[#8c756c] font-medium italic max-w-lg mx-auto">
                    "Gửi gắm yêu thương qua từng mũi đan."
                </p>
            </div>

            {/* Sweet & Simple Sections */}
            <div className="max-w-5xl mx-auto px-6 pb-20 space-y-16">

                {/* Section 1: Our Story */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4 order-2 md:order-1">
                        <h3 className="text-2xl md:text-2xl font-bold text-[#e07a5f] font-serif tracking-wide">Câu Chuyện Nhỏ Của Chúng Mình</h3>
                        <p className="text-base md:text-lg text-[#7a645c] leading-relaxed">
                            PeaceChill được nhen nhóm vào năm 2026, xuất phát từ một góc nhỏ ấm cúng dành cho những ai yêu thích đan móc. Chúng mình mong muốn tạo ra một không gian yên bình — nơi bạn có thể sống chậm lại, thư giãn và tự tay làm nên những món đồ nhỏ xinh, đáng yêu.                        </p>
                    </div>

                    <div className="h-64 w-full order-1 md:order-2">
                        <img
                            src={anhlen1}
                            alt="Cozy Shop"
                            className="w-full h-full object-cover rounded-3xl border border-[#ffdcd0] shadow-sm"
                        />
                    </div>
                </div>

                {/* Section 2: What We Have */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="bg-[#fef5e7] rounded-3xl h-64 flex flex-col items-center justify-center text-[#d4a373] text-sm font-medium border-2 border-dashed border-[#fce9cf] shadow-sm">
                        <img
                            src={anhlen2}
                            alt="Cozy Shop"
                            className="w-full h-full object-cover rounded-3xl border border-[#ffdcd0] shadow-sm"
                        />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl md:text-2xl font-bold text-[#e07a5f] font-serif tracking-wide">PeaceChill Có Gì Cho Bạn?</h3>
                        <p className="text-base md:text-lg text-[#7a645c] leading-relaxed">
                            Chúng mình mang đến những sợi len mềm mại như mây, từ len Merino đến cotton hữu cơ với những gam màu pastel nhẹ nhàng nhất. Ngoài ra, PeaceChill còn tổ chức những buổi workshop ấm áp vào cuối tuần — nơi tụi mình có thể ngồi lại cùng nhau, nhâm nhi chút trà và học những mũi đan mới.
                        </p>
                    </div>
                </div>

                {/* Mini Cute Box */}
                <div className="bg-gradient-to-br from-[#fff4ed] to-[#fef5e7] rounded-2xl p-8 text-center max-w-xl mx-auto border border-[#fce9cf] shadow-sm">
                    <h3 className="text-xl md:text-2xl font-bold text-[#4a3731] mb-3 font-serif">
                        Bạn sẽ đan len cùng chúng mình chứ?
                    </h3>

                    <p className="text-sm md:text-base text-[#8c756c] mb-6 font-medium">
                        Hãy chọn màu len yêu thích hoặc đăng ký tham gia buổi workshop sắp tới ngay nhé!
                    </p>

                    <div className="flex justify-center gap-4">
                        <button className="bg-[#f9bfaf] hover:bg-[#f2957b] text-white text-sm md:text-base font-bold px-6 py-3 rounded-2xl transition-all shadow-sm active:scale-95"
                            onClick={() => window.location.href = '/shop'}>
                            Mua Len
                        </button>
                        <button className="bg-white hover:bg-[#efeeee] text-[#7a645c] text-sm md:text-base font-bold px-6 py-3 rounded-2xl border border-[#ffdcd0] transition-all shadow-sm active:scale-95"
                            // onClick={() => window.location.href = '/workshop'}
                            >
                            Tham gia Workshop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;