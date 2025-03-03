type ProfileCardProps = {
  profile: {
    name: string;
    email: string;
    organization: string;
    role: string;
  };
  isSelected: boolean;
  onClick: () => void;
};

const ProfileCard = ({ profile, isSelected, onClick }: ProfileCardProps) => {
  return (
    <div
      className="group relative cursor-pointer rounded-lg p-[1px] shadow-sm"
      onClick={() => {
        onClick();
      }}
    >
      <div
        className={`absolute inset-0 rounded-lg group-hover:block ${
          isSelected ? "block" : "hidden"
        }`}
        style={{
          // TODO: need to variable this as a color token
          background:
            "linear-gradient(140deg, var(--blue-400) 2.34%, var(--purple-700) 51.11%, #F30EE9 97.96%)",
        }}
      />
      <div className="relative rounded-[7px] bg-white p-3">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full">
            <img
              src="/profile-dummy.jpeg"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{profile.name}</h3>
            <div className="text-add-on-primary-altered space-y-0.5 text-sm">
              <p className="font-semibold">{profile.role}</p>
              <p>{profile.organization}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
