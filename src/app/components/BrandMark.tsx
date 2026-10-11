interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={`${className} shrink-0`}>
      <path d="M10 4h14l8 8v23H10a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z" fill="#174A3B" />
      <path d="M24 4v8h8" fill="#D8F279" />
      <path d="M13 18h12M13 23h8" stroke="#fff" strokeLinecap="round" strokeWidth="2" />
      <path d="m20 30 3-3 3 2 4-5" fill="none" stroke="#D8F279" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
