import { useEffect, useState } from "react";

import UserCard from "../components/UserCard";
import SearchBar from "../components/SearchBar";

import type { User } from "../types/User";

function Users() {

  const [users, setUsers] = useState<User[]>([]);

  const [searchText, setSearchText] =
    useState<string>("");

  const [selectedCity, setSelectedCity] =
    useState<string>("All");

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  useEffect(() => {

    fetch("https://jsonplaceholder.typicode.com/users")

      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json() as Promise<User[]>;
      })

      .then((data: User[]) => {

        setUsers(data);

        setLoading(false);
      })

      .catch(() => {

        setError("Failed to fetch users");

        setLoading(false);
      });

  }, []);

  function handleSearchChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    setSearchText(event.target.value);
  }

  function handleCityChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {

    setSelectedCity(event.target.value);
  }

  const cities = [
    "All",
    ...Array.from(
      new Set(
        users.map(
          (user) => user.address.city
        )
      )
    ),
  ];

  const filteredUsers = users.filter((user) => {

    const matchesName =
      user.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

    const matchesCity =
      selectedCity === "All" ||
      user.address.city === selectedCity;

    return matchesName && matchesCity;
  });

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="users-page">

      <h1>User Directory</h1>

      <div className="filters">

        <SearchBar
          searchText={searchText}
          onSearchChange={handleSearchChange}
        />

        <select
          value={selectedCity}
          onChange={handleCityChange}
        >

          {cities.map((city) => (
            <option
              key={city}
              value={city}
            >
              {city}
            </option>
          ))}

        </select>

      </div>

      {filteredUsers.length === 0 ? (

        <h2>No Users Found</h2>

      ) : (

        <div className="user-list">

          {filteredUsers.map((user) => (

            <UserCard
              key={user.id}
              user={user}
            />

          ))}

        </div>

      )}

    </div>
  );
}

export default Users;