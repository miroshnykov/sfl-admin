let env

if (process.env.CI) {
    env = `CI`
}

let config

config = {
    env: process.env.NODE_ENV || env || `production`,
    port: 8080,
    sflCoreCondition: {
        host: '"https://sfl-condition.jatun.systems/"'
    },
    sso:{
        host:'"https://am-ssoauth.jatun.systems/"'
    }
}

module.exports = config
