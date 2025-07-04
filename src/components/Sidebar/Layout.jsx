import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "../Header/Header";

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [filter, setFilter] = useState("all");

  return (
    <>
      <Header />
      <Sidebar
        setFilter={setFilter}
        isMenuOpen={isMenuOpen}
        toggleMenu={() => setIsMenuOpen((open) => !open)}
        filter={filter}
      />
      <main
        style={{
          marginTop: "65px",
          marginLeft: isMenuOpen ? "210px" : "0px",
          padding: "2rem",
          minHeight: "calc(100vh - 65px)",
          background: "#fff",
          transition: "margin-left 0.3s",
        }}
      >
        {React.cloneElement(children, {
          isMenuOpen,
          toggleMenu: () => setIsMenuOpen((open) => !open),
          filter,
          setFilter,
        })}
      </main>
    </>
  );
};

export default Layout;