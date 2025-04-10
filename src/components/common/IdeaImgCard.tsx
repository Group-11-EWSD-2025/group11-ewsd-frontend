const IdeaImgCard = ({ image }: { image: string }) => {
  return (
    <div className="aspect-square w-full rounded-lg object-cover">
      <img
        src={image}
        alt={image}
        className="aspect-square w-full rounded-lg object-cover"
      />
    </div>
  );
};

export default IdeaImgCard;
