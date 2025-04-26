import { Button } from "@/components/ui/button";
import { cn, hideDialog, showDialog } from "@/lib/utils";
import { useReportIdea } from "@/modules/Ideas/api/mutateReportIdea";
import { TIdea } from "@/types/idea";
import { useQueryClient } from "@tanstack/react-query";
import { Flag } from "lucide-react";

function ReportButton({
  idea,
  isFinalClosureDate,
}: {
  idea: TIdea;
  isFinalClosureDate: boolean;
}) {
  const queryClient = useQueryClient();

  const reportIdea = useReportIdea({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getIdeaDetails", idea.id],
        });
        queryClient.invalidateQueries({ queryKey: ["getIdeaList"] });
        hideDialog();
      },
    },
  });

  function handleReport() {
    showDialog({
      isAlert: true,
      title: "Report Idea",
      description: "Are you sure you want to report this idea?",
      action: {
        variant: "destructive",
        label: "Report",
        state: reportIdea.isPending ? "loading" : "default",
        onClick: () => {
          reportIdea.mutate(idea.id);
        },
      },
    });
  }

  return (
    <Button
      variant="ghost"
      className="flex cursor-pointer items-center gap-x-2"
      state={reportIdea.isPending ? "loading" : "default"}
      disabled={idea.is_report || isFinalClosureDate}
      onClick={handleReport}
    >
      <Flag size={20} className={cn({ "text-destructive": idea.is_report })} />
      <p className={cn("font-normal", { "text-destructive": idea.is_report })}>
        {idea.is_report ? "Reported" : "Report"}
      </p>
    </Button>
  );
}

export default ReportButton;
