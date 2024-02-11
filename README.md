# members-only
This backend project is also the part of the full stack course by the TOP ([theodinproject.com](https://www.theodinproject.com)). In this project the main learning is user authentication using [passportJS](https://www.passportjs.org/) a very powerful Nodejs library used for user authenticatin. Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. A 500+ set of strategies support authentication using a username and password, Facebook, Twitter, and much more.

This project is sort of small chat box where users can login and logout just like facebook and create messages and see messages of other users but can se user name and message date only if they are the members of the private chat club. For login session management on backend side, I have used [express-session](https://expressjs.com/en/resources/middleware/session.html) middleware along with passportJS middleware which helps passportJS store and retrieve user session data which is helpful in user authentication and authorization like rendering cetain pages based on user authentication provided by passportJS and express-session.

For credentials storage and secure access, [nconf](https://www.npmjs.com/package/nconf?activeTab=readme) has been used. Using nconf is easy; it is designed to be a simple key-value store with support for both local and remote storage. Keys are namespaced and delimited by :


[LIVE PREVIEW](https://fullstack-private-chatbox.adaptable.app/)