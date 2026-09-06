import Image from "next/image";
import { Sparkles } from "lucide-react";
import heroArtwork from "@/app/assests/car.png";

/**
 * Full-bleed indigo banner at the top of the Shop page. Extra bottom padding
 * leaves room for the segmented tabs, which straddle its lower edge.
 *
 * The artwork ships with its own background baked in, so the panel gradient is
 * sampled from the same PNG and the image's left edge is masked into it.
 */
export function ShopHeroBanner() {
  return (
    <div className="shop-hero relative overflow-hidden px-5 pt-7 pb-[4.5rem]">
      <div
        aria-hidden
        className="shop-hero-beam pointer-events-none absolute -bottom-28 -left-16 h-72 w-[150%] rotate-[-22deg]"
      />

      <Image
        src={heroArtwork}
        alt=""
        priority
        aria-hidden
        sizes="210px"
        className="shop-hero-art pointer-events-none absolute -top-3 right-0 h-auto w-[48%] max-w-[210px] select-none"
      />

      <div className="relative max-w-[58%]">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.02em] whitespace-nowrap text-white">
          <Sparkles size={13} strokeWidth={2.4} />
          NO-COST EMIs
        </span>

        <h1 className="mt-4 text-[28px] leading-[1.13] font-extrabold tracking-[-0.01em] text-white">
          Shop today,
          <br />
          {/*
            Slanted rather than set in the family's true italic: Plus Jakarta
            Sans's italic redraws several letterforms, which reads as a
            different typeface next to the upright lines. Skewing the upright
            face keeps the letterforms identical and only adds the lean.
          */}
          <span className="hero-slant">
            Pay later using
          </span>
          <br />
          Mutual funds.
        </h1>

        <p className="mt-3 text-[12px] leading-[1.45] font-medium text-white/85">
          No credit score required. No interest.
          <br />
          Backed by your investments.
        </p>
      </div>
    </div>
  );
}
