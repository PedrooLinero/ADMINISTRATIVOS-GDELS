import { Outlet } from "react-router";
import Menu from "../components/Menu";
import PantallaInicio from "../components/PantallaInicio";

function Home() {
  return (
    <>
      <Menu />
      <PantallaInicio />
      <Outlet />
    </>
  );
}

export default Home;