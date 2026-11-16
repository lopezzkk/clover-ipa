

for(let i=0;i<5;i++){const a=i/5*6.2832;spawnDummy({x:TC.x-2+Math.cos(a)*6,z:TC.z+Math.sin(a)*6})}
skin('civil');pm.position.set(0,0,0);cam.position.set(0,15,13);cam.lookAt(0,1,0);document.documentElement.style.setProperty('--bpn','90');menuInit();requestAnimationFrame(loop);
