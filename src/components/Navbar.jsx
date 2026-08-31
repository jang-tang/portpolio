import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation } from "../data/portfolio";

function Navbar() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="#" className="logo">
          JTW<span>.</span>
        </a>

        <nav className={`nav-links ${open ? "active" : ""}`}>
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleClick}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label="메뉴"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;