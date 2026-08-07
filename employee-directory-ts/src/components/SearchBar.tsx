import "../styles/SearchBar.css";

interface SearchBarProps {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

function SearchBar({
  searchText,
  setSearchText,
}: SearchBarProps) {

  return (

    <input
      className="search-bar"
      type="text"
      placeholder="Search Employee..."
      value={searchText}
      onChange={(event) =>
        setSearchText(event.target.value)
      }
    />

  );

}

export default SearchBar;