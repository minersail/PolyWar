# Polywar

---

Name: Quinn Morris and Jordan Woo

Date: May 9th 2019

Project Topic: Shapes fighting each other while you watch it unfold in real time

URL: https://polywar.herokuapp.com/

 ---

### 1. Data Format and Storage

Data point fields:

user
- `Field 1`: Username       `Type: String`
- `Field 3`: Score          `Type: Number`
- `Field 4`: Password       `Type: String`

squadron
- `Field 1`: Name           `Type: String`
- `Field 2`: Author         `Type: Number`
- `Field 3`: Units          `Type: [Number]`
- `Field 4`: Wins           `Type: Number`

battle
- `Field 1`: squad1         `Type: Number`
- `Field 2`: squad2         `Type: Number`

user:
{
    username: String
    score: Number
    password: String
}

squadron:
{
    name: String
    author: Number
    units: [Number]
    wins: Number
}

battle:
{
    squad1: Number
    squad2: Number
}

### 2. Add New Data

HTML form route: `/logout`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/logout'
};
```

POST endpoint route: `/api/create_user`

```javascript
var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/create_user',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
        name: 'Jordan',
        id: 10,
        password: 'GoteemBois'
    } 
};
```

POST endpoint route: `/api/login`

```javascript
var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/login',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {
        name: 'Jordan',
        password: 'GoteemBois'
    }
};
```

GET endpoint route: `/api/get_user/:user`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/api/get_user/:user',
};
```

DELETE endpoint route: `/api/delete_user`

```javascript
var options = { 
    method: 'DELETE',
    url: 'http://localhost:3000/api/delete_user',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {
        name: 'Jordan',
        password: 'GoteemBois'
    }
};
```

POST endpoint route: `/api/create_squadron`

```javascript
var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/create_squadron',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {
        name: 'Jordan'
    }
};
```

POST endpoint route: `/api/edit_squadron`

```javascript
var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/edit_squadron',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {
        name: "Quinn",
        units: [1,2,3,4,5,6,7,8,9,10,11,12]
        id: 1234202
    } 
};
```

HTML form route: `/delete_user`

DELETE endpoint route: `/api/delete_user`

```javascript
var options = { 
    method: 'DELETE',
    url: 'http://localhost:3000/api/delete_user',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {
        user: "Quinn"
        password: "PEACH3$"
    } 
};
```

HTML form route: `/create_squadron`

POST endpoint route: `/api/create_squadron`

```javascript
var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/create_squadron',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {
        units: [1,2,3,4,5,6,7,8,9,10,11,12]
        name: "Benny"
        id: 46521879
    } 
};
```

POST endpoint route: `/api/edit_squadron`

```javascript
var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/edit_squadron',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {
        units: [1,2,3,4,5,6,7,8,9,10,11,12]
        name: "Benny"
        id: 46521879
    } 
};
```


GET endpoint route: `/api/squadron/:id`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/api/squadron/:id'
};
```

DELETE endpoint route: `/api/delete_squadron`

```javascript
var options = { 
    method: 'DELETE',
    url: 'http://localhost:3000/api/delete_squadron',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {
        name: "Quinn"
        id: 46521879
    } 
};
```

POST endpoint route: `/api/createBattle`

```javascript
var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/createBattle',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {
        squad1: Squadron1,
        squad2: Squadron2
    } 
};
```

HTML form route: `/battles`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/battles'
};
```

HTML form route: `/battle/:id`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/battle/:id'
};
```

HTML form route: `/editTeam/:id`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/editTeam/:id'
};
```

HTML form route: `/viewTeam/:id`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/viewTeam/:id'
};
```

HTML form route: `/viewSquadrons/:id`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/viewSquadrons/:id'
};
```

HTML form route: `/battleSelect/:id`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/battleSelect/:id'
};
```

HTML form route: `/login`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/login'
};
```

HTML form route: `/about`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/about'
};
```

### 3. Navigation Pages

Navigation Filters
1. Battle -> `/battle/:id`
2. Home -> `/`
3. About -> `/about`
4. Create Profile -> `/create_profile`
5. Get User -> `/api/get_user/:user`
6. Delete User -> `/api/delete_user`
7. Create Squadron -> `/api/create_squadron`
8. Get Squadrons -> `/api/squadron/:id`
9. Delete Squadron -> `/api/delete_squadron`
10. View Battles -> `/battles`
11. Login -> `/api/login`
12. Logout -> `/api/logout`
13. Create User -> `/api/create_user`
14. Edit Squadron -> `/api/edit_squadron`
15. Edit Team -> `/editTeam/:id`
16. View Team -> `/viewTeam/:id`
17. View Squadrons -> `/viewSquadrons/:id`
18. Battle Select -> `/battleSelect/:id`