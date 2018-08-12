let Release = connection => connection.release()

let BeginTransaction = connection => new Promise((resolve, reject) => connection.beginTransaction((err) => err ? reject(err) : resolve(connection)))

let Commit = connection => new Promise((resolve, reject) => connection.commit((error) => error ? reject({ error, connection }) : resolve(connection)))

let Rollback = connection => new Promise((resolve, reject) => connection.rollback(() => resolve(connection)))

module.exports = { Release, BeginTransaction, Commit, Rollback }