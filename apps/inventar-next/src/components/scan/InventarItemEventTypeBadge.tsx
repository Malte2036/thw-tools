import { eventTypeToFriendlyString, FunkItemEventType } from '@/api/funk/funkModels';
import { cn } from '@/lib/utils';

export default function InventarItemEventTypeBadge({ type }: { type: FunkItemEventType }) {
  return (
    <div
      className={cn(
        'rounded-xl text-sm px-2 h-min bg-green-200',
        type === 'borrowed' && 'bg-red-200'
      )}
    >
      {eventTypeToFriendlyString(type)}
    </div>
  );
}
