import AdminSingletonPage from '../../components/admin/AdminSingletonPage';
import AdminResourcePage from '../../components/admin/AdminResourcePage';
import {
  admissionsSingletonConfig,
  admissionStepsConfig,
  admissionFaqsConfig,
} from '../../services/resourceConfigs';

export default function AdminAdmissionsPage() {
  return (
    <div className="space-y-10">
      <AdminSingletonPage config={admissionsSingletonConfig} />
      <div className="border-t border-ink-200 pt-8">
        <AdminResourcePage config={admissionStepsConfig} />
      </div>
      <div className="border-t border-ink-200 pt-8">
        <AdminResourcePage config={admissionFaqsConfig} />
      </div>
    </div>
  );
}
