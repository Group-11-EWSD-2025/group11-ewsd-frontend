import { Button } from "@/components/ui/button";
import { useToggleHideIdea } from "@/modules/Ideas/api/mutateToggleHideIdea";
import { TIdea } from "@/types/idea";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function HideButton({ idea }: { idea: TIdea }) {
  const queryClient = useQueryClient();

  const toggleHideIdea = useToggleHideIdea({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getIdeaDetails", idea.id],
        });
        queryClient.invalidateQueries({ queryKey: ["getIdeaList"] });
      },
    },
  });

  function handleHide() {
    toggleHideIdea.mutate({
      id: idea.id,
      type: idea.status === "hide" ? "unhide" : "hide",
    });
  }

  return (
    <Button
      variant="ghost"
      className="flex cursor-pointer items-center gap-x-2"
      onClick={handleHide}
    >
      {idea.status === "hide" ? (
        <Eye size={20} className="text-brand" />
      ) : (
        <EyeOff size={20} className="text-brand" />
      )}
      <p className="text-brand font-normal">
        {idea.status === "hide" ? "Unhide" : "Hide"}
      </p>
      {toggleHideIdea.isPending && <Loader2 className="animate-spin" />}
    </Button>
  );
}

export default HideButton;
