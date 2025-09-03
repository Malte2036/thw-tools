import { Button, Dialog } from '../base';

interface Props {
  onClose: () => void;
}

export default function FeedbackDialog({ onClose }: Props) {
  return (
    <Dialog title="Feedback">
      <div slot="content">
        <div className="flex flex-col gap-2">
          <div>Du hast Ideen für neue Tools, weitere Quizfragen oder Feedback?</div>
          <div>
            <span>Schreib mir gerne eine Direktnachricht in </span>
            <a
              data-umami-event="Feedback Dialog Hermine link"
              href="https://app.thw-messenger.de/thw/app#/contacts/profile/1990855"
              target="_blank"
              className="underline text-thw"
            >
              <span>Hermine</span>
            </a>
            <span> (Malte Sehmer).</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button onClick={onClose}>
          <span>Schließen</span>
        </Button>
      </div>
    </Dialog>
  );
}
