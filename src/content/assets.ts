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
    video('mosaic-19', 432, 768, 'Behind the scenes of a talking-head shoot'),
    video('mosaic-20', 432, 768, 'Fitness creator training with a kettlebell'),
  ],

  categories: {
    food: video('cat-food', 540, 960, 'Noodles tossed in a flaming wok'),
    fashion: video('cat-fashion', 540, 960, 'Model in a teal salwar suit striking a pose'),
    beauty: video('cat-beauty', 540, 960, 'Phone recording a skincare routine'),
    fitness: video('cat-fitness', 540, 960, 'Athlete doing dumbbell lunges in a gym'),
    lifestyle: video('cat-lifestyle', 540, 960, 'Two friends filming a dance in a retro diner'),
    travel: video('cat-travel', 540, 960, 'Ghats of Pushkar lake, Rajasthan'),
    tech: video('cat-tech', 540, 960, 'Creator recording on a camera rig at a desk'),
    home: video('cat-home', 540, 960, 'A bright modern kitchen interior'),
  },

  ctaBrand: video('cta-brand', 1600, 900, 'Fashion shoot in a studio with lights and a clothes rail'),
  ctaCreator: video('cta-creator', 720, 1000, 'Creators dancing for a short video in front of a ring light'),
  creatorsHero: video('creators-hero', 1920, 1080, 'A creator recording at a desk with a camera rig'),
  creatorsHeroMobile: video('creators-hero-mobile', 720, 1280, 'A creator recording at a desk with a camera rig'),

  /** Product stills for mock UI panels (no faces). */
  ui: {
    pizza: still('ui-pizza', 360, 640, 'Pepperoni pizza close-up'),
    coffee: still('ui-coffee', 360, 640, 'Coffee being poured'),
    toast: still('ui-toast', 360, 640, 'Grilled toast'),
    wok: still('ui-wok', 360, 640, 'Vegetables in a wok'),
    skincare: still('ui-skincare', 360, 640, 'Skincare products on a table'),
    closet: still('ui-closet', 360, 640, 'Organised wardrobe'),
  },

  /** Hero avatar stack (licensed stock faces; mock panels use abstract avatars instead). */
  avatars: [1, 2, 3, 4, 5].map((n) => still(`avatar-${n}`, 160, 160, '')),

  logo: { poster: '/brand/ccc-logo.svg', width: 1470, height: 660, alt: 'Content Creation Company', credit: 'CCC' } satisfies MediaSlot,
} as const;

export type CategoryKey = keyof typeof assets.categories;
