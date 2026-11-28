import type { MediaSlot } from './types';

/**
 * THE assets manifest. Components read media only from here.
 *
 * Every slot is produced by `pnpm assets` (scripts/fetch-assets.mjs, sources in
 * scripts/asset-sources.mjs) into public/media/<slot>.(mp4|webp). To swap in your own
 * footage, point that slot at a local file in asset-sources.mjs and re-run the script:
 * file names stay the same, so nothing here changes. Licences are tracked in ASSETS.md.
 *
 * TEMPORARY MEDIA: all current files are royalty-free stock (Mixkit) standing in for
 * CCC's own creator content. See docs/TODO-real-content.md.
 */
const MIXKIT = 'Mixkit (Mixkit Stock Video Free License)';

const video = (slot: string, width: number, height: number, alt: string): MediaSlot => ({
  src: `/media/${slot}.mp4`,
  poster: `/media/${slot}.webp`,
  width,
  height,
  alt,
  credit: MIXKIT,
});
const still = (slot: string, width: number, height: number, alt: string): MediaSlot => ({
  poster: `/media/${slot}.webp`,
  width,
  height,
  alt,
  credit: MIXKIT,
});

export const assets = {
  hero: video('hero', 1920, 1080, 'A creator filming herself on a phone gimbal outdoors'),
  heroMobile: video('hero-mobile', 720, 1280, 'A creator filming herself on a phone gimbal outdoors'),

  mosaic: [
    video('mosaic-01', 432, 768, 'Creator talking to camera in front of cereal boxes'),
    video('mosaic-02', 432, 768, 'Model in traditional Indian jewellery posing'),
    video('mosaic-03', 432, 768, 'Creator speaking straight to camera'),
    video('mosaic-04', 432, 768, 'Phone on a ring light recording a beauty creator'),
    video('mosaic-05', 432, 768, 'Creator dancing on a colourful set'),
    video('mosaic-06', 432, 768, 'Model in a teal salwar suit'),
    video('mosaic-07', 432, 768, 'Creator vlogging on the street'),
    video('mosaic-08', 432, 768, 'Creator holding a social media icon'),
    video('mosaic-09', 432, 768, 'Model checking her make-up'),
    video('mosaic-10', 432, 768, 'Phone on a ring light filming a creator'),
    video('mosaic-11', 432, 768, 'Creator setting up her phone for a skincare video'),
    video('mosaic-12', 432, 768, 'Creator walking and talking to her phone'),
    video('mosaic-13', 432, 768, 'Creator recording a selfie video'),
    video('mosaic-14', 432, 768, 'Model in Indian attire turning to camera'),
    video('mosaic-15', 432, 768, 'Creator on a video call on a terrace'),
    video('mosaic-16', 432, 768, 'Creator holding a play-button sign'),
    video('mosaic-17', 432, 768, 'Creator in red sunglasses posing'),
    video('mosaic-18', 432, 768, 'Vlogger recording in sign language'),
    video('mosaic-20', 432, 768, 'Fitness creator training with a kettlebell'),
  ],

  categories: {
    food: video('cat-food', 540, 960, 'Noodles tossed in a flaming wok'),
    fashion: video('cat-fashion', 540, 960, 'Model in a teal salwar suit striking a pose'),
    beauty: video('cat-beauty', 540, 960, 'Phone recording a skincare routine'),
    fitness: video('cat-fitness', 540, 960, 'Athlete doing dumbbell lunges in a gym'),
    lifestyle: video('cat-lifestyle', 540, 960, 'Two friends filming a dance in a retro diner'),
    travel: video('cat-travel', 540, 960, 'Ghats of Pushkar lake, Rajasthan'),
  },

  ctaBrand: video('cta-brand', 1600, 900, 'Fashion shoot in a studio with lights and a clothes rail'),
  ctaCreator: video('cta-creator', 720, 1000, 'Creators dancing for a short video in front of a ring light'),

  /** Set atmosphere for celebrity / TV work (hands and gear only, no identifiable talent). */
  sets: [
    video('set-1', 540, 960, 'Camera monitor framing a product shot on a studio set'),
    video('set-2', 540, 960, 'Operator adjusting a camera rig on a studio set'),
  ],
  /** Model shoots. */
  models: [
    video('model-1', 720, 1280, 'Fashion shoot in a creative studio with a photographer and a model'),
    video('model-2', 540, 960, 'Model in a white dress posing against a white backdrop'),
  ],

  /** Hero avatar stack (licensed stock faces; mock panels use abstract avatars instead). */
  avatars: [1, 2, 3, 4].map((n) => still(`avatar-${n}`, 160, 160, '')),

} as const;
