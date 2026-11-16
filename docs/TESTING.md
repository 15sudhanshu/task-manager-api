# API Testing

All endpoints were tested manually with Thunder Client against a local MySQL database. These cases cover error handling and authentication.

| #   | Test                                               | Expected | Result | Screenshot                                        |
| --- | -------------------------------------------------- | -------- | ------ | ------------------------------------------------- |
| 1   | Register with an email that already exists         | 409      | Pass   | [view](screenshots/01-duplicate-register-409.png) |
| 2   | Log in with a wrong password                       | 401      | Pass   | [view](screenshots/02-wrong-password-401.png)     |
| 3   | List tasks without a token                         | 401      | Pass   | [view](screenshots/03-no-token-401.png)           |
| 4   | Create a task without a title                      | 400      | Pass   | [view](screenshots/04-missing-title-400.png)      |
| 5   | Get a task that does not exist                     | 404      | Pass   | [view](screenshots/05-task-not-found-404.png)     |
| 6   | Call a protected route with an invalid token       | 401      | Pass   | [view](screenshots/06-bad-token-401.png)          |
| 7   | Create a task with an invalid status               | 400      | Pass   | [view](screenshots/07-invalid-status-400.png)     |
| 8   | Register with a password shorter than 8 characters | 400      | Pass   | [view](screenshots/08-short-password-400.png)     |
