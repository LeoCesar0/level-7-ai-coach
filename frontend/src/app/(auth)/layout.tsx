import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <div className="flex-1 grid place-items-center">
        <main className="p-[20px]" >{children}</main>
      </div>
    </>
  );
};

export default Layout;
