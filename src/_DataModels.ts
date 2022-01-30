export type PageModel = {
  id: string;
  title: string;
  description: string;
  link: string;
  iconClassName: string;
  tileColor: string;
  gradientColor: string;
  isHidden: boolean;
};

export type UserModel = {
  name: string;
  pinnedPages: string[];
};

export const Greetings = ["Good morning", "Good afternoon", "Good evening"];
