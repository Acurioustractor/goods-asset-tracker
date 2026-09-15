/**
 * The pitch's own menu: one tile per chapter, each with the photograph (or model sheet) that
 * chapter is about. Photographs are ones the page already prints, from the Media Room starred
 * set where the chapter has one. `span` sets the tile's size, and the order below fills a
 * five-column grid row by row with no holes; the last tile stretches to close the final row.
 * `position` moves the crop onto the subject. pitch-menu.guards.test.ts holds every file to disk.
 */

export type TileSpan = 'big' | 'wide' | 'one';

export interface MenuTile {
  src: string;
  /** A drawing or sheet sits whole on paper instead of filling the tile. */
  drawing?: boolean;
  span: TileSpan;
  /** CSS object-position for the crop. */
  position?: string;
}

export const PITCH_MENU_TILES: Record<string, MenuTile> = {
  top: { src: '/video/hero-poster.jpg', span: 'big' },
  problem: { src: '/images/community/kalgoorlie/on-the-floor-dirty-mat.jpg', span: 'one', position: 'center 22%' },
  cost: { src: '/images/stories/utopia/08-beforeafter.jpg', span: 'one' },
  origin: { src: '/images/act/harvest-field-notes-dji-0021.jpg', span: 'one' },
  people: { src: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg', span: 'one', position: 'center 30%' },
  road: { src: '/images/stories/utopia/01-hero.jpg', span: 'wide' },
  products: { src: '/images/pitch/bed-assembled.jpg', span: 'one' },
  map: { src: '/images/community/kalgoorlie/camp-visit.jpg', span: 'one' },
  facility: { src: '/images/process/factory-panorama.jpg', span: 'wide' },
  maningrida: { src: '/images/community/maningrida/men-over-finished-bed.jpg', span: 'one' },
  utopia: { src: '/images/stories/utopia/09-offground.jpg', span: 'one', position: 'center 40%' },
  buyers: { src: '/images/stories/utopia/08-beforeafter.jpg', span: 'one', position: 'center 45%' },
  model: { src: '/images/model/whole-model-tile.jpg', drawing: true, span: 'big' },
  measure: { src: '/images/product/stretch-bed-community.jpg', span: 'one', position: 'center 40%' },
  'ten-years': { src: '/images/community/unplaced/rec-assembly-05-pole-sleeve.jpg', span: 'one' },
  money: { src: '/images/community/alice-springs/stretch-bed-kids-pile.jpg', span: 'one', position: 'center 40%' },
  capital: { src: '/images/media-pack/nic-with-elder-on-verandah.jpg', span: 'one' },
  sequence: { src: '/images/community/unplaced/rec-assembly-04-wide.jpg', span: 'one' },
  request: { src: '/images/media-pack/lying-on-stretch-bed.jpg', span: 'wide' },
  close: { src: '/images/community/maningrida/kids-carrying-orange-bed.jpg', span: 'wide', position: 'center 40%' },
  questions: { src: '/images/product/washing-machine.jpg', span: 'one' },
};

/** Grid cells a tile takes, for working out how far the last tile stretches. */
export const TILE_CELLS: Record<TileSpan, { cols: number; cells: number }> = {
  big: { cols: 2, cells: 4 },
  wide: { cols: 2, cells: 2 },
  one: { cols: 1, cells: 1 },
};
