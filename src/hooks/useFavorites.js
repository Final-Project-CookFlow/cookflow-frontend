import { useState, useEffect } from "react";

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    const idStr = String(id);
    setFavorites((prev) =>
      prev.includes(idStr)
        ? prev.filter((fav) => fav !== idStr)
        : [...prev, idStr]
    );
  };

  return { favorites, toggleFavorite };
}
