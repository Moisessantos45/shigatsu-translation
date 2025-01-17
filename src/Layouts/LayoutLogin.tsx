import { Outlet } from "react-router-dom";
import HeaderLogin from "../Headers/HeaderLogin";
import useUserStore from "../Store/useUserStore";
import { useEffect } from "react";

const LayoutLogin = () => {
  const { fetchUserData } = useUserStore();

  useEffect(() => {
    const llamdaFetchUserData = async (): Promise<void> => {
      await fetchUserData();
    };
    llamdaFetchUserData();
  }, []);
  return (
    <>
      <HeaderLogin />
      <Outlet />
    </>
  );
};

export default LayoutLogin;
