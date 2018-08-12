const expect = require('chai').expect,
    sinon = require('sinon'),
    { Release, BeginTransaction, Commit, Rollback } = require('../../../../../services/database/mysql/transaction')

describe('Common code surrounding mysql database interactions', () => {
    let errorObj
    beforeEach(() => {
        errorObj = { message: 'error' }
        connection = {
            getConnection: sinon.stub(),
            release: sinon.stub(),
            beginTransaction: sinon.stub(),
            commit: sinon.stub(),
            rollback: sinon.stub()
        }
    })
    it('should take in a connection and release the connection', () => {
        Release(connection)
        expect(connection.release.called).to.be.true
    })
    describe('Will begin a transaction on a given connection', () => {
        it('should take in a connection and start a transaction on it and return the connection', () => {
            connection.beginTransaction.callsFake((cb) => cb())
            return BeginTransaction(connection)
                .then(conn => {
                    expect(connection.beginTransaction.called).to.be.true
                    expect(conn).to.deep.equal(connection)
                })
        })

        it('should take in a connection and attempt to start a transaction but throw an object containing the error and the connection', () => {
            connection.beginTransaction.callsFake((cb) => cb(errorObj))
            return BeginTransaction(connection)
                .then(res => { expect(res).to.be.undefined })
                .catch(err => {
                    expect(connection.beginTransaction.called).to.be.true
                    expect(err).to.deep.equal(errorObj)
                })
        })
    })

    describe('Will commit a transaction on a given connection', () => {
        it('should take in a connection and commit all queries done', () => {
            connection.commit.callsFake((cb) => cb())
            return Commit(connection)
                .then(res => {
                    expect(res).to.deep.equal(connection)
                    expect(connection.commit.called).to.be.true
                })
        })

        it('should take in a connection and commit and throw an error with the connection if it fails', () => {
            connection.commit.callsFake((cb) => cb(errorObj))
            return Commit(connection)
                .then(res => {
                    expect(res).to.be.undefined
                })
                .catch(err => {
                    expect(err.connection).to.deep.equal(connection)
                    expect(err.error).to.deep.equal(errorObj)
                    expect(connection.commit.called).to.be.true
                })
        })
    })

    describe('Will rollback queries on the connection', () => {
        it('should take in a connection and rollback the queries commited on it', () => {
            connection.rollback.callsFake((cb) => cb())
            return Rollback(connection)
                .then(res => {
                    expect(res).to.deep.equal(connection)
                    expect(connection.rollback.called).to.be.true
                })
        })
    })
})