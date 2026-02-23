import { useState } from 'react';

function KeyPointItem({ point }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-[rgba(47,47,47,0.08)] last:border-none">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between gap-3 py-3 text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-[#BFA56A] text-sm flex-shrink-0">•</span>
          <span className="font-medium text-[#2F2F2F] text-[15px] leading-snug">{point.title}</span>
        </span>
        <span
          className={`text-[#969B92] text-xs flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <p className="text-[#6B7280] text-[14px] leading-[1.6] pb-3 pl-[22px]">
          {point.content}
        </p>
      )}
    </li>
  );
}

export default function KeyPoints({ keyPoints }) {
  if (!keyPoints?.length) return null;

  return (
    <div>
      <h3 className="font-semibold text-[#2F2F2F] text-[15px] mb-1">Puntos Clave</h3>
      <ul className="divide-y divide-[rgba(47,47,47,0.08)]">
        {keyPoints.map((point, i) => (
          <KeyPointItem key={i} point={point} />
        ))}
      </ul>
    </div>
  );
}
