export const uuidTransformer = {
  to: (uuid?: string) =>
    uuid ? Buffer.from(uuid.replace(/-/g, ''), 'hex') : uuid,
  from: (bin: Buffer) =>
    bin
      ? `${bin.toString('hex', 0, 4)}-${bin.toString('hex', 4, 6)}-${bin.toString('hex', 6, 8)}-${bin.toString('hex', 8, 10)}-${bin.toString('hex', 10, 16)}`
      : null,
}
