import AdminResourcePage from '../../components/admin/AdminResourcePage';
import { facultyConfig } from '../../services/resourceConfigs';

export default function AdminFacultyPage() {
  return <AdminResourcePage config={facultyConfig} />;
}
