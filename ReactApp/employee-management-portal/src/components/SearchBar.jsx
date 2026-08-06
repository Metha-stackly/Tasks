import "../styles/SearchBar.css";

function SearchBar({

    searchText,

    setSearchText

}){

    return(

        <div className="search-container">

            <input

                type="text"

                placeholder="Search employee..."

                value={searchText}

                onChange={(e)=>setSearchText(e.target.value)}

            />

        </div>

    );

}

export default SearchBar;