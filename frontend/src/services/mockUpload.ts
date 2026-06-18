// TEMPORARY mock upload — will become a real axios.post('/books/upload',
// formData, { onUploadProgress }) call. The signature (file in, progress
// callback, Promise out) is designed to match that call exactly, so
// UploadModal/UploadFileItem won't need to change when this is swapped.

const DEMO_FAILURE_THRESHOLD_BYTES = 8 * 1024 * 1024 // 8MB — demo-only trigger

export function simulateUpload(
  file: File,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    let percent = 0

    const interval = setInterval(() => {
      percent += Math.random() * 18 + 7 // uneven increments feel more realistic
      if (percent >= 100) {
        percent = 100
        onProgress(100)
        clearInterval(interval)

        // Demo-only deterministic failure trigger — replaced by real
        // network error handling once a backend exists.
        if (file.size > DEMO_FAILURE_THRESHOLD_BYTES) {
          reject(new Error('Upload failed. The server could not process this file.'))
        } else {
          resolve()
        }
        return
      }
      onProgress(Math.round(percent))
    }, 250)
  })
}