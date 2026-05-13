import * as React from "react";
import { cn } from "@/shared/lib/utils";

export function FieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-4", className)} {...props} />;
}

export function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("grid gap-2 data-[invalid=true]:text-destructive", className)}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function FieldError({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    />
  );
}
