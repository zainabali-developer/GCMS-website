import AdminSingletonPage from '../../components/admin/AdminSingletonPage';
import { aboutSingletonConfig } from '../../services/resourceConfigs';

export default function AdminAboutPage() {
  return <AdminSingletonPage config={aboutSingletonConfig} />;
}
