module.exports = {
  apps: [{
    name: 'backend',
    script: './app.js',
   env: {
  NODE_ENV: 'production',
  JWT_SECRET: 'seu-segredo',
  PORT: 3001,
  MONGODB_URI: 'mongodb://localhost:27017/aroundb'
},
    instances: 'max',
    exec_mode: 'cluster'
  }]
};