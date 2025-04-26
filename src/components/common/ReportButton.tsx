import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
      },
    },
  });

  function handleReport() {
    reportIdea.mutate(idea.id);
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
