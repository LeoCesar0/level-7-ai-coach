import { ReactNode } from "react";
import { HomeDetails } from "../(home)/HomeDetails";

interface IProps {
  children: ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <div className="flex-1 flex flex-col justify-center pb-8">
        <main className="p-[20px] container">{children}</main>
        <HomeDetails />
      </div>
    </>
  );
};

export default Layout;
