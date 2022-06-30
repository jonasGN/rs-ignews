import styles from "./styles.module.scss";

interface PostTileProps {
  time: string;
  title: string;
  content: string;
}

export function PostTile(props: PostTileProps) {
  return (
    <a href="#" className={styles.container}>
      <time>{props.time}</time>
      <strong>{props.title}</strong>
      <p>{props.content}</p>
    </a>
  );
}
