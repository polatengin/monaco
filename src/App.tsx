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

  useEffect(() => {
    const pageList = data.flatMap(group => group.pages).filter(page => user.pinnedPages.includes(page.id));

    setPinnedPages(pageList);
  }, [data, user.pinnedPages]);

  return (
    <div className="relative w-full h-full bg-gray-100 select-none">
      <div className="flex bg-slate-700 text-white p-8 items-center">
        <h1 className="flex-grow text-4xl">{greeting} {user.name}</h1>

        <i className="fa-solid fa-pen-to-square w-8 h-8 p-2 cursor-pointer" onClick={() => setIsEditing(true)}></i>
      </div>

      <div className="flex-row">
        <div className="flex bg-gray-500 p-4 text-white items-center cursor-pointer">
          <span className="flex-grow">Pinned Pages</span>

          <i className="fa-solid fa-chevron-down p-2 w-8 h-8"></i>
        </div>
        <div className="grid grid-cols-3 grid-flow-row gap-4 m-4">
          {pinnedPages.map((page) => (
            <a key={page.id} className="flex flex-row rounded overflow-hidden h-40 border shadow shadow-md hover:shadow-xl " href={page.link} target="_blank">
              <i style={{ backgroundImage: `linear-gradient(${page.tileColor}, ${page.gradientColor})` }} className={`block h-full w-32 flex items-center justify-center bg-cover text-white text-7xl ${page.iconClassName}`}></i>

              <div className="bg-white w-full p-4 flex flex-col justify-between leading-normal">
                <span className="font-bold block leading-tight">{page.title}</span>
                <span className="flex-grow text-gray-500 block text-sm my-2">{page.description}</span>
                <span className="text-blue-500 text-sm">{page.link}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    <div>
    </div>
  );
};
