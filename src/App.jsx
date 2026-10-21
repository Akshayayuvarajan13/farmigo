import { useEffect, useMemo, useState } from 'react';
import {
  Sprout, Search, Plus, ShoppingBasket, PackageCheck, Truck,
  LayoutDashboard, Leaf, ArrowUpRight, X, RefreshCw, MapPin,
  CalendarDays, Star, MessageSquare
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

const seedProducts = [
  { id: 'demo-1', name: 'Tomatoes', category: 'Vegetables', quantity: 180, unit: 'kg', price: 28, farmer_name: 'Green Valley Farm', location: 'Kanchipuram', delivery_date: '2026-10-23', emoji: '🍅' },
  { id: 'demo-2', name: 'Red Onions', category: 'Vegetables', quantity: 250, unit: 'kg', price: 32, farmer_name: 'Sunrise Organics', location: 'Chengalpattu', delivery_date: '2026-10-23', emoji: '🧅' },
  { id: 'demo-3', name: 'Potatoes', category: 'Vegetables', quantity: 300, unit: 'kg', price: 24, farmer_name: 'Green Valley Farm', location: 'Kanchipuram', delivery_date: '2026-10-24', emoji: '🥔' },
  { id: 'demo-4', name: 'Spinach', category: 'Leafy Greens', quantity: 65, unit: 'kg', price: 35, farmer_name: 'Fresh Roots Co-op', location: 'Tambaram', delivery_date: '2026-10-22', emoji: '🥬' },
  { id: 'demo-5', name: 'Carrots', category: 'Vegetables', quantity: 120, unit: 'kg', price: 42, farmer_name: 'Hilltop Produce', location: 'Vandalur', delivery_date: '2026-10-24', emoji: '🥕' },
  { id: 'demo-6', name: 'Bananas', category: 'Fruits', quantity: 200, unit: 'dozen', price: 48, farmer_name: 'Sunrise Organics', location: 'Chengalpattu', delivery_date: '2026-10-23', emoji: '🍌' },
  { id: 'demo-7', name: 'Brinjal', category: 'Vegetables', quantity: 95, unit: 'kg', price: 36, farmer_name: 'Green Valley Farm', location: 'Kanchipuram', delivery_date: '2026-10-24', emoji: '🍆' },
  { id: 'demo-8', name: 'Cabbage', category: 'Vegetables', quantity: 110, unit: 'kg', price: 26, farmer_name: 'Fresh Roots Co-op', location: 'Tambaram', delivery_date: '2026-10-23', emoji: '🥬' },
  { id: 'demo-9', name: 'Cauliflower', category: 'Vegetables', quantity: 75, unit: 'piece', price: 32, farmer_name: 'Hilltop Produce', location: 'Vandalur', delivery_date: '2026-10-24', emoji: '🥦' },
  { id: 'demo-10', name: 'Cucumber', category: 'Vegetables', quantity: 90, unit: 'kg', price: 30, farmer_name: 'Sunrise Organics', location: 'Chengalpattu', delivery_date: '2026-10-23', emoji: '🥒' },
  { id: 'demo-11', name: 'Green Chilli', category: 'Vegetables', quantity: 45, unit: 'kg', price: 55, farmer_name: 'Green Valley Farm', location: 'Kanchipuram', delivery_date: '2026-10-23', emoji: '🌶️' },
  { id: 'demo-12', name: 'Ladies Finger', category: 'Vegetables', quantity: 85, unit: 'kg', price: 40, farmer_name: 'Fresh Roots Co-op', location: 'Tambaram', delivery_date: '2026-10-24', emoji: '🥒' },
  { id: 'demo-13', name: 'Pumpkin', category: 'Vegetables', quantity: 130, unit: 'kg', price: 22, farmer_name: 'Hilltop Produce', location: 'Vandalur', delivery_date: '2026-10-25', emoji: '🎃' },
  { id: 'demo-14', name: 'Beetroot', category: 'Vegetables', quantity: 60, unit: 'kg', price: 34, farmer_name: 'Nature Farm', location: 'Chennai', delivery_date: '2026-10-24', emoji: '🫜' },
  { id: 'demo-15', name: 'Garlic', category: 'Vegetables', quantity: 55, unit: 'kg', price: 85, farmer_name: 'Nature Farm', location: 'Chennai', delivery_date: '2026-10-25', emoji: '🧄' },
  { id: 'demo-16', name: 'Drumstick', category: 'Vegetables', quantity: 70, unit: 'kg', price: 48, farmer_name: 'Sunrise Organics', location: 'Chengalpattu', delivery_date: '2026-10-24', emoji: '🥬' },
  { id: 'demo-17', name: 'Capsicum', category: 'Vegetables', quantity: 50, unit: 'kg', price: 62, farmer_name: 'Green Valley Farm', location: 'Kanchipuram', delivery_date: '2026-10-25', emoji: '🫑' },
  { id: 'demo-18', name: 'Radish', category: 'Vegetables', quantity: 65, unit: 'kg', price: 28, farmer_name: 'Fresh Roots Co-op', location: 'Tambaram', delivery_date: '2026-10-24', emoji: '🥕' }
];

const money = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const emojiFor = name => ({
  tomatoes: '🍅', onions: '🧅', potatoes: '🥔', spinach: '🥬',
  carrots: '🥕', bananas: '🍌', cabbage: '🥬', rice: '🌾',
  cucumber: '🥒', brinjal: '🍆', cauliflower: '🥦',
  'green chilli': '🌶️', 'ladies finger': '🥒', pumpkin: '🎃',
  beetroot: '🫜', garlic: '🧄', drumstick: '🥬',
  capsicum: '🫑', radish: '🥕'
}[String(name).toLowerCase()] || '🥦');

export default function App() {
  const [role, setRole] = useState('buyer');
  const [userName, setUserName] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [portalChoice, setPortalChoice] = useState('buyer');
  const [portalEntered, setPortalEntered] = useState(false);
  const [tab, setTab] = useState('Overview');

  const [products, setProducts] = useState(seedProducts);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [reports, setReports] = useState([]);

  const [address, setAddress] = useState({
    name: 'Campus Hostel', phone: '', line: '',
    area: 'Chennai', pincode: ''
  });

  const [ratingForm, setRatingForm] = useState({
    order_id: '', stars: '5', comment: ''
  });

  const [reportForm, setReportForm] = useState({
    order_id: '', reason: 'Late delivery', details: ''
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All produce');
  const [notice, setNotice] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showOrder, setShowOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newCrop, setNewCrop] = useState({
    name: '', category: 'Vegetables', quantity: '',
    unit: 'kg', price: '', farmer_name: 'My Farm',
    location: '', delivery_date: ''
  });

  const [orderForm, setOrderForm] = useState({
    buyer_name: 'Campus Hostel', quantity: '',
    delivery_date: '', address: '', preorder: false
  });

  async function loadData() {
    if (!isSupabaseConfigured) return;

    setLoading(true);

    const [p, o, f] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('feedback').select('*').order('created_at', { ascending: false })
    ]);

    if (!p.error && p.data) setProducts(p.data);
    if (!o.error && o.data) setOrders(o.data);

    if (!f.error && f.data) {
      setFeedback(f.data);
    } else if (f.error) {
      console.error('Feedback loading failed:', f.error.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => products.filter(p =>
    `${p.name} ${p.farmer_name} ${p.location}`
      .toLowerCase()
      .includes(search.toLowerCase()) &&
    (category === 'All produce' || p.category === category)
  ), [products, search, category]);

  const totalSupply = products.reduce(
    (sum, p) => sum + Number(p.quantity || 0), 0
  );

  const pendingOrders = orders.filter(
    o => !['Delivered', 'Cancelled'].includes(o.status)
  ).length;

  const totalOrderValue = orders.reduce(
    (sum, o) => sum + Number(o.total_price || 0), 0
  );

  async function addCrop(e) {
    e.preventDefault();

    const crop = {
      ...newCrop,
      quantity: Number(newCrop.quantity),
      price: Number(newCrop.price)
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .insert(crop)
        .select()
        .single();

      if (error) {
        setNotice(`Could not save crop: ${error.message}`);
        return;
      }

      setProducts(prev => [data, ...prev]);
    } else {
      setProducts(prev => [
        { ...crop, id: `demo-${Date.now()}`, emoji: emojiFor(crop.name) },
        ...prev
      ]);
    }

    setShowAdd(false);

    setNewCrop({
      name: '', category: 'Vegetables', quantity: '',
      unit: 'kg', price: '', farmer_name: 'My Farm',
      location: '', delivery_date: ''
    });

    setNotice('Crop listing added successfully.');
  }

  async function placeOrder(e) {
    e.preventDefault();

    const product = showOrder;
    const qty = Number(orderForm.quantity);

    if (!qty || qty <= 0 || qty > Number(product.quantity)) {
      setNotice(`Enter a quantity between 1 and ${product.quantity} ${product.unit}.`);
      return;
    }

    const record = {
      delivery_address: orderForm.address ||
        `${address.name}, ${address.line}, ${address.area} ${address.pincode}`.trim(),
      is_preorder: Boolean(orderForm.preorder),
      product_id: isSupabaseConfigured && !String(product.id).startsWith('demo-')
        ? product.id : null,
      product_name: product.name,
      buyer_name: orderForm.buyer_name,
      farmer_name: product.farmer_name,
      quantity: qty,
      unit: product.unit,
      total_price: qty * Number(product.price),
      delivery_date: orderForm.delivery_date || product.delivery_date || null,
      status: 'Requested'
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders').insert(record).select().single();

      if (error) {
        setNotice(`Could not place order: ${error.message}`);
        return;
      }

      setOrders(prev => [data, ...prev]);
    } else {
      setOrders(prev => [{
        ...record,
        id: `demo-order-${Date.now()}`,
        created_at: new Date().toISOString()
      }, ...prev]);
    }

    setProducts(prev => prev.map(p =>
      p.id === product.id
        ? { ...p, quantity: Number(p.quantity) - qty }
        : p
    ));

    setShowOrder(null);

    setOrderForm({
      buyer_name: 'Campus Hostel', quantity: '',
      delivery_date: '', address: '', preorder: false
    });

    setNotice('Bulk request placed! The farmer can now coordinate delivery.');
  }

  async function updateStatus(order, status) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', order.id);

      if (error) {
        setNotice(`Could not update order: ${error.message}`);
        return;
      }
    }

    setOrders(prev => prev.map(o =>
      o.id === order.id ? { ...o, status } : o
    ));

    setNotice(`Order marked ${status.toLowerCase()}.`);
  }

  function addToCart(product) {
    setCart(prev => {
      const found = prev.find(item => item.product.id === product.id);

      if (found) {
        return prev.map(item =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  Number(product.quantity),
                  item.quantity + 1
                )
              }
            : item
        );
      }

      return [...prev, { product, quantity: 1 }];
    });

    setNotice(`${product.name} added to your cart.`);
  }

  function updateCartQty(id, qty) {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== id));
    } else {
      setCart(prev => prev.map(item =>
        item.product.id === id
          ? {
              ...item,
              quantity: Math.min(Number(item.product.quantity), qty)
            }
          : item
      ));
    }
  }

  async function checkoutCart() {
    if (!address.line.trim() || !address.pincode.trim()) {
      setNotice('Please add a delivery address and PIN code in Addresses before checkout.');
      setTab('Addresses');
      return;
    }

    const items = [...cart];

    for (const item of items) {
      const product = item.product;

      const record = {
        product_id: isSupabaseConfigured && !String(product.id).startsWith('demo-')
          ? product.id : null,
        product_name: product.name,
        buyer_name: address.name || 'Consumer',
        farmer_name: product.farmer_name,
        quantity: item.quantity,
        unit: product.unit,
        total_price: item.quantity * Number(product.price),
        delivery_date: product.delivery_date || null,
        delivery_address: `${address.name}, ${address.line}, ${address.area}, ${address.pincode}`,
        is_preorder: false,
        status: 'Requested'
      };

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('orders').insert(record).select().single();

        if (error) {
          setNotice(`Checkout stopped: ${error.message}`);
          return;
        }

        setOrders(prev => [data, ...prev]);
      } else {
        setOrders(prev => [{
          ...record,
          id: `demo-order-${Date.now()}-${Math.random()}`,
          created_at: new Date().toISOString()
        }, ...prev]);
      }

      setProducts(prev => prev.map(p =>
        p.id === product.id
          ? { ...p, quantity: Math.max(0, Number(p.quantity) - item.quantity) }
          : p
      ));
    }

    setCart([]);
    setNotice('Checkout complete! Your orders are placed.');
    setTab('My Orders');
  }

  async function submitFeedback(e) {
    e.preventDefault();

    const order = orders.find(
      o => String(o.id) === String(ratingForm.order_id)
    );

    if (!order) {
      setNotice('Please select an order before submitting feedback.');
      return;
    }

    const record = {
      order_id: String(order.id),
      stars: Number(ratingForm.stars),
      comment: ratingForm.comment.trim(),
      buyer_name: order.buyer_name || userName || 'Customer',
      farmer_name: order.farmer_name || '',
      product_name: order.product_name || ''
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('feedback')
        .insert(record)
        .select()
        .single();

      if (error) {
        setNotice(`Could not save feedback: ${error.message}`);
        return;
      }

      setFeedback(prev => [data, ...prev]);
    } else {
      setFeedback(prev => [{
        ...record,
        id: Date.now(),
        created_at: new Date().toISOString()
      }, ...prev]);
    }

    setRatingForm({ order_id: '', stars: '5', comment: '' });
    setNotice('Thank you! Your customer feedback has been submitted.');
  }

  function submitReport(e) {
    e.preventDefault();

    setReports(prev => [{
      ...reportForm,
      id: Date.now(),
      created_at: new Date().toISOString(),
      status: 'Under review'
    }, ...prev]);

    setReportForm({
      order_id: '', reason: 'Late delivery', details: ''
    });

    setNotice('Report submitted to the Farmigo support team.');
  }

  const nav = role === 'farmer'
    ? [
        'Overview',
        'My Listings',
        'Incoming Orders',
        'Demand Board',
        'Customer Feedback'
      ]
    : [
        'Overview',
        'Browse Produce',
        'Cart',
        'My Orders',
        'Recommendations',
        'Addresses',
        'Ratings & Feedback',
        'Reports',
        'Demand Board'
      ];

  const activeNav = nav.includes(tab) ? tab : 'Overview';

  // Show feedback only for orders belonging to the selected farmer.
  const farmerFeedback = feedback.filter(f =>
    orders.some(o =>
      String(o.id) === String(f.order_id) &&
      String(o.farmer_name || '').trim().toLowerCase() ===
        String(f.farmer_name || '').trim().toLowerCase()
    )
  );

  if (!portalEntered) {
    return (
      <div className="login-screen">
        <section className="login-visual">
          <div className="login-brand">
            <img src="/farmigo-logo.png" alt="Farmigo logo" />
            <div><h1>Farmigo</h1><p>From Farm to You</p></div>
          </div>

          <div className="login-copy">
            <span>FRESH PRODUCE. HEALTHY FOOD.</span>
            <h2>A greener tomorrow starts with local farms.</h2>
            <p>Connect farmers and buyers with fresh produce, clear delivery updates and a simpler way to source food.</p>
            <div className="login-benefits">
              <span>🌿 Local farmers</span>
              <span>🥬 Fresh quality</span>
              <span>🚚 Direct delivery</span>
            </div>
          </div>

          <div className="login-photo-caption">
            Support farmers · Eat fresh · Build a better future
          </div>
        </section>

        <section className="login-panel">
          <div className="login-panel-inner">
            <div className="login-mobile-brand">
              <img src="/farmigo-logo.png" alt="" />
              <strong>Farmigo</strong>
              <small>From Farm to You</small>
            </div>

            <h2>Welcome to Farmigo</h2>
            <p className="login-subtitle">Choose your portal to continue</p>

            <div className="portal-cards">
              <button
                type="button"
                onClick={() => setPortalChoice('buyer')}
                className={`portal-card ${portalChoice === 'buyer' ? 'chosen' : ''}`}
              >
                <span className="portal-symbol">🛒</span>
                <strong>Buyer Portal</strong>
                <small>For hostels, cafeterias and food buyers</small>
              </button>

              <button
                type="button"
                onClick={() => setPortalChoice('farmer')}
                className={`portal-card ${portalChoice === 'farmer' ? 'chosen' : ''}`}
              >
                <span className="portal-symbol">🌱</span>
                <strong>Farmer Portal</strong>
                <small>For farmers and produce suppliers</small>
              </button>
            </div>

            <form
              className="login-form"
              onSubmit={e => {
                e.preventDefault();
                if (!loginName.trim() || !loginPassword) return;
                setUserName(loginName.trim());
                setRole(portalChoice);
                setTab('Overview');
                setPortalEntered(true);
                setNotice(`Welcome, ${loginName.trim()}! You are signed into the ${portalChoice} demo portal.`);
              }}
            >
              <label>
                Username
                <input
                  required
                  autoComplete="username"
                  value={loginName}
                  onChange={e => setLoginName(e.target.value)}
                  placeholder={portalChoice === 'farmer' ? 'Enter farmer username' : 'Enter buyer username'}
                />
              </label>

              <label>
                Password
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </label>

              <button className="login-submit" type="submit">
                Login to {portalChoice === 'buyer' ? 'Buyer' : 'Farmer'} Portal <span>→</span>
              </button>
            </form>

            <p className="login-demo-note">
              Demo preview: username and password are required to enter.
              Secure account verification must be enabled with Supabase Auth before public launch.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={e => {
            e.preventDefault();
            setTab('Overview');
          }}
        >
          <span className="brand-mark logo-image">
            <img src="/farmigo-logo.png" alt="Farmigo leaf shopping cart logo" />
          </span>
          <span>Farmigo<small>FROM FARM TO YOU</small></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-label role-locked">
          {role === 'farmer' ? 'FARMER PORTAL' : 'BUYER PORTAL'}
        </div>
        <div className="nav-label">MENU</div>

        {nav.map((item, i) => (
          <button
            key={item}
            className={`nav-item ${activeNav === item ? 'selected' : ''}`}
            onClick={() => setTab(item)}
          >
            {i === 0 ? <LayoutDashboard size={18} /> :
              item === 'Demand Board' ? <ArrowUpRight size={18} /> :
              item === 'Customer Feedback' ? <MessageSquare size={18} /> :
              i === 1 ? <Leaf size={18} /> :
              <PackageCheck size={18} />}
            <span>{item}</span>
            {item.includes('Orders') && orders.length > 0 &&
              <span className="nav-count">{orders.length}</span>}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="season-card">
            <span className="season-icon">🌱</span>
            <strong>Grow local. Eat fresh.</strong>
            <p>Better connections make better meals.</p>
          </div>

          <div className="user-mini">
            <div className="avatar">{role === 'farmer' ? 'F' : 'H'}</div>
            <div>
              <strong>{userName || (role === 'farmer' ? 'Farm partner' : 'Hostel kitchen')}</strong>
              <small>{role === 'farmer' ? 'Farmer portal' : 'Buyer portal'}</small>
            </div>
            <span className="online-dot" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activeNav}</strong>
          </div>

          <div className="topbar-right">
            <span className={`connection-pill ${isSupabaseConfigured ? 'connected' : ''}`}>
              <span /> {isSupabaseConfigured ? 'Database connected' : 'Preview mode'}
            </span>

            <button
              className="cart-shortcut"
              onClick={() => {
                if (role === 'buyer') setTab('Cart');
              }}
              title="Open cart"
              disabled={role !== 'buyer'}
            >
              <ShoppingBasket size={17} /> Cart
              <b>{cart.reduce((sum, item) => sum + item.quantity, 0)}</b>
            </button>

            <button
              className="icon-btn"
              title="Refresh data"
              onClick={loadData}
            >
              <RefreshCw size={17} className={loading ? 'spin' : ''} />
            </button>

            <button
              className="top-avatar"
              title="Switch user / portal"
              onClick={() => {
                setLoginName(userName);
                setLoginPassword('');
                setPortalChoice(role);
                setPortalEntered(false);
              }}
            >
              {(userName || (role === 'farmer' ? 'F' : 'B')).slice(0, 1).toUpperCase()}
            </button>
          </div>
        </header>

        <div className="page-content">
          {notice && (
            <div className="notice">
              <span>{notice}</span>
              <button onClick={() => setNotice('')}><X size={16} /></button>
            </div>
          )}

          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" /> YOUR LOCAL FOOD NETWORK
              </div>
              <h1>
                {activeNav === 'Overview'
                  ? (role === 'farmer' ? 'Good morning, farmer.' : 'Fresh food, smarter sourcing.')
                  : activeNav}
              </h1>
              <p className="welcome-sub">
                {role === 'farmer'
                  ? 'Share your harvest with the kitchens that feed your community.'
                  : 'Source fresh produce directly from local farms, without the middlemen.'}
              </p>
            </div>
            <div className="date-chip"><CalendarDays size={16} /> October 2026</div>
          </section>

          {activeNav === 'Overview' && (
            <>
              <div className="stat-grid">
                <Stat icon={<Leaf size={20} />} label="Available supply" value={`${totalSupply.toLocaleString()} kg`} note={`${products.length} crop listings`} tone="green" />
                <Stat icon={<ShoppingBasket size={20} />} label="Active requests" value={pendingOrders} note="Awaiting fulfilment" tone="gold" />
                <Stat icon={<Truck size={20} />} label="Orders placed" value={orders.length} note="Across your network" tone="blue" />
                <Stat icon={<ArrowUpRight size={20} />} label="Order value" value={money(totalOrderValue)} note="Requested produce value" tone="purple" />
              </div>

              <div className="section-heading">
                <div>
                  <h2>{role === 'farmer' ? 'Your harvest at a glance' : 'Available fresh produce'}</h2>
                  <p>{role === 'farmer' ? 'What your local network can source today.' : 'Fresh from nearby farms, ready for your kitchen.'}</p>
                </div>
                <button className="text-button" onClick={() => setTab(role === 'farmer' ? 'My Listings' : 'Browse Produce')}>
                  View all <ArrowUpRight size={15} />
                </button>
              </div>

              <ProductGrid
                products={filtered.slice(0, 3)}
                role={role}
                onOrder={p => {
                  setShowOrder(p);
                  setOrderForm(f => ({ ...f, quantity: '', preorder: false }));
                }}
                onAddToCart={addToCart}
                onAdd={() => setShowAdd(true)}
              />

              <div className="section-heading order-heading">
                <div>
                  <h2>Most ordered vegetables</h2>
                  <p>Popular picks in this demo catalogue, ranked by sample order activity.</p>
                </div>
                <button className="text-button" onClick={() => setTab('Demand Board')}>
                  View demand <ArrowUpRight size={15} />
                </button>
              </div>

              <div className="popular-grid">
                {products
                  .filter(p => p.category === 'Vegetables' || p.category === 'Leafy Greens')
                  .slice()
                  .sort((a, b) =>
                    Number(b.popularity || ({ Tomatoes: 120, Potatoes: 105, 'Red Onions': 98, Carrots: 76, Spinach: 62, Brinjal: 58 }[b.name] || 20)) -
                    Number(a.popularity || ({ Tomatoes: 120, Potatoes: 105, 'Red Onions': 98, Carrots: 76, Spinach: 62, Brinjal: 58 }[a.name] || 20))
                  )
                  .slice(0, 5)
                  .map((p, i) => (
                    <article className="popular-item" key={p.id}>
                      <span className="popular-rank">#{i + 1}</span>
                      <span className="popular-emoji">{p.emoji || emojiFor(p.name)}</span>
                      <div>
                        <strong>{p.name}</strong>
                        <small>{({ Tomatoes: '120 sample orders', Potatoes: '105 sample orders', 'Red Onions': '98 sample orders', Carrots: '76 sample orders', Spinach: '62 sample orders' }[p.name] || 'Popular local produce')}</small>
                      </div>
                      <b>{money(p.price)}/{p.unit}</b>
                    </article>
                  ))}
              </div>

              <div className="section-heading order-heading">
                <div>
                  <h2>Recent order activity</h2>
                  <p>Keep track of requests and delivery progress.</p>
                </div>
                <button className="text-button" onClick={() => setTab(role === 'farmer' ? 'Incoming Orders' : 'My Orders')}>
                  All orders <ArrowUpRight size={15} />
                </button>
              </div>

              <OrderTable orders={orders.slice(0, 4)} role={role} onStatus={updateStatus} />
            </>
          )}

          {(activeNav === 'Browse Produce' || activeNav === 'My Listings') && (
            <>
              <div className="toolbar">
                <div className="searchbox">
                  <Search size={17} />
                  <input
                    placeholder="Search crops, farms, locations..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>

                <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option>All produce</option>
                  <option>Vegetables</option>
                  <option>Leafy Greens</option>
                  <option>Fruits</option>
                  <option>Grains</option>
                </select>

                {role === 'farmer' && (
                  <button className="primary-btn" onClick={() => setShowAdd(true)}>
                    <Plus size={17} /> Add listing
                  </button>
                )}
              </div>

              <ProductGrid
                products={filtered}
                role={role}
                onOrder={p => {
                  setShowOrder(p);
                  setOrderForm(f => ({ ...f, quantity: '', preorder: false }));
                }}
                onAddToCart={addToCart}
                onAdd={() => setShowAdd(true)}
              />

              {filtered.length === 0 && <div className="empty-state">No produce found. Try a different search.</div>}
            </>
          )}

          {activeNav === 'Demand Board' && (
            <>
              <div className="demand-intro">
                <div>
                  <span className="eyebrow"><span className="eyebrow-line" /> SUPPLY MEETS DEMAND</span>
                  <h2>Plan the next harvest and delivery</h2>
                  <p>Compare available listed stock with open bulk requests to spot shortages and surplus.</p>
                </div>
                <div className="demand-summary">
                  <span>Open requests</span>
                  <strong>{orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length}</strong>
                </div>
              </div>

              <div className="demand-grid">
                {[...new Set([
                  ...products.map(p => p.name),
                  ...orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).map(o => o.product_name)
                ])].map(cropName => {
                  const cropProducts = products.filter(p => p.name === cropName);
                  const openOrders = orders.filter(o => o.product_name === cropName && !['Delivered', 'Cancelled'].includes(o.status));
                  const supply = cropProducts.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
                  const demand = openOrders.reduce((sum, o) => sum + Number(o.quantity || 0), 0);
                  const unit = cropProducts[0]?.unit || openOrders[0]?.unit || 'kg';
                  const covered = demand === 0 ? 100 : Math.min(100, Math.round(supply / demand * 100));
                  const shortage = Math.max(0, demand - supply);
                  const surplus = Math.max(0, supply - demand);

                  return (
                    <article className="demand-card" key={cropName}>
                      <div className="demand-card-head">
                        <span className="demand-emoji">{emojiFor(cropName)}</span>
                        <div className="demand-crop">
                          <h3>{cropName}</h3>
                          <small>{cropProducts.length} supplier listing{cropProducts.length === 1 ? '' : 's'}</small>
                        </div>
                        <span className={`status-badge ${shortage ? 'requested' : 'accepted'}`}>
                          {shortage ? 'Shortage' : demand ? 'Covered' : 'Available'}
                        </span>
                      </div>

                      <div className="demand-numbers">
                        <div><small>Available supply</small><strong>{supply.toLocaleString()} <small>{unit}</small></strong></div>
                        <div><small>Open demand</small><strong>{demand.toLocaleString()} <small>{unit}</small></strong></div>
                      </div>

                      <div className="demand-progress"><div style={{ width: `${covered}%` }} /></div>

                      <div className="demand-foot">
                        <span>{demand ? `${covered}% of demand covered` : 'No open requests yet'}</span>
                        <strong className={shortage ? 'shortage-text' : 'surplus-text'}>
                          {shortage ? `${shortage} ${unit} needed` : surplus ? `${surplus} ${unit} surplus` : 'Balanced'}
                        </strong>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="demand-note">
                <Leaf size={18} />
                <div>
                  <strong>How to use this board</strong>
                  <p>Use shortages to prioritize sourcing and surplus to identify crops that may need more buyers. Figures update from product listings and orders in this workspace.</p>
                </div>
              </div>
            </>
          )}

          {(activeNav === 'My Orders' || activeNav === 'Incoming Orders') && (
            <div className="table-card">
              <OrderTable orders={orders} role={role} onStatus={updateStatus} />
              {orders.length === 0 && (
                <div className="empty-state">
                  No orders yet. {role === 'buyer'
                    ? 'Browse produce to place your first bulk request.'
                    : 'Orders from buyers will appear here.'}
                </div>
              )}
            </div>
          )}

          {activeNav === 'Cart' && (
            <>
              <div className="section-heading">
                <div><h2>Your shopping cart</h2><p>Review quantities before placing your order.</p></div>
                <button className="text-button" onClick={() => setTab('Browse Produce')}>Continue shopping</button>
              </div>

              {cart.length === 0 ? (
                <div className="empty-state">Your cart is empty. Browse produce and add items to your cart.</div>
              ) : (
                <div className="table-card">
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr><th>Produce</th><th>Farm / Region</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th /></tr>
                      </thead>
                      <tbody>
                        {cart.map(item => (
                          <tr key={item.product.id}>
                            <td>{emojiFor(item.product.name)} {item.product.name}</td>
                            <td>{item.product.farmer_name} · {item.product.location}</td>
                            <td>{money(item.product.price)}/{item.product.unit}</td>
                            <td>
                              <input
                                aria-label="Cart quantity"
                                type="number"
                                min="1"
                                max={item.product.quantity}
                                value={item.quantity}
                                onChange={e => updateCartQty(item.product.id, Number(e.target.value))}
                                style={{ width: 70, padding: 7 }}
                              />
                            </td>
                            <td>{money(item.product.price * item.quantity)}</td>
                            <td><button className="secondary-btn" onClick={() => updateCartQty(item.product.id, 0)}>Remove</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="cart-checkout">
                    <span>Cart total <strong>{money(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0))}</strong></span>
                    <button className="primary-btn" onClick={checkoutCart}>Checkout & deliver to address →</button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeNav === 'Recommendations' && (
            <>
              <div className="demand-intro">
                <div>
                  <span className="eyebrow"><span className="eyebrow-line" /> PERSONALIZED BUYING</span>
                  <h2>Suggestions for your next order</h2>
                  <p>Uses your order history in this session to suggest frequently purchased produce and useful nearby alternatives.</p>
                </div>
              </div>

              <div className="demand-grid">
                <article className="demand-card">
                  <h3>Based on your purchase history</h3>
                  <p>{orders.length ? `You have ${orders.length} order(s) in this session. Consider replenishing items you have ordered before.` : 'Your purchase history will build as you place orders.'}</p>
                  {[...new Set(orders.map(o => o.product_name))].slice(0, 4).map(name => {
                    const product = products.find(p => p.name === name);
                    return (
                      <div className="demand-row" key={name}>
                        <span><strong>{emojiFor(name)} {name}</strong><small>Previously ordered</small></span>
                        {product
                          ? <button className="secondary-btn" onClick={() => addToCart(product)}>Add to cart</button>
                          : <small>Not currently listed</small>}
                      </div>
                    );
                  })}
                  {orders.length === 0 && <div className="empty-state">Place your first order and we'll start showing history-based suggestions.</div>}
                </article>

                <article className="demand-card">
                  <h3>Available near your selected region</h3>
                  <p>Current demo location: {address.area || 'Choose an area in Addresses'}.</p>
                  {products.filter(p => !address.area || p.location.toLowerCase().includes(address.area.toLowerCase()) || p.location.toLowerCase().includes('chennai')).slice(0, 5).map(p => (
                    <div className="demand-row" key={p.id}>
                      <span><strong>{emojiFor(p.name)} {p.name}</strong><small>{p.location} · {p.quantity} {p.unit} available</small></span>
                      <button className="secondary-btn" onClick={() => addToCart(p)}>Add</button>
                    </div>
                  ))}
                </article>
              </div>
            </>
          )}

          {activeNav === 'Addresses' && (
            <div className="table-card address-card">
              <h2>Delivery address</h2>
              <p>Save where you want Farmigo orders delivered.</p>

              <form className="modal-form" onSubmit={e => {
                e.preventDefault();
                setNotice('Delivery address saved for this session.');
              }}>
                <label>Recipient / hostel name
                  <input required value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} />
                </label>
                <label>Phone number
                  <input value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} placeholder="Contact number" />
                </label>
                <label>Door no., street and landmark
                  <input required value={address.line} onChange={e => setAddress({ ...address, line: e.target.value })} placeholder="House / hostel address" />
                </label>
                <div className="form-row">
                  <label>Area / town
                    <input required value={address.area} onChange={e => setAddress({ ...address, area: e.target.value })} placeholder="Chennai, Tambaram..." />
                  </label>
                  <label>PIN code
                    <input required value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} placeholder="6-digit PIN" maxLength="6" />
                  </label>
                </div>
                <button className="primary-btn" type="submit">Save delivery address</button>
              </form>

              <div className="demand-note">
                <MapPin size={18} />
                <div><strong>Delivery coverage</strong><p>Search products by region in Browse Produce. Availability and delivery dates are demo listings and must be confirmed by the farmer.</p></div>
              </div>
            </div>
          )}

          {activeNav === 'Ratings & Feedback' && role === 'buyer' && (
            <div className="demand-grid">
              <article className="demand-card">
                <h3>Rate a completed order</h3>
                <p>Share feedback on produce quality, packing and delivery experience.</p>

                <form className="modal-form" onSubmit={submitFeedback}>
                  <label>Order
                    <select required value={ratingForm.order_id} onChange={e => setRatingForm({ ...ratingForm, order_id: e.target.value })}>
                      <option value="">Choose an order</option>
                      {orders.map(o => <option key={o.id} value={o.id}>{o.id} · {o.product_name}</option>)}
                    </select>
                  </label>

                  <label>Rating
                    <select value={ratingForm.stars} onChange={e => setRatingForm({ ...ratingForm, stars: e.target.value })}>
                      <option value="5">★★★★★ — Excellent</option>
                      <option value="4">★★★★☆ — Good</option>
                      <option value="3">★★★☆☆ — Average</option>
                      <option value="2">★★☆☆☆ — Poor</option>
                      <option value="1">★☆☆☆☆ — Very poor</option>
                    </select>
                  </label>

                  <label>Customer feedback
                    <textarea required value={ratingForm.comment} onChange={e => setRatingForm({ ...ratingForm, comment: e.target.value })} placeholder="Tell us about freshness, quality or delivery" rows="3" />
                  </label>

                  <button className="primary-btn" type="submit">Submit feedback</button>
                </form>
              </article>

              <article className="demand-card">
                <h3>Your submitted feedback</h3>
                {feedback.filter(f => f.buyer_name === userName).length === 0
                  ? <div className="empty-state">No feedback submitted yet.</div>
                  : feedback.filter(f => f.buyer_name === userName).map(f => (
                    <div className="demand-row" key={f.id}>
                      <div>
                        <strong>{'★'.repeat(Number(f.stars))}{'☆'.repeat(5 - Number(f.stars))} · {f.product_name}</strong>
                        <small>{f.comment}</small>
                      </div>
                    </div>
                  ))}
              </article>
            </div>
          )}

          {activeNav === 'Customer Feedback' && role === 'farmer' && (
            <section className="demand-grid">
              <article className="demand-card">
                <div className="section-heading">
                  <div>
                    <h2><MessageSquare size={20} /> Customer Feedback</h2>
                    <p>View ratings and comments submitted for your orders.</p>
                  </div>
                  <button className="secondary-btn" onClick={loadData}>
                    <RefreshCw size={15} /> Refresh
                  </button>
                </div>

                <div className="demand-numbers">
                  <div>
                    <small>Total feedback</small>
                    <strong>{farmerFeedback.length}</strong>
                  </div>
                  <div>
                    <small>Average rating</small>
                    <strong>
                      {farmerFeedback.length
                        ? (farmerFeedback.reduce((sum, f) => sum + Number(f.stars || 0), 0) / farmerFeedback.length).toFixed(1)
                        : '—'} <Star size={15} fill="currentColor" />
                    </strong>
                  </div>
                </div>

                {farmerFeedback.length === 0 ? (
                  <div className="empty-state">
                    <MessageSquare size={28} />
                    <h3>No customer feedback yet</h3>
                    <p>When a customer submits feedback for an order linked to your farm, it will appear here.</p>
                  </div>
                ) : (
                  farmerFeedback.map(f => (
                    <div className="demand-row" key={f.id}>
                      <div>
                        <strong>
                          {f.product_name || 'Produce'} · {'★'.repeat(Number(f.stars || 0))}
                          {'☆'.repeat(5 - Number(f.stars || 0))}
                        </strong>
                        <small>Customer: {f.buyer_name || 'Customer'}</small>
                        <p>{f.comment}</p>
                        <small>
                          {f.created_at ? new Date(f.created_at).toLocaleDateString() : ''}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </article>
            </section>
          )}

          {activeNav === 'Reports' && role === 'buyer' && (
            <div className="demand-grid">
              <article className="demand-card">
                <h3>Report an order or issue</h3>
                <p>Report late delivery, damaged produce, incorrect quantity or a safety concern.</p>

                <form className="modal-form" onSubmit={submitReport}>
                  <label>Related order (optional)
                    <select value={reportForm.order_id} onChange={e => setReportForm({ ...reportForm, order_id: e.target.value })}>
                      <option value="">General issue</option>
                      {orders.map(o => <option key={o.id} value={o.id}>{o.id} · {o.product_name}</option>)}
                    </select>
                  </label>

                  <label>Issue type
                    <select value={reportForm.reason} onChange={e => setReportForm({ ...reportForm, reason: e.target.value })}>
                      {['Late delivery', 'Damaged or poor-quality produce', 'Wrong quantity', 'Payment issue', 'Farmer / buyer conduct', 'Other'].map(x => <option key={x}>{x}</option>)}
                    </select>
                  </label>

                  <label>Details
                    <textarea required rows="3" value={reportForm.details} onChange={e => setReportForm({ ...reportForm, details: e.target.value })} placeholder="Describe the issue and what help you need" />
                  </label>

                  <button className="primary-btn" type="submit">Submit report</button>
                </form>
              </article>

              <article className="demand-card">
                <h3>Submitted reports</h3>
                {reports.length === 0
                  ? <div className="empty-state">No reports submitted. Any reports you submit will appear here.</div>
                  : reports.map(r => (
                    <div className="demand-row" key={r.id}>
                      <div><strong>{r.reason}</strong><small>{r.order_id || 'General report'} · {r.details}</small></div>
                      <span className="status-badge requested">{r.status}</span>
                    </div>
                  ))}
              </article>
            </div>
          )}
        </div>

        <footer>
          <span>© 2026 Farmigo</span>
          <span><span className="footer-dot" /> From Farm to You</span>
        </footer>
      </main>

      {showAdd && (
        <Modal
          title="Add a crop listing"
          subtitle="Tell local kitchens what you have available."
          onClose={() => setShowAdd(false)}
        >
          <form className="modal-form" onSubmit={addCrop}>
            <label>Crop name
              <input required value={newCrop.name} onChange={e => setNewCrop({ ...newCrop, name: e.target.value })} placeholder="e.g. Fresh tomatoes" />
            </label>

            <div className="form-row">
              <label>Category
                <select value={newCrop.category} onChange={e => setNewCrop({ ...newCrop, category: e.target.value })}>
                  <option>Vegetables</option><option>Leafy Greens</option><option>Fruits</option><option>Grains</option>
                </select>
              </label>
              <label>Unit
                <select value={newCrop.unit} onChange={e => setNewCrop({ ...newCrop, unit: e.target.value })}>
                  <option>kg</option><option>dozen</option><option>bag</option><option>crate</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>Quantity available
                <input type="number" min="1" required value={newCrop.quantity} onChange={e => setNewCrop({ ...newCrop, quantity: e.target.value })} placeholder="e.g. 100" />
              </label>
              <label>Price per unit (₹)
                <input type="number" min="1" required value={newCrop.price} onChange={e => setNewCrop({ ...newCrop, price: e.target.value })} placeholder="e.g. 30" />
              </label>
            </div>

            <label>Farm / supplier name
              <input required value={newCrop.farmer_name} onChange={e => setNewCrop({ ...newCrop, farmer_name: e.target.value })} />
            </label>
            <label>Location
              <input required value={newCrop.location} onChange={e => setNewCrop({ ...newCrop, location: e.target.value })} placeholder="Town or district" />
            </label>
            <label>Earliest delivery date
              <input type="date" value={newCrop.delivery_date} onChange={e => setNewCrop({ ...newCrop, delivery_date: e.target.value })} />
            </label>
            <button className="primary-btn full-btn" type="submit"><Plus size={17} /> Publish listing</button>
          </form>
        </Modal>
      )}

      {showOrder && (
        <Modal
          title={`Request ${showOrder.name}`}
          subtitle={`From ${showOrder.farmer_name} · ${money(showOrder.price)} per ${showOrder.unit}`}
          onClose={() => setShowOrder(null)}
        >
          <form className="modal-form" onSubmit={placeOrder}>
            <div className="order-product-summary">
              <span>{showOrder.emoji || emojiFor(showOrder.name)}</span>
              <div><strong>{showOrder.name}</strong><small>{showOrder.quantity} {showOrder.unit} available</small></div>
              <strong>{money(showOrder.price)}/{showOrder.unit}</strong>
            </div>

            <label>Hostel / cafeteria name
              <input required value={orderForm.buyer_name} onChange={e => setOrderForm({ ...orderForm, buyer_name: e.target.value })} />
            </label>
            <label>Quantity needed ({showOrder.unit})
              <input type="number" min="1" max={showOrder.quantity} required value={orderForm.quantity} onChange={e => setOrderForm({ ...orderForm, quantity: e.target.value })} placeholder={`Up to ${showOrder.quantity}`} />
            </label>
            <label>Preferred delivery date
              <input type="date" value={orderForm.delivery_date} onChange={e => setOrderForm({ ...orderForm, delivery_date: e.target.value })} />
            </label>
            <label>Delivery address
              <input value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })} placeholder={address.line ? `${address.line}, ${address.area}` : 'Add your delivery address in Addresses'} />
            </label>
            <label className="preorder-check">
              <input type="checkbox" checked={Boolean(orderForm.preorder)} onChange={e => setOrderForm({ ...orderForm, preorder: e.target.checked })} />
              This is a preorder for a future harvest / delivery date
            </label>

            {Number(orderForm.quantity) > 0 && (
              <div className="total-line">
                <span>Estimated total</span>
                <strong>{money(Number(orderForm.quantity) * Number(showOrder.price))}</strong>
              </div>
            )}

            <button className="primary-btn full-btn" type="submit"><ShoppingBasket size={17} /> Place bulk request</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Stat({ icon, label, value, note, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-note">{note}</span>
    </div>
  );
}

function ProductGrid({ products, role, onOrder, onAdd, onAddToCart }) {
  return (
    <div className="product-grid">
      {products.map((p, i) => (
        <article className="product-card" key={p.id}>
          <div className={`product-art art-${i % 4}`}>
            <span className="produce-emoji">{p.emoji || emojiFor(p.name)}</span>
            <span className="fresh-tag"><span /> Fresh harvest</span>
            <span className="category-tag">{p.category}</span>
          </div>

          <div className="product-info">
            <div className="product-title-row">
              <h3>{p.name}</h3>
              <strong>{money(p.price)}<small> / {p.unit}</small></strong>
            </div>

            <div className="farmer-line">
              <span className="mini-farm-icon"><Sprout size={14} /></span>
              <span>{p.farmer_name || 'Local farm'}</span>
            </div>

            <div className="product-meta">
              <span><PackageCheck size={14} />{Number(p.quantity).toLocaleString()} {p.unit} available</span>
              <span><MapPin size={14} />{p.location || 'Local'}</span>
            </div>

            {p.delivery_date && <div className="delivery-line"><CalendarDays size={14} /> Delivery: {p.delivery_date}</div>}

            <button
              className={role === 'farmer' ? 'secondary-btn product-action' : 'primary-btn product-action'}
              onClick={() => role === 'farmer' ? onAdd() : onOrder(p)}
            >
              {role === 'farmer'
                ? <><Plus size={15} /> Add another listing</>
                : <><ShoppingBasket size={15} /> Preorder / Buy</>}
            </button>

            {role !== 'farmer' && (
              <button className="secondary-btn product-action" onClick={() => onAddToCart(p)}>
                <ShoppingBasket size={15} /> Add to cart
              </button>
            )}
          </div>
        </article>
      ))}

      {role === 'farmer' && (
        <button className="add-product-card" onClick={onAdd}>
          <span><Plus size={24} /></span>
          <strong>Add a new crop</strong>
          <small>List your available harvest</small>
        </button>
      )}
    </div>
  );
}

function OrderTable({ orders, role, onStatus }) {
  if (!orders.length) {
    return <div className="empty-state">Your order activity will appear here once a bulk request is placed.</div>;
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>PRODUCE</th>
            <th>{role === 'farmer' ? 'BUYER' : 'SUPPLIER'}</th>
            <th>QUANTITY</th>
            <th>ORDER VALUE</th>
            <th>STATUS</th>
            {role === 'farmer' && <th>ACTION</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>
                <div className="table-product">
                  <span>{emojiFor(o.product_name)}</span>
                  <strong>{o.product_name}</strong>
                </div>
              </td>
              <td>{role === 'farmer' ? o.buyer_name : o.farmer_name}</td>
              <td>{o.quantity} {o.unit || 'kg'}</td>
              <td className="price-cell">{money(o.total_price)}</td>
              <td><span className={`status-badge ${(o.status || 'Requested').toLowerCase().replace(/\s/g, '-')}`}>{o.status || 'Requested'}</span></td>
              {role === 'farmer' && (
                <td>
                  <select className="status-select" value={o.status || 'Requested'} onChange={e => onStatus(o, e.target.value)}>
                    <option>Requested</option><option>Accepted</option><option>Preparing</option><option>Dispatched</option><option>Delivered</option><option>Cancelled</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="modal-backdrop" onMouseDown={e => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <section className="modal">
        <div className="modal-head">
          <div><h2>{title}</h2><p>{subtitle}</p></div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}