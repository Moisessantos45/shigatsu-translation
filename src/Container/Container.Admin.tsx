import useInteractionStore from "@/Store/InteracionState";
import { ReactNode, FC } from "react";

interface Props {
  children: ReactNode;
}

const ContainerAdmin: FC<Props> = ({ children }) => {
  const { isDarkMode } = useInteractionStore();
  return (
    <section className={`content ${isDarkMode ? "dark" : ""}`}>
      <div className="container px-4 mx-auto mt-5">{children}</div>
    </section>
  );
};

export default ContainerAdmin;
