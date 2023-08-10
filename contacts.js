const fs = require("fs").promises; // Підключення модуля fs для роботи з файловою системою
require("colors"); // Підключення модуля colors для кольорового виведення в консоль
const path = require("path"); // Підключення модуля path для роботи з шляхами до файлів

const contactsPath = path.join("./db", "contacts.json"); // Шлях до файлу з контактами
const contactsDataBase = require("./db/contacts.json"); // Завантаження контактів з файлу

function parseContacts(data) {
  return JSON.parse(data.toString()); // Функція для розбору даних з JSON формату в об'єкт JavaScript
}

function listContacts() {
  fs.readFile(contactsPath) // Читання файлу з контактами
    .then((data) => {
      return parseContacts(data); // Розбір даних контактів
    })
    .then((list) => {
      return [...list].sort((a, b) => {
        return a.name.localeCompare(b.name); // Сортування контактів за іменем
      });
    })
    .then((result) => console.table(result)) // Виведення відсортованого списку контактів у вигляді таблиці
    .catch((error) => console.log(error.message)); // Обробка помилок
}

function getContactById(contactId) {
  fs.readFile(contactsPath) // Читання файлу з контактами
    .then((data) => {
      const contacts = parseContacts(data); // Розбір даних контактів
      return contacts;
    })
    .then((contacts) => {
      const contactsFilter = contacts.filter(
        (contact) => contact.id === contactId // Фільтрація контактів за заданим ідентифікатором
      );
      if (contactsFilter.length > 0) {
        console.table(contactsFilter); // Виведення контакту (або контактів) знайдених за ідентифікатором у вигляді таблиці
        return;
      }
      console.log(`There is no contact with the id: ${contactId}.`.red); // Виведення повідомлення, якщо контакт не знайдений
    })
    .catch((err) => console.log(err.message)); // Обробка помилок
}

function removeContact(contactId) {
  fs.readFile(contactsPath) // Читання файлу з контактами
    .then((data) => {
      const contacts = parseContacts(data); // Розбір даних контактів
      return contacts;
    })
    .then((contacts) => {
      const contactIndex = contacts.findIndex(
        (contact) => contact.id === contactId // Знаходження індексу контакту за заданим ідентифікатором
      );
      if (contactIndex !== -1) {
        contacts.splice(contactIndex, 1); // Видалення контакту з масиву

        fs.writeFile(contactsPath, JSON.stringify(contacts), (error) => {
          if (error) {
            console.log(error.message); // Обробка помилок запису у файл
            return;
          }
        });
        console.log(
          `Contact with the id ${contactId} has been removed.`.green // Виведення повідомлення про успішне видалення контакту
        );
      } else {
        console.log(`There is no contact with the id: ${contactId}.`.red); // Виведення повідомлення, якщо контакт не знайдений
      }
    })
    .catch((error) => console.log(error.message)); // Обробка помилок
}

function addContact(name, email, phone) {
  const contact = {
    id: (Math.floor(Math.random() * 100000) + contactsDataBase.length) // Генерація унікального ідентифікатора для нового контакту
      .toString(),
    name,
    email,
    phone,
  };

  if (name === undefined || email === undefined || phone === undefined) {
    console.log(
      "Please set all arguments (name, email, phone) to add contact".red
    ); // Виведення повідомлення, якщо не вказані всі аргументи для додавання контакту
    return;
  }

  contactsDataBase.push(contact); // Додавання нового контакту до масиву контактів

  const contactsUpdate = JSON.stringify(contactsDataBase); // Конвертація масиву контактів в JSON формат

  fs.writeFile(contactsPath, contactsUpdate, (error) => {
    if (error) {
      console.log("Oops, something went wrong:".red, error.message); // Обробка помилок запису у файл
      return;
    }
  });
  console.log(`${name} has been added to your contacts`.green); // Виведення повідомлення про успішне додавання контакту
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
