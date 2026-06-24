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

export const WrenchIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className ?? ""}`} strokeWidth={1.6}>
    <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2-2 2.5-2.5z" />
  </svg>
);
