import Header from "../../components/UI/Header";
import PortfolioContent from "../../components/portfolio/PortfolioContent";
import { getRequest } from "../../utils/fetchData";
import styles from "../../styles/portfolios.module.scss";
import { InferGetStaticPropsType } from "next";
import metadata from "../../components/metadata";
import { NextSeo } from "next-seo";

interface Content {
  message: string;
  range: string;
  title: string;
  fileName: string;
  extension: string;
  portfolioDate: string;
  about: string;
  email: string;
  createdDate: string;
};

export default function DetailPage({
  content,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
			<NextSeo
				title="Portfolios"
        description="개발자들의 멋진 포트폴리오를 확인해보세요! 커버 이미지를 클릭하면 포트폴리오 영상을 보실 수 있습니다."
				canonical={`${metadata.meta.url}/portfolios`}
        openGraph={{ url: `${metadata.meta.url}/portfolios` }}
			/>
      <div className={styles.portfolioContainer}>
        <Header />
        <div className={styles.alignComponents}>
          <PortfolioContent content={content} />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const res = await getRequest("portfolios/file");
  const content: Content = await res.json();
  return {
    props: {
      content,
    },
  };
}
