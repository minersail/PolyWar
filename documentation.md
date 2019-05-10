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
- `Field 1`: Name           `Type: String`
- `Field 2`: Id             `Type: Number`
- `Field 3`: Score          `Type: Number`
- `Field 4`: Password       `Type: String`
- `Field 5`: Squads         `Type: [Squadron]`

squadron
- `Field 1`: Name           `Type: String`
- `Field 2`: Author         `Type: Number`
- `Field 3`: Units          `Type: [Number]`
- `Field 4`: Wins           `Type: Number`

battle
- `Field 1`: home_team      `Type: Number`
- `Field 2`: away_team      `Type: Number`
- `Field 3`: comments       `Type: [comments]`

user:
{
    name: String
    id: Number
    score: Number
    password: String
    squads: [Squadron]
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
    home_team: Number
    away_team: Number
    comments: [comments]
}

### 2. Add New Data

HTML form route: `/create_profile`

POST endpoint route: `/api/create_profile`

```javascript
var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/create_profile',
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

HTML form route: `/get_user/:user`

GET endpoint route: `/api/get_user/:user`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/api/get_user',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {

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
        units: "1,2,3,4,5,6,7,8,9,10,11,12"
        name: "Benny"
        id: 46521879
    } 
};
```

HTML form route: `/squadron/:id`

GET endpoint route: `/api/squadron/:id`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/api/squadron/:id',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {
        id: 46521879
    } 
};
```

HTML form route: `/delete_squadron`

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

HTML form route: `/battles`

GET endpoint route: `/api/battles`

```javascript
var options = { 
    method: 'GET',
    url: 'http://localhost:3000/api/battles',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: {

    } 
};
```

### 3. Navigation Pages

Navigation Filters
1. Battle -> `/battle`
2. Home -> `/`
3. About -> `/about`
4. Create Profile -> `/create_profile`
5. Get User -> `/get_user/:user`
6. Delete User -> `/delete_user`
7. Create Squadron -> `/create_squadron`
8. Get Squadrons -> `/squadrion/:id`
9. Delete Squadron -> `/delete_squadron`
10. View Battles -> `/battles`