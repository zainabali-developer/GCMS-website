import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-6xl font-semibold text-emerald-800">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-ink-900">Page not found</h1>
      <p className="mt-2 max-w-md text-ink-600">
        The page you're looking for doesn't exist or may have been moved. Try searching the site or head back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/">
          <Button>
            <Home className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <Link to="/search">
          <Button variant="outline">
            <Search className="h-4 w-4" /> Search the Site
          </Button>
        </Link>
      </div>
    </div>
  );
}
