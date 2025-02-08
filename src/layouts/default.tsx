import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header";

interface DefaultLayoutProps {
  user: any;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ user }) => {
  return (
    <div className="flex flex-col w-full min-h-dvh">
      <Header user={user} />
      <main className="flex flex-col grow">
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
