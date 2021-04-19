__`KEY_WORD: Heroku deploy addon postgreSQL, PostgreSQL pool, package.json scrips, __dirname, full-stack app file structure, Callback function order, Frontend options input.`__

## Important: Heroku hobby postgreSQL is just supporting Client way (not pool) way to connect.

<p align="center">
<img src="./assets/weather-01.png" width=90%>
</p>

---------------------------------------------------

- Check the deploy app here. [Weather app heroku link.](https://myweather-app-2021.herokuapp.com/)

- Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/WebDev-tools-demo/blob/master/README.md).

------------------------------------------------------------
# Full Stack React App Tutorial
A simple weather app, built for a full stack React app tutorial. Also features Reactstrap, Express, and PostgreSQL.

This tutorial is from [Develop and Deploy a Full Stack React App](https://brycestpierre.com/full-stack-react-app/), by By Bryce St. Pierre. Thanks for his hard work and help! 

#### Instruction about running application locally.

1. Run commands in terminal

```bash
$ git clone <github-link>
$ cd <folder-name>
$ npm i
$ npm run installAll
```

2. Sign up and get your own Weather api key in [https://openweathermap.org/](https://openweathermap.org/)

3. Create a new file call '.env' in folder `server`.

__`Location:./server/.env`__

```bash
WEATHER_API=you api key here // <-- replace with your api key
```

4. Download, install [postgreSQL](https://www.postgresql.org/).

- Start your local postgreSQL server.

- Create a local database in Postgres and a new table locally.

```bash
$ createdb -U postgres weather-db

$ psql --username=postgres

postgres=# \l

postgres=# \c weather-db

weather-db=# CREATE TABLE cities (
	id serial NOT NULL,
	city_name character varying(50) NOT NULL UNIQUE,
	PRIMARY KEY (id)
);

weather-db=# \dt

weather-db=# \c postgres
```

- [stackoverflow](https://stackoverflow.com/questions/17963348/how-to-disconnect-from-a-database-and-go-back-to-the-default-database-in-postgre)
- [postgre CLI](https://www.datacamp.com/community/tutorials/10-command-line-utilities-postgresql)

------------------------------------------------------------

5. Or simplly, we can run the script.

```bash
npm run configure-db-local
```
------------------------------------------------------------

6. Run the app in local.
```bash
$ npm run dev
```
------------------------------------------------------------

# Web development tools (Part 29)

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/WebDev-tools-demo/blob/master/README.md)

## `Section: Deploy.` (Basic)

### `Summary`: In this documentation, we learn to deploy a fullstack application with tech stack React, Node, Express and Postgres.

### `Check Dependencies & Tools:`

`Backend:`
- body-parser
- cookie-parser
- dotenv
- express
- pg :star:(8.3.0)
- request
- request-promise

`Frontend:`
- bootstrap
- lodash
- lodash.template
- merge
- react
- react-dom
- react-scripts
- reactstrap

------------------------------------------------------------

#### `本章背景：`
- 本章是一个很简单的部署全栈应用程序的教程，使用的技术栈包括：React，Node，Express，Postgres，部署平台是 Heroku。

- 本实例有三个特点，第一个是全栈部署，第二是使用 Postgres 部署，有比较大的实用指导意义，第三时作者对于 SQL database 的设置比较原生，也是一个很好学习的机会。

- 自己对原本的文件结构进行调整，对应的 package.json 也进行了修改，是一个很好的学习机会。[heroku customize nodejs scripts](https://devcenter.heroku.com/articles/nodejs-support)

------------------------------------------------------------
- 设计思路：

1. 后端思路：重点是 pool 的设置。

2. 前端思路：正常设置，还有配置 proxy。

3. 可以补充的工作：
    - 加入 redis & Authentication。
    - 增加前端错误信息显示条，比如说前端和后端都遇到错误，前端进行页面跳转并显示来自后端的错误信息。
    - 提升 code 的逻辑，减少重复。
    - 增加 errorHandler。
------------------------------------------------------------

### <span id="29.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/WebDev-tools-demo/blob/master/README.md)

- [29.1 Change file structure.](#29.1)
- [29.2 Backend setup.](#29.2)
- [29.3 Frontend setup.](#29.3)
- [29.4 Deploy in heroku.](#29.4)
- [29.5 Re-deploy.](#29.5)
- [29.6 ‘pg’ Dependency version update.](#29.6)
- [29.7 PostgreSQL pool.](#29.7)

------------------------------------------------------------

### <span id="29.1">`Step1: Change file structure.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

1. 传统的 fullstack 文件结构（网上常见的 heroku deploy 教程结构），[查看这里：Weather-RNEP-heroku-old](https://github.com/DonghaoWu/Weather-RNEP-heroku-old)

  - 之前的结构是把前端 app 放在大文件夹里面，前端 app 有自己的 package.json，但是后端 app 不是独立的，它跟全局共用一个 package.json，所以之前一共有两个 package.json，分别是：

  __`Location:./package.json`__

  ```json
  {
    "name": "postgres-deploy-heroku",
    "version": "1.0.0",
    "description": "A tutorial about deploy a postgres fullstack application.",
    "main": "index.js",
    "scripts": {
      "dev": "concurrently \"npm run server\" \"npm run client\"",
      "client": "npm start --prefix client",
      "server": "nodemon server",
      "start": "node server",
      "heroku-postbuild": "cd client && npm install && npm run build"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/DonghaoWu/deploy-example-heroku.git"
    },
    "keywords": [
      "postgres-deploy-heroku"
    ],
    "author": "Donghao",
    "license": "ISC",
    "bugs": {
      "url": "https://github.com/DonghaoWu/deploy-example-heroku/issues"
    },
    "homepage": "https://github.com/DonghaoWu/deploy-example-heroku#readme",
    "devDependencies": {
      "concurrently": "^5.2.0",
      "nodemon": "^2.0.4"
    },
    "dependencies": {
      "body-parser": "^1.19.0",
      "cookie-parser": "^1.4.5",
      "dotenv": "^8.2.0",
      "express": "^4.17.1",
      "pg": "^8.3.0",
      "request": "^2.88.2",
      "request-promise": "^4.2.6"
    }
  }
  ```

  __`Location:./client/package.json`__

  ```json
    
  {
    "name": "client",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
      "bootstrap": "^4.3.1",
      "lodash": "^4.17.19",
      "lodash.template": "^4.5.0",
      "merge": "^1.2.1",
      "react": "^16.5.1",
      "react-dom": "^16.5.1",
      "react-scripts": "^3.4.1",
      "reactstrap": "^6.4.0"
    },
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test --env=jsdom",
      "eject": "react-scripts eject"
    },
    "proxy": "http://localhost:5000",
    "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    }
  }
  ```

2. 修改后，把后端 app 独立起来，使后端 app 有自己的 package.json，这需要把一些 dependency 转移到 server 文件夹中，同时对根目录的 package.json 进行修改。

```diff
+ ./client/package.json 不用修改
```

__`Location:./package.json`__

```diff
{
  "name": "postgres-deploy-heroku",
  "version": "1.0.0",
  "description": "A tutorial about deploy a postgres fullstack application.",
  "main": "index.js",
  "scripts": {
+   "installAll": "concurrently \"npm run installServer\" \"npm run installClient\"",
+   "installServer": "cd server && npm install",
+   "installClient": "cd client && npm install",
+   "dev": "concurrently \"npm run server\" \"npm run client\"",
+   "client": "npm start --prefix client",
+   "server": "npm run server --prefix server",
+   "start": "npm start --prefix server",
+   "heroku-prebuild": "cd server && npm install",
+   "heroku-postbuild": "cd client && npm install && npm run build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/DonghaoWu/deploy-example-heroku.git"
  },
  "keywords": [
    "postgres-deploy-heroku"
  ],
  "author": "Donghao",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/DonghaoWu/deploy-example-heroku/issues"
  },
  "homepage": "https://github.com/DonghaoWu/deploy-example-heroku#readme",
  "devDependencies": {
+   "concurrently": "^5.2.0"
  }
}
```

__`Location:./server/package.json`__

```diff
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "server": "nodemon index.js",
    "start": "node index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
+   "body-parser": "^1.19.0",
+   "cookie-parser": "^1.4.5",
+   "dotenv": "^8.2.0",
+   "express": "^4.17.1",
+   "pg": "^8.3.0",
+   "request": "^2.88.2",
+   "request-promise": "^4.2.6"
  },
  "devDependencies": {
+   "nodemon": "^2.0.4"
  }
}
```
#### `Comment:`
1. 修改文件结构确实使工作量增多了，但这样做能够最大程度保持前端 app 和后端 app 能独立一个文件夹，使用起来会清楚很多。

### <span id="29.2">`Step2: Backend setup.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

#### Backend 主要是聚焦在 Database 的设置不一样上面。

1. 之前 smart-brain-prod 的 postgreSQL 设置：

```js
// Step 1, 定义 route function
const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
}

// Step 2, Database Setup
const knex = require('knex');

const db = knex({
  client: process.env.POSTGRES_CLIENT,
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  }
});

// Step 3, 应用，在 route 中调用 function。
app.get('/profile/:id', auth.requireAuth, (req, res) => { handleProfileGet(req, res, db) })
```

- 或者
```js
// Step 2, Database Setup
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});
```

2. 本例的 postgreSQL 设置：

```js
// Step 1, Database Setup
const { Pool } = require('pg');

const CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/weather-db';

class Database {
  constructor() {
    this._pool = new Pool({
      connectionString: CONNECTION_STRING,
    });

    this._pool.on('error', (err, client) => {
      console.error('Unexpected error on idle PostgreSQL client.', err);
      process.exit(-1);
    });
  }

  query(query, ...args) {
    this._pool.connect((err, client, done) => {
      if (err) throw err;
      const params = args.length === 2 ? args[0] : [];
      const callback = args.length === 1 ? args[0] : args[1];

      client.query(query, params, (err, res) => {
        done();
        if (err) {
          console.log(err.stack);
          return callback({ error: 'Database error.' }, null);
        }
        callback({}, res.rows);
      });
    });
  }

  end() {
    this._pool.end();
  }
}

module.exports = new Database();
```

```js
// Step 2, 定义route function
const db = require('../database');

class Cities {
  static retrieveAll (callback) {
    db.query('SELECT city_name from cities', (err, res) => {
      let result = err.error ? err : res;
      callback(result);
    });
  }

  static insert (city, callback) {
    db.query('INSERT INTO cities (city_name) VALUES ($1)', [city], (err, res) => {
      let result = err.error ? err : res;
      callback(result);
    });
  }
}

module.exports = Cities;
```

```js
// Step 3, 应用，在 route 中调用 function。
let express = require('express');
let Cities = require('../models/cities');

let router = express.Router();

router.get('/', (req, res) => {
  Cities.retrieveAll((result) => {
    return res.json(result);
  });
});

router.post('/', (req, res) => {
  let city = req.body.city;

  Cities.insert(city, (result) => {
    return res.json(result);
  });
});

module.exports = router;
```

#### `Comment:`
1. 很明显，本例中使用的 database 设置更复杂更原生，值得学习，而且这里使用了 跟 smart-brain 不一样的 __`pool 概念`__。

2. 试图分析这种原生设置的调用顺序：

```diff
+ API call: `/`
+ client.query('SELECT city_name from cities', [], callback-A);


+ success:
+ callback-A({}, res.rows); //db.query('SELECT city_name from cities', callback-A);
+ callback-B(res); // retrieveAll (callback-B)


- failed
- callback-A({ error: 'Database error.' }, null); //db.query('SELECT city_name from cities', callback-A);
- callback-B(err); // retrieveAll (callback-B)
```


<p align="center">
<img src="./assets/p29-03.png" width=90%>
</p>

-----------------------------------------------------------------

3. 从代码可知，有两个函数是原生的，包括

```js
this._pool.on(param, callback) // callback(err, client)
this._pool.connect(callback) // callback(err, client, done)
client.query(param1, param2, callback) // client 来自 this._pool.connect(callback) 中 callback 的第二个参数。
```

4. 为了方便理解，上面的代码跟源代码有点区别，原版是：

```js
// Step 2, 定义route function
const db = require('../database');

class Cities {
  static retrieveAll (callback) {
    db.query('SELECT city_name from cities', (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }

  static insert (city, callback) {
    db.query('INSERT INTO cities (city_name) VALUES ($1)', [city], (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }
}

module.exports = Cities;
```

```js
// Step 3, 应用，在 route 中调用 function。
let express = require('express');
let Cities = require('../models/cities');

let router = express.Router();

router.get('/', (req, res) => {
  Cities.retrieveAll((err, cities) => {
    if (err)
      return res.json(err);
    return res.json(cities);
  });
});

router.post('/', (req, res) => {
  let city = req.body.city;

  Cities.insert(city, (err, result) => {
    if (err)
      return res.json(err);
    return res.json(result);
  });
});

module.exports = router;
```


### <span id="29.3">`Step3: Frontend setup.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

1. 配置 proxy：

__`Location:./client/package.json`__

```json
"proxy": "http://localhost:5000"
```

2. 前端代码：

__`Location:./client/src/App.js`__

```jsx
import React, { Component } from 'react';

import {
  Container,
  Navbar,
  NavbarBrand,
  Row,
  Jumbotron,
  InputGroup,
  InputGroupAddon,
  Button,
  FormGroup,
  Input,
  Col
} from 'reactstrap';

import Weather from './Weather';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weather: null,
      cityList: [],
      newCityName: ''
    };
  }

  getCityList = () => {
    fetch('/api/cities')
      .then(res => res.json())
      .then(res => {
        let cityList = res.map(r => r.city_name);
        this.setState({ cityList });
      });
  };

  handleInputChange = (e) => {
    this.setState({ newCityName: e.target.value });
  };

  handleAddCity = () => {
    fetch('/api/cities', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: this.state.newCityName })
    })
      .then(res => res.json())
      .then(res => {
        this.getCityList();
        this.setState({ newCityName: '' });
      });
  };

  handleChangeCityAndGetWeather = (e) => {
    let city = e.target.value;
    fetch(`/api/weather/${city}`)
      .then(res => res.json())
      .then(weather => {
        this.setState({ weather });
      });
  }

  componentDidMount() {
    this.getCityList();
  }

  render() {
    return (
      <Container fluid className="centered">
        <Navbar dark color="dark">
          <NavbarBrand href="/">MyWeather</NavbarBrand>
        </Navbar>
        <Row>
          <Col>
            <Jumbotron>
              <h1 className="display-3">MyWeather</h1>
              <p className="lead">The current weather for your favorite cities!</p>
              <InputGroup>
                <Input
                  placeholder="New city name..."
                  value={this.state.newCityName}
                  onChange={this.handleInputChange}
                />
                <InputGroupAddon addonType="append">
                  <Button color="primary" onClick={this.handleAddCity}>Add City</Button>
                </InputGroupAddon>

              </InputGroup>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1 className="display-5">Current Weather</h1>
            <FormGroup>
              <Input type="select" onChange={this.handleChangeCityAndGetWeather}>
                {this.state.cityList.length === 0 && <option>No cities added yet.</option>}
                {this.state.cityList.length > 0 && <option>Select a city.</option>}
                {this.state.cityList.map((city, i) => <option key={i}>{city}</option>)}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Weather data={this.state.weather} />
      </Container>
    );
  }
}

export default App;
```

#### `Comment:`
1. `这里有一个新应用，就是 option 的 handle function 的书写。`

### <span id="29.4">`Step4: Deploy in heroku.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

1. 设定 static 内容的来源。

__`Location:./server/index.js`__

```js
const ENV = process.env.NODE_ENV;

if(ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.use((req,res)=>{
        res.sendFile(path.join(__dirname,'../client/build/index.html'))
    })
}
```

#### `Comment:`
- 关于 __dirname 的使用。
```js
path.join(__dirname, '../client/build')
// __dirname ---> 当前路径，以字符串表示，是动态显示属性，无论这个 app 在哪里，__dirname 都是指当前文件所在文件夹。
// ‘../client/build’，表示当前文件所在文件夹往上一层，然后进入 client 文件夹，最后定位里面的 build 文件夹。
```

- 参考资料：[How to Use __dirname in Node.js](https://www.digitalocean.com/community/tutorials/nodejs-how-to-use__dirname)

2. Bash heroku 命令 (先注册 heroku 账户)：:star::star::star:

```bash
$ heroku login  # 登录 heroku
$ heroku create <your-app-name> # 定制 app 名字
$ heroku addons:create heroku-postgresql:hobby-dev --name=<your-db-name> # 新增一个 postgreSQL 的 database。

$ heroku addons:attach <your-db-name> --app=<your-app-name> # 设定 app 和 db 对接

$ heroku pg:psql --app <your-app-name> # 进入 app 对应的 db 的命令行

$ =>CREATE TABLE cities (
	id serial NOT NULL,
	city_name character varying(50) NOT NULL,
	PRIMARY KEY (id)
); # 逐行输入，记得最后输入 `;` 表示结束。

\q # 退出 app 对应的 db 的命令行

$ git add .
$ git commit -m'ready for deploy'
$ git push
$ git push heroku master

$ heroku ps:scale web=1
$ heroku open
```


<p align="center">
<img src="./assets/p29-04.png" width=90%>
</p>

-----------------------------------------------------------------


<p align="center">
<img src="./assets/p29-05.png" width=90%>
</p>

-----------------------------------------------------------------


<p align="center">
<img src="./assets/p29-06.png" width=90%>
</p>

-----------------------------------------------------------------

#### `Comment:`
1. 

### <span id="29.5">`Step5: Re-deploy.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

1. Bash commands:

```bash
$ git add .
$ git commit -m'ready for deploy'
$ git push heroku master
```

2. 指定连接特定的 heroku app (option)

```bash
$ heroku git:remote -a weather-app-demo-2020 # <specify-app-name>
```

#### `Comment:`
1. 

### <span id="29.6">`Step6: ‘pg’ Dependency version update.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

1. `"pg": "^8.3.0",`:

__`Location:./server/database/index.js`__

```js
var { Pool } = require('pg');

const CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/weather-db';

class Database {
  constructor() {
    this._pool = new Pool({
      connectionString: CONNECTION_STRING,
    });

    this._pool.on('error', (err, client) => {
      console.error('Unexpected error on idle PostgreSQL client.', err);
      process.exit(-1);
    });

  }

  query(query, ...args) {
    this._pool.connect((err, client, done) => {
      if (err) throw err;
      const params = args.length === 2 ? args[0] : [];
      const callback = args.length === 1 ? args[0] : args[1];

      client.query(query, params, (err, res) => {
        done();
        if (err) {
          console.log(err.stack);
          return callback({ error: 'Database error.' }, null);
        }
        callback({}, res.rows);
      });
    });

  }

  end() {
    this._pool.end();
  }
}

module.exports = new Database();
```

2. `"pg": "^7.4.3"`:

__`Location:./server/database/index.js`__

```js
var { Pool } = require('pg');

const CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/weather-db';
const SSL = process.env.NODE_ENV === 'production';

class Database {
  constructor () {
    this._pool = new Pool({
      connectionString: CONNECTION_STRING,
      ssl: SSL
    });

    this._pool.on('error', (err, client) => {
      console.error('Unexpected error on idle PostgreSQL client.', err);
      process.exit(-1);
    });

  }

  query (query, ...args) {
    this._pool.connect((err, client, done) => {
      if (err) throw err;
      const params = args.length === 2 ? args[0] : [];
      const callback = args.length === 1 ? args[0] : args[1];

      client.query(query, params, (err, res) => {
        done();
        if (err) {
          console.log(err.stack);
          return callback({ error: 'Database error.' }, null);
        }
        callback({}, res.rows);
      });
    });
  }

  end () {
    this._pool.end();
  }
}

module.exports = new Database();
```

#### `Comment:`
1. 两个 pg 的版本，对应的配置有不一样，主要是 7 版本需要配置 SSL，8 版本不需要。
2. 其实配置了 SSL 的 8 版本在本地是可以运行的，但是部署在 heroku 上面就不行，出现以下错误：

<p align="center">
<img src="./assets/p29-07.png" width=90%>
</p>

-----------------------------------------------------------------

__`本章用到的全部资料：`__

1. [Develop and Deploy a Full Stack React App](https://brycestpierre.com/full-stack-react-app/)

2. [https://openweathermap.org/](https://openweathermap.org/)

3. [heroku customize nodejs scripts](https://devcenter.heroku.com/articles/nodejs-support)

4. [Weather-RNEP-heroku-old](https://github.com/DonghaoWu/Weather-RNEP-heroku-old)

5. [nodejs连接postgreSQL数据库](https://blog.csdn.net/u013992330/article/details/79281250)

6. [How to connect PostgreSQL to NodeJS right way?](https://stackoverrun.com/cn/q/12054533)

7. [关于Node.js连接postgreSQL并进行数据操作的介绍](https://m.php.cn/article/405563.html)

8. [PostgreSQL Connection Pooling: Part 1 – Pros & Cons](https://scalegrid.io/blog/postgresql-connection-pooling-part-1-pros-and-cons/)

9. [PostgreSQL pooling offical doc](https://node-postgres.com/features/pooling)

10. [How to Use __dirname in Node.js](https://www.digitalocean.com/community/tutorials/nodejs-how-to-use__dirname)

- #### Click here: [BACK TO CONTENT](#29.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/WebDev-tools-demo/blob/master/README.md)