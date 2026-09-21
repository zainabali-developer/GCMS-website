import AdminResourcePage from '../../components/admin/AdminResourcePage';
import { highlightsConfig } from '../../services/resourceConfigs';

export default function AdminHighlightsPage() {
  return <AdminResourcePage config={highlightsConfig} />;
}
