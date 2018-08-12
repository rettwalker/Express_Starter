const expect = require('chai').expect,
    sinon = require('sinon'),
    mysql = require('mysql'),
    { GetConnection, GetPool, GetPoolConnection, RunQuery, RunQueryInTransaction, Query, ExecuteQuery, ExecuteQueryInTransaction, ConvertToTransactional } = require('../../../../../services/database/mysql')

describe('Common code surrounding mysql database interactions', () => {
    let connection, results, errorObj, GetPoolStub, GetConnectionStub, ConnectionStub, QueryStub, queryString, queryObj
    beforeEach(() => {
        GetPoolStub = sinon.stub(mysql, 'createPool').returns({})
        GetConnectionStub = sinon.stub(mysql, 'createConnection').returns({})
        FormatSpy = sinon.spy(mysql, 'format')
        ConnectionStub = sinon.stub()
        QueryStub = sinon.stub()
        results = { message: 'results' }
        errorObj = { message: 'error' }
        connection = {
            getConnection: sinon.stub(),
            release: sinon.stub(),
            beginTransaction: sinon.stub(),
            commit: sinon.stub(),
            rollback: sinon.stub(),
            query: sinon.stub()
        }
        queryObj = { params: [] }
        queryString = 'select * from something'
    })
    afterEach(() => {
        GetPoolStub.restore()
        GetConnectionStub.restore()
        FormatSpy.restore()
    })

    it('should create pool of connections if one has not already been created', () => {
        expect(GetPool).to.be.an('function')
        expect(GetPool()).to.be.an('function')
        return GetPool()()
            .then(res => { GetPool()() })
            .then(res => {
                expect(GetPoolStub.called).to.be.true
                expect(GetPoolStub.callCount).to.equal(1)
            })
    })

    it('should get a connection to the database', () => {
        expect(GetConnection).to.be.an('function')
        expect(GetConnection()).to.be.an('function')
        return GetConnection()()
            .then(res => {
                expect(GetConnectionStub.called).to.be.true
                expect(res).to.deep.equal({})
            })
    })

    describe('Will convert query to take in a connection and return a connection', () => {
        it('Will convert query to take in a connection and return a connection', () => {
            expect(ConvertToTransactional()).to.be.an('function')
            QueryStub.resolves()
            return ConvertToTransactional(QueryStub)(connection)
                .then(conn => {
                    expect(QueryStub.called).to.be.true
                    expect(conn).to.deep.equal(connection)
                })
        })

        it('will convert and execute query and throw object with error and connection if it fails', () => {
            QueryStub.rejects(errorObj)
            return ConvertToTransactional(QueryStub)(connection)
                .then(res => { expect(res).to.be.undefined })
                .catch(err => {
                    expect(QueryStub.called).to.be.true
                    expect(err.error).to.deep.equal(errorObj)
                    expect(err.connection).to.deep.equal(connection)
                })
        })
    })

    describe('Getting connection from the connection pool', () => {
        it('should return a function', () => {
            expect(GetPoolConnection).to.be.an('function')
            expect(GetPoolConnection()).to.be.an('function')

        })
        it('should provide connection from the generated pool', () => {
            let PoolStub = sinon.stub()
            PoolStub.returns(() => { return Promise.resolve(connection) })
            connection.getConnection.callsFake((cb) => {
                cb(null, { message: 'i am a connection' })
            })

            return GetPoolConnection(PoolStub)()
                .then(res => {
                    expect(PoolStub.called).to.be.true
                    expect(connection.getConnection.called).to.be.true
                    expect(res).to.deep.equal({ message: 'i am a connection' })
                })
        })

        it('should attempt to provide connection for pool but throw an error if it fails', () => {
            let PoolStub = sinon.stub(),
                connection = {
                    getConnection: sinon.stub()
                }
            PoolStub.returns(() => { return Promise.resolve(connection) })
            connection.getConnection.callsFake((cb) => {
                cb({ message: 'i threw an error' }, null)
            })

            return GetPoolConnection(PoolStub)()
                .then(res => {
                    expect(res).to.be.undefined
                })
                .catch(res => {
                    expect(PoolStub.called).to.be.true
                    expect(connection.getConnection.called).to.be.true
                    expect(res).to.deep.equal({ message: 'i threw an error' })
                })
        })
    })

    describe('Will run a query provided a connection', () => {
        it('should be a function', () => {
            expect(RunQuery).to.be.an('function')
            expect(RunQuery()).to.be.an('function')
        })
        it('should take in a function that will provide an connection and execute query on it and return results', () => {
            ConnectionStub.resolves(connection)
            connection.query.callsFake((sql, cb) => cb(null, results, {}))
            return RunQuery(ConnectionStub)(queryString)
                .then(res => {
                    expect(ConnectionStub.called).to.be.true
                    expect(connection.query.calledWith(queryString)).to.be.true
                    expect(res).to.deep.equal(results)
                })
        })

        it('should take in a function that will provide an connection and execute query on it and throw error if it fails', () => {
            ConnectionStub.resolves(connection)
            connection.query.callsFake((sql, cb) => cb(errorObj, null, null))
            return RunQuery(ConnectionStub)(queryString)
                .then(res => {
                    expect(res).to.be.undefined
                })
                .catch(err => {
                    expect(err).to.deep.equal(errorObj)
                    expect(ConnectionStub.called).to.be.true
                    expect(connection.query.calledWith(queryString)).to.be.true
                })
        })
    })

    describe('Will create a function that when called will execture a query inside a transaction', () => {
        it('should pass in connection fn that will then execute transaction', () => {
            expect(RunQueryInTransaction(ConnectionStub)).to.be.an('function')
            ConnectionStub.resolves(connection)
            connection.beginTransaction.callsFake((cb) => cb())
            QueryStub.resolves(connection)
            connection.commit.callsFake((cb) => cb())
            connection.release.callsFake()
            return RunQueryInTransaction(ConnectionStub)(QueryStub)
                .then(res => {
                    expect(ConnectionStub.called).to.be.true
                    expect(connection.beginTransaction.called).to.be.true
                    expect(QueryStub.called).to.be.true
                    expect(connection.commit.called).to.be.true
                    expect(connection.release.called).to.be.true
                    expect(res).to.be.true
                })
        })

        it('should pass in connection fn that will then execute transaction and if it fails rollback the querys and release the connection', () => {
            expect(RunQueryInTransaction(ConnectionStub)).to.be.an('function')
            ConnectionStub.resolves(connection)
            connection.beginTransaction.callsFake((cb) => cb())
            QueryStub.rejects(errorObj)
            connection.commit.callsFake((cb) => cb())
            connection.rollback.callsFake((cb) => cb())
            connection.release.callsFake()

            return RunQueryInTransaction(ConnectionStub)(QueryStub)
                .then(res => { expect(res).to.be.undefined })
                .catch(err => {
                    expect(ConnectionStub.called).to.be.true
                    expect(connection.beginTransaction.called).to.be.true
                    expect(QueryStub.called).to.be.true
                    expect(connection.commit.called).to.be.false
                    expect(connection.rollback.called).to.be.true
                    expect(connection.release.called).to.be.true
                    expect(err).to.deep.equal(errorObj)
                })
        })

        it('should pass in connection fn that will fail on commit and throw an error back', () => {
            expect(RunQueryInTransaction(ConnectionStub)).to.be.an('function')
            ConnectionStub.resolves(connection)
            connection.beginTransaction.callsFake((cb) => cb())
            QueryStub.resolves(connection)
            connection.commit.callsFake((cb) => cb(errorObj))
            connection.rollback.callsFake((cb) => cb())
            connection.release.callsFake()

            return RunQueryInTransaction(ConnectionStub)(QueryStub)
                .then(res => { expect(res).to.be.undefined })
                .catch(err => {
                    expect(ConnectionStub.called).to.be.true
                    expect(connection.beginTransaction.called).to.be.true
                    expect(QueryStub.called).to.be.true
                    expect(connection.commit.called).to.be.true
                    expect(connection.rollback.called).to.be.true
                    expect(connection.release.called).to.be.true
                    expect(err).to.deep.equal(errorObj)
                })
        })
    })

    describe('Will provide a formated query', () => {
        it('should take in a object that has params and sql stirng and return a formated string', () => {
            queryObj.sql = queryString
            expect(Query(queryObj)).to.deep.equal('select * from something')
            expect(FormatSpy.called).to.be.true
        })
    })

    describe('function that wraps the required steps to execute a single query', () => {
        it('should execute the provided query', () => {
            expect(ExecuteQuery).to.be.an('function')
        })

        it('should execute query with transaction', () => {
            expect(ExecuteQueryInTransaction).to.be.an('function')
        })
    })
})