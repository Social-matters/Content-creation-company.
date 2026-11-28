"use client";

import { useRef, type ElementType } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { whenNear } from "@/lib/defer";
import { ease, flow, mq } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type {
  AccentStyle,
  Headline as HeadlineContent,
  HeadlineLine,
} from "@/content/types";

const sizes = {
  mega: "text-mega",
  d1: "text-d1",
  d2: "text-d2",
  d3: "text-d3",
  d4: "text-d4",
} as const;

type Tone = "dark" | "light";

type Props = {
  lines: HeadlineContent;
  as?: ElementType;
  size?: keyof typeof sizes;
  /** Background the headline sits on: 'dark' = ink, 'light' = cream. */
  tone?: Tone;
  className?: string;
  lineClassName?: (index: number) => string | undefined;
  /**
   * undefined: reveal when scrolled into view.
   * false: stay hidden. true: reveal now (used by orchestrated sections like the hero).
   */
  play?: boolean;
  delay?: number;
  /** Where keyboard focus lands when someone is sent to this section. */
  focusTarget?: boolean;
};

/** Display headline with SplitText line-mask reveal and an animated accent word. */
export function Headline({
  lines,
  as: Tag = "h2",
  size = "d2",
  tone = "light",
  className,
  lineClassName,
  play,
  delay = 0,
  focusTarget,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (context) => {
      const el = ref.current;
      if (!el) return;
      if (play === false) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      if (play === undefined)
        return whenNear(el, () => context.add(() => revealHeadline(el, delay, { trigger: el, start: flow.start, ...flow.toggle })));
      return revealHeadline(el, delay);
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  );

  return (
    <Tag
      ref={ref}
      className={cn("font-display", sizes[size], className)}
      {...(focusTarget ? { tabIndex: -1, "data-focus-target": true } : null)}
    >
      {lines.map((line, i) => (
        <span key={i} className={cn("block", lineClassName?.(i))}>
          <Line line={line} tone={tone} />
        </span>
      ))}
    </Tag>
  );
}

/** SplitText line reveal + accent block wipe. Lines rise with a slight settle-in tilt. Returns a disposer. */
function revealHeadline(
  el: HTMLElement,
  delay: number,
  scrollTrigger?: ScrollTrigger.Vars,
) {
  const mm = gsap.matchMedia();
  mm.add({ motion: mq.motionOK, reduced: mq.reduced }, (ctx) => {
    gsap.set(el, { autoAlpha: 1 });
    if (ctx.conditions?.reduced) {
      gsap.from(el, { autoAlpha: 0, duration: 0.6, delay, scrollTrigger });
      return;
    }
    const accents = el.querySelectorAll("[data-accent-bg]");
    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "ccc-line",
      aria: "none",
      autoSplit: true,
      // Keep a highlighted phrase in one piece, with its block, when it takes two lines.
      deepSlice: false,
      onSplit(self) {
        const tl = gsap.timeline({ delay, scrollTrigger });
        tl.from(self.lines, {
          yPercent: 105,
          rotate: 2.5,
          transformOrigin: "0% 100%",
          duration: flow.dur,
          stagger: flow.stagger + 0.02,
          ease: ease.reveal,
        });
        if (accents.length) {
          tl.from(
            accents,
            { scaleX: 0, rotate: 0, duration: 1.2, ease: "expo.inOut" },
            "-=1",
          );
        }
        return tl;
      },
    });
    return () => split.revert();
  });
  return () => mm.revert();
}

function Line({ line, tone }: { line: HeadlineLine; tone: Tone }) {
  if (typeof line === "string") return <>{line}</>;
  return (
    <>
      {line.before}
      <Accent text={line.accent} style={line.style ?? "orange"} tone={tone} wrap={line.wrap} />
      {line.after}
    </>
  );
}

function Accent({
  text,
  style,
  tone,
  wrap,
}: {
  text: string;
  style: AccentStyle;
  tone: Tone;
  wrap?: boolean;
}) {
  if (style === "orange")
    return (
      <span className={tone === "dark" ? "text-orange" : "text-orange-display"}>
        {text}
      </span>
    );
  if (style === "outline") {
    return (
      <span
        className="text-transparent"
        style={{
          WebkitTextStroke: `0.035em ${tone === "dark" ? "var(--ccc-orange)" : "var(--ccc-black)"}`,
        }}
      >
        {text}
      </span>
    );
  }
  return <TiltedBlock tone={tone} wrap={wrap}>{text}</TiltedBlock>;
}

/**
 * Signature neo-brutalist highlight: a tilted block with a hard shadow behind a word.
 * On ink it's an orange block with ink text; on cream a black block with orange text.
 */
export function TiltedBlock({
  children,
  tone = "light",
  wrap,
}: {
  children: React.ReactNode;
  tone?: Tone;
  wrap?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative isolate inline-block whitespace-nowrap px-[0.09em]",
        tone === "dark" ? "text-ink" : "text-orange",
        wrap && "max-sm:whitespace-normal",
      )}
    >
      <span
        data-accent-bg
        aria-hidden
        className={cn(
          "absolute inset-x-0 -top-[0.02em] -z-10 origin-left border-[0.035em] border-black",
          // A long phrase needs a flatter tilt, or the far end of the block lifts off its letters.
          wrap ? "-bottom-[0.12em] -rotate-[0.8deg]" : "-bottom-[0.06em] -rotate-[2.2deg]",
          tone === "dark" ? "bg-orange" : "bg-black",
        )}
        style={{
          boxShadow: `0.07em 0.07em 0 0 ${tone === "dark" ? "#000" : "var(--ccc-orange)"}`,
        }}
      />
      {children}
    </span>
  );
}
