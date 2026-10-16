interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
  showWordmark?: boolean;
}

/**
 * The official Waracle logo (mark + wordmark), used across the app. The asset
 * is the real brand logo; a white version is used on dark backgrounds and the
 * near-black version on light backgrounds.
 *
 * `showWordmark` is kept for API compatibility with existing call sites.
 */
export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const src = variant === 'dark' ? '/logo-dark.png' : '/logo-white.png';
  return (
    <img
      src={src}
      alt="Waracle"
      className={`h-7 w-auto shrink-0 self-start ${className}`}
      draggable={false}
    />
  );
}
