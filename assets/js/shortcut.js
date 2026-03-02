(function () {
  const btn = document.getElementById("add-shortcut-btn");
  if (!btn) return;

  let deferredPrompt = null;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent || "");
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const locale = (document.documentElement.lang || "").toLowerCase().startsWith("ko") ? "ko" : "en";
  const msg = {
    ko: {
      ios: "Safari 공유 버튼을 누른 뒤 '홈 화면에 추가'를 선택하세요.",
      unsupported: "브라우저 메뉴에서 '홈 화면에 추가'를 선택하세요."
    },
    en: {
      ios: "Open Safari Share and tap 'Add to Home Screen'.",
      unsupported: "Use your browser menu and select 'Add to Home Screen'."
    }
  };

  function show() {
    btn.classList.remove("hidden");
  }

  function hide() {
    btn.classList.add("hidden");
  }

  if (isStandalone) {
    hide();
    return;
  }

  btn.addEventListener("click", async function () {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } catch (e) {}
      deferredPrompt = null;
      hide();
      return;
    }
    alert(isIOS ? msg[locale].ios : msg[locale].unsupported);
  });

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    show();
  });

  window.addEventListener("appinstalled", hide);

  if (isIOS) {
    show();
  } else {
    hide();
  }
})();
