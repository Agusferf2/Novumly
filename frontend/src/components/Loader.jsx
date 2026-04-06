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
    <div className="flex flex-col items-center justify-center gap-4 loader-fade-in">
      <div className="relative">
        {/* Thought dots above head */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-end gap-1.5">
          <span className="loader-dot" style={{ animationDelay: '0ms' }} />
          <span className="loader-dot" style={{ animationDelay: '150ms' }} />
          <span className="loader-dot" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Person thinking SVG */}
        <svg
          width="56"
          height="68"
          viewBox="0 0 56 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#969B92] dark:text-[#6B7280]"
        >
          {/* Head */}
          <circle cx="28" cy="16" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          {/* Neck + torso */}
          <path d="M28 24 L28 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          {/* Left arm — elbow on desk / knee, thinking pose */}
          <path d="M28 30 Q18 34 16 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Right arm — raised toward chin */}
          <path d="M28 30 Q38 28 36 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Hips */}
          <path d="M22 42 L34 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          {/* Left leg — seated, bent forward */}
          <path d="M22 42 Q18 50 20 58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          {/* Right leg — seated, bent forward */}
          <path d="M34 42 Q38 50 36 58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          {/* Left foot */}
          <path d="M20 58 L14 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          {/* Right foot */}
          <path d="M36 58 L42 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {label && (
        <p className="text-[#969B92] text-xs tracking-wide">{label}</p>
      )}
    </div>
  );
}
