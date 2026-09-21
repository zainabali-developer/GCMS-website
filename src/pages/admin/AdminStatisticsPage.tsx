import AdminResourcePage from '../../components/admin/AdminResourcePage';
import { statisticsConfig } from '../../services/resourceConfigs';

export default function AdminStatisticsPage() {
  return <AdminResourcePage config={statisticsConfig} />;
}
