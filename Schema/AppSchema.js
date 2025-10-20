import { Schema, model } from 'mongoose';

const AppSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'},
  
  Bill: [{
    title: {type: String, required: [true, 'Please Add Billing Title'], unique: true, trim: true},
    amountNeeded: {type: mongoose.Decimal128, required: [true, 'Please Enter Bill Amount']},
    amountDeposited:{type: mongoose.Decimal128, required: [true, 'Please Enter Deposited Amount This Month']},
    DueDate:{type: Date, required: [true, 'Please Enter Bill DueDate']}
  }],

  Investment: [{
    title: {type: String, required: [true, 'Please Enter Investment Title'], unique: true, trim: true},
    amountNeeded: {type: mongoose.Decimal128, required: [true, 'Please Enter Investment Amount']},
    amountDeposited:{type: mongoose.Decimal128, required: [true, 'Please Enter Deposited Amount This Month']}
  }],

  Spending: [{
    title: {type: String, required: [true, 'Please Enter Spending  Title'], unique: true, trim: true},
    amountDeposited:{type: mongoose.Decimal128, required: [true, 'Please Enter Deposited Amount This Month']}
  }]  
}); 

AppSchema.pre('save', async function(next) {
    if (this.isModified('Bill.amountNeeded') || this.isModified('Bill.amountDeposited')) {
        if (this.Bill.amountNeeded > this.Bill.amountDeposited) {
            const error = new Error("You're Short This Month 😕");
            return next(error);
        }
    }
    
    next();
});
export default model('Application', AppSchema);