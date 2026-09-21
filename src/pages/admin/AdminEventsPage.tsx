import AdminResourcePage from '../../components/admin/AdminResourcePage';
import { eventsConfig } from '../../services/resourceConfigs';

export default function AdminEventsPage() {
  return <AdminResourcePage config={eventsConfig} />;
}
