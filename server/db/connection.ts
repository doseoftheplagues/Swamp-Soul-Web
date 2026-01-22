import knex from 'knex'
import config from './knexfile.js'

type Environment = 'development' | 'production' | 'test'
const env = (process.env.NODE_ENV as Environment) || 'development'

const connectionConfig = config.default ? config.default[env] : config[env]

if (env === 'production') {
  connectionConfig.connection.filename = '/app/server/db/dev.sqlite3'
}

const connection = knex(connectionConfig)

export default connection
