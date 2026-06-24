import { Grade } from "@/lib/types";
import { GRADE_CLASS, cn } from "@/lib/utils";

export function GradeBadge({ grade, className }: { grade: Grade; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block font-display text-[11px] font-bold uppercase tracking-[0.5px] text-white",
        GRADE_CLASS[grade],
        className
      )}
      style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 7px) 100%, 0 100%)", padding: "4px 11px 4px 13px" }}
    >
      Grade {grade}
    </span>
  );
}
