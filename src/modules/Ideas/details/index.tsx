import CustomForm from "@/components/common/CustomForm";
import IdeaAttachmentCard from "@/components/common/IdeaAttachmentCard";
import IdeaCardPopover from "@/components/common/IdeaCardPopover";
import IdeaImgCard from "@/components/common/IdeaImgCard";
import ReportButton from "@/components/common/ReportButton";
import Tag from "@/components/common/Tag";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Eye,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sampleImages = [
  "https://images.unsplash.com/photo-1597684018919-b68344127b5f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
];

const sampleAttachments = ["file-1.pdf", "file-2.pdf"];

function IdeaDetails() {
  const [viewBy, setViewBy] = useState<"asc" | "desc">("desc");

  return (
    <div className="relative mx-auto space-y-4 p-4 lg:mt-[var(--topbar-height)] lg:max-w-[var(--content-width)] lg:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Eye size={20} />
          <p className="text-text-strong text-sm">
            123 People interacted this idea.
          </p>
        </div>

        <div className="flex items-center gap-x-2">
          <Clock className="text-brand" size={20} />
          <p className="text-text-strong text-sm">Posted on 12 Nov 2025</p>
        </div>
      </div>

      <div className="border-border-weak relative rounded-xl border bg-white">
        <div className="space-y-6 p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Tag content="#Label" />
            </div>
            <div className="flex items-center gap-x-6">
              <ReportButton />
              <IdeaCardPopover />
            </div>
          </div>
          <p className="text-text-strong">
            Allowing flexible work hours or hybrid schedules can improve
            productivity, reduce stress, and boost job satisfaction while
            maintaining operational efficiency.
          </p>

          <div className="space-y-2">
            <p className="text-brand text-sm">Attached with</p>
            <div className="grid grid-cols-2 items-center gap-x-2 md:grid-cols-4">
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

          <div className="grid grid-cols-2 gap-x-4">
            <Button variant="outline">
              <ThumbsUp size={20} />
              <p className="text-text-strong">1 Like</p>
            </Button>
            <Button variant="outline">
              <ThumbsDown size={20} />
              <p className="text-text-strong">1 Dislike</p>
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-6 p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <p className="text-brand text-sm">3 Comments</p>
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

          <div className="flex flex-col gap-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <CommentCard key={`comment-${index}`} />
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 left-0 rounded-xl bg-white p-4 lg:p-5">
          <div className="border-border-weak rounded-lg border p-3 shadow-sm">
            <CommentForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentCard() {
  return (
    <div className="flex gap-x-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-y-1">
        <p className="text-text-strong font-medium">
          Phyo Hein
          <span className="text-brand"> ∙ 1 min ago</span>
        </p>
        <p className="text-text-strong">
          Great idea! Our team spends too much time processing budget requests
          manually.
        </p>
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
  const commentForm = useForm<CommentFormInputs>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
      isAnonymous: false,
    },
  });

  function onSubmit(data: CommentFormInputs) {
    console.log(data);
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
        <Button type="submit" size="icon">
          <Send size={20} className="text-white" />
        </Button>
      </div>
    </CustomForm>
  );
}

export default IdeaDetails;
