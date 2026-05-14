import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

const foundations = [
  "Supabase SSR auth",
  "User-scoped data model",
  "Zod validated forms",
  "Feature-Sliced Design",
];

export function HomeView() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6">
        <header className="flex h-14 items-center justify-between">
          <Link className="font-semibold" href="/">
            SaaS Starter
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Create account</Link>
            </Button>
          </div>
        </header>
        <div className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[1fr_420px]">
          <div className="flex max-w-2xl flex-col gap-6">
            <Badge className="w-fit" variant="secondary">
              Next.js 16 + Supabase
            </Badge>
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
                A scalable SaaS foundation with the boring parts already wired.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Auth, subscriptions, validation, layout, and database boundaries are in place so product features can be added without reshaping the app.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sign-up">Start with auth</Link>
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Scaffold checklist</CardTitle>
              <CardDescription>
                Core SaaS capabilities ready for product-specific slices.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {foundations.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border p-3">
                  <CheckCircle2 className="text-primary" data-icon="inline-start" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
