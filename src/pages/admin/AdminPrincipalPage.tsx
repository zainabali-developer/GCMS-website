import AdminSingletonPage from '../../components/admin/AdminSingletonPage';
import { principalSingletonConfig } from '../../services/resourceConfigs';

export default function AdminPrincipalPage() {
  return <AdminSingletonPage config={principalSingletonConfig} />;
}
