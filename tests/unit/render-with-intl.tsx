import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { AnonymousUsageProvider } from "@/features/anonymous-usage";
import messages from "@/shared/i18n/messages/en";

export function renderWithIntl(ui: ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AnonymousUsageProvider>{ui}</AnonymousUsageProvider>
    </NextIntlClientProvider>,
  );
}
