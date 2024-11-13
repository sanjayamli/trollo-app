import mongoose  from  'mongoose';
import bcrypt    from  'bcryptjs';
import validator from 'validator'; 

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    validate: {
      validator: (v) => validator.isEmail(v), 
      message: (props) => `${props.value} is not a valid email!`, 
    },
  },
  password: { 
    type: String, 
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'], 
    maxlength: [20, 'Password must be at most 20 characters long'],
  },
  googleId: { type: String },
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('User', UserSchema);
