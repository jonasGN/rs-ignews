import Image from "next/image";

import logo from "/public/images/logo.svg";

import styles from "./styles.module.scss";
import { SignInButton } from "../SignInButton";
import { ActiveLink } from "./ActiveLink";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Image src={logo} alt="IG News Logo" />
        <nav className={styles.navMenu}>
          <ul>
            <li>
              <ActiveLink href="/" activeClassName={styles.active}>
                <a>Home</a>
              </ActiveLink>
            </li>
            <li>
              <ActiveLink href="/posts" activeClassName={styles.active}>
                <a>Posts</a>
              </ActiveLink>
            </li>
          </ul>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
