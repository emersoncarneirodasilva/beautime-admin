import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  color?: string;
  text?: string;
  fullscreen?: boolean;
}

export default function Spinner({
  size = 60,
  color = "var(--color-action)",
  text,
  fullscreen = false,
}: SpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <Loader2
        className="animate-spin"
        style={{ width: size, height: size, color }}
      />
      {text &&       <p className="text-[var(--text-secondary)]">{text}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <section
        className="loading-overlay fixed inset-0 z-50 grid place-items-center bg-[var(--background)] text-[var(--foreground)]"
        role="status"
        aria-live="polite"
      >
        {spinner}
      </section>
    );
  }

  return spinner;
}
