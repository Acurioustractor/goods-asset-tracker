import { redirect } from 'next/navigation';

/** The SVG sheet is now the placemat itself, at /admin/model. */
export default function ModelPlacematSvgPage() {
  redirect('/admin/model');
}
