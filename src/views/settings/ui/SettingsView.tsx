import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function SettingsView() {
  const t = useTranslations("settings");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("account.title")}</CardTitle>
            <CardDescription>{t("account.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span>{t("account.typeLabel")}</span>
              <Badge variant="secondary">{t("account.typeValue")}</Badge>
            </div>
            <div className="rounded-md border p-3 text-muted-foreground">
              {t("account.note")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("billing.title")}</CardTitle>
            <CardDescription>{t("billing.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span>{t("billing.statusLabel")}</span>
              <Badge variant="outline">{t("billing.statusValue")}</Badge>
            </div>
            <div className="rounded-md border p-3 text-muted-foreground">
              {t("billing.note")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
