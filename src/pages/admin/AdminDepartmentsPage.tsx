import AdminResourcePage from '../../components/admin/AdminResourcePage';
import { departmentsConfig } from '../../services/resourceConfigs';

export default function AdminDepartmentsPage() {
  return <AdminResourcePage config={departmentsConfig} />;
}
