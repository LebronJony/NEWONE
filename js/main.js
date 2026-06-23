/* ===== 滚动触发的淡入动画 ===== */
document.addEventListener('DOMContentLoaded', function() {
  const fadeEls = document.querySelectorAll('.fade-in');

  function checkFade() {
    fadeEls.forEach(function(el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  checkFade();
  window.addEventListener('scroll', checkFade);
});

/* ===== 详情页：侧边栏锚点高亮 + 移动端侧栏开关 ===== */
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector('.page-sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const sections = document.querySelectorAll('.content-section');
  const sidebarLinks = document.querySelectorAll('.page-sidebar a');

  // 移动端侧栏开关
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      document.querySelector('.page-sidebar').classList.toggle('open');
    });
    // 点击链接后关闭侧栏
    if (sidebar) {
      sidebar.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
          }
        });
      });
    }
  }

  // 锚点滚动高亮
  function updateActiveLink() {
    if (!sections.length || !sidebarLinks.length) return;

    let currentId = '';
    sections.forEach(function(sec) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120) {
        currentId = sec.id;
      }
    });

    sidebarLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  if (sections.length && sidebarLinks.length) {
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink);
  }
});
