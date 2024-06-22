const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
      minLength: [2, 'Minimum length for name is 2 characters!'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Name is required!'],
      minLength: [2, 'Minimum length for last name is 2 characters!'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      minLength: [8, 'Minimum length for name is 2 characters!'],
      maxLength: [20, `Maximum length is 20 characters!`],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Password confirm is required!'],
      minLength: [8, 'Minimum length for name is 2 characters!'],
      maxLength: [20, `Maximum length is 20 characters!`],
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: 'Password must match!',
      },
      select: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      unique: true,
      validate: [validator.isEmail, 'Email address is required!'],
      trim: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verifyToken: String,
    image: {
      type: String,
      default: 'default.png',
    },
    statusText: {
      type: String,
      minLength: [1, 'Minimum length for name is 1 characters!'],
      maxLength: [255, `Maximum length is 255 characters!`],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, rel) {
        rel.id = doc._id;
        delete rel._id;
        delete rel.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

// if user is new then we create hash pass
userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hash(this.password, 12);
    this.passwordConfrim = undefined;
  }
  next();
});

// checking whetever user changed password if so settitng password change at property and hashing pass
userSchema.pre('save', function (next) {
  if (this.isModified('password') && !this.isNew) {
    this.passwordChangedAt = Date.now();
  }
  next();
});

userSchema.methods.checkUserPassword = async function (
  userInputPassword,
  userPassword
) {
  return await bcrypt.compare(userInputPassword, userPassword);
};

userSchema.methods.checkIsJwtIssuedBeforeChaningPassword = function (
  jwtTimestamp
) {
  if (this.passwordChangedAt) {
    return jwtTimestamp < this.passwordChangedAt;
  }
  return false;
};

const User = mongoose.model('User', userSchema, 'chatUsers');

module.exports = User;
