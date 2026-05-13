import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const stats = [
  { label: "Active users", value: "0", note: "Connect product events later" },
  { label: "Organizations", value: "1", note: "Membership scoped by RLS" },
  { label: "Plan", value: "Free", note: "Billing placeholder" },
];

export function DashboardView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge className="w-fit" variant="secondary">
          Protected route
        </Badge>
        <h1 className="text-3xl font-semibold tracking-normal">Dashboard</h1>
        <p className="text-muted-foreground">
          This shell is ready for product widgets, analytics, and team-scoped data.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle>{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Next implementation targets</CardTitle>
          <CardDescription>
            Add real feature slices without changing the foundation.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {[
            "Create organization onboarding",
            "Invite members by email",
            "Add Stripe checkout and webhooks",
            "Connect product-specific entities",
          ].map((item) => (
            <div key={item} className="rounded-md border p-3 text-sm">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
