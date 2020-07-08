const http = require('http')
const { URL } = require('url')
const { extname } = require('path')
const { getIconForFile } = require('vscode-icons-js')
const axios = require('axios')

const server = http.createServer()

server.on('request', async (req, res) => {
  const iconFallback = 'default_file.svg'
  let iconFileExtension = iconFallback
  let svg

  const url = new URL(req.url, `${req.protocol}://${req.headers.host}`)
  const file = url.searchParams.get('file')

  if (file) {
    const extension = extname(file) || file.indexOf('.') !== -1 ? file : `.${file}`

    if (extension) {
      iconFileExtension = getIconForFile(extension)
    }
  }

  try {
    const { data } = await axios.get(
      `https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/${iconFileExtension}`,
      {
        responseType: 'arraybuffer'
      }
    )
    svg = data
  } catch (err) {
    svg = `https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/${iconFileExtension}`
  }

  res.setHeader('Content-type', 'image/svg+xml')
  res.end(svg)
})

server.listen(process.env.PORT || 3000)
