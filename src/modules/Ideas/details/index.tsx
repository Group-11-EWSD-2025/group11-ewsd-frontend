import CustomForm from "@/components/common/CustomForm";
import HideButton from "@/components/common/HideButton";
import IdeaAttachmentCard from "@/components/common/IdeaAttachmentCard";
import { isAttachment, isImage } from "@/components/common/IdeaCard";
import IdeaCardPopover from "@/components/common/IdeaCardPopover";
import IdeaImgCard from "@/components/common/IdeaImgCard";
import ReportButton from "@/components/common/ReportButton";
import Tag from "@/components/common/Tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import useAcademicYear from "@/hooks/useAcademicYear";
import { FEATURES, useAuthorize } from "@/hooks/useAuthorize";
import { cn, getInitials } from "@/lib/utils";
import { TComment, TIdea } from "@/types/idea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Eye,
  Flag,
  Loader2,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useCommentIdea } from "../api/mutateCommentIdea";
import { useReactIdea } from "../api/mutateReactIdea";
import { useGetIdeaDetails } from "../api/queryGetIdeaDetails";

function IdeaDetails() {
  const queryClient = useQueryClient();
  const { ideaId } = useParams();
  const { authState } = useAuth();
  const { checkFeatureAvailability } = useAuthorize();
  const { isIdeaSubmissionOpen } = useAcademicYear();
  const [viewBy, setViewBy] = useState<"asc" | "desc">("desc");

  const { data: idea, isLoading } = useGetIdeaDetails({
    data: {
      id: ideaId ?? "",
    },
  });
  const ideaData: TIdea = idea?.data.body;

  const likeIdea = useReactIdea({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getIdeaDetails", ideaId],
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
          queryKey: ["getIdeaDetails", ideaId],
        });
        queryClient.invalidateQueries({
          queryKey: ["getIdeaList"],
        });
      },
    },
  });

  const handleLikeButtonClick = () => {
    if (!ideaData?.is_liked) {
      likeIdea.mutate({
        id: ideaData?.id,
        type: "like",
      });
    } else {
      likeIdea.mutate({
        id: ideaData?.id,
        type: "remove-like",
      });
    }
  };

  const handleUnlikeButtonClick = () => {
    if (!ideaData?.is_unliked) {
      unlikeIdea.mutate({
        id: ideaData?.id,
        type: "unlike",
      });
    } else {
      unlikeIdea.mutate({
        id: ideaData?.id,
        type: "remove-unlike",
      });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-screen" />;
  }

  return (
    <div className="relative mx-auto space-y-4 p-4 lg:max-w-[var(--content-width)] lg:p-6">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div className="flex items-center gap-x-2">
          <Eye size={20} />
          <p className="text-text-strong text-sm">
            {ideaData?.views} People interacted this idea.
          </p>
        </div>

        <div className="flex items-center gap-x-2">
          <Clock className="text-brand" size={20} />
          <p className="text-text-strong text-sm">
            Posted{" "}
            {formatDistanceToNow(
              ideaData?.created_at
                ? new Date(ideaData?.created_at)
                : new Date(),
              {
                addSuffix: true,
              },
            )}
          </p>
        </div>
      </div>

      <div className="border-border-weak relative rounded-xl border bg-white">
        {/* Details */}
        <div className="space-y-6 p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Tag content={`#${ideaData?.category?.name}`} />
            </div>
            <div className="flex items-center gap-x-2">
              {checkFeatureAvailability(FEATURES.SEE_REPORT_COUNT) && (
                <div className="flex items-center gap-x-2 rounded-md bg-red-100 px-2.5 py-1.5">
                  <Flag size={20} className="text-destructive" />
                  <p className="text-destructive">{ideaData.report_count}</p>
                </div>
              )}
              {checkFeatureAvailability(FEATURES.REPORT_IDEA) &&
                authState?.userData?.id !== ideaData?.user_id && (
                  <ReportButton idea={ideaData} />
                )}

              {checkFeatureAvailability(FEATURES.TOGGLE_HIDE_UNHIDE) && (
                <HideButton idea={ideaData} />
              )}

              {authState?.userData?.id === ideaData?.user_id &&
                isIdeaSubmissionOpen && <IdeaCardPopover idea={ideaData} />}
            </div>
          </div>
          <p className="text-text-strong">{ideaData?.content}</p>

          {ideaData.files.length > 0 && (
            <div className="space-y-2">
              <p className="text-brand text-sm">Attached with</p>
              <div className="grid grid-cols-4 items-center gap-x-2">
                {ideaData.files.map((file: any, index: number) => (
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

          {/* Like and Unlike */}
          <div className="grid grid-cols-2 gap-x-4">
            <Button
              variant="outline"
              onClick={handleLikeButtonClick}
              disabled={
                likeIdea.isPending ||
                !checkFeatureAvailability(FEATURES.REACT_COMMENT_IDEA) ||
                !isIdeaSubmissionOpen
              }
            >
              <ThumbsUp
                size={20}
                className={cn({ "text-purple-600": ideaData?.is_liked })}
              />
              <p className={cn({ "text-purple-600": ideaData?.is_liked })}>
                {ideaData?.likes_count} Like
              </p>
              {likeIdea.isPending && (
                <Loader2 size={20} className="animate-spin" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleUnlikeButtonClick}
              disabled={
                unlikeIdea.isPending ||
                !checkFeatureAvailability(FEATURES.REACT_COMMENT_IDEA) ||
                !isIdeaSubmissionOpen
              }
            >
              <ThumbsDown
                size={20}
                className={cn({ "text-purple-600": ideaData?.is_unliked })}
              />
              <p className={cn({ "text-purple-600": ideaData?.is_unliked })}>
                {ideaData?.un_likes_count} Dislike
              </p>
              {unlikeIdea.isPending && (
                <Loader2 size={20} className="animate-spin" />
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Comments */}
        <div className="space-y-6 p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <p className="text-brand text-sm">
              {ideaData?.comments_count} Comments
            </p>
            <div className="flex items-center gap-x-2">
              <p className="text-brand text-sm">View by</p>
              <Tabs
                defaultValue="desc"
                value={viewBy}
                onValueChange={(value) => {
                  setViewBy(value as "asc" | "desc");
                }}
              >
                <TabsList className="flex w-full">
                  <TabsTrigger value="asc">
                    <ArrowUp size={20} />
                  </TabsTrigger>
                  <TabsTrigger value="desc">
                    <ArrowDown size={20} />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className={"flex flex-col space-y-6"}>
            {ideaData.comments.length === 0 ? (
              <p className="text-text-strong text-sm">No comments yet</p>
            ) : (
              [...ideaData.comments]
                .sort((a, b) => {
                  const dateA = new Date(a.created_at).getTime();
                  const dateB = new Date(b.created_at).getTime();
                  return viewBy === "desc" ? dateA - dateB : dateB - dateA;
                })
                .map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))
            )}
          </div>
        </div>

        {checkFeatureAvailability(FEATURES.REACT_COMMENT_IDEA) &&
          isIdeaSubmissionOpen && (
            <div className="sticky bottom-0 left-0 rounded-xl bg-white p-4 lg:p-5">
              <div className="border-border-weak rounded-lg border p-3 shadow-sm">
                <CommentForm />
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function CommentCard({ comment }: { comment: TComment }) {
  return (
    <div className="flex gap-x-4">
      <Avatar className="border-border-weak border">
        <AvatarImage
          src={
            comment.privacy === "private" ? "" : (comment.user.profile ?? "")
          }
        />
        <AvatarFallback>
          {comment.privacy === "private"
            ? "AN"
            : getInitials(comment.user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-y-1">
        <p className="text-text-strong">
          {comment.privacy === "private" ? "Anonymous" : comment.user.name}
          <span className="text-brand">
            {" "}
            ∙{" "}
            {formatDistanceToNow(new Date(comment.created_at), {
              addSuffix: true,
            })}
          </span>
        </p>
        <p className="text-text-strong">{comment.content}</p>
      </div>
    </div>
  );
}

const commentSchema = z.object({
  comment: z.string().min(1, { message: "Comment is required" }),
  isAnonymous: z.boolean(),
});
export type CommentFormInputs = z.infer<typeof commentSchema>;
function CommentForm() {
  const queryClient = useQueryClient();
  const { ideaId } = useParams();
  const commentForm = useForm<CommentFormInputs>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
      isAnonymous: false,
    },
  });

  const commentIdea = useCommentIdea({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getIdeaDetails", ideaId] });
        queryClient.invalidateQueries({ queryKey: ["getIdeaList"] });
      },
    },
  });

  function onSubmit(data: CommentFormInputs) {
    commentIdea.mutate({
      id: ideaId ?? "",
      content: data.comment,
      privacy: data.isAnonymous ? "private" : "public",
    });
    commentForm.reset();
  }

  return (
    <CustomForm formMethods={commentForm} onSubmit={onSubmit}>
      <CustomForm.TextareaField
        field={{
          name: "comment",
          placeholder: "Leave your comment here...",
          className:
            "border-none resize-none shadow-none outline-none focus-visible:ring-0",
        }}
      />
      <div className="flex items-center justify-between gap-x-2">
        <CustomForm.CheckboxField
          field={{
            name: "isAnonymous",
            label: "Comment Anonymously",
          }}
        />
        <Button type="submit" size="icon" disabled={commentIdea.isPending}>
          <Send size={20} className="text-white" />
        </Button>
      </div>
    </CustomForm>
  );
}

export default IdeaDetails;
