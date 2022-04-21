import React, { FunctionComponent, useEffect, useState } from "react";

import { Greetings, GroupModel, PageModel, UserModel } from "./_DataModels";

export const App: FunctionComponent = () => {

  const [user, setUser] = useState<UserModel>({ name: "", pinnedPages: [] } as UserModel);

  const [greeting, setGreeting] = useState<string>("");

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [data, setData] = useState<GroupModel[]>([]);

  const [pinnedPages, setPinnedPages] = useState<PageModel[]>([]);

  const [filteredPages, setFilteredPages] = useState<PageModel[]>([]);

  const [query, setQuery] = useState<string>("");

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

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      const filtered = data.flatMap(group => group.pages).filter(page => page.title.toLowerCase().includes(query.toLowerCase()));

      setFilteredPages(filtered);
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [query, data]);

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
            <a key={page.id} className="flex flex-row rounded overflow-hidden h-40 border shadow shadow-md hover:shadow-xl " href={page.link} target="_blank" rel="noreferrer">
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

      <div className="flex-row">
        {data.map(group => (
          <div key={group.name}>
            <div className="flex bg-gray-500 p-4 text-white items-center cursor-pointer" onClick={() => toggleGroup(group)}>
              <span className="flex-grow">{group.name}</span>

              <i className={`fa-solid p-2 w-8 h-8 ${group.isExpanded ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
            </div>
            <div className="grid grid-cols-3 grid-flow-row gap-4 m-4">
              {group.isExpanded && group.pages.map(page => (
                <a key={page.id} className="flex flex-row rounded overflow-hidden h-40 border shadow shadow-md hover:shadow-xl " href={page.link} target="_blank" rel="noreferrer">
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
        ))}
      </div>

      {isEditing && <div className="absolute right-0 top-0 w-2/5 h-full bg-white drop-shadow-lg">
        <div className="flex bg-slate-800 p-8 text-white items-center">
          <span className="flex-grow text-4xl">Configure</span>

          <div className="flex justify-end">
            <i className="bg-slate-800 p-2 text-white fa-solid fa-xmark w-8 h-8 p-2 cursor-pointer" onClick={() => setIsEditing(false)}></i>
          </div>
        </div>
        <div className="px-4">
          <form autoComplete="off" onSubmit={(e) => {
            localStorage.setItem("user", JSON.stringify(user));

            e.preventDefault();
          }}>
            <div className="py-2">
              <button onClick={() => clear()} className="text-red-500 bg-red-100 rounded px-4 py-2"><i className="mr-2 fa-solid fa-trash-can"></i>Clear customization data</button>
            </div>
            <div className="py-2">
              <label className="text-gray-800 font-bold mb-1 block" htmlFor="name">
                Your Name
              </label>
              <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 focus:outline-none focus:shadow-outline" id="name" autoComplete="off" onChange={(e) => {

                const name = e.target.value;

                setUser({ ...user, name });

                localStorage.setItem("user", JSON.stringify({ ...user, name }));
              }} value={user.name} />
            </div>
            <div className="py-2">
              <label className="text-gray-800 font-bold mb-1 block">
                Pinned Pages
              </label>
              <div>
                {data.map(group => group.pages.map(page => (
                  <div key={page.id}>
                    <i className={`p-2 cursor-pointer fa-solid fa-${user.pinnedPages.includes(page.id) ? "minus" : "thumbtack"}`} onClick={() => {
                      const pinnedPages = user.pinnedPages;

                      pinnedPages.includes(page.id) ? pinnedPages.splice(pinnedPages.indexOf(page.id), 1) : pinnedPages.push(page.id);

                      setUser({ ...user, pinnedPages });

                      const pageList = data.flatMap(group => group.pages).filter(page => user.pinnedPages.includes(page.id));

                      setPinnedPages(pageList);

                      localStorage.setItem("user", JSON.stringify(user));
                    }}></i>
                    <span className="ml-2">{page.title}</span>
                  </div>
                )))
                }
              </div>
            </div>
          </form>
        </div>
      </div>
      }
    </div>
  );
};
