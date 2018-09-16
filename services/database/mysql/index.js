const mysql = require('mysql'),
    { database } = require('../../../config'),
    { Release, BeginTransaction, Commit, Rollback } = require('./transaction'),
    { ExecuteListOfPromises } = require('../../../util')

let pool = null

const GetPool = () => {
    return function () {
        if (!pool)
            pool = mysql.createPool(database.mysql)
        return Promise.resolve(pool)
    }
}

const GetConnection = () => () => Promise.resolve(mysql.createConnection(database.mysql))

const GetPoolConnection = poolFn => () => poolFn()().then(pool => new Promise((resolve, reject) => pool.getConnection((err, connection) => err ? reject(err) : resolve(connection))))

const RunQuery = connectionFn => query => {
    let queryHandler = conn => new Promise((resolve, reject) => conn.query(query, (error, results, fields) => error ? reject(error) : resolve(results)))
    return connectionFn().then(queryHandler)
}

const RunQueryInTransaction = connectionFn => {
    return function () {
        let errorHandler = ({ error, connection }) => Rollback(connection).then(Release).then(() => { throw error })
        let convertedQueries = [...arguments].map(queryfn => ConvertToTransactional(queryfn))
        return connectionFn()
            .then(BeginTransaction)
            .then(conn => ExecuteListOfPromises([Promise.resolve(conn), ...convertedQueries]))
            .then(Commit)
            .then(Release)
            .then(res => true)
            .catch(errorHandler)
    }
}

const ConvertToTransactional = queryFn => connection => queryFn().then(res => connection).catch(error => { throw { error, connection } })

const Query = ({ sql, params }) => mysql.format(sql, params)

const ExecuteQueryInTransaction = RunQueryInTransaction(GetPoolConnection(GetPool()))
const ExecuteQuery = RunQuery(GetPool())

module.exports = { GetConnection, GetPool, GetPoolConnection, RunQuery, RunQueryInTransaction, ConvertToTransactional, Query, ExecuteQuery, ExecuteQueryInTransaction }