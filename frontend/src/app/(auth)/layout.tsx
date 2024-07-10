import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <div className="flex-1 flex flex-col justify-center pb-8">
        <main className="p-[20px]">{children}</main>
      </div>
    </>
  );
};

export default Layout;
