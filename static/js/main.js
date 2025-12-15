// static/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // 첫 로딩 애니메이션
  setTimeout(() => {
    document.body.classList.add("is-loaded");
  }, 100);

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

  // 기본은 아이콘 뷰
  setView("icons");

  // VIEW 버튼 클릭 → 드롭다운 열기/닫기
  if (viewToggle && viewMenu) {
    viewToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      viewMenu.classList.toggle("is-open");
    });

    // as Icons / as List 선택
    viewOptions.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.view || "icons";
        setView(mode);

        // 선택 표시 (✓) 업데이트
        viewOptions.forEach((opt) => {
          opt.classList.toggle("is-selected", opt === btn);
        });

        viewMenu.classList.remove("is-open");
      });
    });

    // 바깥 클릭 시 드롭다운 닫기
    document.addEventListener("click", (event) => {
      if (!viewMenu.contains(event.target) && event.target !== viewToggle) {
        viewMenu.classList.remove("is-open");
      }
    });
  }

  // Get Info는 나중에 info 패널 만들면 여기서 연결하면 됨.
  // const infoToggle = document.getElementById("infoToggle");
});
