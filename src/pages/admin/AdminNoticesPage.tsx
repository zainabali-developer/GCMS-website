import AdminResourcePage from '../../components/admin/AdminResourcePage';
import { noticesConfig } from '../../services/resourceConfigs';

export default function AdminNoticesPage() {
  return <AdminResourcePage config={noticesConfig} />;
}
