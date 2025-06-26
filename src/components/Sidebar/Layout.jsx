import React, { useState } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [filter, setFilter] = useState("all");

  return (
    <>
      <Sidebar
        setFilter={setFilter}
        isMenuOpen={isMenuOpen}
        toggleMenu={() => setIsMenuOpen((open) => !open)}
        filter={filter}
      />
      {React.cloneElement(children, {
        isMenuOpen,
        toggleMenu: () => setIsMenuOpen((open) => !open),
        filter,
        setFilter,
      })}
    </>
  );
};

export default Layout;