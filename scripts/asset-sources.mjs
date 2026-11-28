/**
 * Source list for scripts/fetch-assets.mjs. One entry per output slot.
 *
 * provider:
 *   - 'mixkit'  direct download by Mixkit item id (Mixkit Stock Video Free License)
 *   - 'pexels'  search via Pexels API (needs PEXELS_API_KEY in .env.local)
 *   - 'local'   a file you supply (path relative to project root), e.g. your own footage
 *
 * kind: 'video' (mp4 + webp poster) | 'image' (webp still taken from a video or image)
 * w/h:  output size. Source is scaled to cover and cropped; fx/fy (0–1) move the crop focus.
 * ss/t: start second and duration for video trims.
 *
 * To swap in your own media later: change the entry to { provider: 'local', file: 'raw/my-clip.mp4' }
 * and re-run `pnpm assets`. File names in public/media stay the same, so no code changes.
 */

const tile = { kind: 'video', w: 432, h: 768, t: 6, crf: 29 };
const cat = { kind: 'video', w: 540, h: 960, t: 7, crf: 28 };
const avatar = { kind: 'image', w: 160, h: 160 };

export const sources = [
  // ---- Hero ----
  { slot: 'hero', provider: 'mixkit', id: 34468, kind: 'video', w: 1920, h: 1080, ss: 0, t: 10, crf: 27, res: 1080, alt: 'A creator filming herself on a phone gimbal outdoors' },
  { slot: 'hero-mobile', provider: 'mixkit', id: 34468, kind: 'video', w: 720, h: 1280, ss: 0, t: 10, crf: 27, fx: 0.5, alt: 'A creator filming herself on a phone gimbal outdoors' },

  // ---- Influencer mosaic ----
  { slot: 'mosaic-01', provider: 'mixkit', id: 42319, ...tile, alt: 'Creator talking to camera in front of cereal boxes' },
  { slot: 'mosaic-02', provider: 'mixkit', id: 50782, ...tile, alt: 'Model in traditional Indian jewellery posing' },
  { slot: 'mosaic-03', provider: 'mixkit', id: 42323, ...tile, alt: 'Creator speaking straight to camera' },
  { slot: 'mosaic-04', provider: 'mixkit', id: 49141, ...tile, alt: 'Phone on a ring light recording a beauty creator' },
  { slot: 'mosaic-05', provider: 'mixkit', id: 42306, ...tile, alt: 'Creator dancing on a colourful set' },
  { slot: 'mosaic-06', provider: 'mixkit', id: 50792, ...tile, alt: 'Model in a teal salwar suit' },
  { slot: 'mosaic-07', provider: 'mixkit', id: 34469, ...tile, alt: 'Creator vlogging on the street' },
  { slot: 'mosaic-08', provider: 'mixkit', id: 42283, ...tile, alt: 'Creator holding a social media icon' },
  { slot: 'mosaic-09', provider: 'mixkit', id: 52039, ...tile, alt: 'Model checking her make-up' },
  { slot: 'mosaic-10', provider: 'mixkit', id: 42316, ...tile, alt: 'Phone on a ring light filming a creator' },
  { slot: 'mosaic-11', provider: 'mixkit', id: 50405, ...tile, alt: 'Creator setting up her phone for a skincare video' },
  { slot: 'mosaic-12', provider: 'mixkit', id: 34487, ...tile, alt: 'Creator walking and talking to her phone' },
  { slot: 'mosaic-13', provider: 'mixkit', id: 42308, ...tile, alt: 'Creator recording a selfie video' },
  { slot: 'mosaic-14', provider: 'mixkit', id: 50791, ...tile, alt: 'Model in Indian attire turning to camera' },
  { slot: 'mosaic-15', provider: 'mixkit', id: 10442, ...tile, alt: 'Creator on a video call on a terrace' },
  { slot: 'mosaic-16', provider: 'mixkit', id: 42310, ...tile, alt: 'Creator holding a play-button sign' },
  { slot: 'mosaic-17', provider: 'mixkit', id: 50488, ...tile, alt: 'Creator in red sunglasses posing' },
  { slot: 'mosaic-18', provider: 'mixkit', id: 4550, ...tile, alt: 'Vlogger recording in sign language' },
  { slot: 'mosaic-20', provider: 'mixkit', id: 52106, ...tile, alt: 'Fitness creator training with a kettlebell' },

  // ---- Proof by category ----
  { slot: 'cat-food', provider: 'mixkit', id: 9286, ...cat, alt: 'Noodles tossed in a flaming wok' },
  { slot: 'cat-fashion', provider: 'mixkit', id: 50793, ...cat, alt: 'Model in a teal salwar suit striking a pose' },
  { slot: 'cat-beauty', provider: 'mixkit', id: 50406, ...cat, alt: 'Phone recording a skincare routine' },
  { slot: 'cat-fitness', provider: 'mixkit', id: 52110, ...cat, alt: 'Athlete doing dumbbell lunges in a gym' },
  { slot: 'cat-lifestyle', provider: 'mixkit', id: 42313, ...cat, alt: 'Two friends filming a dance in a retro diner' },
  { slot: 'cat-travel', provider: 'mixkit', id: 6945, ...cat, alt: 'Ghats of Pushkar lake, Rajasthan' },

  // ---- CTA backgrounds ----
  { slot: 'cta-brand', provider: 'mixkit', id: 50641, kind: 'video', w: 1600, h: 900, t: 8, crf: 28, res: 1080, alt: 'Fashion shoot in a studio with lights and a clothes rail' },
  { slot: 'cta-creator', provider: 'mixkit', id: 42315, kind: 'video', w: 720, h: 1000, t: 8, crf: 28, alt: 'Creators dancing for a short video in front of a ring light' },

  // ---- Set atmosphere (celebrity / TV work, no identifiable talent) and model shoots ----
  { slot: 'set-1', provider: 'mixkit', id: 44066, ...cat, alt: 'Camera monitor framing a product shot on a studio set' },
  { slot: 'set-2', provider: 'mixkit', id: 44079, ...cat, alt: 'Operator adjusting a camera rig on a studio set' },
  { slot: 'model-1', provider: 'mixkit', id: 50639, kind: 'video', w: 720, h: 1280, t: 8, crf: 27, res: 1080, alt: 'Fashion shoot in a creative studio with a photographer and a model' },
  { slot: 'model-2', provider: 'mixkit', id: 52279, ...cat, alt: 'Model in a white dress posing against a white backdrop' },


  // ---- Hero avatar stack (licensed Mixkit footage) ----
  { slot: 'avatar-1', provider: 'mixkit', id: 42323, ...avatar, zoom: 1.5, fy: 0.12, ss: 1 },
  { slot: 'avatar-2', provider: 'mixkit', id: 50782, ...avatar, zoom: 1.5, fy: 0.1, fx: 0.45, ss: 1 },
  { slot: 'avatar-3', provider: 'mixkit', id: 42319, ...avatar, zoom: 1.5, fy: 0.12, ss: 1 },
  { slot: 'avatar-4', provider: 'mixkit', id: 34469, ...avatar, zoom: 1.8, fy: 0.2, fx: 0.47, ss: 1 },
];
