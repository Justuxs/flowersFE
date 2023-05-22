
const main ="http://localhost:8080"
const endpoints = {
    login: main+"/admin/login",
    logout: "/api/logout",
    products: main+"/products",
    order: main+"/orders",
    review: main+"/review",

    // add more endpoints here
};

export default endpoints;