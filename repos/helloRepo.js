const fs = require('fs');

const FILE = './assets/hellos.json';

const helloRepo = {
  get: function (resolve, reject) {
    fs.readFile(FILE, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  },
  getById: function (id, resolve, reject) {
    fs.readFile(FILE, function (err, data) {
      if (err) {
        reject(err);
      } else {
        const hello = JSON.parse(data).find(h => h.id == id);
        resolve(hello);
      }
    });
  },
  search: function (searchObject, resolve, reject) {
    fs.readFile(FILE, function (err, data) {
      if (err) {
        reject(err);
      } else {
        const result = JSON.parse(data).filter(
          h => (searchObject.id ? h.id == searchObject.id : true) &&
          (searchObject.value ? h.value == searchObject.value : true)
        );
        resolve(result);
      }
    });
  },
  insert: function (newData, resolve, reject) {
    fs.readFile(FILE, function (err, data) {
      if (err) {
        reject(err);
      } else {
        let existingData = JSON.parse(data);
        existingData.push(newData);
        fs.writeFile(FILE, JSON.stringify(existingData), function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(newData);
          }
        });
      }
    });
  },
  delete: function (id, resolve, reject) {
    fs.readFile(FILE, function (err, data) {
      if (err) reject(err);
      else {
        let existingData = JSON.parse(data).filter(h => h.id != id);
        fs.writeFile(FILE, JSON.stringify(existingData), function (err) {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  },
};

module.exports = helloRepo;
