import Image from "next/image";

import logo from "/public/images/logo.svg";

import styles from "./styles.module.scss";
import { SignInButton } from "../SignInButton";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Image src={logo} alt="IG News Logo" />
        <nav className={styles.navMenu}>
          <ul>
            <li>
              <a href="" className={styles.active}>
                Home
              </a>
            </li>
            <li>
              <a href="">Posts</a>
            </li>
          </ul>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
