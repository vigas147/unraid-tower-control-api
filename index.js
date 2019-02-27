const express = require('express')
const basicAuth = require('express-basic-auth')
const app = express()
const port = 3000
const users = require('./users')
const { spawnSync } = require('child_process')

const staticAuth = basicAuth({
    users: users,
    challenge: true,
    unauthorizedResponse: getUnauthorizedResponse
})

function getUnauthorizedResponse(req) {
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : 'No credentials provided'
}

app.get('/auth', staticAuth, (req, res) => {
    res.sendStatus(200)
})

app.get('/boot', staticAuth, (req, res) => {
    const ls = spawnSync("./wake.sh")
    let respone = ls.stdout.toString()
    res.send(respone)
})

app.get('/getIp', staticAuth, (req, res) => {
    const ls = spawnSync("./tower-ip.sh")
    if (ls.stdout && ls.stdout.length > 4) {
        res.send(ls.stdout.toString())
    } else {
        res.send("Server offline.")
    }
})

app.get('/ping', (req, res) => {
    res.sendStatus(200)
})

app.listen(port, () => console.log(`Listening on port ${port}`))