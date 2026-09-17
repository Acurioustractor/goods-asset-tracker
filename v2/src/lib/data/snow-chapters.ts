/**
 * The Snow report's chapters, and the photograph each one wears in the menu.
 *
 * The list used to live in the page. It moved here on 18 September 2026 when Ben asked for the
 * pitch's chapter menu on this page too: the menu, the rail and the chapter headers all read
 * the same list, so a chapter moves in one place. A chapter's number is its position here.
 *
 * Tiles follow pitch-menu.ts: photographs the page already prints, `span` sets the tile's size,
 * `position` moves the crop onto the subject. snow-chapters.guards.test.ts holds every file to
 * disk and every chapter to a tile.
 */

import type { MenuTile } from './pitch-menu';

export const SNOW_CHAPTERS = [
  { id: 'ch-making', label: 'What we made' },
  { id: 'ch-first', label: 'Snow went first' },
  { id: 'ch-board', label: 'Who holds it' },
  { id: 'ch-alice', label: 'Alice Springs' },
  { id: 'ch-buyers', label: 'Who is buying' },
  { id: 'ch-washers', label: 'The machines' },
  { id: 'ch-model', label: 'The whole model' },
  { id: 'ch-films', label: 'In their own words' },
  { id: 'ch-archive', label: 'The archive' },
  { id: 'ch-together', label: 'What we have done' },
  { id: 'ch-because', label: 'What Goods is now' },
  { id: 'ch-ten', label: 'Ten years' },
] as const;

export type SnowChapterId = (typeof SNOW_CHAPTERS)[number]['id'];

export const SNOW_MENU_TILES: Record<SnowChapterId, MenuTile> = {
  // Rows one and two: a big tile, a wide one and four singles fill ten cells exactly.
  'ch-making': { src: '/images/community/alice-springs/stretch-bed-two-generations.jpg', span: 'big', position: 'center 30%' },
  'ch-first': { src: '/images/media-pack/sally-georgina-tennant-creek-jul-2025.jpg', span: 'wide', position: 'center 30%' },
  'ch-board': { src: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg', span: 'one', position: 'center 30%' },
  'ch-alice': { src: '/images/community/alice-springs/stretch-bed-kids-pile.jpg', span: 'one', position: 'center 40%' },
  'ch-buyers': { src: '/images/stories/utopia/08-beforeafter.jpg', span: 'one', position: 'center 45%' },
  'ch-washers': { src: '/images/community/tennant-creek/norman-frank-pakkimjalki-kari.jpg', span: 'one' },
  // Rows three and four: the same shape again, with the model sheet as the big drawing.
  'ch-model': { src: '/images/model/whole-model-tile.jpg', drawing: true, span: 'big' },
  'ch-films': { src: '/video/kalgoorlie/ninga-mia-drone-poster.jpg', span: 'wide' },
  'ch-archive': { src: '/images/community/maningrida/kids-carrying-orange-bed.jpg', span: 'one', position: 'center 40%' },
  'ch-together': { src: '/images/media-pack/snow-tennant-creek-april-2025.jpg', span: 'one' },
  'ch-because': { src: '/images/product/stretch-bed-community.jpg', span: 'one', position: 'center 40%' },
  'ch-ten': { src: '/images/community/tennant-creek/bed-on-the-lawn.jpg', span: 'one', position: 'center 60%' },
};
