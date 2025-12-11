// static/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // View 토글 (Icons / List / Gallery)
  const viewButtons = document.querySelectorAll(".view-button");
  const previewList = document.getElementById("previewList");

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view; // icons / list / gallery

      // 버튼 active 상태 변경
      viewButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      // 리스트 클래스 변경
      if (!previewList) return;
      previewList.classList.remove("view-icons", "view-list", "view-gallery");
      previewList.classList.add(`view-${view}`);
    });
  });

  // Get Info 버튼: 왼쪽 패널 투명도 토글 (간단한 효과)
  const infoToggle = document.getElementById("infoToggle");
  const infoPanel = document.getElementById("infoPanel");

  if (infoToggle && infoPanel) {
    infoPanel.style.opacity = "1";

    infoToggle.addEventListener("click", () => {
      if (infoPanel.style.opacity === "1") {
        infoPanel.style.opacity = "0.4";
      } else {
        infoPanel.style.opacity = "1";
      }
    });
  }

  // 오른쪽 패널 탭 전환 (Cause / Chat / About Me / People)
  const sideTabs = document.querySelectorAll(".side-tab");
  const sideSections = document.querySelectorAll(".side-section");

  sideTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.panel; // cause / chat / company / people

      // 탭 active 변경
      sideTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      // 섹션 표시 변경
      sideSections.forEach((section) => {
        if (section.dataset.panel === target) {
          section.classList.add("is-active");
        } else {
          section.classList.remove("is-active");
        }
      });
    });
  });
});
