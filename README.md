# wiki

## Vocabulario

- Silabas: Juego de contar cantidad de silabas en palabras
- Acentual: Juego de categoría acentual
- Rimas: Juego de rimas

## Rutas públicas
Todas las rutas que se encuentran aquí son de orden público, es decir, tanto usuarios registrados como no registrados pueden acceder y utilizar estos endpoints.

Es muy importante que si el usuario no está registrado, el userId debe ser 0, equivalente al usuario invitado.

### Usuarios

Existe una ruta exclusiva para los usuarios, encargada del registro e inicio de sesión. Todas las opciones disponibles para este apartado se encuentran en /users

#### POST /register

Ruta para el registro de usuarios comunes, es decir, personas que van a usar los juegos, y sin mayores privilegios ni permisos dentro del sistema. La solicitud debe incluir un body conformado por

```typescript
const type registerBody = {
  email: string,
  password: string,
  course: string,
  name: string
}
```

Esta ruta, en caso de mandar una solicitud válida, la respuesta será de la forma

```typescript
const type registerResponse = {
  success: boolean,
  payload:{
      message: string
  }
}
```


#### POST /login

Esta ruta se utiliza para iniciar la sesión de los usuarios, independiente de si son administradores
o usuarios comunes. La solicitud lleva un body conformado por

```typescript
const type loginBody = {
  email: string,
  password: string
}
```

La respuesta es de la forma
```typescript
const userInfo = {
  id: number,
  name: string,
  course: string,
  email: string,
  password: string
}

const type loginResponse = {
  success: boolean,
  payload:{
      message: string
      user: userInfo[]
  }
}
```

#### POST /registerAdmin

Una ligera excepción dentro de las rutas públicas. Esta se asocia a la creación de usuarios administradores. Para evitar el libre acceso, se solicita una clave secreta sólo conocida por los gestores de la API

Solicitud:

```typescript
const type adminRegisterBody = {
  email: string,
  password: string,
  name: string,
  secret_key: string
}
```

Respuesta:

```typescript
const type adminRegisterResponse = {
  success: boolean,
  payload:{
      message: string
  }
}
```

### Scores
Esta ruta está asociada a la obtención de los puntajes de los usuarios y del sistema. Todas las opciones se encuentran en /scores

### GET /leaderboards
Ruta que devuelve los leaderboards del sistema. 



Respuesta:
```typescript
const type gameLeaderboard = {
  name: string,
  score: number,
  answer_time: string
}

const type leaderboardsResponse = {
  success: boolean,
  payload: {
    message: string,
    silabaLeaderboard: gameLeaderboard,
    acentualLeaderboard: gameLeaderboard,
    rimasLeaderboard: gameLeaderboard
  }
}
```

#### GET /history/:userId

Al ser un get, la información necesaria se entrega EXCLUSIVAMENTE en el link de la solicitud, donde :userId se reemplaza por el id del usuario a obtener.

Respuesta:
```typescript
const type sessionScore = {
  session_id: string,
  score: number,
  answer_time: string
  game_id: number
  difficulty: number
}

const type historyResponse = {
  success: boolean,
  payload: sessionScore[]
}
```
Donde payload[0] es el historial de Silabas, payload[1] es el historial de Acentual y payload[2] es el historial de rimas

