// Config Module Exports
// Central export point for all database-related configuration

export { default as connectDB, disconnectDB, isConnected, getConnectionInfo, prisma } from './database.js';