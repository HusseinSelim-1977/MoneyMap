import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'Please Enter Your First Name'], trim: true},
    lastName: {type: String, required: [true, 'Please Enter Your Last Name'], trim: true},
    Email: {
        type: String, 
        required: [true, 'Please Enter Your Email'], 
        unique: true, 
        trim: true,
        match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],},
    Password:{type: String, required: [true, 'Please Enter A Password'], minlength: 6, select: false}
}, {timestamps: true});

//Encrypts/Hashes Passwords before saving them in database in sign-in
//after signing-in it hashes the passwords and adds unique characters to maximize security
//using salt in a cost factor of 2^12 = 4,096 rounds of hashing
userSchema.pre('save', async function(next){
    if(!this.isModified(Password)){
        next();
}

const salt = await genSalt(12);
this.Password = await hash(this.Password,salt);
});

//method used to match user entered password to hashed password in login
userSchema.methods.matchPassword = async function(enteredPass){
    return await compare(enteredPass, this.Password);
};

export default model('User', userSchema);

//In User schema the match type I added from chatGPT for more valid and secure sign-in
// trim is used to delet spaces before and after input for database efficiency
// select: false field is used to prevent public visibility of any outsiders to view User-Passwords in database query
//Note: All notes are written by me Hussein Selim not by chatGPT for future information 