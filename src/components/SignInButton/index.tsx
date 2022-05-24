import { FaGithub } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import styles from "./styles.module.scss";

export function SignInButton() {
  const isUserLoggedIn = false;

  return (
    <button className={styles.button}>
      <FaGithub color={isUserLoggedIn ? "#04D361" : "#eba417"} />
      {isUserLoggedIn ? "Username" : "Sing in with GitHub"}
      {isUserLoggedIn ? <IoMdClose /> : null}
    </button>
  );
}
