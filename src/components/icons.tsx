type IconProps = { className?: string };

const base = "fill-none stroke-current";

export const SearchIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={2}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const UserIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={1.7}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);

export const CartIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={1.7}>
    <path d="M6 6h15l-1.5 9h-12z" />
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M6 6L5 3H2" />
  </svg>
);

export const MenuIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={1.7}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={2}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ArrowIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={2.2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const HeartIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={1.7}>
    <path d="M12 21s-7-4.5-9.5-8.5C.5 8 3 4 6.5 4 9 4 12 7 12 7s3-3 5.5-3C21 4 23.5 8 21.5 12.5 19 16.5 12 21 12 21z" />
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={2.2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={2.2}>
    <path d="M5 12h14" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={2.4}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const StarIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" />
  </svg>
);

export const QuoteIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M9.5 5C6.5 6.5 4.8 9.2 4.8 12.6c0 3.4 2 5.6 4.6 5.6 2.2 0 3.9-1.6 3.9-3.7 0-2-1.4-3.5-3.3-3.5-.4 0-.8.1-1 .2.4-1.6 1.8-3.1 3.6-4L9.5 5zm9 0c-3 1.5-4.7 4.2-4.7 7.6 0 3.4 2 5.6 4.6 5.6 2.2 0 3.9-1.6 3.9-3.7 0-2-1.4-3.5-3.3-3.5-.4 0-.8.1-1 .2.4-1.6 1.8-3.1 3.6-4L18.5 5z" />
  </svg>
);

export const LockIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={1.8}>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 018 0v3" />
  </svg>
);

export const ShieldIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={1.8}>
    <path d="M12 3l7 3v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const TruckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={1.8}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
);

export const ChatIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={1.8}>
    <path d="M21 12a8 8 0 01-8 8H4l2-3a8 8 0 1115-5z" />
  </svg>
);

export const WrenchIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={1.6}>
    <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2-2 2.5-2.5z" />
  </svg>
);
