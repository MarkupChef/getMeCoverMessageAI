import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function SettingsView() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Settings</h1>
        <p className="text-muted-foreground">
          Organization, member, and billing settings placeholders.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Workspace identity and membership.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span>Current role</span>
              <Badge variant="secondary">Owner</Badge>
            </div>
            <div className="rounded-md border p-3 text-muted-foreground">
              Invite form will use inviteMemberSchema and organization-scoped RLS.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Stripe extension point, not integrated yet.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span>Subscription status</span>
              <Badge variant="outline">Not configured</Badge>
            </div>
            <div className="rounded-md border p-3 text-muted-foreground">
              Add Checkout, Customer Portal, and webhooks when pricing is defined.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
