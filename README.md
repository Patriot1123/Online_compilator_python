Проект представляет собой веб-приложение - онлайн IDE для языка Python с функциональностью, аналогичной PyCharm. Основные возможности:
- Редактирование кода Python с подсветкой синтаксиса
- Выполнение кода с отображением результатов и ошибок
- Управление файлами (создание, сохранение, удаление)
- Загрузка изображений для проектов
- Статистика кода (количество строк, символов)

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript(Фронтэнд делал друг, поэтому я не до конца понял, что там. Так получилось¯\_(ツ)_/¯)
- **Библиотеки**: 
  - CodeMirror (редактор кода)
  - Werkzeug (обработка файлов)



Backend (app.py)
- index.html - основной интерфейс:
  - Редактор кода (CodeMirror)
  - Панель управления файлами
  - Окно вывода/ввода
  - Вкладка статистики

- script.js - логика клиентской части:
  - Работа с редактором кода
  - Обработка действий пользователя
  - AJAX-запросы к серверу
  - Подсчет статистики кода

 Редактор кода
Реализован на базе библиотеки CodeMirror с дополнительными плагинами:
- Подсветка синтаксиса Python
- Автоматическое закрытие скобок
- Подсветка активной строки
- Автоматический отступ (4 пробела) после `:`(Не до конца реализованна. Есть некоторые проблемы с этим)


  
Заключение

Итоги реализации
Создано полнофункциональное веб-приложение, предоставляющее:
- Удобный редактор кода Python
- Безопасное хранение файлов
- Возможность выполнения кода с обработкой ввода/вывода
- Полезную статистику по коду
- 
Возможные улучшения
- Добавление поддержки виртуальных окружений
- Реализация совместного редактирования
- Интеграция с системами контроля версий
- Поддержка дополнительных языков программирования






******ПРЕДЫСТОРИЯ******
Проект который мы с другом делали для яндекс лицея, в общем, мы начали делать проект в конце февраля, начале марта(примерно), а закончили все еще ночью с 6 по 7 апреля, но я выложил 7 апреля потому что еще проверял работоспособность. Весь процесс затянулся, т.к. были экзамены и т.п. но мы закончили вроде к сроку, а может даже раньше. На гитхаб не было ничего залито, т.к. я забывал это делать. В общем вот такие пироги
------------------------
_______00000000____­____________________­_____________
_____0000____0000__­____________________­_____________
____0000______0000_­____________________­_____________
____0000______0000_­_____0000000________­_____________
____0000______0000_­___0000___0000______­_____________
____0000______0000_­___0000___0000______­_____________
_____0000____0000__­___0000___0000______­_____________
_______00000000____­_____0000000_______0­00___________
___________________­___________________0­000__________
___________________­__________________00­0____________
___000_____________­_________________000­_____________
__00000____________­________________000_­_____________
____000____________­_______________000__­_____________
_____000___________­______________000___­_____________
______0000_________­____________0000____­_____________
_______00000_______­__________00000_____­_____________
________000000_____­________000000______­_____________
_________00000000__­______000000________­_____________
__________000000000­00000000000_________­_____________
____________0000000­000000000___________­_____________
_______________0000­0000________________­_____________
___________________­____________________­_____________
