
//Getting Users
const userContainer = document.getElementById("userContainer");
const loading = document.getElementById("loading");
const searchUser = document.getElementById("searchUser");
const sortBtn = document.getElementById("sortBtn");

let users = [];

//Fetch Users (Async/Await)
async function fetchUsers(){

    loading.style.display = "block";

    try{

        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        users = await response.json();

        displayUsers(users);

    }
    catch(error){

        userContainer.innerHTML = "<h2>Failed to Load Users</h2>";

    }

    loading.style.display = "none";

}

//Display Users

function displayUsers(userList){

    userContainer.innerHTML = "";

    userList.forEach(function(user){

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${user.name}</h3>

            <p><strong>Username:</strong> ${user.username}</p>

            <p><strong>Email:</strong> ${user.email}</p>

            <p><strong>Phone:</strong> ${user.phone}</p>

            <p><strong>Company:</strong> ${user.company.name}</p>

            <p><strong>City:</strong> ${user.address.city}</p>
        `;

        userContainer.appendChild(card);

    });

}

//Load Users
fetchUsers();

//Search users (using EVENT LISTENER)

searchUser.addEventListener("keyup", function () {

    const searchValue = searchUser.value.toLowerCase();

    const filteredUsers = users.filter(function(user){

        return user.name.toLowerCase().includes(searchValue);

    });

    displayUsers(filteredUsers);

});

//Sorting
sortBtn.addEventListener("click", function(){

    users.sort(function(a,b){

        return a.name.localeCompare(b.name);

    });

    displayUsers(users);

});

//Improve err Handling
userContainer.innerHTML = `
    <div style="text-align:center;color:red;">
        <h2>Failed to Load Users</h2>
        <p>Please check your internet connection and try again.</p>
    </div>
`;