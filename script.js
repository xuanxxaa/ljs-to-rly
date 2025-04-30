/* FPS演示 */
function initAnimation(trackId, fps) {
	const track = document.getElementById(trackId);
	const dot = track.querySelector('.dot');
	const trackWidth = track.offsetWidth - 10;
	const totalTime = 1200;
	const interval = 1000 / fps;
	const step = trackWidth / (totalTime / interval);

	let startTime = null;
	let requestId = null;

	function animate(timestamp) {
		if (!startTime) startTime = timestamp;
		const elapsed = timestamp - startTime;
		const currentFrame = Math.floor(elapsed / interval);
		const position = currentFrame * step;
		dot.style.transform = `translateX(${position}px)`;

		// 循环
		if (elapsed >= totalTime) {
			cancelAnimationFrame(requestId);
			dot.style.transform = 'translateX(0)';
			setTimeout(() => {
				startTime = null;
				requestId = requestAnimationFrame(animate);
			});
		} else {
			requestId = requestAnimationFrame(animate);
		}
	}
	requestId = requestAnimationFrame(animate);
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
	const configs = [
		{ id: 'track15', fps: 15 },
		{ id: 'track30', fps: 30 },
		{ id: 'track60', fps: 60 }
	];
	configs.forEach(config => initAnimation(config.id, config.fps));
});

// 重置
let resizeTimer;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(() => {
		configs.forEach(config => {
			const track = document.getElementById(config.id);
			const dot = track.querySelector('.dot');
			cancelAnimationFrame(dot.requestId);
			initAnimation(config.id, config.fps);
		});
	}, 300);
});

/* 切换标签页 */
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
	tab.addEventListener('click', () => {
		document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
		document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
		
		tab.classList.add('active');
		const tabId = tab.getAttribute('data-tab');
		document.getElementById(tabId).classList.add('active');
	});
});

// 返回顶部按钮
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
	if (window.pageYOffset > 300) {
		backToTop.classList.add('visible');
	} else {
		backToTop.classList.remove('visible');
	}
});

backToTop.addEventListener('click', () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
});

// 图片懒加载
document.addEventListener('DOMContentLoaded', function() {
	const lazyImages = document.querySelectorAll('.image-placeholder img');
	
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = img.getAttribute('data-src') || img.src;
				img.onload = () => {
					img.parentElement.style.background = 'none';
				};
				observer.unobserve(img);
			}
		});
	});
	
	lazyImages.forEach(img => {
		imageObserver.observe(img);
	});
});

document.addEventListener('DOMContentLoaded', function() {
	const tabs = document.querySelectorAll('.tab');
	const tabContents = document.querySelectorAll('.tab-content');
	
	// 创建指示器
	const tabIndicator = document.createElement('div');
	tabIndicator.className = 'tab-indicator';
	document.querySelector('.tabs').appendChild(tabIndicator);
	
	// 设置指示器位置函数
	function setIndicatorPosition(tab) {
		if (!tab) return;
		const { offsetLeft, offsetWidth } = tab;
		tabIndicator.style.left = `${offsetLeft}px`;
		tabIndicator.style.width = `${offsetWidth}px`;
	}
	
	// 激活标签函数
	function activateTab(tab) {
		// 移除所有active类
		tabs.forEach(t => t.classList.remove('active'));
		tabContents.forEach(c => c.classList.remove('active'));
		document.querySelectorAll('.question-card.expanded').forEach(openCard => {
			openCard.classList.remove('expanded');
		});
		
		// 添加active类
		tab.classList.add('active');
		const tabId = tab.dataset.tab;
		if (tabId) {
			const content = document.getElementById(tabId);
			if (content) content.classList.add('active');
		}
		
		// 更新指示器
		setIndicatorPosition(tab);
	}
	
	// 初始化
	const defaultTab = document.querySelector('.tab.active') || tabs[0];
	if (defaultTab) {
		activateTab(defaultTab);
	}
	
	// 绑定事件
	tabs.forEach(tab => {
		tab.addEventListener('click', function(e) {
			e.preventDefault();
			activateTab(this);
		});
	});
	
	// 窗口大小变化时重新定位指示器
	window.addEventListener('resize', function() {
		const activeTab = document.querySelector('.tab.active');
		setIndicatorPosition(activeTab);
	});
});

/* 滚动动画 */
document.addEventListener('DOMContentLoaded', function() {
	const animatedElements = document.querySelectorAll('.component-card, .term-card');
	let lastScrollPos = window.pageYOffset;
	let ticking = false;
	
	animatedElements.forEach(el => {
		el.classList.add('scroll-animate');
	});
	
	function checkElements(scrollDown) {
		const windowHeight = window.innerHeight;
		const triggerOffset = windowHeight * 0.2;
		
		animatedElements.forEach(el => {
			const rect = el.getBoundingClientRect();
			const elementTop = rect.top;
			const elementBottom = rect.bottom;
			if (elementTop < windowHeight - triggerOffset && elementBottom > triggerOffset) {
				el.classList.add('in-view');
				el.classList.remove('out-view');
			}
			else if (!scrollDown && elementTop > windowHeight) {
				if (el.classList.contains('in-view')) {
					el.classList.remove('in-view');
					el.classList.add('out-view');
				}
			}
		});
	}
	
	window.addEventListener('scroll', function() {
		const currentScrollPos = window.pageYOffset;
		const scrollDown = currentScrollPos > lastScrollPos;
		lastScrollPos = currentScrollPos;
		
		if (!ticking) {
			window.requestAnimationFrame(function() {
				checkElements(scrollDown);
				ticking = false;
			});
			ticking = true;
		}
	}, { passive: true });
	
	checkElements(true);
	
	setTimeout(() => {
		const initialViewElements = document.querySelectorAll('.scroll-animate');
		initialViewElements.forEach(el => {
			const rect = el.getBoundingClientRect();
			if (rect.top < window.innerHeight && rect.bottom > 0) {
				el.classList.add('in-view');
			}
		});
	}, 100);
});

/* 粒子 */
document.addEventListener('DOMContentLoaded', function() {
	const splashScreen = document.getElementById('splash-screen');
	const splashContent = document.getElementById('splash-content');
	const receiveBtn = document.getElementById('receive-btn');
	const mainHeader = document.getElementById('mainHeader');
	const mainContent = document.getElementById('mainContent');
	const body = document.body;
	
	const canvas = document.getElementById('particles-canvas');
	const ctx = canvas.getContext('2d');
	let particles = [];
	let particleCount = window.innerWidth < 768 ? 40 : 80;
	let animationId;
	let isHeaderOnly = false;
	
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = isHeaderOnly ? 125 : window.innerHeight;
	}
	
	class Particle {
		constructor() {
			this.x = Math.random() * canvas.width;
			this.y = isHeaderOnly ? Math.random() * 125 : Math.random() * canvas.height;
			this.size = Math.random() * 3 + 1;
			this.speedX = Math.random() * 1 - 0.5;
			this.speedY = Math.random() * 1 - 0.5;
			this.color = `rgba(255,255,255,${Math.random() * 0.6 + 0.4})`;
		}
		
		update() {
			this.x += this.speedX;
			this.y += this.speedY;
			
			if (this.x < 0 || this.x > canvas.width) {
				this.speedX = -this.speedX;
			}
			
			if (isHeaderOnly) {
				if (this.y < 0 || this.y > 125) {
					this.speedY = -this.speedY;
				}
			} else {
				if (this.y < 0 || this.y > canvas.height) {
					this.speedY = -this.speedY;
				}
			}
		}
		
		draw() {
			if (!isHeaderOnly || this.y <= 125) {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}
	
	// 初始化
	function initParticles(count) {
		particles = [];
		for (let i = 0; i < count; i++) {
			particles.push(new Particle());
		}
	}
	
	// 循环
	function animateParticles() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// 绘制粒子
		for (let i = 0; i < particles.length; i++) {
			particles[i].update();
			particles[i].draw();
		}
		
		// 绘制连线
		for (let i = 0; i < particles.length; i++) {
			for (let j = i + 1; j < particles.length; j++) {
				const dx = particles[i].x - particles[j].x;
				const dy = particles[i].y - particles[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				
				if (distance < 125) {
					if (!isHeaderOnly || (particles[i].y <= 100 && particles[j].y <= 100)) {
						ctx.strokeStyle = `rgba(255,255,255,${1 - distance/100})`;
						ctx.lineWidth = 0.5;
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.stroke();
					}
				}
			}
		}
		
		animationId = requestAnimationFrame(animateParticles);
	}
	
	// 初始化
	resizeCanvas();
	initParticles(particleCount);
	animateParticles();
	

	window.addEventListener('resize', function() {
		resizeCanvas();
		initParticles(particleCount);
	});

	document.getElementById('receive-btn').addEventListener('click', function() {
		isHeaderOnly = true;
		canvas.classList.add('particles-header-only');
		resizeCanvas();
		
		// 重新初始化
		particleCount = window.innerWidth < 768 ? 15 : 50; 
		initParticles(particleCount);
	});
});

/* 首页过渡 */
document.addEventListener('DOMContentLoaded', function() {
	const splashScreen = document.getElementById('splash-screen');
	const receiveBtn = document.getElementById('receive-btn');
	const mainHeader = document.getElementById('mainHeader');
	const mainContent = document.getElementById('mainContent');
	const body = document.body;

	const headerContent = document.createElement('div');
	headerContent.innerHTML = `
		<h1 style="margin-bottom: 10px">Laptop</h1>
		<div class="subtitle">李均劭 赠 冉龙雨</div>
	`;
	headerContent.style.textAlign = 'center';
	headerContent.style.width = '100%';
	mainHeader.appendChild(headerContent);

	receiveBtn.addEventListener('click', function() {
		this.style.display = 'none';
		headerContent.style.opacity = '1';
		mainHeader.style.opacity = '1';

		splashScreen.style.transition = 'all 1.2s ease';
		splashScreen.style.height = mainHeader.offsetHeight + 'px';
		splashScreen.style.borderRadius = '0 0 15px 15px';

		setTimeout(() => {
			mainContent.style.transition = 'opacity 2.0s ease, transform 0.8s ease';
			mainContent.style.opacity = '1';
			mainContent.style.transform = 'translateY(0)';
			mainContent.classList.add('visible');
			body.classList.add('scroll-enabled');
		}, 300);

		setTimeout(() => window.scrollTo(0, 0), 500);
	});
});
	
/* 问题容器折叠 */
document.addEventListener('DOMContentLoaded', function() {
	const questionCards = document.querySelectorAll('.question-card');

	function toggleCard(card) {
		const isExpanded = card.classList.contains('expanded');
		if (!isExpanded) {
			document.querySelectorAll('.question-card.expanded').forEach(openCard => {
				if (openCard !== card) openCard.classList.remove('expanded');
			});
		}
		card.classList.toggle('expanded');
		if (card.classList.contains('expanded')) {
			card.style.zIndex = '10';
		} else {
			setTimeout(() => card.style.zIndex = '', 300);
		}
	}

	questionCards.forEach(card => {
		const icon = card.querySelector('.dropdown-icon');
		const downloadBtns = card.querySelectorAll('.download-btn');
        
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCard(card);
        });
        
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                return true;
            });
        });
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.download-btn')) {
                toggleCard(card);
            }
        });
	});
});

// 笔记本分类切换
document.addEventListener('DOMContentLoaded', function() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.category-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const categoryId = this.getAttribute('data-category');
            const activeContent = document.getElementById(categoryId);
            activeContent.classList.add('active');
            
            setTimeout(() => {
                const cards = activeContent.querySelectorAll('.component-card');
                cards.forEach(card => {
                    card.classList.add('in-view');
                    card.classList.remove('scroll-animate', 'out-view');
                });
            }, 10);
        });
    });
    
    const initialTab = document.querySelector('.category-tab.active');
    if (initialTab) {
        const initialCategory = document.getElementById(initialTab.getAttribute('data-category'));
        if (initialCategory) {
            setTimeout(() => {
                const cards = initialCategory.querySelectorAll('.component-card');
                cards.forEach(card => {
                    card.classList.add('in-view');
                    card.classList.remove('scroll-animate', 'out-view');
                });
            }, 100);
        }
    }
});

//倒计时
function calculateDays() {
  const startDate = new Date('2024-09-21');
  const currentDate = new Date();
  const diffTime = currentDate - startDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

document.getElementById('daysCounter').textContent = calculateDays();