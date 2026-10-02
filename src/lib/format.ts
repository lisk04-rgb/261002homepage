const wonFormatter = new Intl.NumberFormat("ko-KR");

export const PRICE_ON_INQUIRY = "문의 후 안내";

export function formatPrice(price: number | undefined): string {
  return price === undefined ? PRICE_ON_INQUIRY : `${wonFormatter.format(price)}원`;
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${year}. ${Number(month)}. ${Number(day)}.`;
}
