import Link from "next/link";

export default function NotFoundPage() {
  // Brand Colors
  const colors = {
    botanicalDark: "#0B1C14", // Deep background base
    botanicalMid: "#163323", // Mid green for gradient
    logoGreen: "#2E7D32", // Bright AiMS NATION green
    goldTan: "#D4AF37", // The premium gold/tan from logo
    white: "#FFFFFF",
  };

  return (
    <>
      <style>{`
        /* 0. Initial Background Fade (0s - 0.5s) */
        .animate-bg-fade {
          opacity: 0;
          animation: fadeIn 0.5s ease-in forwards;
        }

        /* 1. 404 & Icons Materialization (0.5s - 1.0s) */
        .animate-drift-in {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          animation: driftIn 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          animation-delay: 0.5s;
        }

        /* 2. Text and Button Slide Up (1.0s - 1.5s) */
        .animate-slide-up {
          opacity: 0;
          transform: translateY(30px);
          animation: slideUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          animation-delay: 1.0s;
        }

        /* 3. Subtle Character Motion (Starts after 1.0s, loops) */
        .animate-subtle-motion {
          opacity: 0;
          animation: 
            fadeIn 0.5s ease-in forwards 1.0s,
            subtleWiggle 4s ease-in-out infinite 1.5s;
          transform-origin: bottom center;
        }

        /* Floating Animation for scattered icons */
        .float-slow { animation: float 6s ease-in-out infinite; }
        .float-med { animation: float 5s ease-in-out infinite 1s; }
        .float-fast { animation: float 4s ease-in-out infinite 2s; }

        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes driftIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes subtleWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }

        /* Gradient Button */
        .btn-gold-gradient {
          background: linear-gradient(135deg, #E6C25B 0%, #B89020 100%);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          transition: all 0.3s ease;
        }
        .btn-gold-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, #F2D06B 0%, #C49C2B 100%);
        }
      `}</style>

      {/* MAIN BACKGROUND: Replace this gradient with your actual leaf image URL if preferred */}
      <main
        className="animate-bg-fade relative min-h-screen overflow-hidden flex flex-col items-center justify-center font-sans"
        style={{
          background: `radial-gradient(circle at center, ${colors.botanicalMid} 0%, ${colors.botanicalDark} 100%)`,
          // backgroundImage: `url('/path-to-your-image_5-leaves.jpg')`, // Uncomment to use real image
          // backgroundSize: 'cover',
          // backgroundPosition: 'center'
        }}
      >
        {/* Decorative Foreground Leaves (Simulated depth) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PGVsbGlwc2UgY3g9IjQwIiBjeT0iNDAiIHJ4PSIyMCIgcnk9IjQwIiBmaWxsPSIjMDAwIiB0cmFuc2Zvcm09InJvdGF0ZSg0NSA0MCA0MCkiLz48L3N2Zz4=')] opacity-5 mix-blend-overlay"></div>

        {/* --- TOP NAVIGATION HEADER --- */}
        <header className="absolute top-0 left-0 w-full px-8 py-6 z-50 flex justify-center">
          {/* Top-Left: Logo Block */}
          {/* Top-Left: Logo Block */}
          <div className="flex items-center gap-3">
            {/* Added className="w-20 h-auto" to restrict the size! */}
            <img
              src="/logo2.png"
              alt="Aims Nation Logo"
              className="w-40 h-auto"
            />
          </div>

          {/* Top-Right: Navigation */}
        </header>

        {/* --- CENTRAL 404 STRUCTURE --- */}
        <div className="animate-drift-in relative flex flex-col items-center z-10 mt-12">
          {/* Gold Open Book (Top center) */}

          {/* Giant Numbers with overlapping leaf illusion */}
          <div className="relative">
            <h1
              className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter drop-shadow-2xl"
              style={{ color: colors.white }}
            >
              404
            </h1>

            {/* Scattered Learning Icons around the numbers */}
            <div
              className="absolute top-[20%] left-[-10%] float-slow"
              style={{ color: colors.goldTan }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>{" "}
              {/* Graduation Cap */}
            </div>
            <div
              className="absolute top-[40%] right-[-15%] float-fast opacity-70"
              style={{ color: colors.goldTan }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.goldTan}
                strokeWidth="1.5"
                className="mb-[-20px] relative z-20"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>{" "}
              {/* Calculator */}
            </div>
            <div
              className="absolute bottom-[20%] left-[5%] float-med opacity-80"
              style={{ color: colors.goldTan }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 18H3l9-9-9-9h9l9 9-9 9z" />
              </svg>{" "}
              {/* Geometry/Ruler abstract */}
            </div>
          </div>
        </div>

        {/* --- TEXT AND BUTTON (Slides up last) --- */}
        <div className="animate-slide-up flex flex-col items-center z-20 text-center px-4 max-w-2xl mt-[-20px]">
          <h2
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: colors.goldTan }}
          >
            Oops! Looks like you've wandered off the path of excellence.
          </h2>
          <p
            className="text-lg md:text-xl font-medium mb-10 opacity-90"
            style={{ color: colors.white }}
          >
            This specific knowledge branch is still growing.
          </p>

          <Link
            href="/"
            className="btn-gold-gradient text-white font-bold text-lg px-10 py-4 rounded-full flex items-center gap-2"
          >
            Go To Home
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* --- BOTTOM RIGHT CHILDREN SILHOUETTE --- */}
        <div
          className="animate-subtle-motion absolute bottom-8 right-8 z-30"
          style={{ color: colors.white, opacity: 0.8 }}
        >
          {/* Using an abstract SVG to represent the children reading/tablet */}
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
            {/* Child 1 (Left, with book) */}
            <circle cx="8" cy="10" r="2.5" />
            <path d="M12 16.5c-2-2.5-6-2.5-8 0v4.5h8v-4.5z" />
            <path d="M5 14h6v2H5z" fill={colors.goldTan} />{" "}
            {/* Abstract Book */}
            {/* Child 2 (Right, with tablet) */}
            <circle cx="16" cy="11" r="2" />
            <path d="M19 17.5c-1.5-2-4.5-2-6 0v3.5h6v-3.5z" />
            <rect
              x="14"
              y="15"
              width="4"
              height="3"
              rx="0.5"
              fill={colors.goldTan}
            />{" "}
            {/* Abstract Tablet */}
          </svg>
        </div>
      </main>
    </>
  );
}
