import "../styles/FavoriteButton.css";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

function FavoriteButton({
  isFavorite,
  onToggle,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={`favorite-button ${
        isFavorite ? "favorite-active" : ""
      }`}
      onClick={onToggle}
    >
      {isFavorite
        ? "♥ Favorited"
        : "♡ Favorite"}
    </button>
  );
}

export default FavoriteButton;