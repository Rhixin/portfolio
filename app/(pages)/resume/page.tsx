export default function Resume() {
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full glass-effect rounded-2xl md:rounded-3xl border border-cyan-400/20 shadow-2xl p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          My Resume
        </h1>

        {/* PDF Container */}
        <div className="glass-effect rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-purple-400/20">
          <embed
            src="/pdf/VallesCV.pdf"
            type="application/pdf"
            width="100%"
            height="600px"
            className="rounded-lg min-h-[400px] sm:min-h-[500px] md:min-h-[600px]"
          />
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <a
            href="/pdf/VallesCV.pdf"
            download
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-cyan-500/20 to-purple-500/20 glass-effect rounded-lg hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300 glow-border text-cyan-400 font-semibold"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}
