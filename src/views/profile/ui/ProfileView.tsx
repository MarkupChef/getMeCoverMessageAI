import { DeleteAccountDialog } from "@/features/delete-account";
import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type ProfileViewProps = {
  email: string;
  fullName: string | null;
  freeGenerationsUsed: number | null;
  freeGenerationsLimit: number | null;
};

export function ProfileView({
  email,
  fullName,
  freeGenerationsUsed,
  freeGenerationsLimit,
}: ProfileViewProps) {
  const t = useTranslations("profile");

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("account.title")}</CardTitle>
            <CardDescription>{t("account.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-md border p-3">
              <span className="text-muted-foreground">{t("account.email")}</span>
              <span className="min-w-0 truncate font-medium">{email}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-md border p-3">
              <span className="text-muted-foreground">
                {t("account.fullName")}
              </span>
              <span className="min-w-0 truncate font-medium">
                {fullName ?? t("account.emptyFullName")}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("usage.title")}</CardTitle>
            <CardDescription>{t("usage.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-md border p-3">
              <span className="text-muted-foreground">{t("usage.free")}</span>
              <Badge variant="outline">
                {freeGenerationsUsed === null || freeGenerationsLimit === null
                  ? t("usage.unavailable")
                  : t("usage.value", {
                      used: String(freeGenerationsUsed),
                      limit: String(freeGenerationsLimit),
                    })}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>{t("danger.title")}</CardTitle>
          <CardDescription>{t("danger.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <p className="max-w-2xl text-sm text-muted-foreground">
            {t("danger.retentionNotice")}
          </p>
          <DeleteAccountDialog email={email} />
        </CardContent>
      </Card>
    </div>
  );
}
