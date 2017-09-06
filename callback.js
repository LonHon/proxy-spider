function learn(somet){
    console.log(somet)
}
function we(callback, somet){
    somet += 'is coll';
    callback(somet);
}
we(learn, 'longhong')