"use client";

import { useRef, type ElementType } from "react";
import { gsap, SplitText, useGSAP, type ScrollTrigger } from "@/lib/gsap";
import { whenNear } from "@/lib/defer";
import { dur, ease, flow, mq, revealStart, stagger, playOnce } from "@/lib/motion";
import { useSiteVersion, type SiteVersion } from "@/lib/site-version";
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
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const { version } = useSiteVersion();

  useGSAP(
    (context) => {
      const el = ref.current;
      if (!el) return;
      if (play === false) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      if (play === undefined)
        return whenNear(el, () =>
          context.add(() =>
            revealHeadline(
              el,
              delay,
              version === "v2"
                ? { trigger: el, start: flow.start, ...flow.toggle }
                : { trigger: el, start: revealStart, ...playOnce },
              version,
            ),
          ),
        );
      return revealHeadline(el, delay, undefined, version);
    },
    { scope: ref, dependencies: [play, version], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} className={cn("font-display", sizes[size], className)}>
      {lines.map((line, i) => (
        <span key={i} className={cn("block", lineClassName?.(i))}>
          <Line line={line} tone={tone} />
        </span>
      ))}
    </Tag>
  );
}

/** SplitText line reveal + accent block wipe. v2 rises slower with a slight settle-in tilt. Returns a disposer. */
function revealHeadline(
  el: HTMLElement,
  delay: number,
  scrollTrigger?: ScrollTrigger.Vars,
  version: SiteVersion = "v1",
) {
  const v2 = version === "v2";
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
      onSplit(self) {
        const tl = gsap.timeline({ delay, scrollTrigger });
        tl.from(self.lines, {
          yPercent: v2 ? 105 : 118,
          rotate: v2 ? 2.5 : 0,
          transformOrigin: "0% 100%",
          duration: v2 ? flow.dur : dur.reveal,
          stagger: v2 ? flow.stagger + 0.02 : stagger.base,
          ease: ease.reveal,
        });
        if (accents.length) {
          tl.from(
            accents,
            { scaleX: 0, rotate: 0, duration: v2 ? 1.2 : 0.9, ease: "expo.inOut" },
            v2 ? "-=1" : "-=0.75",
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
      <Accent text={line.accent} style={line.style ?? "orange"} tone={tone} />
      {line.after}
    </>
  );
}

export function Accent({
  text,
  style,
  tone,
}: {
  text: string;
  style: AccentStyle;
  tone: Tone;
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
  return <TiltedBlock tone={tone}>{text}</TiltedBlock>;
}

/**
 * Signature neo-brutalist highlight: a tilted block with a hard shadow behind a word.
 * On ink it's an orange block with ink text; on cream a black block with orange text.
 */
export function TiltedBlock({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={cn(
        "relative isolate inline-block whitespace-nowrap px-[0.09em]",
        tone === "dark" ? "text-ink" : "text-orange",
      )}
    >
      <span
        data-accent-bg
        aria-hidden
        className={cn(
          "absolute inset-x-0 -top-[0.02em] -bottom-[0.06em] -z-10 origin-left -rotate-[2.2deg] border-[0.035em] border-black",
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
