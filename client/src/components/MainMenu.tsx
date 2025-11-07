import { useEffect, useState } from 'react'

const MainMenu = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    setUserName(storedUser);
  }, []);

  return (
    <>
    <div className="text-white text-2xl">
      {userName ? `Üdv, ${userName}` : "Mittomán"}
    </div>
    <button
        onClick={() => {
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/";
        }}
        className="mt-4 px-4 py-2 bg-red-600 rounded cursor-pointer"
        >
        Kijelentkezés
    </button>
    </>
  );
}

export default MainMenu