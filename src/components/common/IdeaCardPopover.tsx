import { MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { showDialog } from "@/lib/utils";
import IdeaForm from "@/modules/Departments/details/components/IdeaForm";
import { TIdea } from "@/types/idea";
import { Pencil } from "lucide-react";

function IdeaCardPopover({ idea }: { idea: TIdea }) {
  function handleEditIdea() {
    showDialog({
      title: "Edit Idea",
      children: <IdeaForm idea={idea} />,
    });
  }

  function handleDeleteIdea() {
    console.log("Delete Idea");
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
