import Teams from "@/lib/teams.json";
import Image from "next/image";

export default function TeamsComponent() {
  const womBaseUrl = "https://wiseoldman.net/players/";
  const getTeamStyle = (color: string) => {
    switch (color) {
      case "yellow":
        return "text-yellow-300";
      case "pink":
        return "text-pink-400";
      case "blue":
        return "text-blue-400";
      default:
        return "text-yellow-300";
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Teams.map((team) => (
          <div key={team.id}>
            <h2
              className={`flex flex-row items-center gap-2 text-2xl font-bold mb-4`}
            >
              <Image
                src={team.image}
                alt={team.name}
                width={100}
                height={100}
                className="w-6 h-9 rounded-full"
              />
              <span className={getTeamStyle(team.color)}> {team.name}</span>
            </h2>
            <div className="flex flex-col gap-2">
              {team.members.map((member) => (
                <span key={member}>
                  <a
                    href={`${womBaseUrl}${member.replaceAll(" ", "_")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={getTeamStyle(team.color)}
                  >
                    + {member}
                  </a>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
