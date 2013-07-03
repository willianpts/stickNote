
document.addEventListener("deviceready", ready, false);
 
var Local = function(){
     
    var module = {
        done: function(position) {
            alert('Latitude: '          + position.coords.latitude          + '\n' +
                  'Longitude: '         + position.coords.longitude         + '\n' +
                  'Altitude: '          + position.coords.altitude          + '\n' +
                  'Accuracy: '          + position.coords.accuracy          + '\n' +
                  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                  'Heading: '           + position.coords.heading           + '\n' +
                  'Speed: '             + position.coords.speed             + '\n' +
                  'Timestamp: '         + position.timestamp                + '\n'
            );
        },
         
        pr: function(e){
            //~ console.log(e);
            //~ console.log(Object.keys(this));
            //~ console.log(this.prop);
            s();
        },
         
        prop: 'valor inicial',
         
        posicao: function(f){
            this.prop = f;
            //~ navigator.geolocation.getCurrentPosition(function(e){ console.log(e) },  function(){ console.log('deu erro')});
            //~ navigator.geolocation.getCurrentPosition(this.done, function(){ console.log('deu erro')});
        }
    };
     
    function done(position){
        alert('Latitude: '          + position.coords.latitude          + '\n' +
                  'Longitude: '         + position.coords.longitude         + '\n' +
                  'Altitude: '          + position.coords.altitude          + '\n' +
                  'Accuracy: '          + position.coords.accuracy          + '\n' +
                  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                  'Heading: '           + position.coords.heading           + '\n' +
                  'Speed: '             + position.coords.speed             + '\n' +
                  'Timestamp: '         + position.timestamp                + '\n'
        );
    };
     
    var s = function (){
        console.log(this.prop);
    }.bind(module);
     
    return module;
};
//~ 
//~ Local.prototype = {
//~ 
//~ };
 
function ready() {
    var meuLocal = new Local();
    meuLocal.posicao([1,2,3,4,5]);
    meuLocal.pr(1);
     
    var l2 = new Local();
    l2.posicao('eu sou o l2!!!');
    l2.pr(1);
}
 
ready();