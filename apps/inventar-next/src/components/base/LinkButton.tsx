import { trackEvent } from '@thw-tools/shared';
import Button from './Button';

interface Props {
  url: string | URL;
  blank?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  dataUmamiEvent?: string | undefined;
  children?: React.ReactNode;
}

export default function LinkButton({
  url,
  secondary,
  disabled,
  dataUmamiEvent,
  children,
  blank,
}: Props) {
  return (
    <a
      href={url instanceof URL ? url.href : url}
      target={blank ? '_blank' : undefined}
      rel={blank ? 'noreffer' : undefined}
      className="h-full"
      tabIndex={-1}
      onClick={() => trackEvent(dataUmamiEvent)}
    >
      <Button type={secondary ? 'secondary' : 'primary'} disabled={disabled}>
        {children}
      </Button>
    </a>
  );
}
