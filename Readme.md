 Transfer-test
---------------

### Start:
```bash
docker-compose up --build -d
```
Docker exposes `8080` app port and `5432` pgsql port for convenience

### Rest API:
```
GET  /account/                                                  - returns current session user
GET  /account/:id                                               - get user by id
POST /account/transfer/:from/:to         { amount }             - transfer from :from to :to
POST /auth/login                         { name, password }     - login using JWT
POST /auth/register                      { name, password }     - create new user

```

### Containers:
* `pg` - pgsql databas
* `migrate` - initial migrations creating `accounts` and `changes` tables
* `seed` - initialize db with some mock data
* `app` - nodejs server

### Tests:
Actually no good tests here, but I wrote an interesting benchmark test for different transaction isolation levels.     
You can run it locally after change `.env` file, you will need to set `PGHOST=127.0.0.1`