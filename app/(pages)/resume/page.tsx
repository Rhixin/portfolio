export default function Resume() {
  return (
    <div className="flex flex-col items-center">
      {/* Embed PDF to display it on the page */}
      <embed
        src="/pdf/VallesCV.pdf"
        type="application/pdf"
        width="100%"
        height="500px"
      />

      <a
        href="/pdf/VallesCV.pdf"
        download
        className="mt-4 px-4 py-2 bg-[#373f51] text-white rounded-md"
      >
        Download PDF
      </a>
    </div>
  );
}
