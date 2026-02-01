const bcrypt = require('bcryptjs')

const hashed = "$2b$12$4zDyfSGAdfrQ/90k1v.J/u5jUAhezGJQutnfRyAg2zToNVLqbe8Rm"
const plain = "12345678"

bcrypt.compare(plain, hashed).then(res => {
  console.log("Match:", res) // باید true بشه
})

// const bcrypt = require('bcryptjs')

// const password = '12345678'
// const saltRounds = 12

// bcrypt.hash(password, saltRounds).then(hash => {
//   console.log('✅ رمز عبور واقعی "12345678" → هش:')
//   console.log(hash)
// })