'use client';

import { Button } from '@/components/base';

interface Props {
  onClick: () => void;
  visible: boolean;
  children: React.ReactNode;
}

export default function FloatingActionButton({ onClick, visible, children }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        type="primary"
        size="large"
        onClick={onClick}
        className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        {children}
      </Button>
    </div>
  );
}
