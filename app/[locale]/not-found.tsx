import { getTranslations } from "next-intl/server";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="flex max-w-md flex-col gap-4 text-center">
        <h1 className="text-2xl font-semibold">{t("notFoundTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("notFoundDescription")}
        </p>
        <Button asChild>
          <Link href="/">{t("goHome")}</Link>
        </Button>
      </div>
    </main>
  );
}
