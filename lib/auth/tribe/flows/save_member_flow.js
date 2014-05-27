// name it this to remind me of purpose initially

//a helper class we're using as a bit of a MONAD
var SaveMemberFlow = function(args){
  args = args || {};
  return {
    success : args.success || false,
    message : args.message,
    member : args.member,
    changes : args.changes,
    setInvalid : function(mssg){
      this.success = false;
      this.message = mssg;
    },
    setSuccessful : function(mssg){
      this.success = true;
      this.message = mssg;
    }
  }
};

module.exports = SaveMemberFlow;