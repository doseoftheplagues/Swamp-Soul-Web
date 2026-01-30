import knex from 'knex'
import config from './knexfile.js'

type Environment = 'development' | 'production' | 'test'
const env = (process.env.NODE_ENV as Environment) || 'development'

// This handles both CommonJS and ESM export styles safely
const connectionConfig = config.default ? config.default[env] : config[env]

// REMOVE THE IF (ENV === 'PRODUCTION') OVERRIDE BLOCK ENTIRELY

const connection = knex(connectionConfig)

console.log('--- DATABASE CONNECTION INITIALIZED ---')
console.log('Environment:', env)
console.log('Database Path:', connectionConfig.connection.filename)

export default connection
