import styles from "./page.module.css";
import Translator from "@/components/Translator";

export default function Home() {
  return (
    <main className={styles.main}>
      <Translator />
    </main>
  );
}
