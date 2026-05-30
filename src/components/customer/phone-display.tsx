import { formatPhoneDisplay } from "@/lib/phone";

type PhoneDisplayProps = {
  phone: string;
  className?: string;
};

export function PhoneDisplay({ phone, className }: PhoneDisplayProps) {
  return (
    <span className={className} suppressHydrationWarning>
      {formatPhoneDisplay(phone)}
    </span>
  );
}
