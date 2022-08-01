// PortfolioContent.tsx의 FilterImageProps 타입 설정을 위한 글로벌 타입 선언
export {};

declare global {
  type StaticImport = {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  }
}