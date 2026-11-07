const orderStatuses: Record<string, string> = {
  pending: "অপেক্ষমাণ",
  confirmed: "নিশ্চিত",
  processing: "প্রস্তুত হচ্ছে",
  shipped: "শিপড",
  delivered: "ডেলিভার্ড",
  cancelled: "বাতিল",
  returned: "ফেরত",
};

const paymentStatuses: Record<string, string> = {
  unpaid: "অপরিশোধিত",
  pending: "অপেক্ষমাণ",
  paid: "পরিশোধিত",
  failed: "ব্যর্থ",
  refunded: "ফেরত দেওয়া",
};

export function orderStatusLabel(status: string) {
  return orderStatuses[status] ?? status;
}

export function paymentStatusLabel(status: string) {
  return paymentStatuses[status] ?? status;
}
