import { MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { hideDialog, showDialog } from "@/lib/utils";
import IdeaForm from "@/modules/Departments/details/components/IdeaForm";
import { useDeleteIdea } from "@/modules/Ideas/api/mutateDeleteIdea";
import { TIdea } from "@/types/idea";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";

function IdeaCardPopover({ idea }: { idea: TIdea }) {
  const queryClient = useQueryClient();
  function handleEditIdea() {
    showDialog({
      title: "Edit Idea",
      children: <IdeaForm idea={idea} />,
    });
  }

  const deleteIdea = useDeleteIdea({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getIdeaList"],
        });
        toast({ title: "Idea deleted successfully." });
      },
    },
  });

  function handleDeleteIdea() {
    showDialog({
      isAlert: true,
      title: "Delete Idea",
      description: "Are you sure you want to delete this idea?",
      cancel: {
        label: "Cancel",
        variant: "outline",
        onClick: () => {
          hideDialog();
        },
      },
      action: {
        label: "Delete",
        variant: "destructive",
        state: deleteIdea.isPending ? "loading" : "default",
        onClick: () => {
          deleteIdea.mutate(idea.id);
        },
      },
    });
  }
  return (
    <Popover>
      <PopoverTrigger>
        <MoreHorizontal className="h-4 w-4 cursor-pointer text-slate-700" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex w-[186px] flex-col divide-y divide-gray-200 p-1"
      >
        <div>
          <Button
            variant="ghost"
            onClick={handleEditIdea}
            className="w-full justify-start rounded-none p-2 text-slate-700"
          >
            <Pencil className="size-4" />
            Edit Idea
          </Button>
          <Separator />
          <Button
            variant="ghost"
            onClick={handleDeleteIdea}
            className="w-full justify-start rounded-none p-2 text-red-500"
          >
            <Trash className="size-4" />
            Delete Idea
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default IdeaCardPopover;
