const url = require('url')
const http = require('http')
const path = require('path')
const fs = require('fs')

const server = new http.Server()

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname.slice(1)
  const allowDir = path.join(__dirname, 'files')
  const filepath = path.join(allowDir, pathname)

  switch (req.method) {
    case 'DELETE':
      if (allowDir !== path.dirname(filepath)) {
        res.statusCode = 400
        return res.end('Wrong file directory!')
      }

      fs.rm(filepath, {}, error => {
        if (error && error.code === 'ENOENT') {
          res.statusCode = 404
          return res.end('File is not found!')
        } else if (error) {
          res.statusCode = 500
          return res.end('Internal Server Error!')
        } else {
          res.statusCode = 200
          return res.end('File was successfully deleted!')
        }
      })

      req.on('aborted', () => {
        req.destroy()
      })

      break

    default:
      res.statusCode = 501
      res.end('Not implemented')
  }
})

module.exports = server
