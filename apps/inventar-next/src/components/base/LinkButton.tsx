import { trackEvent } from '@thw-tools/shared';
import Button from './Button';

interface Props {
  url: string | URL;
  blank?: boolean;
  type?: 'primary' | 'secondary' | 'warning';
  disabled?: boolean;
  dataUmamiEvent?: string | undefined;
  children?: React.ReactNode;
  className?: string;
}

export default function LinkButton({
  url,
  type = 'primary',
  disabled,
  dataUmamiEvent,
  children,
  blank,
  className,
}: Props) {
  return (
    <a
      href={url instanceof URL ? url.href : url}
      target={blank ? '_blank' : undefined}
      rel={blank ? 'noreffer' : undefined}
      className={`h-full ${className}`}
      tabIndex={-1}
      onClick={() => trackEvent(dataUmamiEvent)}
    >
      <Button type={type} disabled={disabled}>
        {children}
      </Button>
    </a>
  );
}
