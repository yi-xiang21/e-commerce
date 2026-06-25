import React from 'react';
import anhlen1 from '../assets/len1.jpg';
import anhlen2 from '../assets/len2.jpg';


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
                    "Creating beautiful things, one stitch at a time."
                </p>
            </div>

            {/* Sweet & Simple Sections */}
            <div className="max-w-5xl mx-auto px-6 pb-20 space-y-16">

                {/* Section 1: Our Story */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4 order-2 md:order-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#e07a5f] font-serif tracking-wide">Our Little Story</h2>
                        <p className="text-base md:text-lg text-[#7a645c] leading-relaxed">
                            PeaceChill started in 2026 as a tiny cozy corner for everyone who loves knitting and crocheting. We wanted to create a peaceful place where you can slow down, relax, and make cute things with your own hands.
                        </p>
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
                        <h2 className="text-2xl md:text-3xl font-bold text-[#e07a5f] font-serif tracking-wide">What We Have For You</h2>
                        <p className="text-base md:text-lg text-[#7a645c] leading-relaxed">
                            We bring you the softest, cloud-like yarns from Merino wool to organic cotton with the prettiest pastel colors. We also host warm weekend workshops where we can sit together, drink some tea, and learn new stitches.
                        </p>
                    </div>
                </div>

                {/* Mini Cute Box */}
                <div className="bg-gradient-to-br from-[#fff4ed] to-[#fef5e7] rounded-2xl p-8 text-center max-w-xl mx-auto border border-[#fce9cf] shadow-sm">
                    <h3 className="text-xl md:text-2xl font-bold text-[#4a3731] mb-3 font-serif">
                        Want to stitch with us?
                    </h3>

                    <p className="text-sm md:text-base text-[#8c756c] mb-6 font-medium">
                        Pick your favorite yarn color or join our upcoming workshop!
                    </p>

                    <div className="flex justify-center gap-4">
                        <button className="bg-[#f9bfaf] hover:bg-[#f2957b] text-white text-sm md:text-base font-bold px-6 py-3 rounded-2xl transition-all shadow-sm active:scale-95">
                            Shop Yarn
                        </button>
                        <button className="bg-white hover:bg-[#efeeee] text-[#7a645c] text-sm md:text-base font-bold px-6 py-3 rounded-2xl border border-[#ffdcd0] transition-all shadow-sm active:scale-95">
                            Join Workshop
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;