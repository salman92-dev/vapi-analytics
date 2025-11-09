import Sidebar from "../client-dashboard-components/sidebar";

const Layout = ({ children }) => {
  return (
    <div>
        <Sidebar/>
        <main className=" lg:ml-73">{children}</main>
    </div>
  );
}

export default Layout;