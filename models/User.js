class User {
    constructor(email, password, isAdmin = true) {
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;

    }
    // Getter method for the user's email
    getEmail() {
        return this.email;
    }

    // Setter method for the user's email
    setEmail(email) {
        this.email = email;
    }

    // Getter method for the user's password
    getPassword() {
        return this.password;
    }

    // Setter method for the user's password
    setPassword(password) {
        this.password = password;
    }

    // Getter method for the user's isAdmin status
    getIsAdmin() {
        return this.isAdmin;
    }

    // Setter method for the user's isAdmin status
    setIsAdmin(isAdmin) {
        this.isAdmin = isAdmin;
    }

}

export default User;
