export default function OfflinePage() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-[#C9A227] mb-4">Horizon-VIP-Move</h1>
          <p className="text-gray-400">You are offline. Please check your connection.</p>
          <a href="/en" className="mt-6 inline-block text-[#C9A227] underline">Go to Home</a>
        </div>
      </body>
    </html>
  );
}
