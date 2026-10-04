/**
 * ⚠️ CẢNH BÁO BẢO MẬT — ĐỌC KỸ TRƯỚC KHI DEPLOY:
 * Đặt API key trực tiếp trong code client-side (JS trên trình duyệt) sẽ BỊ LỘ
 * cho bất kỳ ai xem source code trang web.
 *
 * GIẢI PHÁP AN TOÀN HƠN:
 * 1. Dùng Cloudflare Worker làm proxy — gọi API từ worker, key lưu trong env vars
 * 2. Dùng Vercel/Netlify serverless function
 * 3. Dùng backend riêng (Node.js, PHP) làm trung gian
 *
 * Biến dưới đây chỉ để TEST. Thay bằng proxy URL khi đưa lên production.
 */
// Endpoint trỏ đến Cloudflare Pages Function Proxy để bảo mật API Key
const AI_ENDPOINT = "https://anhuynh-engineer.pages.dev/api/chat";

/* ─── 1. Nav scrolled toggle ─── */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });
}

/* ─── 2. Mobile menu toggle ─── */
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobileNav');
let menuOpen = false;
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileNav.classList.toggle('open', menuOpen);
    menuToggle.setAttribute('aria-expanded', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ─── 3. Card mousemove → CSS vars --mx/--my ─── */
document.querySelectorAll('.project, .service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ─── 4. Generate 22 rising particles (zero-g) ─── */
const particlesEl = document.getElementById('particles');
if (particlesEl) {
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const drift = (Math.random() - 0.5) * 120;
    const opacity = 0.2 + Math.random() * 0.5;
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (14 + Math.random() * 18) + 's';
    p.style.animationDelay = (Math.random() * -25) + 's';
    p.style.setProperty('--p-drift', drift + 'px');
    p.style.setProperty('--p-opacity', opacity);
    const size = 2 + Math.random() * 3;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    if (i % 3 === 0) {
      p.style.background = 'var(--cyan)';
      p.style.boxShadow = '0 0 8px var(--cyan)';
    }
    particlesEl.appendChild(p);
  }
}

/* ─── 5. Scene 3D parallax tilt theo chuột ─── */
const sceneInner = document.getElementById('sceneInner');
let sTargetX = 0, sTargetY = 0, sCurX = 0, sCurY = 0;
window.addEventListener('mousemove', (e) => {
  sTargetX = (e.clientX / window.innerWidth - 0.5) * 2;
  sTargetY = (e.clientY / window.innerHeight - 0.5) * 2;
});
function animateScene() {
  sCurX += (sTargetX - sCurX) * 0.04;
  sCurY += (sTargetY - sCurY) * 0.04;
  if (sceneInner) {
    sceneInner.style.transform = `rotateY(${sCurX * 8}deg) rotateX(${-sCurY * 8}deg)`;
  }
  requestAnimationFrame(animateScene);
}
animateScene();

/* ─── 6. Scroll fade gravity scene ─── */
const gravityScene = document.getElementById('gravityScene');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (gravityScene && y < window.innerHeight * 1.2) {
    gravityScene.style.transform = `translate3d(0, ${y * 0.2}px, 0)`;
    gravityScene.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.9));
  }
}, { passive: true });

/* ─── 7. IntersectionObserver scroll reveal (staggered) ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

function observeGroup(selector) {
  document.querySelectorAll(selector).forEach(group => {
    Array.from(group.children).forEach((item, idx) => {
      item.style.transitionDelay = (idx * 0.08) + 's';
      observer.observe(item);
    });
  });
}
observeGroup('.services-grid');
observeGroup('.projects-list');
observeGroup('.coming-soon-grid');
observeGroup('.feature-grid');
observeGroup('.showcase-grid');

/* ─── 8. Smooth scroll cho a[href^="#"] ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* ═══════════════════════════════════════════════════
   9. CHAT WIDGET — Tư vấn AI trực tiếp (Gemini 2.5 Flash)
   ═══════════════════════════════════════════════════ */
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

// Lịch sử hội thoại gửi cho Gemini
let chatHistory = [];

// System prompt cho AI
const SYSTEM_PROMPT = `Bạn là trợ lý tư vấn AI của Thiên Ân (Adam) — Dev Design Engineer tại TP. Hồ Chí Minh.
Nhiệm vụ: Giúp khách hàng tiềm năng tìm hiểu về dịch vụ và tư vấn sơ bộ.
Dịch vụ chính: Website & Landing Page, Blog & Content Site, Web Application, Mobile App, Domain/Hosting/VPS setup, Vibe Coding & AI Build.
Sản phẩm đã làm: ThinkNote (ứng dụng ghi chú AI), ByteOne (website công ty).
Liên hệ trực tiếp: Zalo/SĐT 0985905443.
Quy tắc: Trả lời bằng tiếng Việt, ngắn gọn (2-4 câu). Thân thiện, chuyên nghiệp. Nếu khách muốn báo giá chi tiết, hướng dẫn liên hệ Zalo/SĐT. Không bịa thông tin.`;

if (chatToggle && chatWidget) {
  // Mở/đóng chat widget
  chatToggle.addEventListener('click', () => {
    chatWidget.classList.toggle('open');
    // Ẩn badge sau khi mở lần đầu
    const badge = chatToggle.querySelector('.chat-toggle-badge');
    if (badge) badge.style.display = 'none';
    if (chatWidget.classList.contains('open') && chatInput) chatInput.focus();
  });
  if (chatClose) {
    chatClose.addEventListener('click', () => chatWidget.classList.remove('open'));
  }

  // Gửi tin nhắn
  function sendMessage() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;
    // Hiển thị tin nhắn user
    appendBubble(text, 'user');
    chatInput.value = '';
    // Thêm vào history
    chatHistory.push({ role: 'user', parts: [{ text }] });
    // Gọi AI
    callGeminiAPI();
  }

  if (chatSend) chatSend.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }
}

// Thêm bong bóng tin nhắn vào khung chat
function appendBubble(text, type) {
  if (!chatMessages) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

// Hàm tạo/lấy Session ID ngẫu nhiên để phân biệt khách truy cập
function getChatSessionId() {
  let sid = sessionStorage.getItem('chat_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 9).toUpperCase();
    sessionStorage.setItem('chat_session_id', sid);
  }
  return sid;
}

// Gọi Gemini API
async function callGeminiAPI() {
  // Hiển thị trạng thái đang gõ
  const typingBubble = appendBubble('Đang suy nghĩ...', 'bot typing');

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: getChatSessionId(),
        contents: chatHistory,
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
      })
    });

    if (!response.ok) throw new Error(`API lỗi: ${response.status}`);
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, tôi không thể trả lời lúc này.';

    // Cập nhật bubble
    typingBubble.textContent = reply;
    typingBubble.classList.remove('typing');
    // Thêm vào history
    chatHistory.push({ role: 'model', parts: [{ text: reply }] });

  } catch (err) {
    console.error('Chat AI error:', err);
    typingBubble.textContent = '⚠️ Không thể kết nối AI. Vui lòng thử lại hoặc nhắn Zalo 0985 905 443!';
    typingBubble.classList.remove('typing');
  }

  if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
}
