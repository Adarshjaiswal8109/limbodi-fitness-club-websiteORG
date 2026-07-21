import { AdminRouteGuard } from '@/components/admin/route-guard';
import { ErrorBoundary } from '@/components/admin/error-boundary';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AdminRouteGuard>{children}</AdminRouteGuard>
    </ErrorBoundary>
  );
}
