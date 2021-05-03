// node module (pass function and data between files)

module.exports.getDate = function(){
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const today = new Date();
    return today.toLocaleDateString("en-US", options);
}

module.exports.getDay = function(){
    const options = { weekday: 'long' };
    const today = new Date();
    return today.toLocaleDateString("en-US", options);
}





