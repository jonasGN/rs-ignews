export function toCurrency(number: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}

type DateOptions = Intl.DateTimeFormatOptions;

export function toLocaleDate(date: string, options?: DateOptions): string {
  return new Date(date).toLocaleDateString(
    "pt-BR",
    options ?? {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}
