/**
 * What the pitch changes on the road stops it borrows from deck.ts: a better lead photograph,
 * more photographs of the place, a film that opens in a modal, a link to the longer story.
 * Ben's calls of 14 September 2026 ("the better photo of Nic standing in the Ninga Mia camp",
 * "Mykel on the bed here and a link to open his video", "more of the Maningrida photos",
 * "a link to the Utopia delivery story and one more photo of the kids making beds").
 * Every photograph here is already live on another page of the site.
 */

export interface RoadPhoto {
  src: string;
  alt: string;
}

export interface RoadOverride {
  photo?: RoadPhoto;
  gallery?: RoadPhoto[];
  film?: { src: string; poster: string; title: string };
  link?: { label: string; href: string };
}

export const ROAD_OVERRIDES: Readonly<Record<string, RoadOverride>> = {
  'stop-1-kalgoorlie': {
    photo: { src: '/images/community/kalgoorlie/camp-mattress-tent.jpg', alt: 'Nic standing in the camp at Ninga Mia beside a mattress on the ground' },
    gallery: [
      { src: '/images/community/kalgoorlie/camp-visit.jpg', alt: 'Visiting the camp at Ninga Mia' },
      { src: '/images/community/kalgoorlie/crate-bases-build.jpg', alt: 'Building the first crate-base beds at Ninga Mia' },
      { src: '/images/community/kalgoorlie/delivery-truck.jpg', alt: 'The delivery truck at Ninga Mia' },
      { src: '/images/community/kalgoorlie/mattress-dumped-jerry-can.jpg', alt: 'A dumped mattress and a jerry can on the red dirt' },
      { src: '/images/community/kalgoorlie/dump-site-dawn.jpg', alt: 'A bushland dumping ground at dawn: fridges, mattresses, a couch' },
      { src: '/images/community/kalgoorlie/mattress-ochre.jpg', alt: 'A foam mattress dyed the colour of the dirt it was abandoned on' },
    ],
  },
  'stop-5-utopia': {
    photo: { src: '/images/people/mykel.jpg', alt: 'Mykel on a Stretch Bed' },
    film: {
      src: '/video/partners/oonchiumpa/mykel-building-the-bed.mp4',
      poster: '/video/partners/oonchiumpa/mykel-building-the-bed-poster.jpg',
      title: 'Mykel, building his bed at home, in his own voice',
    },
  },
  'stop-6-maningrida-and-the-farm': {
    photo: { src: '/images/community/maningrida/tensioning-canvas.jpg', alt: 'Tensioning the canvas on a Stretch Bed at the Gamardi build day, Maningrida' },
    gallery: [
      { src: '/images/stories/maningrida/01-bed-run-outside-school.jpg', alt: 'The run of beds outside the school, Maningrida' },
      { src: '/images/community/maningrida/kids-carrying-orange-bed.jpg', alt: 'Kids carrying an orange Stretch Bed, Maningrida' },
      { src: '/images/community/maningrida/unrolling-canvas-with-elder.jpg', alt: 'Unrolling canvas with an Elder, Maningrida' },
      { src: '/images/community/maningrida/men-over-finished-bed.jpg', alt: 'Men over a finished Stretch Bed, Gamardi' },
      { src: '/images/community/maningrida/whole-run-at-sunset.jpg', alt: 'The whole Maningrida run at sunset' },
      { src: '/images/process/heat-press-full.jpg', alt: 'The heat press at the Goods on Country facility in Queensland, where the parts were pressed' },
    ],
  },
  'stop-7-oonchiumpa': {
    gallery: [
      { src: '/images/community/alice-springs/oonchiumpa-office-joy.jpg', alt: 'The Oonchiumpa team testing a Stretch Bed, laughing' },
      { src: '/images/build/build-009.jpg', alt: 'Build day with Oonchiumpa, Alice Springs' },
      { src: '/images/product/stretch-bed-kids-building.jpg', alt: 'Two kids fitting an X-leg to a Stretch Bed' },
    ],
    link: { label: 'The Utopia delivery story', href: '/partners/centrecorp' },
  },
};

/** The four things a Stretch Bed is made of, as the home page shows them. */
export const BED_PIECES: readonly { src: string; alt: string; title: string; body: string }[] = [
  { src: '/images/pitch/bed-frame-legs.jpg', alt: 'Recycled HDPE plastic legs, pressed from community waste', title: 'Recycled plastic legs', body: 'Crossed X-legs pressed from HDPE. About 20 kg of plastic in every bed.' },
  { src: '/images/pitch/bed-poles.jpg', alt: 'Galvanised steel pole', title: 'Galvanised steel poles', body: 'Two poles thread through the canvas sleeves and the top holes of the legs.' },
  { src: '/images/pitch/bed-canvas.jpg', alt: 'Heavy-duty Australian canvas with the Goods mark', title: 'Heavy-duty canvas', body: 'Washable, repairable, and structural: its tension holds the bed up.' },
  { src: '/images/media-pack/nic-with-elder-on-verandah.jpg', alt: 'Nic sitting on a Stretch Bed with an Elder on a verandah', title: 'The support around it', body: 'Every bed is on the register. Facilitation and support for the workshopping in community come with it.' },
];

/** The five verbs of the method, as deck slide S04 lists them. */
export const METHOD_VERBS: readonly string[] = ['Listen', 'Make', 'Return', 'Share', 'Support what comes next'];

/** The sections of /pitch in order. `nav` says whether the chapter bar lists it. Deck slides point here by `home`. */
export const PITCH_SECTIONS: readonly { id: string; label: string; nav: boolean }[] = [
  { id: 'crux', label: 'Start', nav: false },
  { id: 'problem', label: 'Problem', nav: true },
  { id: 'road', label: 'Road', nav: true },
  { id: 'map', label: 'Map', nav: true },
  { id: 'make', label: 'Bed', nav: true },
  { id: 'facility', label: 'Facility', nav: true },
  { id: 'maningrida', label: 'Maningrida', nav: true },
  { id: 'trade', label: 'Trade', nav: true },
  { id: 'model', label: 'Model', nav: true },
  { id: 'people', label: 'People', nav: true },
  { id: 'money', label: 'Money', nav: true },
  { id: 'measure', label: 'Measure', nav: true },
  { id: 'close', label: 'Close', nav: false },
  { id: 'questions', label: 'Questions', nav: true },
];
