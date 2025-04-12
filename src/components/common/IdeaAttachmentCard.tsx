import { File } from "lucide-react";

function IdeaAttachmentCard({ attachment }: { attachment: string }) {
  return (
    <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg bg-slate-100">
      <File size={24} className="text-slate-500" />
      <p className="text-text-strong">{attachment.split("/").pop()}</p>
    </div>
  );
}

export default IdeaAttachmentCard;
