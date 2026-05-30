const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

CompanySchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

CompanySchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Company', CompanySchema);
