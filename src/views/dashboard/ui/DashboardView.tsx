import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const statKeys = ["usage", "account", "plan"] as const;
const targetKeys = [
  "productEntities",
  "profileSettings",
  "stripe",
  "usage",
] as const;

export function DashboardView() {
  const t = useTranslations("dashboard.page");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge className="w-fit" variant="secondary">
          {t("badge")}
        </Badge>
        <h1 className="text-3xl font-semibold tracking-normal">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {statKeys.map((stat) => (
          <Card key={stat}>
            <CardHeader>
              <CardDescription>{t(`stats.${stat}.label`)}</CardDescription>
              <CardTitle>{t(`stats.${stat}.value`)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t(`stats.${stat}.note`)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("targets.title")}</CardTitle>
          <CardDescription>
            {t("targets.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {targetKeys.map((item) => (
            <div key={item} className="rounded-md border p-3 text-sm">
              {t(`targets.${item}`)}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
