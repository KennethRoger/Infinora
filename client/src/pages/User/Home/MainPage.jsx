import Button from "@/components/Form/Button";
import Header from "@/components/Header/Header";
import CreatorBanner from "@/components/Section/CreatorBanner";
import { useLocation } from "react-router-dom";

function MainPage() {
  return (
    <>
      <main className="pt-[75px]">
        <CreatorBanner />
        <h1>Shop by Category</h1>
        <Button styles={""} />
      </main>
    </>
  );
}

export default MainPage;
