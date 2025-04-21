# <img src="public/icons/128.png" width="40" align="top"> Browser TI-agent

TI-агент для браузеров, анализирует посещаемые страницы и проверяет их на безопасность при помощи API **VirusTotal** и **Kaspersky**, а также имеет дополнительные пользовательские настройки (используемые ресурсы, включение оповещений, белый список и т.д.).
Поддержка мобильных устройств.

## Установка и запуск
1. Клонируйте репозиторий на устройство.
2. Перейдите в папку проекта.
3. Убедитесь, что установлен `npm` версии **9.1.0** или выше:
   ```bash
   $ npm --version
   10.9.2
   ```
4. Для запуска режима разработки (автосборка) выполните:
   ```bash
   $ npm run watch
   ```

   Пример вывода:
   ```
   > my-extension@0.1.0 watch
   > webpack --mode=development --watch --config config/webpack.config.js

   hidden assets 41.1 KiB 4 assets
    asset contentScript.js 7.57 KiB [emitted] (name: contentScript) 1 related asset
    asset popup.js 5.4 KiB [emitted] (name: popup) 1 related asset
    asset popup.css 3.37 KiB [emitted] (name: popup) 1 related asset
    asset background.js 1.46 KiB [emitted] (name: background) 1 related asset
    asset popup.html 1.15 KiB [compared for emit] [from: public/popup.html] [copied]
    asset manifest.json 636 bytes [compared for emit] [from: public/manifest.json] [copied]
    2025-04-17 12:06:47: webpack compiled
   ```

5. Для сборки расширения перед публикацией выполните:
   ```bash
   $ npm run build
   ```

   Пример вывода:
   ```bash
   > my-extension@0.1.0 build
   > webpack --mode=production --config config/webpack.config.js

   webpack compiled successfully

## Принцип работы

### Структура кода

Весь JavaScript-код распределён по трём основным файлам:
- **background.js** - работает в фоновом режиме с момента установки расширения.
- **contentScript.js** - запускается в указанный момент (в данном случае при загрузки страницы) и работает до завершения.
- **popup.js** - запускается при открытии контекстного меню на панели инструментов.

#### content.js:
Этот скрипт отвечает за основной функционал расширения. Главная асинхронная функция расположена в конце скрипта, в ней:
1. вызывается функция `updStorage()`, отвечающая за установку начальных настроек при первом запуске
2. получаются текущие настройки из `chrome.storage.sync`
3. отправляется запрос в **background.js** для получения ответа от внешнего API
4. вызывается функция `checkStatus()`, отвечающая за формирование статуса для домена
5. вызывается функция `alerting()`, отвечающая за вывод оповещений пользователю

Также в скрипте есть слушатель, который принимает запросы от popup.js и отправляет домен текущей страницы

#### background.js
Этот скрипт отвечает за коммуникацию расширения с внешнеми API. В нем есть слушатель, которой принимает сообщение от **contentScript.js** и отправляет запрос с доменом на API (VirusTotal или Kaspersky в зависимости от запрошенного), а затем пересылает ответ обратно в **contentScript.js**

#### popup.js
Этот скрипт отвечает за функционал контекстного меню и пользовательские настройки. 

В нем одна асинхронная функция, в которой создаются слушатели изменений для кнопок и флагов настроек, реализующие обновление `chrome.storage.sync`, а также задаются начальные значения настроек.

## Расширение

Расширение опубликовано и доступно для установки в [**Chrome Web Store**](https://chromewebstore.google.com/detail/browser-ti-agent/cmnbbfaalckdmfnpoffpobdlhbpomdjk) 

## Contribution

Suggestions and pull requests are welcomed!.

---

This project was bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)

