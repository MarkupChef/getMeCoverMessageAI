import Link from "next/link";
import { Button } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="flex max-w-md flex-col gap-4 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  );
}
