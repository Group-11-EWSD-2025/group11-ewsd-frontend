import { IdeaCard, IdeaCardSkeleton } from "@/components/common/IdeaCard";
import { Button } from "@/components/ui/button";
import { showDialog } from "@/lib/utils";
import { Filter } from "@/modules/Departments/details";
import { useGetIdeaList } from "@/modules/Departments/details/api/queryGetIdeaList";
import IdeaForm from "@/modules/Departments/details/components/IdeaForm";
import { TIdea } from "@/types/idea";
import { File, Plus } from "lucide-react";

type IdeaViewProps = {
  filter: Filter;
};
const IdeaListView = ({ filter }: IdeaViewProps) => {
  console.log(filter);
  const { data: getIdeas, isLoading: isLoadingIdeas } = useGetIdeaList({
    queryConfig: {
      enabled: true,
    },
  });

  const allIdeas = getIdeas?.body.data;

  function handleCreateNewIdea() {
    showDialog({
      title: "Create New Idea",
      children: <IdeaForm />,
    });
  }

  return (
    <div className="space-y-4">
      {!isLoadingIdeas ? (
        <>
          {allIdeas.length > 0 ? (
            allIdeas?.map((idea: TIdea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))
          ) : (
            <div className="border-weak mx-auto flex h-full w-full flex-col gap-y-8 rounded-xl border bg-white p-4 md:w-[70%] md:p-10">
              <File size={40} />
              <div className="space-y-2">
                <p className="text-xl font-medium">No idea yet.</p>
                <p className="text-brand text-sm">
                  Be the first to share your idea and help improve our
                  university! Your voice can make a difference.
                </p>
              </div>
              <div>
                <Button onClick={handleCreateNewIdea}>
                  <Plus size={20} />
                  Create New Idea
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <IdeaCardSkeleton key={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default IdeaListView;
