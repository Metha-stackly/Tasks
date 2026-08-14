import "../styles/Filter.css";

interface FilterProps {
  selectedGenre: string;
  sortBy: string;
  onGenreChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

function Filter({
  selectedGenre,
  sortBy,
  onGenreChange,
  onSortChange,
}: FilterProps) {
  return (
    <div className="filter-container">

      <select
        value={selectedGenre}
        onChange={(event) =>
          onGenreChange(
            event.target.value
          )
        }
      >
        <option value="">
          All Genres
        </option>

        <option value="28">
          Action
        </option>

        <option value="12">
          Adventure
        </option>

        <option value="35">
          Comedy
        </option>

        <option value="18">
          Drama
        </option>

        <option value="27">
          Horror
        </option>

        <option value="10749">
          Romance
        </option>

        <option value="878">
          Science Fiction
        </option>
      </select>

      <select
        value={sortBy}
        onChange={(event) =>
          onSortChange(
            event.target.value
          )
        }
      >
        <option value="">
          Sort By
        </option>

        <option value="high">
          Rating: High to Low
        </option>

        <option value="low">
          Rating: Low to High
        </option>
      </select>

    </div>
  );
}

export default Filter;