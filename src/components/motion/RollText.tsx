import type { CSSProperties } from "react";

/**
 * Vertical roll text (MOTION mục 1). CSS thuần: mỗi ký tự có 2 bản sao xếp dọc trong mask,
 * hover vào phần tử cha có class `group` thì ký tự cuộn lên, stagger trái → phải; rời chuột cuộn về phải → trái.
 * Mask có đệm dọc 0.3em để không cắt dấu tiếng Việt.
 */
export function RollText({ text, className = "" }: { text: string; className?: string }) {
  const chars = Array.from(text);
  const n = chars.length;
  return (
    <span className={`roll-text ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex">
        {chars.map((c, i) => (
          <span
            key={i}
            className="roll-char"
            style={{ "--i": i, "--r": n - 1 - i } as CSSProperties}
          >
            <span className="roll-inner">
              <span>{c === " " ? " " : c}</span>
              <span className="roll-copy">{c === " " ? " " : c}</span>
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
