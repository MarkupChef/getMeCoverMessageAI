import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function BillingView() {
  const t = useTranslations("billing");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex size-10 items-center justify-center rounded-md border bg-background">
            <CreditCard className="size-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <CardTitle className="text-base">{t("empty.title")}</CardTitle>
          <CardDescription>{t("empty.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/plan">{t("empty.action")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
