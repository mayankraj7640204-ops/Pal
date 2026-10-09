export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#10B981]/20 border-t-[#10B981] rounded-full animate-spin"></div>
        <p className="text-sm font-mono tracking-widest text-[#10B981] uppercase animate-pulse">
          Decrypting Vault...
        </p>
      </div>
    </div>
  );
}
