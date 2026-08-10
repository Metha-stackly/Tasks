import type { User } from "../types/User";

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  return (
    <div className="user-card">

      <h2>{user.name}</h2>

      <p>
        <strong>Username:</strong> {user.username}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <p>
        <strong>Phone:</strong> {user.phone}
      </p>

      <p>
        <strong>City:</strong> {user.address.city}
      </p>

      <p>
        <strong>Company:</strong> {user.company.name}
      </p>

    </div>
  );
}

export default UserCard;