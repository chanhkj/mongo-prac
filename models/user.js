var mongoose = require('mongoose')

var bcrypt = require('bcrypt')

var userSchema = mongoose.Schema({
  local: {
    name: String,
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  }
})

userSchema.pre('save', function(next) {
  // console.log('before save hash the password')
  // console.log(this)
  var user = this
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.local.password, salt, function(err, hash) {
      if (err) return next(err)

      user.local.password = hash
      // console.log('after hash')
      // console.log(user)
      next()
    })
  })
})

// userSchema.post('save', function() {
  // console.log('after the save, save successful')
// })

// userSchema.methods.sayName = function() {
//   console.log(this);
//   console.log('my email is: ' + this.local.email)
//   console.log('my password is: ' + this.local.password)
// }

userSchema.methods.authenticate = function(givenPassword, callback) {
  console.log('given password is ' + givenPassword)
  console.log('saved password is ' + this.local.password)
  var hashedPassword = this.local.password

  bcrypt.compare(givenPassword, this.local.password, function(err, isMatch) {
    callback(err, isMatch)
  })
}

var User = mongoose.model('User', userSchema)

// var newUser = new User({
//   local: {
//     email: 'chan@gamil.com',
//     password: 'test123'
//   }
// })

// newUser.save(function (err, newUser) {
//   if (err) console.log(err.message)
//   // console.log('new user saved')
//   newUser.authenticate('test123', function(err, authenticated) {
//     if (err) console.log('not authenticated')
//     console.log('auth is ' + authenticated)
//     if (authenticated) console.log('user is authenticated')
//   })
// })

module.exports = User
