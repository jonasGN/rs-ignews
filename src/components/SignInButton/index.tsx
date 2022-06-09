import { useSession, signIn, signOut } from "next-auth/react";

import { FaGithub } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import styles from "./styles.module.scss";

export function SignInButton() {
  const { data, status } = useSession();

  function handleButtonClick() {
    status === "authenticated" ? signOut() : signIn("github");
  }

  const title = () => {
    if (status === "loading") return "";
    return data ? data.user.name : "Sign in with GitHub";
  };

  const loadingClass = status === "loading" ? styles.loading : "";
  const statusColor = data ? "#04D361" : "#eba417";

  return (
    <button
      type="button"
      className={`${styles.button} ${loadingClass}`}
      onClick={handleButtonClick}
      disabled={status === "loading"}
    >
      <FaGithub color={statusColor} />
      {title()}
      {data ? <IoMdClose /> : null}
    </button>
  );
}
