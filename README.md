[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# commit-spy
This is a Graphql-based microservices project. IdeaHub is a graphql based system for storing and sharing ideas with the public while also getting feedback. It has various features for making the experience awesome. It allows users to

- Create an Account
- Post ideas Publicly and Privately
- Comment and like ideas
- Message fellow users
- make voice calls to users.

The basic backend system is completed and work is being done on the frontend part of the project. 
## GraphQL Schema
The system's graphql schema is simple and can be seen via any graphQL compatible Client when querying `https://thraine.herokuapp.com` where the project is currently hosted. For documentation sake, it is as follows.




![Query](./img/ideahub_schema.png)
![Mutation](./img/ideahubMutation.png)


## Images
In the image below, a new user is created.
![Reg](./img/ideahubreg.png)


Here is an image of the Login query.
![User Login](./img/ideahubLogin.png)


Below, a new idea is created by an already authorized user.
![Create Project](./img/ideahubCreate.png)



