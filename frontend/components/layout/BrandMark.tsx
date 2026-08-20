import Link from 'next/link';

export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="3" className="fill-brand-600 dark:fill-brand-500" />
      <path d="M9 8h9.5L23 13.5V24H9V8Z" fill="#FFFFFF" />
      <path d="M18.5 8V13.5H23" fill="#E8EAED" />
      <path d="M12 17h8M12 20.5h5.5" stroke="#2F5D6A" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export function BrandLockup() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <BrandMark size={32} />
      <span className="text-[17px] font-semibold tracking-tight text-ink dark:text-paper">
        FileProcessor
      </span>
    </Link>
  );
}
