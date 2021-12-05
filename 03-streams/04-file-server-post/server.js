const http = require('http')
const path = require('path')
const fs = require('fs')
const LimitSizeStream = require('./LimitSizeStream')

const server = new http.Server()

const allowDir = path.join(__dirname, 'files')

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname.slice(1)

  const filepath = path.join(allowDir, pathname)

  const handleError = () => {
    res.statusCode = 500
    res.end('Internal server error')
  }

  const fileWrittableStream = fs.createWriteStream(filepath, { flags: 'wx' })
  const limitSizeStream = new LimitSizeStream({ limit: 1000000 })

  switch (req.method) {
    case 'POST':
      if (path.dirname(filepath) !== allowDir) {
        res.statusCode = 400
        res.end('Wrong file directory')
      }

      req
        .on('aborted', () => {
          fileWrittableStream.destroy()
          req.destroy()
          fs.rm(filepath, handleError)
        })
        .pipe(limitSizeStream)
        .on('error', error => {
          fileWrittableStream.destroy(error)
        })
        .pipe(fileWrittableStream)
        .on('error', err => {
          if (err.code === 'EEXIST') {
            res.statusCode = 409
            return res.end('File already exists')
          } else if (err.code === 'LIMIT_EXCEEDED') {
            fs.rm(filepath, handleError)
            res.statusCode = 413
            return res.end('Limit has been exceeded')
          }
        })
        .on('finish', () => {
          res.statusCode = 201
          return res.end('File was created and saved in file system')
        })

      break

    default:
      res.statusCode = 501
      res.end('Not implemented')
  }
})
module.exports = server
