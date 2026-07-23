export default function LoadingApproval() {
  return (
    <div className="fixed inset-0 left-0 top-0 md:left-64 flex flex-col items-center justify-center bg-gray-50/50 gap-3 z-50">
      {/* Lingkaran Muter-muter */}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-sm"></div>
      
      {/* Teks Keterangan */}
      <p className="text-sm font-semibold text-gray-600 tracking-wide animate-pulse">
        Memuat Dashboard...
      </p>
    </div>
  );
}
