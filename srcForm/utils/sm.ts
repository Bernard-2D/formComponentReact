import { sm2 } from 'sm-crypto'

// 公钥
const publicKey =
  '04d1a6d2c4e1423aa23b33ddcdcdda26d626c71210634226751ed1400400004a94c7eed00b3c4a6958267ae773b07244d5743369504fc31437c2f52f0d0b21a57b'

export function encrypt(data: string) {
  return sm2.doEncrypt(data, publicKey)
}
