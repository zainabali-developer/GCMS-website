import AdminResourcePage from '../../components/admin/AdminResourcePage';
import { downloadsConfig } from '../../services/resourceConfigs';

export default function AdminDownloadsPage() {
  return <AdminResourcePage config={downloadsConfig} />;
}
