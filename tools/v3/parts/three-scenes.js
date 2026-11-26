/* MFM V3 · 3D: glossy light-beam bars (hero) and the exploded study pack. three.js r128, loaded after the page paints. */
window.MFM3D=(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function envFor(r){
    var c=document.createElement('canvas');c.width=1024;c.height=512;var x=c.getContext('2d');
    var g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,'#0b1a15');g.addColorStop(.5,'#050a08');g.addColorStop(1,'#000');x.fillStyle=g;x.fillRect(0,0,1024,512);
    /* soft light strips for the gloss to catch: emerald, white, gold */
    function strip(px,py,w,h,col,blur){x.save();x.filter='blur('+blur+'px)';x.fillStyle=col;x.fillRect(px,py,w,h);x.restore()}
    strip(80,60,260,60,'#21B582',22);strip(440,50,160,26,'#cfe9dc',14);strip(700,90,220,50,'#C8922B',22);strip(300,300,300,30,'#0E6349',28);
    var t=new THREE.CanvasTexture(c);t.mapping=THREE.EquirectangularReflectionMapping;t.encoding=THREE.sRGBEncoding;
    var pm=new THREE.PMREMGenerator(r);var env=pm.fromEquirectangular(t).texture;t.dispose();pm.dispose();return env}
  function setup(canvas,opts){
    opts=opts||{};
    var r=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
    r.setPixelRatio(Math.min(devicePixelRatio||1,opts.dpr||2));r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=opts.exp||1.05;
    var s=new THREE.Scene();s.environment=envFor(r);
    var cam=opts.ortho?new THREE.OrthographicCamera(-5,5,5,-5,.1,100):new THREE.PerspectiveCamera(34,1,.1,100);
    function size(){var w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;r.setSize(w,h,false);
      if(opts.ortho){var a=w/h,v=opts.view||5;cam.left=-v*a;cam.right=v*a;cam.top=v;cam.bottom=-v}else cam.aspect=w/h;cam.updateProjectionMatrix();if(opts.onSize)opts.onSize(w,h)}
    size();new ResizeObserver(size).observe(canvas);
    var vis=true;new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(canvas);
    return {r:r,s:s,cam:cam,loop:function(fn){var t0=performance.now();(function f(t){requestAnimationFrame(f);if(!vis||document.hidden)return;fn((t-t0)/1000);r.render(s,cam)})(t0)}};
  }
  function rounded(w,h,rad){var s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+rad,y);s.lineTo(x+w-rad,y);s.quadraticCurveTo(x+w,y,x+w,y+rad);s.lineTo(x+w,y+h-rad);s.quadraticCurveTo(x+w,y+h,x+w-rad,y+h);s.lineTo(x+rad,y+h);s.quadraticCurveTo(x,y+h,x,y+h-rad);s.lineTo(x,y+rad);s.quadraticCurveTo(x,y,x+rad,y);return s}

  /* ---------- hero: diagonal glossy bars lit in emerald and gold ---------- */
  function beams(canvas){
    var S=setup(canvas,{dpr:1.75,exp:.9}),s=S.s,cam=S.cam;cam.position.set(0,0,16);
    s.fog=new THREE.Fog(0x07100D,11,22);
    var geo=new THREE.ExtrudeGeometry(rounded(1.05,26,.45),{depth:.9,bevelEnabled:true,bevelThickness:.25,bevelSize:.22,bevelSegments:6,curveSegments:10});geo.center();
    var em=new THREE.MeshPhysicalMaterial({color:0x0B5A42,metalness:.3,roughness:.32,clearcoat:1,clearcoatRoughness:.18,envMapIntensity:.9});
    var gd=new THREE.MeshPhysicalMaterial({color:0xA7741A,metalness:.7,roughness:.28,clearcoat:1,clearcoatRoughness:.15,envMapIntensity:1});
    var dk=new THREE.MeshPhysicalMaterial({color:0x07150f,metalness:.2,roughness:.35,clearcoat:1,clearcoatRoughness:.2,envMapIntensity:.7});
    var g=new THREE.Group();g.rotation.z=-0.66;s.add(g);
    var bars=[],N=9;
    for(var i=0;i<N;i++){var m=new THREE.Mesh(geo,i===5?gd:(i%2===1?dk:em));m.position.set((i-(N-1)/2)*2.7,0,-((i*7)%5)*1.4);m.userData={y:(i%2?1:-1)*(1+(i%4)),z:m.position.z,ph:i*1.7};g.add(m);bars.push(m)}
    var k1=new THREE.PointLight(0x3DDC97,34,30,2);k1.position.set(-4,3,6);s.add(k1);
    var k2=new THREE.PointLight(0xE8B547,26,26,2);k2.position.set(5,-2,5);s.add(k2);
    var k3=new THREE.DirectionalLight(0xffffff,.25);k3.position.set(0,6,8);s.add(k3);
    s.add(new THREE.AmbientLight(0x12241d,.5));
    var mx=0,my=0,tx=0,ty=0;addEventListener('pointermove',function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
    S.loop(function(t){
      var sp=reduce?0:1;mx+=(tx-mx)*.04;my+=(ty-my)*.04;
      bars.forEach(function(b){var u=b.userData;b.position.y=u.y+Math.sin(t*.35+u.ph)*1.2*sp;b.position.z=u.z+Math.sin(t*.25+u.ph)*.5*sp});
      k1.position.x=-4+Math.sin(t*.4)*3*sp;k2.position.y=-2+Math.cos(t*.33)*2*sp;
      cam.position.x=mx*1.6;cam.position.y=-my*1.2;cam.lookAt(0,0,0);
    });
    canvas.classList.add('on');
  }

  /* ---------- study pack: four layers that lift apart as you scroll ---------- */
  function pageTex(o){
    var c=document.createElement('canvas');c.width=512;c.height=724;var x=c.getContext('2d');
    var g=x.createLinearGradient(0,0,512,724);g.addColorStop(0,o.a);g.addColorStop(1,o.b);x.fillStyle=g;x.fillRect(0,0,512,724);
    if(o.img){x.drawImage(o.img,0,0,512,724)}else{
      x.strokeStyle=o.line;x.lineWidth=3;x.strokeRect(24,24,464,676);
      x.fillStyle=o.ink;x.font='600 30px Inter, sans-serif';x.fillText(o.kick,48,96);
      x.font='700 64px Inter, sans-serif';o.title.forEach(function(l,i){x.fillText(l,48,180+i*70)});
      x.fillStyle=o.line;for(var i=0;i<9;i++){x.globalAlpha=.55;x.fillRect(48,360+i*34,(i%3===2?260:416),10)}x.globalAlpha=1;
      x.font='600 26px Inter, sans-serif';x.fillStyle=o.ink;x.fillText(o.foot,48,670)}
    var t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t}
  function pack(canvas,o){
    var img=new Image();img.src=o.cover;img.onload=function(){
      var S=setup(canvas,{ortho:true,view:6.4}),s=S.s,cam=S.cam;
      cam.position.set(9+1.4,9,9-1.4);cam.lookAt(1.4,0,-1.4);
      var defs=[
        {a:'#E8D9B5',b:'#cdb88a',line:'#7a6431',ink:'#3a2c0c',kick:'Notes booklets',title:['Key points,','terms & dates'],foot:'Paper 1 · Paper 2'},
        {a:'#13201B',b:'#0a1310',line:'#3DDC97',ink:'#EEF3EF',kick:'Paper 2 workbook',title:['Hadiths, Caliphs,','faith & pillars'],foot:'With marking scheme'},
        {a:'#0E6349',b:'#073A2C',line:'#E8B547',ink:'#F7F2E4',kick:'Paper 1 workbook',title:['Qur’an, Prophet,','first community'],foot:'With marking scheme'},
        {img:img,a:'#000',b:'#000'}];
      var layers=[],W=3.6,D=5.09,H=.12;
      defs.forEach(function(d,i){
        var top=new THREE.MeshPhysicalMaterial({map:pageTex(d),roughness:.45,clearcoat:i===3?.8:.2,clearcoatRoughness:.3});
        var side=new THREE.MeshStandardMaterial({color:i===0?0xd9c79c:(i===3?0x0b3d2d:0xe9e1cc),roughness:.7});
        var m=new THREE.Mesh(new THREE.BoxGeometry(W,H,D),[side,side,top,side,side,side]);
        var e=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:i===3?0xE8B547:0x3DDC97,transparent:true,opacity:.35}));m.add(e);
        s.add(m);layers.push(m)});
      var key=new THREE.DirectionalLight(0xffffff,.75);key.position.set(4,10,6);s.add(key);
      s.add(new THREE.AmbientLight(0xffffff,.4));
      var rim=new THREE.PointLight(0x3DDC97,14,20,2);rim.position.set(-5,2,-3);s.add(rim);
      var labels=o.labels||[],v=new THREE.Vector3(),sec=o.section||canvas,prog=0,auto=0;
      S.loop(function(t){
        var rc=sec.getBoundingClientRect(),vh=innerHeight;
        var p=Math.min(1,Math.max(0,(vh-rc.top)/(rc.height*.7)));prog+=(p-prog)*.08;
        var e=reduce?1:(prog<.5?2*prog*prog:1-Math.pow(-2*prog+2,2)/2),gap=.18+e*1.15;
        layers.forEach(function(m,i){m.position.y=(i-1.5)*gap;m.rotation.y=reduce?0:Math.sin(t*.3)*.08});
        layers.forEach(function(m){m.updateMatrixWorld()});
        labels.forEach(function(l,i){if(!l)return;
          v.set(W/2,0,-D/2);layers[i].localToWorld(v);v.project(cam);
          l.style.transform='translate('+((v.x*.5+.5)*canvas.clientWidth)+'px,'+((-v.y*.5+.5)*canvas.clientHeight)+'px)';l.style.opacity=Math.min(1,e*1.6)});
      });
    };
  }
  return {beams:beams,pack:pack};
})();
