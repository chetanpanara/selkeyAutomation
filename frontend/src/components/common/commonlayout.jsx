import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

function CommonLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-blue-200">
        <NavBar />
      </header>
      <main className="flex-grow w-full mt-12">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-purple-200">
        <Footer />
      </footer>
    </div>
  );
}

export default CommonLayout;
