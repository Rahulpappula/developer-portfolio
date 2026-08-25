const GITHUB_USERNAME = 'Rahulpappula';

document.getElementById('year').textContent = new Date().getFullYear();

const typedEl = document.getElementById('typed');
const phrases = ['whoami', 'build --with-intent', 'ship --with-care'];
let p = 0, i = 0;
function typeLoop(){
  const current = phrases[p];
  typedEl.textContent = current.slice(0, i);
  i++;
  if(i > current.length){
    document.getElementById('terminal-output').textContent = p === 0 ? 'A product-minded developer with a bias for clarity.' : p === 1 ? 'Thoughtful interfaces, reliable systems, useful outcomes.' : 'Ideas into products, without losing the plot.';
    setTimeout(()=>{i=0;p=(p+1)%phrases.length;},1100);
  }
  setTimeout(typeLoop, i > current.length ? 1100 : 75);
}
setTimeout(typeLoop, 600);

function addGlassInteractions(){
  const tiltTargets = document.querySelectorAll('.project-card, .github-panel, .terminal');
  const magneticTargets = document.querySelectorAll('.contact-link, .scroll-cue, .text-link');
  const supportsHover = window.matchMedia('(hover: hover)').matches;
  const root = document.documentElement;

  const progressBar = document.querySelector('.scroll-progress span');
  const updateScrollState = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateScrollState, {passive:true});
  updateScrollState();

  const revealSections = document.querySelectorAll('.reveal-section');
  if('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), {threshold:.14});
    revealSections.forEach(section => revealObserver.observe(section));
  } else revealSections.forEach(section => section.classList.add('is-visible'));

  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`));
    }
  }), {rootMargin:'-25% 0px -65%'});
  document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));

  document.body.addEventListener('pointermove', event => {
    root.style.setProperty('--mouse-x', `${event.clientX}px`);
    root.style.setProperty('--mouse-y', `${event.clientY}px`);
    root.style.setProperty('--page-x', `${(event.clientX / window.innerWidth - .5) * 2}`);
    root.style.setProperty('--page-y', `${(event.clientY / window.innerHeight - .5) * 2}`);
  });

  if(supportsHover){
    tiltTargets.forEach(target => {
      target.addEventListener('pointermove', event => {
        const bounds = target.getBoundingClientRect();
        const rotateX = ((event.clientY - bounds.top) / bounds.height - .5) * -6;
        const rotateY = ((event.clientX - bounds.left) / bounds.width - .5) * 6;
        target.style.setProperty('--glow-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
        target.style.setProperty('--glow-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
        target.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      target.addEventListener('pointerleave', () => { target.style.transform = ''; });
    });
    magneticTargets.forEach(target => {
      target.addEventListener('pointermove', event => {
        const bounds = target.getBoundingClientRect();
        target.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * .12}px,${(event.clientY - bounds.top - bounds.height / 2) * .12}px)`;
      });
      target.addEventListener('pointerleave', () => { target.style.transform = ''; });
    });
  }

  document.addEventListener('pointerdown', event => {
    const target = event.target.closest('a, .project-card, .post');
    if(!target) return;
    const ripple = document.createElement('span');
    const bounds = target.getBoundingClientRect();
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - bounds.left}px`;
    ripple.style.top = `${event.clientY - bounds.top}px`;
    target.style.position = 'relative';
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), {once:true});
  });

  const profileImage = document.querySelector('.profile-photo');
  profileImage.addEventListener('error', () => {
    profileImage.hidden = true;
    profileImage.nextElementSibling.classList.add('is-visible');
  }, {once:true});

  const stats = document.querySelectorAll('.stats-row strong');
  const animateNumber = (element, value) => {
    const duration = 900;
    const started = performance.now();
    const tick = now => {
      const progress = Math.min((now - started) / duration, 1);
      element.textContent = Math.round(value * (1 - Math.pow(1 - progress, 3)));
      if(progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  stats.forEach(stat => stat.dataset.ready = 'false');
  window.animateGithubStats = (values) => stats.forEach((stat, index) => animateNumber(stat, values[index] || 0));

  const cursor = document.createElement('span');
  cursor.className = 'cursor-distortion';
  document.body.appendChild(cursor);
  if(supportsHover){
    document.body.addEventListener('pointermove', event => {
      cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    });
    document.querySelectorAll('a, .project-card, .post').forEach(target => {
      target.addEventListener('pointerenter', () => cursor.classList.add('is-active'));
      target.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });
  }

  const applyGyro = (gamma, beta) => {
    root.style.setProperty('--gyro-x', `${Math.max(-1, Math.min(1, gamma / 25))}`);
    root.style.setProperty('--gyro-y', `${Math.max(-1, Math.min(1, beta / 25))}`);
  };
  if('DeviceOrientationEvent' in window){
    window.addEventListener('deviceorientation', event => applyGyro(event.gamma || 0, event.beta || 0), {passive:true});
  }
}

async function loadProjects(){
  try{
    const res = await fetch('data/projects.json');
    const projects = await res.json();
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';
    projects.forEach(p => {
      const el = document.createElement('article'); el.className='project-card';
      el.innerHTML = `
        <div class="project-top"><span class="project-index">0${projects.indexOf(p)+1}</span><span class="project-arrow">↗</span></div>
        <h3>${p.title}</h3><p>${p.description}</p>
        <div class="tags">${p.tech.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div class="actions">${p.live?`<a class="text-link" href="${p.live}" target="_blank" rel="noopener">Live demo <span>↗</span></a>`:''}${p.repo?`<a class="text-link" href="${p.repo}" target="_blank" rel="noopener">Source <span>↗</span></a>`:''}</div>
      `;
      grid.appendChild(el);
    });
  }catch(e){console.error('Could not load projects',e)}
}

async function loadBlog(){
  try{
    const res = await fetch('data/blog.json');
    const posts = await res.json();
    const node = document.getElementById('blog-list');
    node.innerHTML = '';
    posts.forEach(post=>{
      const el = document.createElement('article'); el.className='post';
      el.innerHTML = `
        <div class="meta"><span>${post.date}</span><span>${post.readTime} read</span></div><h4>${post.title}</h4><p>${post.excerpt}</p><span class="post-arrow">↗</span>
      `;
      node.appendChild(el);
    });
  }catch(e){console.error('Could not load blog',e)}
}

async function loadGitHubStats(){
  try{
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if(!userRes.ok) throw new Error('GitHub user fetch failed');
    const user = await userRes.json();
    document.getElementById('gh-username').textContent = user.login;
    document.getElementById('gh-followers').textContent = user.followers;
    document.getElementById('gh-repos').textContent = user.public_repos;

    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
    const repos = await reposRes.json();
    const stars = Array.isArray(repos)?repos.reduce((s,r)=>s+(r.stargazers_count||0),0):'—';
    document.getElementById('gh-stars').textContent = stars;
    if(window.animateGithubStats) window.animateGithubStats([user.public_repos, user.followers, stars]);
  }catch(err){
    console.warn('GitHub fetch failed — using placeholders', err);
  }
}

async function renderSkills(){
  const skills = ['Frontend','Backend','Design','Systems','Testing','Writing'];
  const values = [92,78,84,70,76,68];
  const ctx = document.getElementById('skillsChart').getContext('2d');
  new Chart(ctx,{
    type:'radar',
    data:{
      labels:skills,
      datasets:[{label:'Skill proficiency',data:values,backgroundColor:'rgba(154, 255, 91, 0.12)',borderColor:'#9aff5b',borderWidth:2,pointBackgroundColor:'#9aff5b',pointBorderColor:'#101310',pointRadius:3}]
    },
    options:{
      maintainAspectRatio:false,
      scales:{r:{min:0,max:100,ticks:{display:false},grid:{color:'rgba(255,255,255,0.12)'},angleLines:{color:'rgba(255,255,255,0.14)'},pointLabels:{color:'#d4dbd1',font:{family:'DM Mono',size:10}}}},
      plugins:{legend:{display:false}}
    }
  });
}

// Boot
loadProjects();loadBlog();loadGitHubStats();renderSkills();addGlassInteractions();
