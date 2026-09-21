import AdminSingletonPage from '../../components/admin/AdminSingletonPage';
import { siteSettingsConfig } from '../../services/resourceConfigs';

export default function AdminSettingsPage() {
  return <AdminSingletonPage config={siteSettingsConfig} />;
}
