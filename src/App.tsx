import React, { FunctionComponent } from 'react';

type User = {
  name: string;
  pinnedPages: number[];
  pagesOrder: number[];
};

export const App: FunctionComponent = () => {

  const [user, setUser] = React.useState<User | null>(null);

  return (
    <div>
    </div>
  );
};
