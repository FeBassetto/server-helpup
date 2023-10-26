import { createServer } from 'http'
import { spawn } from 'child_process'

const server = createServer((req, res) => {
  let data = ''

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', () => {
    const payload = JSON.parse(data)

    if (payload.ref === 'refs/heads/main') {
      console.log(
        'Received a push to the main branch. Updating code and restarting PM2...'
      )

      const updateProcess = spawn('git', ['pull'])
      updateProcess.on('close', (code) => {
        if (code === 0) {
          const pm2Restart = spawn('pm2', ['restart', 'server'])
          pm2Restart.on('close', (code) => {
            console.log('PM2 restarted.')
          })
        } else {
          console.error('Failed to update the code.')
        }
      })
    }

    res.end('Webhook received')
  })
})

const port = 3000
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
