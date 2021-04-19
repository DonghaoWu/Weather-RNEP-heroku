__`KEY_WORD: Heroku deploy addon postgreSQL, PostgreSQL pool, package.json scrips, __dirname, full-stack app file structure, Callback function order, Frontend options input.`__

## Important: Heroku hobby postgreSQL just only support Client way (not pool) to connect.

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

- Related info:

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

- Updated on 4/19/21

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/WebDev-tools-demo/blob/master/README.md)

## `Section: Deploy.` (Basic)

### `Summary`: In this documentation, we learn to deploy a fullstack application with tech stack React, Node, Express and Postgres.

### `Check Dependencies & Tools:`

`Backend:`
- body-parser
- cookie-parser
- dotenv
- express
- pg
- request
- request-promise
- cors(new)

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

- 本实例有三个特点，第一个是全栈部署，第二是使用 Postgres 部署，注意这里使用的是 client 方式连接 postgres， 之前的 pool 方式已经不适用于 hobby free 模式。第三个特点是使用 pg 库连接数据库，查询方式比较原生。

- 自己对原本的文件结构进行调整，对应的 package.json script 进行了修改。[heroku customize nodejs scripts](https://devcenter.heroku.com/articles/nodejs-support)

------------------------------------------------------------
- 设计思路：

1. 后端思路：重点是 client 的设置。

2. 前端思路：正常设置，还有配置 proxy。

3. 后期步补充工作：
  - 加入了错误管理：
    1. 输入为不规范的大小写城市名时，可以对其进行规范后储存到数据库，如 `NEw YoRk => New York`
    2. 输入为空白格时显示错误
    3. 输入为不存在的城市时显示错误。
------------------------------------------------------------

### <span id="29.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/WebDev-tools-demo/blob/master/README.md)

- [29.1 Change file structure.](#29.1)
- [29.2 Backend setup.](#29.2)
- [29.3 Frontend setup.](#29.3)
- [29.4 Deploy in heroku.](#29.4)
- [29.5 Re-deploy.](#29.5)
- [29.6 (LEGACY) ‘pg’ Dependency version update.](#29.6)
- [29.7 PostgreSQL pool.](#29.7)

------------------------------------------------------------

### <span id="29.1">`Step1: Change file structure.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

1. 传统的 fullstack 文件结构（网上常见的 heroku deploy 教程结构），[查看这里：Weather-RNEP-heroku-old](https://github.com/DonghaoWu/Weather-RNEP-heroku-old)

  - 之前的结构是把前端 app 放在大文件夹里面，前端 app 有自己的 package.json，但是后端 app 不是独立的，它跟全局共用一个 package.json，所以 :star: `之前` :star: 一共有两个 package.json 文件。

2. 修改后，把后端 app 独立起来，使后端 app 有自己的 package.json，这需要把一些 dependency 转移到 server 文件夹中，同时对根目录的 package.json 进行修改。

```diff
+ ./client/package.json 不用修改
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
+    "body-parser": "^1.19.0",
+    "cookie-parser": "^1.4.5",
+    "cors": "^2.8.5",
+    "dotenv": "^8.2.0",
+    "express": "^4.17.1",
+    "pg": "^8.6.0",
+    "request": "^2.88.2",
+    "request-promise": "^4.2.6"
  },
  "devDependencies": {
+    "nodemon": "^2.0.4"
  }
}
```

__`Location:./package.json`__

```diff
{
  "name": "postgres-deploy-heroku",
  "version": "1.0.0",
  "description": "A tutorial about deploy a postgres fullstack application.",
  "main": "index.js",
  "scripts": {
+    "installServer": "cd server && npm install",
+    "installClient": "cd client && npm install",
+    "installAll": "concurrently \"npm run installServer\" \"npm run installClient\"",
+    "dev": "concurrently \"npm run server\" \"npm run client\"",
+    "client": "npm start --prefix client",
+    "server": "npm run server --prefix server",
+    "start": "npm start --prefix server",
+    "configure-db-local": "sh configure_db_local.sh",
+    "configure-db-heroku": "sh configure_db_heroku.sh",
+    "heroku-prebuild": "cd server && npm install",
+    "heroku-postbuild": "cd client && npm install && npm run build"
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
+    "concurrently": "^5.2.0"
  }
}
```

#### `Comment:`
1. 现在已经习惯了前后端分开两个文件夹的开发习惯。

### <span id="29.2">`Step2: Backend setup.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

  #### Backend 主要是聚焦在 Database 的设置不一样上面。

1. 本地能使用的 pool 设置

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

2. :star::star::star: 4/19/2021 能够在 `本地和 heroku hobby free` 模式上使用的 client 模式。

```js
require('dotenv').config();
const { Client } = require('pg');

const dbSetting = process.env.DATABASE_URL ?
    {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
    :
    {
        user: process.env.POSTGRE_USER,
        host: process.env.POSTGRE_HOST,
        database: process.env.POSTGRE_LOCAL_DATABASE,
        password: process.env.POSTGRE_password,
        port: process.env.POSTGRE_PORT
    }

const db = new Client(dbSetting);

db.connect();

module.exports = db;
```

3. 对应的 city method.

```js
const db = require('../database');

class Cities {
  static retrieveAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT city_name from cities', (err, res) => {
        if (err) return reject(err);
        resolve({ cities: res.rows })
      });
    })
  }

  static insert({ city }) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO cities (city_name) VALUES ($1)', [city], (err, res) => {
        if (err) return reject(err);
        resolve({ message: `Insert a new city ${city} success!` });
      });
    })
  }
}

module.exports = Cities;
```

4. 对应的 city api。

```js
let express = require('express');
let Cities = require('../models/cities');

let router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { cities } = await Cities.retrieveAll();
    return res.json(cities);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let city = req.body.city;
    const { message } = await Cities.insert({ city });
    return res.json(message);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
```

5. 对应的 weather query。

```js
const request = require('request-promise');

class Weather {
  static retrieveByCity({ city }) {
    return new Promise(async (resolve, reject) => {
      try {
        const weather = await request({
          uri: `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.WEATHER_API}&units=imperial`,
          json: true
        });
        resolve({ weather });
      } catch (err) {
        reject(err.error)
      }
    })
  }
}

module.exports = Weather;
```

6. 对应的 weather api。

```js
let express = require('express');
let Weather = require('../models/weather');

let router = express.Router();

router.get('/:city', async (req, res, next) => {
  try {
    let city = req.params.city;
    const { weather } = await Weather.retrieveByCity({ city });
    return res.json(weather);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
```

#### `Comment:`
1. 以上是很原生的 pg query 设计。

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
      newCityName: '',
      error: '',
    };
  }

  handleInputChange = (e) => {
    this.setState({ newCityName: e.target.value });
  };

  getCityList = async () => {
    try {
      const res = await fetch('/api/cities');
      const data = await res.json();

      let cityList = data.map(r => r.city_name);
      this.setState({ cityList });

    } catch (error) {
      console.log(error);
    }
  };

  handleAddCity = async () => {
    let input = this.state.newCityName.trim();
    if (!input) {
      return this.setState({ weather: null, error: 'Please input a city name.', newCityName: '' });
    }

    let lowerCase = input.toLowerCase();
    let city = lowerCase.split(' ').map(a => a[0].toUpperCase() + a.slice(1)).join(' ');

    try {
      const weatherRes = await fetch(`/api/weather/${city}`);
      const weatherData = await weatherRes.json();

      if (weatherData.type === 'error') {
        throw new Error(weatherData.message);
      }
      else {
        this.setState({ newCityName: '', weather: weatherData, error: '' });

        const addNewCityRes = await fetch('/api/cities', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city })
        });

        const addNewCityData = await addNewCityRes.json();

        if (addNewCityData.type === 'error' && addNewCityData.message === `duplicate key value violates unique constraint "cities_city_name_key"`) {
          throw new Error('Duplicate city name.');
        }
        this.setState({ newCityName: '' });
        await this.getCityList();
      }
    } catch (err) {
      return this.setState({ weather: null, error: err.message });
    }
  };

  handleChangeCityAndGetWeather = async (e) => {
    try {
      let city = e.target.value;
      let res = await fetch(`/api/weather/${city}`);
      let data = await res.json();

      if (data.type === 'error') {
        return this.setState({ weather: null, error: data.message });
      }
      return this.setState({ weather: data, error: '' });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getCityList();
  }

  render() {
    return (
      <Container fluid className="centered">
        <Navbar dark color="dark">
          <NavbarBrand href="/">My Weather</NavbarBrand>
        </Navbar>
        <Row>
          <Col>
            <Jumbotron>
              <h1 className="display-3">My Weather</h1>
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
        <div>
          {
            this.state.error ?
              <p style={{ color: "red" }}> {this.state.error}</p>
              :
              <Weather data={this.state.weather} />
          }
        </div>
      </Container>
    );
  }
}

export default App;
```

#### `Comment:`
1. 这里新增一个重要的逻辑，就是在 handleAddCity 增加 city 的时候，先调用 weather api 查询，如果返回错误，就不储存，如果有结果返回就把城市名字储存到 database 中。

### <span id="29.4">`Step4: Deploy in heroku.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

1. 设定 static 内容的来源。

__`Location:./server/index.js`__

```js
const path = require('path');
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

- 创建 heroku app 和 db。
```bash
$ heroku login  # 登录 heroku
$ heroku create <your-app-name> # 定制 app 名字
$ heroku addons:create heroku-postgresql:hobby-dev --name=<your-db-name> # 新增一个 postgreSQL 的 database。

$ heroku addons:attach <your-db-name> --app=<your-app-name> # 设定 app 和 db 对接
```

- 创建 table
```bash
$ heroku pg:psql --app <your-app-name> # 进入 app 对应的 db 的命令行

$ =>CREATE TABLE cities (
	id serial NOT NULL,
	city_name character varying(50) NOT NULL,
	PRIMARY KEY (id)
); # 逐行输入，记得最后输入 `;` 表示结束。

\q # 退出 app 对应的 db 的命令行
```

- 创建 table 也可以使用本地 script

```bash
$ npm run configure-db-heroku
```

- 上面 script 对应的 sh 文件

```sh
#!/bin/bash

echo "Configuring heroku postgre database (weather app)..."

heroku pg:reset DATABASE

heroku pg:psql < ./server/bin/sql/city.sql

echo "Heroku postgre database (weather app) configured!"
```

- Deploy.
```bash
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
$ heroku git:remote -a <specify-app-name>
```

#### `Comment:`
1. 

#### :star:`以下内容都是关于 pool 设置的，在最新更新中不会用到。`

### <span id="29.6">`(LEGACY)Step6: ‘pg’ Dependency version update.`</span>

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