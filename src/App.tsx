import React, { FunctionComponent, useEffect } from "react";

import { Greetings, GroupModel, PageModel, UserModel } from "./_DataModels";

export const App: FunctionComponent = () => {

  const [user, setUser] = React.useState<UserModel>({ name: "", pinnedPages: [] } as UserModel);

  const [greeting, setGreeting] = React.useState<string>("");

  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const [data, setData] = React.useState<GroupModel[]>([]);

  const [pinnedPages, setPinnedPages] = React.useState<PageModel[]>([]);

  const clear = () => {
    setUser({ name: "", pinnedPages: [] });
    setPinnedPages([]);
    setIsEditing(false);
    localStorage.clear();
  };

  const toggleGroup = (group: GroupModel) => {
    const temp = data.map((g) => {
      if (g.name === group.name) {
        return { ...g, isExpanded: !g.isExpanded };
      }
      return g;
    });
    setData(temp);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }

    const hour = new Date().getHours();

    if (hour < 12) setGreeting(Greetings[0]);
    else if (hour < 18) setGreeting(Greetings[1]);
    else setGreeting(Greetings[2]);

    fetch("/data.json").then(r => r.json()).then((data: GroupModel[]) => {
      data.forEach(group => {
        group.pages.forEach(page => {
          const hsl = page.tileColor.replace("hsl(", "").replace(")", "").split(",");
          const h = parseInt(hsl[0]);
          const s = parseInt(hsl[1].replace("%", ""));
          const l = parseInt(hsl[2].replace("%", ""));

          page.tileColor = `hsl(${h}, ${s + 10}%, ${l + 10}%)`;
          page.gradientColor = `hsl(${h}, ${s - 10}%, ${l - 10}%)`;
        });
      });

      setData(data);
    });
  }, []);

  return (
    <div>
    </div>
  );
};
