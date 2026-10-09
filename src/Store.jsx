import { useEffect, useState } from 'react';
import Academy from './App.jsx';
import './Store.css';
const api = (import.meta.env.VITE_SHOP_API_URL || '').replace(/\/$/, '');
const samples = [
  {
    "id": "facial-machine",
    "name": "Multifunction Facial Machine",
    "priceCents": 1250000,
    "description": "A facial machine with a touchscreen, multiple handpieces, solution bottles, and an LED face mask. Included accessories and specifications will be confirmed.",
    "category": "Equipment",
    "image": "facial-machine.png"
  },
  {
    "id": "lipo-lab",
    "name": "Lipo Lab — Single Bottle",
    "priceCents": 35000,
    "description": "One bottle of Lipo Lab PPC Solution. Sold individually; each quantity in your cart represents one bottle. Bottle size and full product details will be confirmed.",
    "category": "Beauty Products",
    "image": "lipo-lab.png"
  },
  {
    "id": "j-pro-cream",
    "name": "J-PRO Cream — 10g",
    "priceCents": 15000,
    "description": "A 10g tube of J-PRO cream supplied in its retail packaging. Ingredients and directions will be confirmed from the supplier documentation.",
    "category": "Beauty Products",
    "image": "j-pro-cream.png"
  }
].map(p => ({...p, image: `${import.meta.env.BASE_URL}images/products/${p.image}`}));
const money = n => new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR'}).format(n/100);
function readCart(){try{const a=JSON.parse(localStorage.getItem('glamco-cart')||'[]');return Array.isArray(a)?a.filter(x=>typeof x.id==='string'&&Number.isInteger(x.quantity)&&x.quantity>0&&x.quantity<=99):[]}catch{return []}}
export default function Store(){
 const [route,setRoute]=useState(location.hash.slice(1));
 const [products,setProducts]=useState(samples),[cart,setCart]=useState(readCart),[error,setError]=useState(''),[busy,setBusy]=useState(false),[ready,setReady]=useState(false),[status,setStatus]=useState('');
 const [toast,setToast]=useState(null),[toastPaused,setToastPaused]=useState(false);
 useEffect(()=>{if(!toast||toastPaused)return;const timer=setTimeout(()=>setToast(null),4000);return()=>clearTimeout(timer)},[toast,toastPaused]);
 useEffect(()=>{const f=()=>{setRoute(location.hash.slice(1));setError('');setStatus('');setToast(null);setToastPaused(false);window.scrollTo(0,0)};window.addEventListener('hashchange',f);return()=>window.removeEventListener('hashchange',f)},[]);
 useEffect(()=>{try{localStorage.setItem('glamco-cart',JSON.stringify(cart))}catch{}},[cart]);
 useEffect(()=>{if(api)fetch(api+'/products').then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(!Array.isArray(d.products))throw Error();setProducts(d.products);setReady(d.checkoutEnabled===true)}).catch(()=>setError('The shop server is unavailable. Please try again later.'))},[]);
 useEffect(()=>{if(!route.startsWith('payment-return')||!api)return;let cancelled=false;let timer;const poll=async()=>{try{const id=sessionStorage.getItem('glamco-order'),token=sessionStorage.getItem('glamco-token');if(!id||!token){setStatus('No order reference found in this browser. Contact the academy to confirm your payment.');return}const r=await fetch(api+'/orders/'+id,{headers:{Authorization:'Bearer '+token}});if(!r.ok)throw Error();const d=await r.json();if(cancelled)return;if(d.status==='paid'){setStatus('Payment confirmed. Thank you for your order!');setCart([])}else{setStatus('Your payment is awaiting confirmation. Keep your order reference: '+id);timer=setTimeout(poll,5000)}}catch{if(!cancelled)setStatus('We could not check payment yet. Contact the academy with your order reference.')}};poll();return()=>{cancelled=true;clearTimeout(timer)}},[route]);
 const lines=cart.map(x=>({...x,product:products.find(p=>p.id===x.id)})).filter(x=>x.product);
 const total=lines.reduce((n,x)=>n+x.product.priceCents*x.quantity,0),count=lines.reduce((n,x)=>n+x.quantity,0);
 function add(id){
  const product=products.find(p=>p.id===id);if(!product)return;
  if(cart.find(x=>x.id===id)?.quantity>=99){setToast({title:'Cart limit reached',message:'You can add up to 99 of this product.'});setToastPaused(false);return;}
  setCart(c=>{const existing=c.find(x=>x.id===id);return existing?c.map(x=>x.id===id?{...x,quantity:Math.min(99,x.quantity+1)}:x):[...c,{id,quantity:1}]});
  setToast({title:'Added to your cart',message:product.name});setToastPaused(false);
 }
 function quantity(id,n){setCart(c=>n<=0?c.filter(x=>x.id!==id):c.map(x=>x.id===id?{...x,quantity:Math.min(99,n)}:x))}
 async function checkout(e){e.preventDefault();if(busy||!ready||!lines.length)return;setBusy(true);setError('');try{const customer=Object.fromEntries(new FormData(e.currentTarget));const r=await fetch(api+'/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:lines.map(x=>({id:x.id,quantity:x.quantity})),customer})});const d=await r.json();if(!r.ok)throw Error(d.error||'Checkout failed');if(!['https://sandbox.payfast.co.za/eng/process','https://www.payfast.co.za/eng/process'].includes(d.action)||!d.fields||typeof d.fields!=='object')throw Error('Invalid payment response');sessionStorage.setItem('glamco-order',d.orderId);sessionStorage.setItem('glamco-token',d.token);const form=document.createElement('form');form.method='POST';form.action=d.action;Object.entries(d.fields).forEach(([name,value])=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.appendChild(input)});document.body.appendChild(form);form.submit()}catch(err){setError(err.message);setBusy(false)}}
 if(!['shop','cart','checkout','payment-return','payment-cancel'].includes(route))return <Academy/>;
 return <div className="store">
 <div className="cart-toast-region" aria-live="polite" aria-atomic="true">{toast&&<div className="cart-toast" onMouseEnter={()=>setToastPaused(true)} onMouseLeave={()=>setToastPaused(false)} onFocus={()=>setToastPaused(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setToastPaused(false)}}><span className="cart-toast-icon" aria-hidden="true">✓</span><div><strong>{toast.title}</strong><p>{toast.message}</p><a href="#cart">View cart →</a></div><button className="cart-toast-close" aria-label="Dismiss notification" onClick={()=>setToast(null)}>×</button></div>}</div>
 <header className="store-header"><a href="#home" className="brand"><span>GLAM CO.</span><small>ACADEMY</small></a><nav aria-label="Shop navigation"><a href="#home">Academy</a><a href="#shop">Products</a><a href="#cart">Cart ({count})</a></nav></header><main className="store-main">
 {!ready&&<p className="store-notice">Shop preview · Temporary prices. Online payment is not enabled.</p>}
 {error&&<p role="alert" className="store-error">{error}</p>}
 {route==='shop'&&<><p className="eyebrow">THE GLAM CO COLLECTION</p><h1>Beauty essentials.</h1><p>Browse our equipment and beauty products.</p><div className="product-grid">{products.map(p=><article className="product" key={p.id}>{p.image?<img src={p.image} alt={p.name} loading="lazy"/>:<div className="product-placeholder">{p.category}<small>Product photo coming soon</small></div>}<div className="product-body"><small>{p.category}</small><h2>{p.name}</h2><p>{p.description}</p><strong>{money(p.priceCents)}</strong><button className="button button-gold" onClick={()=>add(p.id)}>Add to cart</button></div></article>)}</div></>}
 {(route==='cart'||route==='checkout')&&<><h1>{route==='cart'?'Your cart.':'Checkout.'}</h1>{!lines.length?<p>Your cart is empty. <a href="#shop">Explore products</a></p>:<div className="checkout-grid"><section>{lines.map(x=><article className="cart-line" key={x.id}>{x.product.image?<img className="cart-product-image" src={x.product.image} alt={x.product.name} loading="lazy"/>:<div className="cart-product-image cart-image-placeholder">No photo yet</div>}<div className="cart-product-details"><h2>{x.product.name}</h2><p>{money(x.product.priceCents)} each</p><div className="quantity"><button aria-label={'Decrease '+x.product.name} onClick={()=>quantity(x.id,x.quantity-1)}>−</button><span>{x.quantity}</span><button aria-label={'Increase '+x.product.name} disabled={x.quantity===99} onClick={()=>quantity(x.id,x.quantity+1)}>+</button><button onClick={()=>quantity(x.id,0)}>Remove</button></div></div><strong>{money(x.product.priceCents*x.quantity)}</strong></article>)}<a href="#shop">Continue shopping</a></section><aside className="order-summary"><h2>Order summary</h2><p>Collection at the academy</p><p>Delivery is not available yet.</p><div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div>{route==='cart'?<a className="button button-gold" href="#checkout">Continue to checkout</a>:<form onSubmit={checkout}><label>First name<input required name="firstName" autoComplete="given-name" maxLength="100"/></label><label>Last name<input required name="lastName" autoComplete="family-name" maxLength="100"/></label><label>Email<input required name="email" type="email" autoComplete="email" maxLength="100"/></label><label>Phone<input required name="phone" type="tel" autoComplete="tel" maxLength="30"/></label><label className="consent"><input required type="checkbox"/>I confirm my details and that this order is for collection.</label><button className="button button-gold" disabled={busy||!ready}>{busy?'Connecting…':ready?'Continue to PayFast':'PayFast setup pending'}</button><small>Payment is confirmed only after verification by the shop server.</small></form>}</aside></div>}</>}
 {route==='payment-return'&&<><h1>Payment status.</h1><p role="status">{status||(api?'Checking your payment…':'Payment verification is unavailable until PayFast setup is complete.')}</p><a href="#shop">Back to products</a></>}
 {route==='payment-cancel'&&<><h1>Payment cancelled.</h1><p>Your cart is saved. You can retry checkout.</p><a className="button button-gold" href="#checkout">Return to checkout</a></>}
 </main><footer className="store-footer">Glam Co Academy · <a href="#home">Return to academy</a></footer></div>
}
