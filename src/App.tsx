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
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <div>
    </div>
  );
};
