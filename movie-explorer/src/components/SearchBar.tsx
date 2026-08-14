import "../styles/SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    onChange(event.target.value);
  }

  return (
    <input
      className="search-bar"
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Search movies..."
    />
  );
}

export default SearchBar;