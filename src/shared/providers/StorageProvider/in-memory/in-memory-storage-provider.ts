import fs from 'fs'
import path from 'path'

import { StorageProvider } from '../storage-provider'

export class InMemoryStorage implements StorageProvider {
  private basePath: string

  constructor() {
    this.basePath = path.resolve(__dirname, '../../../../upload')
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true })
    }
  }

  async uploadImage(
    file: Buffer,
    fileName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mimetype: string,
  ): Promise<string> {
    const filePath = path.join(this.basePath, `users/${fileName}`)
    await fs.promises.writeFile(filePath, file)
    return filePath
  }

  async deleteImage(filename: string): Promise<void> {
    const filePath = path.join(this.basePath, filename)
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath)
    }
  }
}
