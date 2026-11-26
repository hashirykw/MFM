/* MFM V2 · 3D: the gold eight-point star (Rub el Hizb) and the study-pack book. three.js r128, loaded after the page paints. */
window.MFM3D=(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function grad(w,h,stops,vertical){var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');var g=vertical?x.createLinearGradient(0,0,0,h):x.createLinearGradient(0,0,w,0);stops.forEach(function(s){g.addColorStop(s[0],s[1])});x.fillStyle=g;x.fillRect(0,0,w,h);return c}
  function envFor(r){
    /* a soft studio: warm key from above, emerald floor, two bright strips for the metal to catch */
    var c=grad(1024,512,[[0,'#fff8e6'],[.28,'#f6dc9c'],[.5,'#8a6a2c'],[.7,'#2b2414'],[1,'#0b0a06']],true),x=c.getContext('2d');
    x.fillStyle='rgba(255,255,255,.95)';x.fillRect(120,90,170,60);x.fillRect(660,70,240,44);
    x.fillStyle='rgba(255,236,190,.8)';x.fillRect(430,180,120,26);
    var t=new THREE.CanvasTexture(c);t.mapping=THREE.EquirectangularReflectionMapping;t.encoding=THREE.sRGBEncoding;
    var pm=new THREE.PMREMGenerator(r);var env=pm.fromEquirectangular(t).texture;t.dispose();pm.dispose();return env}
  function setup(canvas){
    var r=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
    r.setPixelRatio(Math.min(devicePixelRatio||1,2));r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
    var s=new THREE.Scene();s.environment=envFor(r);
    var cam=new THREE.PerspectiveCamera(30,1,.1,100);
    function size(){var w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
    size();new ResizeObserver(size).observe(canvas);
    var vis=true;new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(canvas);
    return {r:r,s:s,cam:cam,loop:function(fn){var t0=performance.now();(function f(t){requestAnimationFrame(f);if(!vis||document.hidden)return;fn((t-t0)/1000);r.render(s,cam)})(t0)}};
  }
  function starShape(R,ri,hole){
    var sh=new THREE.Shape(),k=R*Math.cos(Math.PI/4)/Math.cos(Math.PI/8);
    for(var i=0;i<16;i++){var a=Math.PI/2+i*Math.PI/8,rr=i%2?k*ri:R;var x=Math.cos(a)*rr,y=Math.sin(a)*rr;i?sh.lineTo(x,y):sh.moveTo(x,y)}
    sh.closePath();
    if(hole){var p=new THREE.Path();if(hole.star){for(var j=0;j<16;j++){var b=Math.PI/2+j*Math.PI/8,q=j%2?hole.r*Math.cos(Math.PI/4)/Math.cos(Math.PI/8):hole.r;j?p.lineTo(Math.cos(b)*q,Math.sin(b)*q):p.moveTo(Math.cos(b)*q,Math.sin(b)*q)}p.closePath()}else p.absarc(0,0,hole.r,0,Math.PI*2,true);sh.holes.push(p)}
    return sh}
  function star(canvas,o){
    o=o||{};var S=setup(canvas),s=S.s,cam=S.cam;cam.position.set(0,0,o.dist||11);
    var gold=new THREE.MeshPhysicalMaterial({color:0xF2C55A,metalness:1,roughness:.22,clearcoat:.5,clearcoatRoughness:.2});
    var green=new THREE.MeshPhysicalMaterial({color:0x0E6349,metalness:.35,roughness:.18,clearcoat:1,clearcoatRoughness:.08});
    var g=new THREE.Group();s.add(g);
    var bev={depth:.34,bevelEnabled:true,bevelThickness:.12,bevelSize:.1,bevelSegments:6,curveSegments:48};
    var outer=new THREE.Mesh(new THREE.ExtrudeGeometry(starShape(3,1,{r:2.45,star:true}),bev),gold);outer.geometry.center();g.add(outer);
    var mid=new THREE.Mesh(new THREE.ExtrudeGeometry(starShape(2.15,1,{r:.95}),{depth:.22,bevelEnabled:true,bevelThickness:.08,bevelSize:.07,bevelSegments:5,curveSegments:48}),green);mid.geometry.center();mid.position.z=-.25;g.add(mid);
    var ring=new THREE.Mesh(new THREE.TorusGeometry(.95,.09,24,96),gold);ring.position.z=-.1;g.add(ring);
    /* small stars that drift around the big one */
    var bits=[],small=new THREE.ExtrudeGeometry(starShape(.32,1),{depth:.08,bevelEnabled:true,bevelThickness:.04,bevelSize:.03,bevelSegments:3});small.center();
    (o.bits||[[-3,2.2,.5],[3,-2,.8],[2.7,2.4,-1],[-2.7,-2.4,1.2],[.4,-3.1,-.6]]).forEach(function(p,i){var m=new THREE.Mesh(small,i%2?green:gold);m.position.set(p[0],p[1],p[2]);m.userData.p=p;m.scale.setScalar(.7+Math.random()*.7);s.add(m);bits.push(m)});
    var key=new THREE.DirectionalLight(0xfff1cf,1.4);key.position.set(3,5,6);s.add(key);
    s.add(new THREE.AmbientLight(0xffffff,.25));
    var mx=0,my=0,tx=0,ty=0;
    addEventListener('pointermove',function(e){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)},{passive:true});
    g.scale.setScalar(.001);
    S.loop(function(t){
      var born=Math.min(1,t/1.4),e=1-Math.pow(1-born,4);g.scale.setScalar(e*(o.scale||1));
      mx+=(tx-mx)*.05;my+=(ty-my)*.05;
      var sp=reduce?0:1;
      g.rotation.z=t*.12*sp;
      g.rotation.y=Math.sin(t*.45)*.32*sp+mx*.6;
      g.rotation.x=Math.cos(t*.38)*.16*sp+my*.4;
      mid.rotation.z=-t*.3*sp;
      bits.forEach(function(m,i){var p=m.userData.p;m.position.y=p[1]+Math.sin(t*.8+i)*.18*sp;m.rotation.z=t*(.4+i*.1)*sp;m.rotation.y=t*.7*sp+i})
    });
  }
  function bookFaces(coverImg){
    function edge(w,h,v){var c=grad(w,h,[[0,'#f3ead4'],[1,'#e2d5b6']],v),x=c.getContext('2d');x.strokeStyle='rgba(120,100,60,.22)';x.lineWidth=1;for(var i=0;i<(v?w:h);i+=3){x.beginPath();if(v){x.moveTo(i,0);x.lineTo(i,h)}else{x.moveTo(0,i);x.lineTo(w,i)}x.stroke()}return c}
    var spine=grad(128,1024,[[0,'#0a3e2d'],[.5,'#0f6a4c'],[1,'#0a3e2d']],false),sx=spine.getContext('2d');
    sx.fillStyle='#E8B547';sx.fillRect(0,40,128,10);sx.fillRect(0,974,128,10);
    sx.save();sx.translate(64,512);sx.rotate(Math.PI/2);sx.textAlign='center';sx.textBaseline='middle';sx.font='800 54px Bricolage, sans-serif';sx.fillStyle='#F7D88A';sx.fillText('ISLAMIYAT · MFM',0,0);sx.restore();
    var back=grad(512,724,[[0,'#0d5a42'],[1,'#062a20']],true),bx=back.getContext('2d');
    bx.strokeStyle='rgba(232,181,71,.55)';bx.lineWidth=3;bx.strokeRect(26,26,460,672);
    bx.textAlign='center';bx.fillStyle='#F7D88A';bx.font='800 46px Bricolage, sans-serif';bx.fillText('O Level & IGCSE',256,300);bx.font='800 70px Bricolage, sans-serif';bx.fillText('ISLAMIYAT',256,380);
    bx.font='500 24px Geist, sans-serif';bx.fillStyle='rgba(248,244,234,.8)';bx.fillText('By Sir Mohammad Fazil Maniya',256,440);
    function tex(c){var t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t}
    var cov=new THREE.Texture(coverImg);cov.encoding=THREE.sRGBEncoding;cov.anisotropy=8;cov.needsUpdate=true;
    var paper=function(m){return new THREE.MeshPhysicalMaterial({map:m,roughness:.85,metalness:0})};
    var glossy=function(m){return new THREE.MeshPhysicalMaterial({map:m,roughness:.32,metalness:0,clearcoat:.8,clearcoatRoughness:.25})};
    return [paper(tex(edge(64,1024,true))),glossy(tex(spine)),paper(tex(edge(512,64,true))),paper(tex(edge(512,64,true))),glossy(cov),glossy(tex(back))];
  }
  function book(canvas,o){
    var img=new Image();img.src=o.cover;img.onload=function(){
      var S=setup(canvas),s=S.s,cam=S.cam;cam.position.set(0,0,o.dist||13.5);
      var mats=bookFaces(img);
      var g=new THREE.Group();s.add(g);
      var b=new THREE.Mesh(new THREE.BoxGeometry(3.6,5.09,.62),mats);g.add(b);
      var key=new THREE.DirectionalLight(0xfff1cf,1.1);key.position.set(4,6,8);s.add(key);
      var rim=new THREE.DirectionalLight(0xE8B547,1.2);rim.position.set(-6,2,-4);s.add(rim);
      s.add(new THREE.AmbientLight(0xffffff,.45));
      /* soft floor shadow */
      var sc=document.createElement('canvas');sc.width=sc.height=256;var sx=sc.getContext('2d'),rg=sx.createRadialGradient(128,128,0,128,128,128);rg.addColorStop(0,'rgba(0,0,0,.55)');rg.addColorStop(1,'rgba(0,0,0,0)');sx.fillStyle=rg;sx.fillRect(0,0,256,256);
      var sh=new THREE.Mesh(new THREE.PlaneGeometry(6,1.4),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc),transparent:true,depthWrite:false}));sh.position.y=-3.35;sh.rotation.x=-Math.PI/2.4;s.add(sh);
      var ry=-.5,vy=0,dragging=false,lx=0,rx=.06,idle=0;
      canvas.style.touchAction='pan-y';canvas.style.cursor='grab';
      canvas.addEventListener('pointerdown',function(e){dragging=true;lx=e.clientX;canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing'});
      canvas.addEventListener('pointermove',function(e){if(!dragging)return;var dx=e.clientX-lx;lx=e.clientX;vy=dx*.008;ry+=vy;idle=0});
      function up(){dragging=false;canvas.style.cursor='grab'}
      canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
      var flip=o.flip&&document.querySelector(o.flip);if(flip)flip.addEventListener('click',function(){vy=.22;idle=0});
      S.loop(function(t){
        if(!dragging){vy*=.94;ry+=vy;idle+=1/60;if(idle>1.5&&!reduce)ry+=Math.sin(t*.6)*.004+.0025}
        g.rotation.y=ry;g.rotation.x=rx+Math.sin(t*.7)*.04;g.position.y=Math.sin(t*1.1)*.12;
      });
    };
  }
  return {star:star,book:book};
})();
