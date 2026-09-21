import AdminResourcePage from '../../components/admin/AdminResourcePage';
import { subjectsConfig } from '../../services/resourceConfigs';

export default function AdminSubjectsPage() {
  return <AdminResourcePage config={subjectsConfig} />;
}
