import Header from "../../components/UI/Header";
import PortfolioContent from "../../components/portfolio/PortfolioContent";
import { getRequest } from "../../utils/fetchData";
import styles from "./portfolios.module.scss";
import { InferGetStaticPropsType } from "next";

type Content = {
  message : string,
	range : string,
	title : string,
	fileName : string,
	extension : string,
	portfolioDate : string,
	about : string,
	email : string,
	createdDate : string,
}

export default function DetailPage({ content }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className={styles.portfolioContainer}>
      <Header />
      <div className={styles.alignComponents}>
        <PortfolioContent content={content}/>
      </div>
    </div>
  );
}

export async function getStaticProps() {
	const res = await getRequest("portfolios/file");
  const content: Content[] = await res.json();

	return {
		props: {
			content
		}
	}
}
