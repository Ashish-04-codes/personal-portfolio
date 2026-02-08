import React from "react";
import { motion } from "framer-motion";
import { useTransition } from "../context/TransitionContext";
import { useData } from "../context/DataContext";
import BackButton from "./BackButton";
import "../styles/SharedHeader.scss";

/**
 * SharedHeader
 *
 * Persistent component rendered outside the router.
 * Contains the logo and nav links with Framer layoutId
 * for automatic FLIP animation between home ↔ page positions.
 *
 * Home state: Logo bottom-left, links bottom alongside
 * Page state: Logo top-left (smaller), links horizontal in header bar
 */

/* ========================
   SPRING CONFIG
======================== */
const layoutTransition = {
  type: "spring",
  stiffness: 200,
  damping: 30,
  mass: 1,
};

function SharedHeader() {
  const { isHome, navigateTo } = useTransition();
  const { data } = useData();
  const { socials, settings } = data;

  // Dynamically map all socials — whatever is saved in admin shows here
  const navSocials = socials.map((s, i) => ({
    platform: s.platform,
    label: s.platform,
    num: String(i + 1).padStart(2, "0"),
    url: s.url || "#",
  }));

  const heroName = settings?.hero_name || "Ashish";

  const handleLogoClick = () => {
    if (!isHome) {
      navigateTo("/");
    }
  };

  return (
    <>
      {/* ===== HEADER BAR (visible on sub-pages) ===== */}
      <motion.header
        className={`shared-header ${isHome ? "shared-header--home" : "shared-header--page"}`}
        initial={false}
        animate={{
          opacity: isHome ? 0 : 1,
          y: isHome ? -20 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Background bar — only visible on sub-pages */}
        <div className="shared-header__bar" />
      </motion.header>

      {/* ===== BACK BUTTON (sub-pages only) ===== */}
      {!isHome && <BackButton />}

      {/* ===== LOGO ===== */}
      <motion.div
        layoutId="logo"
        className={`shared-header__logo ${isHome ? "shared-header__logo--home" : "shared-header__logo--page"}`}
        onClick={handleLogoClick}
        layout="position"
        transition={layoutTransition}
        style={{ zIndex: 10001 }}
      >
        {heroName}
      </motion.div>

      {/* ===== NAV LINKS ===== */}
      <motion.nav
        layoutId="nav-links"
        className={`shared-header__nav ${isHome ? "shared-header__nav--home" : "shared-header__nav--page"}`}
        layout="position"
        transition={layoutTransition}
        style={{ zIndex: 10001 }}
      >
        {navSocials.map((item) => (
          <NavItem key={item.num} num={item.num} label={item.label} onClick={() => window.open(item.url)} />
        ))}
      </motion.nav>
    </>
  );
}

/* ========================
   NAV ITEM
======================== */
function NavItem({ num, label, onClick }) {
  return (
    <button className="shared-header__nav-item" onClick={onClick} type="button">
      <span className="shared-header__nav-num">{num}</span>
      {label}
    </button>
  );
}

export default SharedHeader;
