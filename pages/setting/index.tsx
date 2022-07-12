import Header from "../../components/UI/Header";
import SettingList from "../../components/setting/SettingList";

// FIXME: 왜 바디가 전체 화면을 차지하지 않는걸까?
export default function Settings() {
  return (
    <>
      <Header />
      <SettingList />
    </>
  );
}
