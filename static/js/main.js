// static/js/main.js

document.addEventListener("DOMContentLoaded", () => {

  // 👇 [추가] 여기에 이 한 줄을 붙여넣으세요.
  let lenis;
  
  // ✨ [핵심 1] 새로고침 시 스크롤 위치 기억 끄기
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // ----------------------------------------------------
  // ✨ [추가] 이미지 프리로딩 (렉 제거 핵심)
  // ----------------------------------------------------
  const preloadTargets = document.querySelectorAll(".project-trigger");
  preloadTargets.forEach((item) => {
    const rawImage = item.dataset.image;
    if (rawImage) {
      const imgUrl = rawImage.split(',')[0].trim();
      if (imgUrl) {
        const img = new Image();
        img.src = imgUrl; // 브라우저 캐시에 미리 저장!
      }
    }
  });

  // ✨ [핵심 2] 인트로 영상이 나오는 동안은 아예 스크롤 못하게 잠금! (뒤에서 움직이는 것 방지)
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);

  // ----------------------------------------------------
  // 1. 인트로 영상 처리 & 로딩 애니메이션 제어
  // ----------------------------------------------------
  const introOverlay = document.getElementById("introOverlay");
  const introVideo = document.getElementById("introVideo");
  const skipBtn = document.getElementById("skipBtn");

  // 메인 사이트 애니메이션 시작 함수 (영상이 끝나면 실행됨)
  function startSiteAnimation() {
    // ✨ [핵심 3] 사이트 시작 직전에 강제로 맨 위로 이동
    window.scrollTo(0, 0);
    
    // ✨ [핵심 4] 스크롤 잠금 해제 (이제 움직일 수 있음)
    document.body.style.overflow = "";

    introOverlay.classList.add("is-hidden"); // 영상 가림
    
    setTimeout(() => {
      document.body.classList.add("is-loaded");
      introOverlay.style.display = "none"; 
    }, 100);
  }

  if (introVideo) {
    introVideo.muted = true; 
    
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        startSiteAnimation();
      });
    }

    introVideo.addEventListener("ended", startSiteAnimation);
  } else {
    startSiteAnimation();
  }

  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      if(introVideo) introVideo.pause();
      startSiteAnimation();
    });
  }

  // ----------------------------------------------------
  // 2. 부드러운 스크롤 (Lenis) 적용
  // ----------------------------------------------------
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({        // 👈 const를 지우고 이렇게 만드세요.
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ----------------------------------------------------
  // 3. VIEW 보기 방식 변경
  // ----------------------------------------------------
  const viewToggle = document.getElementById("viewToggle");
  const viewMenu = document.getElementById("viewMenu");
  const viewOptions = document.querySelectorAll(".view-option");
  const projectsGrid = document.getElementById("projectsGrid");

  function setView(mode) {
    if (!projectsGrid) return;
    if (mode === "list") {
      projectsGrid.classList.add("is-list-view");
    } else {
      projectsGrid.classList.remove("is-list-view");
    }
  }
  setView("icons"); 

  if (viewToggle && viewMenu) {
    viewToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      viewMenu.classList.toggle("is-open");
    });

    viewOptions.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.view || "icons";
        setView(mode);
        viewOptions.forEach((opt) => opt.classList.toggle("is-selected", opt === btn));
        viewMenu.classList.remove("is-open");
      });
    });

    document.addEventListener("click", (e) => {
      if (!viewMenu.contains(e.target) && e.target !== viewToggle) {
        viewMenu.classList.remove("is-open");
      }
    });
  }

  // ----------------------------------------------------
  // 4. INFO PANEL (왼쪽 미리보기 패널 + 화면 밀림 효과)
  // ----------------------------------------------------
  const infoToggle = document.getElementById("infoToggle");
  const infoPanel = document.getElementById("infoPanel");
  const infoPreviewImg = document.getElementById("infoPreviewImg");
  const infoPreviewTitle = document.getElementById("infoPreviewTitle");
  const infoPlaceholder = document.getElementById("infoPlaceholder");
  const projectItems = document.querySelectorAll(".project-trigger, .item"); 

  if (infoToggle && infoPanel) {
    infoToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      infoPanel.classList.toggle("is-active");
      document.body.classList.toggle("is-panel-open");

      if (infoPanel.classList.contains("is-active")) {
        infoToggle.textContent = "Close Info";
      } else {
        infoToggle.textContent = "Get Info";
      }
    });

    document.addEventListener("click", (e) => {
      if (infoPanel.classList.contains("is-active") && 
          !infoPanel.contains(e.target) && 
          e.target !== infoToggle) {
        
        infoPanel.classList.remove("is-active");
        document.body.classList.remove("is-panel-open");
        infoToggle.textContent = "Get Info";
      }
    });
  }

// ----------------------------------------------------
  // INFO PANEL 마우스 호버 이벤트 (최적화 버전)
  // ----------------------------------------------------
  projectItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      // 패널이 열려있을 때만 실행
      if (infoPanel && infoPanel.classList.contains("is-active")) {
        const title = item.dataset.title || item.querySelector(".item-title")?.innerText;
        const rawImage = item.dataset.image || "";
        const firstImage = rawImage.split(',')[0].trim();

        if (firstImage) {
          // 이미지가 있으면 바로 교체 (프리로딩 덕분에 즉시 뜸)
          infoPreviewImg.src = firstImage;
          infoPreviewImg.style.display = "block";
          infoPlaceholder.style.display = "none";
          
          // ✨ 깜빡임 방지: 투명도 1로 유지
          infoPreviewImg.style.opacity = "1";
        } else {
          // 이미지가 없으면 숨김
          infoPreviewImg.style.display = "none";
          infoPlaceholder.style.display = "block";
          infoPlaceholder.textContent = "No Preview Image";
        }

        if (title) {
          infoPreviewTitle.textContent = title;
          infoPreviewTitle.style.display = "block";
        }
      }
    });
  });

  // ----------------------------------------------------
  // 5. 팝업(모달) 로직 + 갤러리 + 영상 재생
  // ----------------------------------------------------
  const modal = document.getElementById("projectModal");
  const modalClose = document.getElementById("modalClose");
  const modalContainer = document.querySelector(".modal-container");
  const modalMedia = document.querySelector(".modal-media");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  
  let modalCategory = document.querySelector(".modal-category");
  if (!modalCategory && document.querySelector(".modal-text")) {
    modalCategory = document.createElement("p");
    modalCategory.className = "modal-category";
    document.querySelector(".modal-text").insertBefore(modalCategory, modalTitle);
  }

  let currentImages = [];
  let currentIndex = 0;
  let isAnimating = false;

  const popupTriggers = document.querySelectorAll(".project-trigger");

  popupTriggers.forEach((item) => {
    item.addEventListener("click", () => {

      if (lenis) lenis.stop();
      
      if(infoPanel && infoPanel.classList.contains("is-active")) {
          infoPanel.classList.remove("is-active");
          document.body.classList.remove("is-panel-open");
          infoToggle.textContent = "Get Info";
      }

      const title = item.dataset.title;
      const desc = item.dataset.desc;
      const category = item.dataset.category || "";
      const videoSrc = item.dataset.video;
      const rawImage = item.dataset.image || "";

      modalTitle.textContent = title || "Untitled";
      modalDesc.innerHTML = desc ? desc.replace(/\n/g, '<br>') : "";
      if (modalCategory) modalCategory.textContent = category;

      modalMedia.innerHTML = ""; 

      if (videoSrc) {
        modalContainer.classList.add("is-video-mode");
        const video = document.createElement("video");
        video.className = "modal-video";
        video.src = videoSrc;
        video.controls = true; 
        video.autoplay = true; 
        video.muted = true;    
        video.loop = true;     
        modalMedia.appendChild(video);
      } else {
        modalContainer.classList.remove("is-video-mode");
        if (rawImage) {
          currentImages = rawImage.split(',').map(s => s.trim()).filter(s => s !== "");
        } else {
          currentImages = [];
        }
        currentIndex = 0;

        const img = document.createElement("img");
        img.id = "modalImage";
        
        if (currentImages.length > 0) {
          img.src = currentImages[0];
          img.style.display = "block";
          if (currentImages.length > 1) {
            img.style.cursor = "pointer";
            img.title = "Click for next image";
          }
        } else {
          img.style.display = "none";
        }

        modalMedia.appendChild(img);

        img.addEventListener("click", () => {
          if (currentImages.length <= 1 || isAnimating) return;
          isAnimating = true;
          img.classList.add("is-changing");

          setTimeout(() => {
            currentIndex = (currentIndex + 1) % currentImages.length;
            img.src = currentImages[currentIndex];
            img.onload = () => {
               img.classList.remove("is-changing");
               isAnimating = false;
            };
            setTimeout(() => { 
               img.classList.remove("is-changing");
               isAnimating = false;
            }, 50);
          }, 350); 
        });
      }

      document.body.style.overflow = "hidden";
      modal.classList.add("is-active");
    });
  });

  function closeModal() {
    if (modal && modal.classList.contains("is-active")) {
      modal.classList.remove("is-active");
      setTimeout(() => { 
        modalMedia.innerHTML = ""; 
      }, 200);

      if (lenis) lenis.start();
      setTimeout(() => { document.body.style.overflow = ""; }, 500);
    }
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});
// ----------------------------------------------------
  // 6. DARK MODE TOGGLE (심플 버전)
  // ----------------------------------------------------
  const themeToggle = document.getElementById("themeToggle");
  
  // 저장된 테마 불러오기
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  }
// ----------------------------------------------------
  // 7. CUSTOM CURSOR (마우스 포인터)
  // ----------------------------------------------------
  const cursor = document.getElementById("cursor");
  
  // 1. 마우스 움직임 추적
  document.addEventListener("mousemove", (e) => {
    // requestAnimationFrame을 써서 렉 없이 부드럽게
    requestAnimationFrame(() => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
  });

  // 2. 링크나 버튼 위에 올렸을 때 커지는 효과
  // (확대하고 싶은 요소를 여기에 다 적어주면 됩니다)
  const hoverTargets = document.querySelectorAll("a, button, .project-trigger, .view-option, .theme-toggle, .view-trigger, .link-button");

  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("is-hovering");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hovering");
    });
  });