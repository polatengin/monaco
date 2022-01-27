import React, { FunctionComponent, useEffect } from 'react';

type User = {
  name: string;
  pinnedPages: number[];
  pagesOrder: number[];
};

export const App: FunctionComponent = () => {

  const [user, setUser] = React.useState<User | null>(null);

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
