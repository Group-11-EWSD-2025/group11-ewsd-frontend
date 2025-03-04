import IdeaCard from "@/components/common/IdeaCard";

const Home = () => {
  return (
    <div>
      <h1 className="pb-5 text-lg font-medium lg:text-xl">2 Ideas Posted</h1>
      <div className="space-y-4">
        <IdeaCard />
        <IdeaCard />
      </div>
    </div>
  );
};

export default Home;
