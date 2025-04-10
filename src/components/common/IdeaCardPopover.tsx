import { MoreHorizontal, Trash } from "lucide-react";

import { showDialog } from "@/lib/utils";
import IdeaForm from "@/modules/Departments/details/components/IdeaForm";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

function IdeaCardPopover() {
  function handleEditIdea() {
    showDialog({
      title: "Edit Idea",
      children: <IdeaForm />,
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
