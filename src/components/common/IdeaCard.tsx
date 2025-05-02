import IdeaAttachmentCard from "@/components/common/IdeaAttachmentCard";
import IdeaCardPopover from "@/components/common/IdeaCardPopover";
import IdeaImgCard from "@/components/common/IdeaImgCard";
import ReportButton from "@/components/common/ReportButton";
import Tag from "@/components/common/Tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import useAcademicYear from "@/hooks/useAcademicYear";
import { FEATURES, useAuthorize } from "@/hooks/useAuthorize";
import { cn, getInitials } from "@/lib/utils";
import { useReactIdea } from "@/modules/Ideas/api/mutateReactIdea";
import { TIdea } from "@/types/idea";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronRight,
  Flag,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import HideButton from "./HideButton";

const imgTypesExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "avif"];
const attachmentTypesExtensions = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
];
export function isImage(file: string) {
  return imgTypesExtensions.includes(file.split(".").pop() || "");
}
export function isAttachment(file: string) {
  return attachmentTypesExtensions.includes(file.split(".").pop() || "");
}

export const IdeaCard = ({ idea }: { idea: TIdea }) => {
  const { authState } = useAuth();
  const queryClient = useQueryClient();
  const { checkFeatureAvailability } = useAuthorize();
  const { isIdeaSubmissionOpen } = useAcademicYear();

  const likeIdea = useReactIdea({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getIdeaDetails", idea.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["getIdeaList"],
        });
      },
    },
  });

  const unlikeIdea = useReactIdea({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getIdeaDetails", idea.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["getIdeaList"],
        });
      },
    },
  });

  const handleLikeButtonClick = () => {
    if (!idea.is_liked) {
      likeIdea.mutate({
        id: idea.id,
        type: "like",
      });
    } else {
      likeIdea.mutate({
        id: idea.id,
        type: "remove-like",
      });
    }
  };

  const handleUnlikeButtonClick = () => {
    if (!idea.is_unliked) {
      unlikeIdea.mutate({
        id: idea.id,
        type: "unlike",
      });
    } else {
      unlikeIdea.mutate({
        id: idea.id,
        type: "remove-unlike",
      });
    }
  };

  return (
    <div className="border-border-weak space-y-8 rounded-xl border bg-white p-4 lg:p-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Tag content={`#${idea.category?.name}`} />
          </div>
          <div className="flex items-center gap-x-4">
            {checkFeatureAvailability(FEATURES.TOGGLE_HIDE_UNHIDE) && (
              <HideButton idea={idea} />
            )}

            {authState?.userData?.id !== idea.user_id &&
              checkFeatureAvailability(FEATURES.REPORT_IDEA) && (
                <ReportButton idea={idea} />
              )}

            {authState?.userData?.id === idea.user_id &&
              isIdeaSubmissionOpen && <IdeaCardPopover idea={idea} />}
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
            <div className="grid grid-cols-2 items-center gap-2 md:grid-cols-4">
              {idea.files.map((file, index) => (
                <div key={`file-${index}`}>
                  {isImage(file.file) && (
                    <IdeaImgCard key={`img-${index}`} image={file.file} />
                  )}
                  {isAttachment(file.file) && (
                    <IdeaAttachmentCard
                      key={`attachment-${index}`}
                      attachment={file.file}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-x-3">
          <Avatar className="border-border-weak border">
            <AvatarImage
              src={
                idea.privacy === "anonymous" ? "" : (idea.user?.profile ?? "")
              }
            />
            <AvatarFallback>
              {idea.privacy === "anonymous"
                ? "AN"
                : getInitials(idea.user?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <p className="text-text-strong text-sm font-medium">
            {idea.privacy === "anonymous"
              ? "Anonymous"
              : (idea.user?.name ?? "")}
            <span className="text-brand">
              {" "}
              ∙{" "}
              {formatDistanceToNow(new Date(idea.created_at), {
                addSuffix: true,
              })}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center">
          {checkFeatureAvailability(FEATURES.SEE_REPORT_COUNT) && (
            <div className="flex items-center gap-x-2 rounded-md bg-red-100 px-2.5 py-1.5">
              <Flag size={20} className="text-destructive" />
              <p className="text-destructive">{idea.report_count}</p>
            </div>
          )}

          <Button
            variant="ghost"
            onClick={handleLikeButtonClick}
            disabled={
              likeIdea.isPending ||
              !checkFeatureAvailability(FEATURES.REACT_COMMENT_IDEA) ||
              !isIdeaSubmissionOpen
            }
          >
            <ThumbsUp
              size={20}
              className={cn({ "text-purple-600": idea?.is_liked })}
            />
            <p className={cn({ "text-purple-600": idea?.is_liked })}>
              {idea?.likes_count}
            </p>
          </Button>
          <Button
            variant="ghost"
            onClick={handleUnlikeButtonClick}
            disabled={
              unlikeIdea.isPending ||
              !checkFeatureAvailability(FEATURES.REACT_COMMENT_IDEA) ||
              !isIdeaSubmissionOpen
            }
          >
            <ThumbsDown
              size={20}
              className={cn({ "text-purple-600": idea?.is_unliked })}
            />
            <p className={cn({ "text-purple-600": idea?.is_unliked })}>
              {idea?.un_likes_count}
            </p>
          </Button>
          <Button variant="ghost">
            <Link
              to={`${PrivatePageEndPoints.departments.details.ideaDetails.path
                .replace(":id", idea.department_id)
                .replace(":ideaId", idea.id)}`}
              className="flex cursor-pointer items-center gap-x-2"
            >
              <MessageCircle size={20} />
              <p>{idea.comments_count} Comments</p>
              <ChevronRight size={20} />
            </Link>
          </Button>
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
