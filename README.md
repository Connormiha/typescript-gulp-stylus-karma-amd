# typescript-gulp-stylus-karma-amd
[Описание на русском языке](readme_ru.md)     

Hello world simple page application.  
**TypeScript** - compile to ES5, AMD modules  
**Stylus** - css preprocessor  
**Gulp** - build manager  
**Karma** - unit tests runner  
**Jasmine** - unit tests library  
**Bower** - frontend package manager  
**Typings** - DefinitelyTyped libs manager  
**tslint, stylint** - TypeScript and Stylus code validation

Only for Node.js 4+, because every Gulp task was written in ES6
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

Compile data for http server.. (Are put into ./deploy folder)
```
npm run deploy
```

Run unit test
```
npm test
```

Compile build. (Are put into ./build folder)
```
npm run build
```

Check TypsScript and Stylus code validation
```
npm run lint
```
