var maxRoachSpeed=5;
var minRoachSpeed=2;
var width=600;
var height=500;


for (i=0; i<20; i++) {
  var x = Math.floor(
    Math.random() * (
      ((width/2 + 25)+1) - (width/2 - 25) ) + (width/2 -25)
  );
  console.log(x);

}

for (i=0; i<20; i++) {
  var xVel = Math.floor(
    Math.random() * ((maxRoachSpeed+1) - minRoachSpeed) + minRoachSpeed
  );

  console.log(xVel);
}
