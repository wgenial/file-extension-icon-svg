const http = require('http')
const Url = require('url')
const { extname } = require('path')
const { getIconForFile } = require('vscode-icons-js')
const axios = require('axios')

const server = http.createServer()

server.on('request', async (req, res) => {
  try {
    const { file } = Url.parse(req.url, true).query
    const extension = extname(file) || file.indexOf('.') !== -1 ? file : `.${file}`
    const IconForFile = getIconForFile(extension)
    const { data: svg } = await axios.get(
      `https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/${IconForFile}`,
      {
        responseType: 'arraybuffer'
      }
    )
    res.setHeader('Content-type', 'image/svg+xml')
    res.end(svg)
  } catch (err) {
    res.end(err.toString())
  }
})

server.listen(process.env.PORT || 3000)
