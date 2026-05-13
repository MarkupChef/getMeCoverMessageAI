import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footerLabel?: string;
  footerHref?: string;
  footerText?: string;
};

export function AuthCard({
  title,
  description,
  children,
  footerLabel,
  footerHref,
  footerText,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {children}
        {footerHref && footerLabel ? (
          <p className="text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link className="font-medium text-foreground hover:underline" href={footerHref}>
              {footerLabel}
            </Link>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
