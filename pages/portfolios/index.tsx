import Header from "../../components/UI/Header";
import PortfolioContent from "../../components/portfolio/PortfolioContent";
import styles from "./portfolios.module.scss";

export default function DetailPage() {
  return (
    <div className={styles.portfolioContainer}>
      <Header />
      <div className={styles.alignComponents}>
        <PortfolioContent/>
      </div>
    </div>
  );
}
