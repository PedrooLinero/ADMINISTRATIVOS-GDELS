import { Outlet } from "react-router";
import Menu from "../components/Menu";

function Home() {
  return (
    <>
      <Menu />
      {/* <PantallaInicio /> */}
      <Outlet />
    </>
  );
}

export default Home;