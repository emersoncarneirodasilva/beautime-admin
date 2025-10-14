import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  color?: string;
  text?: string;
  fullscreen?: boolean;
}

export default function Spinner({
  size = 60,
  color = "#3b82f6",
  text,
  fullscreen = false,
}: SpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <Loader2
        className="animate-spin"
        style={{ width: size, height: size, color }}
      />
      {text && <p className="text-gray-500">{text}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <section className="fixed inset-0 grid place-items-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </section>
    );
  }

  return spinner;
}
