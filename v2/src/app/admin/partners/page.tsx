import { getPartners, getInquiries } from './actions';
import PartnersManager from './partners-manager';

export default async function PartnersPage() {
  const [partners, inquiries] = await Promise.all([getPartners(), getInquiries()]);
  return <PartnersManager partners={partners} inquiries={inquiries} />;
}
