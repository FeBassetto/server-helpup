export interface StorageProvider {
  uploadImage(file: Buffer, fileName: string, mimetype: string): Promise<string>
  deleteImage(filename: string): Promise<void>
}
