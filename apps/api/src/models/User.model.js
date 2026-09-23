import mongoose from 'mongoose';










const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    userTypes: {
      type: [String],
      enum: ['buyer', 'seller'],
      default: ['buyer']
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    otp: {
      type: String,
      select: false
    },
    otpExpires: {
      type: Date,
      select: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: {
      type: Date
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', function (next) {
  if (this.fullName && !this.name) {
    this.name = this.fullName;
  } else if (this.name && !this.fullName) {
    this.fullName = this.name;
  }
  next();
});

export default mongoose.model('User', UserSchema);