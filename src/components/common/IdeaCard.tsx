import IdeaAttachmentCard from "@/components/common/IdeaAttachmentCard";
import IdeaCardPopover from "@/components/common/IdeaCardPopover";
import IdeaImgCard from "@/components/common/IdeaImgCard";
import ReportButton from "@/components/common/ReportButton";
import Tag from "@/components/common/Tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { getInitials } from "@/lib/utils";
import { TIdea } from "@/types/idea";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronRight,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

const sampleImages = [
  "https://images.unsplash.com/photo-1597684018919-b68344127b5f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
];

const sampleAttachments = ["file-1.pdf", "file-2.pdf"];

export const IdeaCard = ({ idea }: { idea: TIdea }) => {
  return (
    <div className="border-border-weak space-y-8 rounded-xl border bg-white p-4 lg:p-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Tag content={`#${idea.category?.name}`} />
          </div>
          <div className="flex items-center gap-x-2">
            <ReportButton />
            <IdeaCardPopover />
          </div>
        </div>
        <Link
          to={`${PrivatePageEndPoints.departments.details.ideaDetails.path
            .replace(":id", idea.department_id)
            .replace(":ideaId", idea.id)}`}
          className="flex cursor-pointer items-center gap-x-2"
        >
          <p className="text-text-strong">{idea.content}</p>
        </Link>
        {idea.files.length > 0 && (
          <div className="space-y-2">
            <p className="text-brand text-sm">Attached with</p>
            <div className="grid grid-cols-4 items-center gap-x-2">
              {sampleImages.map((image, index) => (
                <IdeaImgCard key={`img-${index}`} image={image} />
              ))}
              {sampleAttachments.map((attachment, index) => (
                <IdeaAttachmentCard
                  key={`attachment-${index}`}
                  attachment={attachment}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-x-3">
          <Avatar className="border-border-weak border">
            <AvatarImage
              src={idea.privacy === "anonymous" ? "" : idea.user.profile}
            />
            <AvatarFallback>{getInitials(idea.user.name)}</AvatarFallback>
          </Avatar>
          <p className="text-text-strong text-sm font-medium">
            {idea.privacy === "anonymous" ? "Anonymous" : idea.user.name}
            <span className="text-brand">
              {" "}
              ∙{" "}
              {formatDistanceToNow(new Date(idea.created_at), {
                addSuffix: true,
              })}
            </span>
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
          <Link
            to={`${PrivatePageEndPoints.departments.details.ideaDetails.path
              .replace(":id", idea.department_id)
              .replace(":ideaId", idea.id)}`}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <MessageCircle size={20} />
            <p className="text-brand">22 Comments</p>
            <ChevronRight size={20} className="text-brand" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const IdeaCardSkeleton = () => {
  return (
    <div className="border-border-weak space-y-8 rounded-xl border bg-white p-4 lg:p-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-x-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        <div className="grid grid-cols-2 gap-x-2 md:grid-cols-4">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
