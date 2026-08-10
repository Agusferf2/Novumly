export default function Loader({ size = 'default', label }) {
  if (size === 'sm') {
    return (
      <div className="flex items-center justify-center gap-1.5 py-2 loader-fade-in">
        <span className="loader-dot" style={{ animationDelay: '0ms' }} />
        <span className="loader-dot" style={{ animationDelay: '150ms' }} />
        <span className="loader-dot" style={{ animationDelay: '300ms' }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 loader-fade-in">

      <div className="flex items-center gap-1.5">
        <span className="loader-dot" style={{ animationDelay: '0ms' }} />
        <span className="loader-dot" style={{ animationDelay: '150ms' }} />
        <span className="loader-dot" style={{ animationDelay: '300ms' }} />
      </div>

      {label && (
        <p className="font-title text-[19px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] tracking-[-0.01em]">
          {label}
        </p>
      )}

    </div>
  );
}
