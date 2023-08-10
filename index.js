const { Command } = require("commander"); // Підключення модуля commander для обробки команд з командного рядка
const contacts = require("./contacts"); // Підключення модуля contacts, який містить функції для роботи з контактами

const program = new Command(); // Створення нового екземпляру команди

program
  .option(
    "-a, --action <string>",
    "choose action: list, get -i, add -n -e -p, remove -i"
  ) // Додавання опції -a або --action з описом, яка дозволяє вибрати дію (list, get, add, remove) та передати додаткові параметри
  .option("-i, --id <string>", "user id") // Додавання опції -i або --id з описом, яка дозволяє передати ідентифікатор користувача
  .option("-n, --name <string>", "user name")
  .option("-e, --email <string>", "user email")
  .option("-p, --phone <string>", "user phone");

program.parse(process.argv); // Розбір аргументів командного рядка

const argv = program.opts(); // Отримання об'єкта з опціями та їх значеннями

function invokeAction({ action, id, name, email, phone }) {
  switch (
    action // Перевірка значення опції action
  ) {
    case "list": // Якщо action === "list"
      contacts.listContacts(); // Виклик функції listContacts() з модуля contacts
      break;
    case "get": // Якщо action === "get"
      contacts.getContactById(id); // Виклик функції getContactById(id) з модуля contacts, передаючи ідентифікатор користувача
      break;
    case "add": // Якщо action === "add"
      contacts.addContact(name, email, phone); // Виклик функції addContact(name, email, phone) з модуля contacts, передаючи ім'я, електронну адресу та номер телефону користувача
      break;
    case "remove": // Якщо action === "remove"
      contacts.removeContact(id); // Виклик функції removeContact(id) з модуля contacts, передаючи ідентифікатор користувача
      break;
    default: // Якщо немає відповідності
      console.warn("\x1B[31m Unknown action type!"); // Вивести повідомлення про невідому дію червоним кольором
  }
}

invokeAction(argv); // Виклик функції invokeAction(argv), передаючи об'єкт з опціями та їх значеннями
