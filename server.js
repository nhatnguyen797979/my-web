const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const slugify = require('slugify');

const app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-me-session-secret';
const dbPath = path.join(__dirname, 'data', 'site.json');

function readDb() {
  if (!fs.existsSync(dbPath)) seedDb();
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}
function writeDb(data) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}
function nextId(items) {
  return items.length ? Math.max(...items.map(x => x.id || 0)) + 1 : 1;
}
function slugifyValue(value) {
  return slugify(value || '', { lower: true, strict: true, locale: 'vi' }) || `item-${Date.now()}`;
}
function seedDb() {
  const now = new Date().toISOString();
  writeDb({
    settings: {
      site_name: 'ToolHub Pro',
      site_tagline: 'Homepage + tools + store + admin starter',
      hero_title: 'Bán sản phẩm số và tặng tool miễn phí để tăng tương tác',
      hero_subtitle: 'Một website đa công cụ với store, resources, blog, dashboard và admin để bạn gắn domain và dùng thật.',
      contact_email: 'support@example.com',
      telegram: '@yourtelegram',
      zalo: '0900000000',
      banner_cta_primary: '/store',
      banner_cta_secondary: '/tools/download-image'
    },
    homepage_sections: [
      { id: 1, name: 'featured-products', title: 'Sản phẩm nổi bật', subtitle: 'Các gói và dịch vụ chính bạn muốn đẩy bán.', is_visible: true, sort_order: 1 },
      { id: 2, name: 'free-tools', title: 'Công cụ miễn phí', subtitle: 'Các tool free để kéo traffic và giữ người dùng ở lại web.', is_visible: true, sort_order: 2 },
      { id: 3, name: 'resources', title: 'Tài nguyên số', subtitle: 'Preset, prompt, template, file tải về.', is_visible: true, sort_order: 3 },
      { id: 4, name: 'faq', title: 'Câu hỏi thường gặp', subtitle: 'Giải đáp nhanh cho khách trước khi mua.', is_visible: true, sort_order: 4 }
    ],
    tools: [
      { id: 1, name: 'Tool tải ảnh từ link', slug: 'download-image', description: 'Tool miễn phí giúp khách dán link web và lấy ảnh nhanh.', badge: 'Free', category: 'Downloader', is_visible: true, sort_order: 1 },
      { id: 2, name: 'Tool tải video từ link', slug: 'download-video', description: 'Trang giữ chỗ để sau này bạn thêm tool video.', badge: 'Soon', category: 'Downloader', is_visible: true, sort_order: 2 },
      { id: 3, name: 'Tool nén ảnh', slug: 'compress-image', description: 'Giảm dung lượng ảnh nhanh để giữ người dùng quay lại.', badge: 'Free', category: 'Image', is_visible: true, sort_order: 3 }
    ],
    products: [
      { id: 1, name: 'Gói dịch vụ chính 1', slug: 'goi-dich-vu-1', description: 'Mô tả ngắn về sản phẩm hoặc dịch vụ nổi bật của bạn.', price: '499.000đ', category: 'Service', badge: 'Hot', image_url: 'https://placehold.co/800x500?text=Service+1', is_visible: true, sort_order: 1 },
      { id: 2, name: 'Gói dịch vụ chính 2', slug: 'goi-dich-vu-2', description: 'Gói nâng cao dành cho khách cần nhiều quyền lợi hơn.', price: '999.000đ', category: 'Service', badge: 'Best Seller', image_url: 'https://placehold.co/800x500?text=Service+2', is_visible: true, sort_order: 2 },
      { id: 3, name: 'Gói VIP', slug: 'goi-vip', description: 'Gói cao cấp để làm nổi bật giá trị chính trên store.', price: '1.999.000đ', category: 'VIP', badge: 'VIP', image_url: 'https://placehold.co/800x500?text=VIP', is_visible: true, sort_order: 3 }
    ],
    resources: [
      { id: 1, name: 'Prompt Pack Vol 1', slug: 'prompt-pack-vol-1', description: 'Bộ prompt mẫu để bán kèm hoặc tặng khách.', price: '199.000đ', file_type: 'ZIP', badge: 'New', is_visible: true, sort_order: 1 },
      { id: 2, name: 'Template Kit', slug: 'template-kit', description: 'Bộ template dựng sẵn cho khách mua tải về.', price: '299.000đ', file_type: 'ZIP', badge: 'Popular', is_visible: true, sort_order: 2 },
      { id: 3, name: 'Preset Bundle', slug: 'preset-bundle', description: 'Preset đóng gói để bán như tài nguyên số.', price: '399.000đ', file_type: 'ZIP', badge: 'Hot', is_visible: true, sort_order: 3 }
    ],
    posts: [
      { id: 1, title: 'Cách dùng tool miễn phí để kéo traffic', slug: 'cach-dung-tool-free-de-keo-traffic', excerpt: 'Biến tool free thành phễu kéo khách về sản phẩm chính.', content: 'Nội dung mẫu: giải thích cách dùng tool miễn phí để tăng tương tác, SEO và giữ người dùng ở lại web lâu hơn.', is_visible: true, sort_order: 1, created_at: now },
      { id: 2, title: 'Xây store + tools trên cùng một domain', slug: 'xay-store-va-tools-tren-cung-domain', excerpt: 'Cách chia bố cục homepage, tools, store và admin rõ ràng.', content: 'Nội dung mẫu: gợi ý tổ chức menu, CTA, dashboard và admin để dễ phát triển về sau.', is_visible: true, sort_order: 2, created_at: now }
    ],
    orders: []
  });
}

function list(table) {
  return [...readDb()[table]].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0) || (b.id||0)-(a.id||0));
}
function findBy(table, key, value) {
  return readDb()[table].find(item => item[key] === value);
}
function mutate(mutator) {
  const data = readDb();
  mutator(data);
  writeDb(data);
  return data;
}
function requireAdmin(req, res, next) {
  if (!req.session.isAdmin) return res.redirect('/admin/login');
  next();
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 } }));
app.use((req, res, next) => { res.locals.site = readDb().settings; res.locals.isAdmin = Boolean(req.session.isAdmin); next(); });

app.get('/', (req, res) => {
  res.render('home', { sections: list('homepage_sections').filter(x=>x.is_visible), tools: list('tools').filter(x=>x.is_visible).slice(0,3), products: list('products').filter(x=>x.is_visible).slice(0,3), resources: list('resources').filter(x=>x.is_visible).slice(0,3), posts: list('posts').filter(x=>x.is_visible).slice(0,3) });
});
app.get('/tools', (req,res)=>res.render('tools',{ tools:list('tools').filter(x=>x.is_visible) }));
app.get('/tools/:slug', (req,res)=>{ const tool=findBy('tools','slug',req.params.slug); if(!tool) return res.status(404).render('404'); res.render('tool-detail',{tool}); });
app.get('/store', (req,res)=>res.render('store',{ products:list('products').filter(x=>x.is_visible) }));
app.get('/store/product/:slug', (req,res)=>{ const product=findBy('products','slug',req.params.slug); if(!product) return res.status(404).render('404'); res.render('product-detail',{product}); });
app.get('/resources', (req,res)=>res.render('resources',{ resources:list('resources').filter(x=>x.is_visible) }));
app.get('/resources/:slug', (req,res)=>{ const resource=findBy('resources','slug',req.params.slug); if(!resource) return res.status(404).render('404'); res.render('resource-detail',{resource}); });
app.get('/blog', (req,res)=>res.render('blog',{ posts:list('posts').filter(x=>x.is_visible) }));
app.get('/blog/:slug', (req,res)=>{ const post=findBy('posts','slug',req.params.slug); if(!post) return res.status(404).render('404'); res.render('post-detail',{post}); });
app.get('/pricing', (req,res)=>res.render('pricing',{ products:list('products').filter(x=>x.is_visible) }));
app.get('/contact', (req,res)=>res.render('contact'));
app.get('/dashboard', (req,res)=>res.render('dashboard',{ orders:list('orders') }));
app.post('/buy', (req,res)=>{
  const { customer_name, customer_email, item_type, item_name, amount } = req.body;
  if (!customer_name || !customer_email || !item_type || !item_name || !amount) return res.status(400).send('Thiếu thông tin');
  mutate(data => data.orders.unshift({ id: nextId(data.orders), customer_name, customer_email, item_type, item_name, amount, status: 'pending', created_at: new Date().toISOString() }));
  res.redirect('/dashboard');
});

app.get('/admin/login', (req,res)=>res.render('admin-login',{ error:null }));
app.post('/admin/login', (req,res)=>{ if(req.body.password !== ADMIN_PASSWORD) return res.status(401).render('admin-login',{ error:'Sai mật khẩu admin.' }); req.session.isAdmin=true; res.redirect('/admin'); });
app.post('/admin/logout', (req,res)=> req.session.destroy(()=>res.redirect('/admin/login')));
app.get('/admin', requireAdmin, (req,res)=>{ const data=readDb(); res.render('admin-dashboard',{ stats:{ tools:data.tools.length, products:data.products.length, resources:data.resources.length, posts:data.posts.length, orders:data.orders.length }, latestOrders:list('orders').slice(0,10) }); });
app.get('/admin/content', requireAdmin, (req,res)=>{ const data=readDb(); res.render('admin-content',{ settings:data.settings, sections:list('homepage_sections'), tools:list('tools'), products:list('products'), resources:list('resources'), posts:list('posts'), orders:list('orders') }); });
app.post('/admin/settings', requireAdmin, (req,res)=>{ mutate(data => { Object.entries(req.body).forEach(([k,v])=>data.settings[k]=String(v||'')); }); res.redirect('/admin/content'); });
app.post('/admin/item/:table/create', requireAdmin, (req,res)=>{
  const { table } = req.params; const p=req.body;
  mutate(data => {
    if (!data[table]) return;
    if (table === 'homepage_sections') data[table].push({ id: nextId(data[table]), name:p.name, title:p.title, subtitle:p.subtitle, is_visible:!!p.is_visible, sort_order:Number(p.sort_order||0) });
    if (table === 'tools') data[table].push({ id: nextId(data[table]), name:p.name, slug:slugifyValue(p.slug||p.name), description:p.description, badge:p.badge||'Free', category:p.category||'Utility', is_visible:!!p.is_visible, sort_order:Number(p.sort_order||0) });
    if (table === 'products') data[table].push({ id: nextId(data[table]), name:p.name, slug:slugifyValue(p.slug||p.name), description:p.description, price:p.price||'0đ', category:p.category||'Digital', badge:p.badge||'Hot', image_url:p.image_url||'https://placehold.co/800x500?text=Product', is_visible:!!p.is_visible, sort_order:Number(p.sort_order||0) });
    if (table === 'resources') data[table].push({ id: nextId(data[table]), name:p.name, slug:slugifyValue(p.slug||p.name), description:p.description, price:p.price||'0đ', file_type:p.file_type||'ZIP', badge:p.badge||'New', is_visible:!!p.is_visible, sort_order:Number(p.sort_order||0) });
    if (table === 'posts') data[table].push({ id: nextId(data[table]), title:p.title, slug:slugifyValue(p.slug||p.title), excerpt:p.excerpt, content:p.content, is_visible:!!p.is_visible, sort_order:Number(p.sort_order||0), created_at:new Date().toISOString() });
  });
  res.redirect('/admin/content');
});
app.post('/admin/item/:table/:id/update', requireAdmin, (req,res)=>{
  const { table, id } = req.params; const p=req.body;
  mutate(data => {
    const item = (data[table]||[]).find(x=>String(x.id)===String(id)); if(!item) return;
    if (table === 'homepage_sections') Object.assign(item, { name:p.name, title:p.title, subtitle:p.subtitle, is_visible:!!p.is_visible, sort_order:Number(p.sort_order||0) });
    if (table === 'tools') Object.assign(item, { name:p.name, slug:slugifyValue(p.slug||p.name), description:p.description, badge:p.badge, category:p.category, is_visible:!!p.is_visible, sort_order:Number(p.sort_order||0) });
    if (table === 'products') Object.assign(item, { name:p.name, slug:slugifyValue(p.slug||p.name), description:p.description, price:p.price, category:p.category, badge:p.badge, image_url:p.image_url, is_visible:!!p.is_visible, sort_order:Number(p.sort_order||0) });
    if (table === 'resources') Object.assign(item, { name:p.name, slug:slugifyValue(p.slug||p.name), description:p.description, price:p.price, file_type:p.file_type, badge:p.badge, is_visible:!!p.is_visible, sort_order:Number(p.sort_order||0) });
    if (table === 'posts') Object.assign(item, { title:p.title, slug:slugifyValue(p.slug||p.title), excerpt:p.excerpt, content:p.content, is_visible:!!p.is_visible, sort_order:Number(p.sort_order||0) });
  });
  res.redirect('/admin/content');
});
app.post('/admin/item/:table/:id/delete', requireAdmin, (req,res)=>{ mutate(data => { if (data[req.params.table]) data[req.params.table] = data[req.params.table].filter(x=>String(x.id)!==String(req.params.id)); }); res.redirect('/admin/content'); });
app.use((req,res)=>res.status(404).render('404'));
app.listen(PORT, HOST, ()=>console.log(`Server running at http://${HOST}:${PORT}`));
