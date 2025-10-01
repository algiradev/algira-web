"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/context/useCart";

type User = {
  id: number;
  username: string;
  avatar?: string;
};

type NavOption = {
  name: string;
  href: string;
};

export const AlgiraLogo = () => {
  return (
    <Image
      alt="Algira Logo"
      src="/algira.svg"
      width={70}
      height={70}
      className={styles.logoImage}
    />
  );
};

type DropdownProps = {
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

const UserDropdown = ({
  user,
  onLogout,
  isOpen,
  onToggle,
  onClose,
}: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button className={styles.userButton} onClick={onToggle}>
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className={styles.avatar}
          />
        ) : (
          <span className={styles.avatarPlaceholder}>
            {user.username[0].toUpperCase()}
          </span>
        )}
        <span className={styles.username}>{user.username}</span>
        <svg
          className={`${styles.dropdownChevron} ${isOpen ? styles.rotate : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div
            className={`${styles.dropdownItem} ${styles.dropdownItemProfile}`}
          >
            <p>Sesión iniciada como</p>
            <p>{user.username}</p>
          </div>
          <Link
            href="/profile"
            className={styles.dropdownItem}
            onClick={onClose}
          >
            Perfil
          </Link>
          <button
            className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
            onClick={onLogout}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

type NavbarProps = {
  options?: NavOption[];
  onCartToggle?: () => void;
};

export default function Navbar({ options = [], onCartToggle }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount, openSidebar, clearCart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const defaultOptions: NavOption[] = [
    { name: "¿Quiénes Somos?", href: "/about-us" },
    { name: "Sala de Sorteos", href: "/raffle-room" },
    { name: "Resultados", href: "/results" },
  ];

  const navOptions = options.length > 0 ? options : defaultOptions;

  const handleLogout = () => {
    logout();
    clearCart();
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      {/* Menú lateral */}
      <div
        className={`${styles.sidebarMenu} ${
          menuOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <AlgiraLogo />
          </Link>
          <button
            className={styles.closeSidebarButton}
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={24} color="white" />
          </button>
        </div>

        <div className={styles.sidebarContent}>
          {navOptions.map((option) => (
            <Link
              key={option.name}
              href={option.href}
              className={styles.sidebarItem}
              onClick={() => setMenuOpen(false)}
            >
              {option.name}
            </Link>
          ))}

          <hr className={styles.sidebarDivider} />
        </div>
      </div>

      <div className={styles.navbarContainer}>
        {/* Logo */}
        <div className={styles.navbarBrand}>
          <Link href="/">
            <AlgiraLogo />
          </Link>
        </div>

        {/* Botón hamburguesa */}
        <button
          className={styles.hamburgerButton}
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          {menuOpen ? (
            <X size={24} color="white" />
          ) : (
            <Menu size={24} color="white" />
          )}
        </button>

        {/* Menú del centro */}
        <div
          className={`${styles.navbarContentCenter} ${
            menuOpen ? styles.open : ""
          }`}
        >
          {navOptions.map((option) => (
            <div key={option.name} className={styles.navbarItem}>
              <Link
                href={option.href}
                className={`${styles.navbarItemLink} ${
                  pathname === option.href ? styles.navbarItemLinkActive : ""
                }`}
              >
                {option.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Lado derecho: carrito + usuario */}
        <div className={styles.navbarContentEnd}>
          <button
            className={styles.cartButton}
            onClick={openSidebar}
            aria-label="Abrir carrito"
          >
            <ShoppingCart size={24} color="white" />
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </button>

          {user ? (
            <UserDropdown
              user={user}
              onLogout={handleLogout}
              isOpen={dropdownOpen}
              onToggle={toggleDropdown}
              onClose={closeDropdown}
            />
          ) : (
            <>
              <div className={styles.navbarItem}>
                <Link href="/login" className={styles.loginButton}>
                  Ingresar
                </Link>
              </div>
              <div className={styles.navbarItem}>
                <Link href="/signup" className={styles.signupButton}>
                  Registrarse
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
