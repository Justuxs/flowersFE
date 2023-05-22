
const main ="http://localhost:8080"
const endpoints = {
    login: main+"/admin/login",
    logout: "/api/logout",
    products: main+"/products",
    order: main+"/orders",
    review: main+"/review",
    statistics: main+"/statistics"

    // add more endpoints here
};

export default endpoints;