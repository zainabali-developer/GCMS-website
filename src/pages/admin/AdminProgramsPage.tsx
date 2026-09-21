import AdminResourcePage from '../../components/admin/AdminResourcePage';
import { programsConfig } from '../../services/resourceConfigs';

export default function AdminProgramsPage() {
  return <AdminResourcePage config={programsConfig} />;
}
