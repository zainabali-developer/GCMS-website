import AdminResourcePage from '../../components/admin/AdminResourcePage';
import { galleryConfig } from '../../services/resourceConfigs';

export default function AdminGalleryPage() {
  return <AdminResourcePage config={galleryConfig} />;
}
