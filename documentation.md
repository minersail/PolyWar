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

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/...`

### 4. Search Data

Search Field: `name`

### 5. Navigation Pages

Navigation Filters
1. Heavy Dogs -> `/heaviest`
2. Select a Breed -> `/breed/:breed_name`
3. Young Dog -> `/youngest`
4. Random Dog -> `/random`
5. Alphabetical Dogs -> `/alphabetical`
