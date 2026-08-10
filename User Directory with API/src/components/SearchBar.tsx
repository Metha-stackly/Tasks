interface SearchBarProps {
  searchText: string;
  onSearchChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

function SearchBar({
  searchText,
  onSearchChange,
}: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search users by name"
      value={searchText}
      onChange={onSearchChange}
    />
  );
}

export default SearchBar;