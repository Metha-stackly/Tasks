// Product Data
const products = [
    {
        id: 1,
        name: "Laptop",
        category: "Electronics",
        price: 50000
    },
    {
        id: 2,
        name: "Mouse",
        category: "Electronics",
        price: 800
    },
    {
        id: 3,
        name: "Keyboard",
        category: "Electronics",
        price: 1500
    },
    {
        id: 4,
        name: "Shirt",
        category: "Clothing",
        price: 1200
    },
    {
        id: 5,
        name: "Jeans",
        category: "Clothing",
        price: 1800
    },
    {
        id: 6,
        name: "Shoes",
        category: "Footwear",
        price: 3000
    },
    {
        id: 7,
        name: "Watch",
        category: "Accessories",
        price: 2500
    },
    {
        id: 8,
        name: "Bag",
        category: "Accessories",
        price: 2000
    },
    {
        id: 9,
        name: "Headphones",
        category: "Electronics",
        price: 3500
    },
    {
        id: 10,
        name: "Bottle",
        category: "Home",
        price: 500
    }
];

// HTML Elements
const productTableBody = document.getElementById("productTableBody");
const searchProduct = document.getElementById("searchProduct");
const categoryFilter = document.getElementById("categoryFilter");
const sortPrice = document.getElementById("sortPrice");

// Display Products
function displayProducts(productList = products) {

    productTableBody.innerHTML = "";

    productList.forEach(function(product){

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
        `;

        productTableBody.appendChild(row);

    });

}

// Display products on page load
displayProducts();


// Search Product (find)
searchProduct.addEventListener("keyup", function(){

    const searchValue = searchProduct.value.toLowerCase();

    if(searchValue === ""){
        displayProducts();
        return;
    }

    const foundProduct = products.find(function(product){

        return product.name.toLowerCase() === searchValue;

    });

    if(foundProduct){

        displayProducts([foundProduct]);

    }else{

        productTableBody.innerHTML =
        "<tr><td colspan='4'>No Product Found</td></tr>";

    }

});


// Filter Products
categoryFilter.addEventListener("change", function(){

    const selectedCategory = categoryFilter.value;

    if(selectedCategory === "All"){
        displayProducts();
        return;
    }

    const filteredProducts = products.filter(function(product){

        return product.category === selectedCategory;

    });

    displayProducts(filteredProducts);

});


// Sort Products
sortPrice.addEventListener("change", function(){

    let sortedProducts = [...products];

    if(sortPrice.value === "asc"){

        sortedProducts.sort(function(a,b){
            return a.price - b.price;
        });

    }
    else if(sortPrice.value === "desc"){

        sortedProducts.sort(function(a,b){
            return b.price - a.price;
        });

    }

    displayProducts(sortedProducts);

});


// map() Example
const productNames = products.map(function(product){

    return product.name;

});

console.log("Product Names:");
console.log(productNames);