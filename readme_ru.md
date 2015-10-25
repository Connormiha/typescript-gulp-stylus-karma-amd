# typescript-gulp-stylus-karma-amd

Пустой Hello world SPA проект. Используется следующий стек технологий:  
**TypeScript** - собирается в ES5 с AMD модулями(RequireJS)  
**Stylus** - css препроцессор  
**Gulp** - сборщик  
**Karma** - Запускает юнит тесты  
**Jasmine** - Библиотека для юнит тестов  
**Bower** - менеджер библиотек для фронтэнд  
**tsd** - Загружает d.ts файлы из DefinitelyTyped  
**tslint, stylint** - валидация кода TypeScript и Stylus

Только для node.js начиная 4 версии, т.к. везде используется ES6
### Установка
```
npm install
```

### Использование
```
npm run deploy && npm start
```

Открыть в браузере
```
http://localhost:8000/
```

### Команды
Запуск http сервера
```
npm start
```

Собрать билд для http сервера. (В проекте это будет папка deploy). В отличии от билда для продакшен, не собирает все в один файл и ничего не сжимает
```
npm run deploy
```

Запускает юнит тесты через Карму
```
npm test
```

Собирает билд. (папка /build). В отличии от deploy сжимается html, css, js проходит через uglifyJS.
```
npm run build
```

Проверка TypeScript и Stylus кода на валидацию через линтер
```
npm run lint
```