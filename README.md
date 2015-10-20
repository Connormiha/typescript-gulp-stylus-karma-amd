# typescript-gulp-stylus-karma-amd
[Описание на русском языке](readme_ru.md)     

Hello world simple page application.  
**TypeScript** - compile to ES5, AMD modules  
**Stylus** - css preprocessor  
**Gulp** - build manager  
**Karma** - Unit tests runner  
**Jasmine** - Unit tests library  
**Bower** - frontend package manager  
**tsd** - DefinitelyTyped libs manager

Only for Node.js 4+, because every Gulp tasks were written on ES6
### Install
```
npm install
```

### Usage
```
npm run deploy && npm start
```

Open in your browser
```
http://localhost:8000/
```

### Commands
Run http server
```
npm start
```

Compile data for http server.. (Puts in /deploy folder)
```
npm run deploy
```

Run unit test
```
npm test
```

Compile build. (Puts in /build folder)
```
npm run build
```