import Header from "../components/header";

interface DefaultLayoutProps {
  user: any;
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ user, children }) => {
  return (
    <div className="flex flex-col w-full min-h-dvh">
      <Header user={user} />
      <main className="flex flex-col grow">{children}</main>
    </div>
  );
};

export default DefaultLayout;
