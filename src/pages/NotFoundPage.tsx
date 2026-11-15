import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main>
      <h1>404 - Page Not Found</h1>
      <p>The page you requested does not exist.</p>

      <Link to="/">Back to Home</Link>
    </main>
  );
}
