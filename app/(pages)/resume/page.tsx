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
    </div>
  );
}
