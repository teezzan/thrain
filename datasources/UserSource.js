const GenericDataSource = require('apollo-datasource-generic');
var UserService = require('../services/UserService')


var books = [{ title: "Legend of tomorrow", author: 1 },
{ title: "Who am I?", author: 2 },
{ title: "The One", author: 2 }]


class UserApi extends GenericDataSource {
    constructor() {
        super();
        this.users = [
            {
                fullname: 'John',
                email: 'john@mail.com',
                password: 'john123',
                username: 'yoursite.net',
            }
        ];
        this.books = [{ title: "Legend of tomorrow", author: 1 },
        { title: "Who am I?", author: 2 },
        { title: "The One", author: 2 }]


    }

    getUser(user) {
        console.log(user);
        return this.books;
    }

    createUser = async (userObject) => {
        UserService.createUser(userObject)
            .then((response) => response)
            .catch((err) => err)
    }

}
module.exports = UserApi;