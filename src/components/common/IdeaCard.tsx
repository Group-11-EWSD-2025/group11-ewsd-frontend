import Tag from "@/components/common/Tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  Ellipsis,
  File,
  Flag,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

const sampleImages = [
  "https://images.unsplash.com/photo-1597684018919-b68344127b5f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
];

const sampleAttachments = ["file-1.pdf", "file-2.pdf"];

const ImageCard = ({ image }: { image: string }) => {
  return (
    <div className="aspect-square w-full rounded-lg object-cover">
      <img
        src={image}
        alt={image}
        className="aspect-square w-full rounded-lg object-cover"
      />
    </div>
  );
};

const AttachmentCard = ({ attachment }: { attachment: string }) => {
  return (
    <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg bg-slate-100">
      <File size={24} className="text-slate-500" />
      <p className="text-text-strong">{attachment}</p>
    </div>
  );
};

const IdeaCard = () => {
  return (
    <div className="border-border-weak space-y-8 rounded-xl border bg-white p-4 lg:p-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Tag content="#Label" />
          </div>
          <div className="flex items-center gap-x-6">
            <div className="flex cursor-pointer items-center gap-x-2">
              <Flag size={20} className="text-brand" />
              <p className="text-brand font-normal">Report</p>
            </div>
            <div className="cursor-pointer">
              <Ellipsis size={20} className="text-brand" />
            </div>
          </div>
        </div>
        <p className="text-text-strong">
          Allowing flexible work hours or hybrid schedules can improve
          productivity, reduce stress, and boost job satisfaction while
          maintaining operational efficiency.
        </p>
        <div className="space-y-2">
          <p className="text-brand text-sm">Attached with</p>
          <div className="grid grid-cols-4 items-center gap-x-2">
            {sampleImages.map((image, index) => (
              <ImageCard key={`img-${index}`} image={image} />
            ))}
            {sampleAttachments.map((attachment, index) => (
              <AttachmentCard
                key={`attachment-${index}`}
                attachment={attachment}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-x-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-text-strong text-sm font-medium">
            Phyo Hein
            <span className="text-brand"> ∙ 1 min ago</span>
          </p>
        </div>
        <div className="flex items-center gap-x-6">
          <div className="flex cursor-pointer items-center gap-x-2">
            <ThumbsUp size={20} />
            <p className="text-brand">1</p>
          </div>
          <div className="flex cursor-pointer items-center gap-x-2">
            <ThumbsDown size={20} />
            <p className="text-brand">1</p>
          </div>
          <div className="flex cursor-pointer items-center gap-x-2">
            <MessageCircle size={20} />
            <p className="text-brand">22 Comments</p>
            <ChevronRight size={20} className="text-brand" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
