import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import "./styles/Navbar.css";

const Navbar = () => {
  useEffect(() => {
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        let section = element.getAttribute("data-href");
        if (section) {
          const target = document.querySelector(section);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          AY
        </a>

        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#what-i-do" href="#what-i-do">
              <HoverLinks text="WHAT I DO" />
            </a>
          </li>
          <li>
            <a data-href="#career" href="#career">
              <HoverLinks text="CAREER" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#academics" href="#academics">
              <HoverLinks text="ACADEMICS" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="HIRE ME" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
