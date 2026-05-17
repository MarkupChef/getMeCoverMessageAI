export function getClientIpFromHeaders(headersList: Headers) {
  const forwardedFor = headersList.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",").at(0)?.trim();

  return (
    forwardedIp ||
    headersList.get("x-real-ip")?.trim() ||
    headersList.get("cf-connecting-ip")?.trim() ||
    null
  );
}

