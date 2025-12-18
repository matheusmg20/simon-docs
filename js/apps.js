(function () {
    const appsBtn = document.querySelector('.apps');
    const windowApps = document.querySelector('.window_apps');

    if (!appsBtn || !windowApps) return;

    // Funções utilitárias
    const openWindow = () => {
      windowApps.classList.add('is-open');
      appsBtn.setAttribute('aria-expanded', 'true');
    };

    const closeWindow = () => {
      windowApps.classList.remove('is-open');
      appsBtn.setAttribute('aria-expanded', 'false');
    };

    const isOpen = () => windowApps.classList.contains('is-open');

    // Toggle ao clicar no ícone
    appsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // evita que o clique "suba" e dispare o clique fora
      isOpen() ? closeWindow() : openWindow();
    });

    // Não fechar ao clicar dentro da janela
    windowApps.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!isOpen()) return;
      const clickedInside =
        windowApps.contains(e.target) || appsBtn.contains(e.target);
      if (!clickedInside) {
        closeWindow();
      }
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        closeWindow();
        appsBtn.focus?.();
      }
    });

    // Acessibilidade inicial
    appsBtn.setAttribute('aria-controls', 'window_apps');
    windowApps.id = windowApps.id || 'window_apps';
    appsBtn.setAttribute('aria-expanded', 'false');
  })();