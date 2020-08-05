------------------------------------------------------------
# Full Stack React App Tutorial
A simple weather app, built for my full stack React app tutorial. Also features Reactstrap, Express, and PostgreSQL.

This tutorial is from [Develop and Deploy a Full Stack React App](https://brycestpierre.com/full-stack-react-app/), by By Bryce St. Pierre. Thanks for his hard work and help! 

#### Instruction.

1. Run commands in terminal
```bash
$ git clone <github-link>
$ cd <folder-name>
$ npm i
$ npm run installAll
```

2. Sign up and get your own Weather api key in [https://openweathermap.org/](https://openweathermap.org/)

3. Create a new file call '.env'.

__`Location:./server/.env`__
```js
WEATHER_API=dd9999999999999999999999 // <-- replace with your api key
```

4. Download, install [postgreSQL](https://www.postgresql.org/) and [Postico](https://eggerapps.at/postico/).
- Create a local database in Postgres.(Here we use Postico GUI.)

<p align="center">
<img src="./assets/p29-01.png" width=85%>
</p>

------------------------------------------------------------

5. Create a table.

<p align="center">
<img src="./assets/p29-02.png" width=85%>
</p>

```sql
CREATE TABLE cities (
	id serial NOT NULL,
	city_name character varying(50) NOT NULL,
	PRIMARY KEY (id)
)
```
------------------------------------------------------------


5. Run the app in local.
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

1. 后端思路：

2. 前端思路：

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
- [29.5 Redeploy.](#29.5)

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

1.  


#### `Comment:`
1. 


### <span id="29.3">`Step3: Frontend setup.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

1. 


#### `Comment:`
1. 

### <span id="29.4">`Step4: Deploy in heroku.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

1. 



#### `Comment:`
1. 

### <span id="29.5">`Step5: Redploy.`</span>

- #### Click here: [BACK TO CONTENT](#29.0)

1. 


#### `Comment:`
1. 

------------------------------------------------------------

__`本章用到的全部资料：`__

1. [Develop and Deploy a Full Stack React App](https://brycestpierre.com/full-stack-react-app/)

2. [https://openweathermap.org/](https://openweathermap.org/)

3. [heroku customize nodejs scripts](https://devcenter.heroku.com/articles/nodejs-support)

4. [Weather-RNEP-heroku-old](https://github.com/DonghaoWu/Weather-RNEP-heroku-old)


- #### Click here: [BACK TO CONTENT](#29.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/WebDev-tools-demo/blob/master/README.md)