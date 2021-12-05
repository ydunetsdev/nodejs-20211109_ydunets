const url = require('url')
const http = require('http')
const path = require('path')
const fs = require('fs')

const server = new http.Server()

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname.slice(1)
  const allowPath = path.join(__dirname, 'files')
  const filepath = path.join(__dirname, 'files', pathname)
  const stream = fs.createReadStream(filepath)
  console.log(pathname)

  switch (req.method) {
    case 'GET':
      stream.pipe(res)

      stream.on('error', error => {
        if (allowPath !== path.dirname(filepath)) {
          res.statusCode = 400
          return res.end('Wrong file directory.')
        } else if (error.code === 'ENOENT') {
          res.statusCode = 404
          return res.end('File not found.')
        } else {
          res.statusCode = 500
          return res.end('Internal server error.')
        }
      })

      req.on('aborted', () => {
        stream.destroy()
      })

      break
    default:
      res.statusCode = 501
      res.end('Not implemented')
  }
})

module.exports = server
