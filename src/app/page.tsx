// import Image from "next/image";
import ColorChallenge from "@/components/ColorChallenge";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* <header>Dark mode here. Later.</header> */}
      <main className={styles.main}>
        <h1>What the color?</h1>
        <p>A proof of visual accuracy.</p>
        <ColorChallenge />
      </main>
      <footer className={styles.footer}>Made with ❤️ by Sheniff.</footer>
    </div>
  );
}
