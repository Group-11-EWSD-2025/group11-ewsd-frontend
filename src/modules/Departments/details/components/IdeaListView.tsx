import IdeaCard from "@/components/common/IdeaCard";
import { Filter } from "@/modules/Departments/details";

type IdeaViewProps = {
  filter: Filter;
};
const IdeaListView = ({ filter }: IdeaViewProps) => {
  console.log(filter);
  // const getIdeas = useGetIdeaList({});

  // console.log(getIdeas);

  return (
    <div className="space-y-4">
      <IdeaCard />
      <IdeaCard />
      <IdeaCard />
    </div>
  );
};

export default IdeaListView;
